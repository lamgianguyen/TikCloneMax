// /api/rest/action — actions list/save/delete.
//
// Port of `backend/Controllers/ActionsController.cs`. Each row stores its
// per-action config blob in `ConfigJson` (a stringified JSON object); the
// myactions widget expects the response to flatten the common fields
// (imageUrl, audioUrl, duration, etc.) back up to top level. The bundle
// also fills in computed `dynamicConfig` defaults that the renderer
// depends on — we mirror those defaults here so the widget never reads
// `undefined` for `enableStreaks` / `cooldown` / `mediaSoundVolume` and
// fall through to its own racy fallback path.

const express = require('express');
const path = require('path');
const actions = require('../db/models/actions');
const channels = require('../db/models/channels');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}
function resolveProfileId(req, channelId) {
  if (channelId <= 0) return 1;
  const ch = channels.findById(channelId);
  return ch && ch.ProfileId > 0 ? ch.ProfileId : 1;
}

// ── ConfigJson helpers (mirror the C# JsonObject accessors) ─────────────────

function safeParseObject(json) {
  if (!json || typeof json !== 'string') return {};
  try {
    const v = JSON.parse(json);
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  } catch {
    return {};
  }
}

function getString(obj, key) {
  const v = obj?.[key];
  if (v === undefined || v === null) return null;
  if (typeof v === 'string') return v.trim() === '' ? null : v;
  return JSON.stringify(v);
}

function getBool(obj, key, fallback) {
  const v = obj?.[key];
  if (v === undefined || v === null) return fallback;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') {
    const lc = v.toLowerCase().trim();
    if (lc === 'true') return true;
    if (lc === 'false') return false;
    const n = parseInt(lc, 10);
    if (Number.isFinite(n)) return n !== 0;
  }
  return fallback;
}

