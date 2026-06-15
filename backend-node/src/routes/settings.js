// /api/updateSettings, /api/getOverlayConfig, /api/modules
//
// Direct port of `backend/Controllers/SettingsController.cs`. updateSettings
// is the bundle's only persistence path for the giant DynamicSettings bag —
// it gets called every time a toggle moves in the settings UI. After write,
// we rebuild the cache and broadcast `widgetSettings` so every connected
// widget picks up the new bag without a full reload.

const express = require('express');
const dynamicSettings = require('../db/models/dynamic-settings');
const channels = require('../db/models/channels');
const channelModules = require('../db/models/channel-modules');
const overlays = require('../db/models/overlays');
const widgetSettings = require('../services/widget-settings-cache');
const logger = require('../logger');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

function resolveProfileId(req) {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return 1;
  const ch = channels.findById(channelId);
  return ch && ch.ProfileId > 0 ? ch.ProfileId : 1;
}

// DynamicSettings values are stored as TEXT. Stringify everything that
// isn't already a string so booleans/numbers/objects round-trip back as
// the same string we got. Matches C#'s `GetRawText()` behavior for non-string.
function stringifyValue(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return '';
  }
}

// POST /api/updateSettings
// Accepts either:
//   - flat object: { key1: val1, key2: val2 }
//   - array of pairs: [{ key, value }, { Key, Value }, { name, value }]
router.post('/updateSettings', (req, res) => {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.json({ status: 200, message: 'OK' });

  const body = req.body;
  const settings = {};

  if (body && typeof body === 'object' && !Array.isArray(body)) {
    for (const [k, v] of Object.entries(body)) {
      settings[k] = stringifyValue(v);
    }
  } else if (Array.isArray(body)) {
    for (const item of body) {
      if (!item || typeof item !== 'object') continue;
      const k = item.key ?? item.Key ?? item.name ?? null;
      const v = item.value ?? item.Value ?? '';
      if (k && typeof k === 'string') settings[k] = stringifyValue(v);
    }
  }

  // The bundle dumps the ENTIRE settings bag into a single `dynamicsettings`
  // key (clone authScript writes `setting_dynamicsettings` = JSON of the whole
  // bag). It round-trips via /api/me back into localStorage and is re-sent on
  // every save → an unbounded self-referential growth loop (live DB rows hit
  // ~295KB). It is never read as an individual setting, so NEVER persist it —
  // this keeps every save bag small (~50KB) and stops the bloat.
  delete settings.dynamicsettings;
  delete settings.dynamicSettings;

  // Per-viewer points data — `points_user_<user>` (balance) + `pointsmeta_<user>`
  // (identity JSON) — is persisted AUTHORITATIVELY by services/points.js via
  // PUT /rest/transaction → points.setBalance. The bundle ALSO carries every such
  // row in its localStorage bag and re-posts ALL of them on EVERY settings.save()
  // (e.g. tweaking cannon Ball Size). After many streams that's ~23k stale rows →
  // the bag balloons to ~10mb (was 413ing the whole save → the UI change never
  // persisted) and the stale localStorage values can clobber fresh points. They are
  // NOT UI settings — drop them here so settings.save persists UI config only (the
  // ~50KB the dynamicsettings guard above already targets). NOTE: keep the
  // `points.*` CONFIG namespace (point-per-gift, etc.) — only the two per-viewer
  // prefixes are dropped. Existing DB rows are untouched (skip ≠ delete). 2026-06-13.
  for (const k of Object.keys(settings)) {
    if (k.indexOf('pointsmeta_') === 0 || k.indexOf('points_user_') === 0) delete settings[k];
  }

  if (Object.keys(settings).length === 0) {
    return res.json({ status: 200, message: 'OK' });
  }

  const profileId = resolveProfileId(req);
  try {
    dynamicSettings.writeMany(channelId, profileId, settings);
  } catch (err) {
    logger.error({ err, channelId, profileId }, '[Settings] writeMany failed');
    return res.status(500).json({ status: 500, message: 'Write failed' });
  }

  // Rebuild cache + push fresh bag to every widget connected for this channel.
  try {
    widgetSettings.rebuildAndBroadcast(channelId);
  } catch (err) {
    logger.warn({ err, channelId }, '[Settings] rebuild/broadcast failed (write already persisted)');
  }

  res.json({ status: 200, message: 'OK' });
});

// GET/POST /api/getOverlayConfig
router.all('/getOverlayConfig', (req, res) => {
  const channelId = resolveChannelId(req);
  const list = channelId > 0 ? overlays.listByChannel(channelId) : [];
  res.json({
    status: 200,
    message: 'OK',
    overlays: list.map((o) => ({
      // camelCase to match bundle's Vue expectations (ASP.NET Core 9 Web default).
      id: o.Id,
      name: o.Name,
      type: o.Type,
      configJson: o.ConfigJson,
      enabled: !!o.Enabled,
      sort: o.Sort,
    })),
    widgets: [],
  });
});

// Same DefaultModules() list used by /api/modules and /api/getAppConfig.
// Single source of truth; updating here updates both.
const DEFAULT_MODULES = [
  { id: 'actions', name: 'Actions & Events', sort: 1, enabled: true },
  { id: 'events', name: 'Events', sort: 2, enabled: true },
  { id: 'sounds', name: 'Sound Alerts', sort: 3, enabled: true },
  { id: 'tts', name: 'Text to Speech', sort: 4, enabled: true },
  { id: 'media', name: 'Media Share', sort: 5, enabled: true },
  { id: 'timers', name: 'Timers', sort: 6, enabled: true },
  { id: 'commands', name: 'Chat Commands', sort: 7, enabled: true },
  { id: 'spotify', name: 'Spotify Integration', sort: 8, enabled: true },
  { id: 'webhooks', name: 'Webhooks', sort: 9, enabled: true },
  { id: 'overlays', name: 'Overlays', sort: 10, enabled: true },
];

function buildModules(channelId) {
  // Case-insensitive merge: defaults provide name/sort, DB rows override
  // enabled flag (and name/sort when set). Bundle expects an ARRAY sorted by
  // sort asc.
  const byId = new Map();
  for (const d of DEFAULT_MODULES) byId.set(d.id.toLowerCase(), { ...d });

  if (channelId > 0) {
    for (const m of channelModules.listByChannel(channelId)) {
      const key = (m.ModuleId || '').toLowerCase();
      const existing = byId.get(key);
      const fallback = existing || {
        id: m.ModuleId,
        name: m.Name || m.ModuleId,
        sort: m.Sort || 0,
        enabled: !!m.Enabled,
      };
      byId.set(key, {
        id: existing ? existing.id : m.ModuleId,
        name: (m.Name || '').trim() ? m.Name : fallback.name,
        sort: existing ? existing.sort : (m.Sort > 0 ? m.Sort : fallback.sort),
        enabled: !!m.Enabled,
      });
    }
  }

  return [...byId.values()].sort((a, b) => a.sort - b.sort);
}

// GET/POST /api/modules
router.all('/modules', (req, res) => {
  const channelId = resolveChannelId(req);
  res.json(buildModules(channelId));
});

module.exports = router;
module.exports.buildModules = buildModules;
module.exports.DEFAULT_MODULES = DEFAULT_MODULES;