function getInt(obj, key) {
  const v = obj?.[key];
  if (v === undefined || v === null) return null;
  if (typeof v === 'number' && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function getDouble(obj, key) {
  const v = obj?.[key];
  if (v === undefined || v === null) return null;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function getDate(obj, key) {
  const v = obj?.[key];
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'string') {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return null;
}

// Bundle expects nice "Bass Drop" instead of "bass_drop-12345_full_lottie.json".
function extractOriginalName(url, marker = '') {
  if (!url || typeof url !== 'string') return null;
  try {
    const clean = url.split(/[?#]/)[0];
    let name = path.basename(clean, path.extname(clean));
    if (!name) return null;
    if (marker) {
      const idx = name.toLowerCase().indexOf(marker.toLowerCase());
      if (idx >= 0) name = name.slice(idx + marker.length);
    }
    name = name
      .replace(/_full_lottie/gi, '')
      .replace(/[-_]/g, ' ')
      .trim();
    return name || null;
  } catch {
    return null;
  }
}

function buildDynamicConfig(config) {
  const src = (config && typeof config.dynamicConfig === 'object' && config.dynamicConfig) || {};
  const result = { ...src };

  if (result.enableStreaks === undefined) result.enableStreaks = getBool(config, 'enableStreaks', false);
  if (result.skipOnNext === undefined) result.skipOnNext = getBool(config, 'skipOnNext', false);
  if (result.mediaSoundVolume === undefined) result.mediaSoundVolume = getInt(config, 'mediaSoundVolume') ?? 100;
  if (result.cooldown === undefined) result.cooldown = getInt(config, 'cooldown') ?? 0;
  if (result.userCooldown === undefined) result.userCooldown = getInt(config, 'userCooldown') ?? 0;
  if (result.isImported === undefined) result.isImported = true;
  if (result.ttsVoice === undefined) result.ttsVoice = getString(config, 'ttsVoice') || 'default';

  if (result.animationUrlOriginalFilename === undefined) {
    result.animationUrlOriginalFilename = extractOriginalName(getString(config, 'animationUrl'), 'gift_');
  }
  if (result.audioUrlOriginalFilename === undefined) {
    result.audioUrlOriginalFilename = extractOriginalName(getString(config, 'audioUrl'));
  }
  if (result.imageUrlOriginalFilename === undefined) {
    result.imageUrlOriginalFilename = extractOriginalName(getString(config, 'imageUrl'));
  }
  if (result.videoUrlOriginalFilename === undefined) {
    result.videoUrlOriginalFilename = extractOriginalName(getString(config, 'videoUrl'));
  }

  return result;
}

function mapAction(row) {
  const config = safeParseObject(row.ConfigJson);
  const dynamicConfig = buildDynamicConfig(config);

  return {
    id: row.Id,
    channelId: row.ChannelId,
    profileId: getInt(config, 'profileId') ?? 1,
    name: (row.Name && row.Name.trim()) || `Action ${row.Id}`,
    type: row.Type,
    triggerValue: row.TriggerValue,
    screenId: getInt(config, 'screenId') ?? 1,
    duration: getInt(config, 'duration') ?? 5,
    amountToAdd: getDouble(config, 'amountToAdd') ?? 0,
    imageUrl: getString(config, 'imageUrl'),
    audioUrl: getString(config, 'audioUrl'),
    videoUrl: getString(config, 'videoUrl'),
    animationUrl: getString(config, 'animationUrl'),
    webhookUrl: getString(config, 'webhookUrl'),
    text: getString(config, 'text'),
    textToSpeech: getString(config, 'textToSpeech'),
    message: getString(config, 'message'),
    obsSceneId: config.obsSceneId ?? null,
    obsSourceId: config.obsSourceId ?? null,
    snapCamEffectId: config.snapCamEffectId ?? null,
    mcCmd: getString(config, 'mcCmd'),
    keystrokes: getString(config, 'keystrokes'),
    thirdPartyAction: config.thirdPartyAction ?? null,
    customGoalConfig: config.customGoalConfig ?? null,
    voicemodVoiceConfig: config.voicemodVoiceConfig ?? null,
    streamerbotActionId: config.streamerbotActionId ?? null,
    timerSeconds: getInt(config, 'timerSeconds'),
    enableFadeEffect: getBool(config, 'enableFadeEffect', true),
    dynamicConfig,
    isDeleted: getBool(config, 'isDeleted', false),
    createdAt: getDate(config, 'createdAt') || row.CreatedAt,
    updatedAt: getDate(config, 'updatedAt') || row.CreatedAt,
    configJson: row.ConfigJson && row.ConfigJson.trim() ? row.ConfigJson : '{}',
    enabled: !!row.Enabled,
    sort: row.Sort,
  };
}

// ── Routes ──────────────────────────────────────────────────────────────────

router.get('/action', (req, res) => {
  const channelId = resolveChannelId(req);
  const profileId = resolveProfileId(req, channelId);
  const list = actions.listByChannelProfile(channelId, profileId).map(mapAction);

  res.json({
    status: 200,
    message: 'OK',
    arrayKey: 'actions',
    actions: list,
    pageSize: Math.max(list.length, 1),
    page: 0,
    orderType: 'DESC',
    orderColumn: 'id',
    hasNext: false,
  });
});

router.post('/action', (req, res) => {
  const channelId = resolveChannelId(req);
  const profileId = resolveProfileId(req, channelId);
  const dto = req.body || {};
  const id = Number(dto.Id ?? dto.id) || 0;
  const name = dto.Name ?? dto.name ?? '';
  const type = dto.Type ?? dto.type ?? '';
  const triggerValue = dto.TriggerValue ?? dto.triggerValue ?? null;
  const configJson = dto.ConfigJson ?? dto.configJson ?? '';
  const enabled = dto.Enabled ?? dto.enabled ?? true;
  const sort = Number(dto.Sort ?? dto.sort ?? 0) | 0;

  if (id > 0) {
    const existing = actions.findById(id);
    if (!existing || existing.ChannelId !== channelId) {
      return res.status(404).json({ status: 404 });
    }
    actions.patch(id, {
      Name: name,
      Type: type,
      TriggerValue: triggerValue,
      ConfigJson: (configJson && String(configJson).trim()) ? configJson : existing.ConfigJson,
      Enabled: !!enabled,
      Sort: sort,
    });
    return res.json({ status: 200, id });
  }

  const newId = actions.create({
    ChannelId: channelId,
    ProfileId: profileId,
    Name: name,
    Type: type,
    TriggerValue: triggerValue,
    ConfigJson: (configJson && String(configJson).trim()) ? configJson : '{}',
    Enabled: !!enabled,
    Sort: sort,
  });
  res.json({ status: 200, id: newId });
});

router.delete('/action/:id', (req, res) => {
  const channelId = resolveChannelId(req);
  const id = parseInt(req.params.id, 10);
  if (Number.isFinite(id) && id > 0) {
    const existing = actions.findById(id);
    if (existing && existing.ChannelId === channelId) actions.remove(id);
  }
  res.json({ status: 200 });
});

// The Actions & Events native form + DevExtreme grid use REST verbs the
// original C# API exposed but the POST-only port omitted, so create/edit
// silently 404'd. The bundle's saveActionForm (deobfuscated.js:8766) does
// PUT rest/action (create) + PATCH rest/action/:id (update) and reads
// response.action; getActionById (8784) does GET rest/action/:id and reads
// response.record. Add those verbs, mirroring the POST handler's field
// mapping, and return the mapped action/record the callbacks expect.
function buildActionFields(dto, existing) {
  const cfg = dto.ConfigJson ?? dto.configJson;
  const en = dto.Enabled ?? dto.enabled;
  return {
    Name: dto.Name ?? dto.name ?? (existing ? existing.Name : ''),
    Type: dto.Type ?? dto.type ?? (existing ? existing.Type : ''),
    TriggerValue: dto.TriggerValue ?? dto.triggerValue ?? (existing ? existing.TriggerValue : null),
    ConfigJson: cfg && String(cfg).trim() ? cfg : (existing ? existing.ConfigJson : '{}'),
    Enabled: en === undefined ? (existing ? !!existing.Enabled : true) : !!en,
    Sort: Number(dto.Sort ?? dto.sort ?? (existing ? existing.Sort : 0)) | 0,
  };
}

// GET /action/:id — edit-form prefill (bundle reads response.record).
router.get('/action/:id', (req, res) => {
  const channelId = resolveChannelId(req);
  const id = parseInt(req.params.id, 10);
  const row = Number.isFinite(id) && id > 0 ? actions.findById(id) : null;
  if (!row || row.ChannelId !== channelId) return res.status(404).json({ status: 404 });
  res.json({ status: 200, message: 'OK', record: mapAction(row) });
});

// PUT /action — create (native form + duplicate). Returns the created action.
router.put('/action', (req, res) => {
  const channelId = resolveChannelId(req);
  const profileId = resolveProfileId(req, channelId);
  const f = buildActionFields(req.body || {}, null);
  const newId = actions.create({ ChannelId: channelId, ProfileId: profileId, ...f });
  res.json({ status: 200, id: newId, action: mapAction(actions.findById(newId)) });
});

// PATCH /action/:id — update (native form + grid inline). Returns the action.
router.patch('/action/:id', (req, res) => {
  const channelId = resolveChannelId(req);
  const id = parseInt(req.params.id, 10);
  const existing = Number.isFinite(id) && id > 0 ? actions.findById(id) : null;
  if (!existing || existing.ChannelId !== channelId) return res.status(404).json({ status: 404 });
  actions.patch(id, buildActionFields(req.body || {}, existing));
  res.json({ status: 200, id, action: mapAction(actions.findById(id)) });
});

module.exports = router;
