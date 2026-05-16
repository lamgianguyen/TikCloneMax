// Single source of truth for widget settings. Caches the merged
// (static defaults + DB overrides) bag per channel; rebuilds + broadcasts
// when settings change. Direct port of `backend/Services/WidgetSettingsCache.cs`.
//
// Stream Profiles: only the active profile's DynamicSettings rows are folded
// into the bag. Switching profile bumps Channels.ProfileId then calls
// `rebuildAndBroadcast(channelId)` so connected widgets pick up the new
// profile's overrides without a full reload.

const DEFAULTS = require('./widget-defaults');
const channels = require('../db/models/channels');
const dynamicSettings = require('../db/models/dynamic-settings');
const sockets = require('./socket-manager');
const logger = require('../logger');

// Lower-cased canonical-key lookup, built once. Lets `normalizeKey()` match
// DB rows whose casing drifted ("Cannon_BallSize") and legacy `widget_*`
// prefixed keys back to the canonical defaults entry.
const CANONICAL_KEYS = new Map();
for (const k of Object.keys(DEFAULTS)) CANONICAL_KEYS.set(k.toLowerCase(), k);

/** @type {Map<number, object>} */
const _channelCache = new Map();

function normalizeKey(rawKey) {
  const lc = rawKey.toLowerCase();
  const hit = CANONICAL_KEYS.get(lc);
  if (hit) return hit;

  if (lc.startsWith('widget_')) {
    const legacy = lc.slice('widget_'.length);
    const legacyHit = CANONICAL_KEYS.get(legacy);
    if (legacyHit) return legacyHit;
  }

  return rawKey;
}

// DB rows are TEXT. Coerce numeric/boolean strings back to native types so
// the bundle's `if (settings.foo)` and `settings.bar > 5` checks behave.
function coerce(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s === '') return '';
  if (s === 'true' || s === 'True') return true;
  if (s === 'false' || s === 'False') return false;
  // Strict integer
  if (/^-?\d+$/.test(s)) {
    const n = Number(s);
    if (Number.isSafeInteger(n)) return n;
  }
  // Float (locale-invariant; SQLite stores TEXT with '.')
  if (/^-?\d+\.\d+$/.test(s)) {
    const f = Number(s);
    if (Number.isFinite(f)) return f;
  }
  return s;
}

function buildMerged(channelId) {
  const ch = channels.findById(channelId);
  const profileId = ch && ch.ProfileId > 0 ? ch.ProfileId : 1;
  const rows = dynamicSettings.readAllAsMap(channelId, profileId);

  // Defaults first (frozen — clone before mutating).
  const merged = { ...DEFAULTS };
  for (const [rawKey, value] of Object.entries(rows)) {
    if (value === '' || value === null || value === undefined) continue;
    merged[normalizeKey(rawKey)] = coerce(value);
  }
  return merged;
}

/**
 * Get the merged bag for a channel. Reads from cache unless `refresh=true`.
 * `channelId <= 0` returns the bare defaults (used by guest /widget loads
 * before a channel context is set).
 */
function getForChannel(channelId = 1, refresh = false) {
  if (channelId <= 0) return { ...DEFAULTS };
  if (!refresh && _channelCache.has(channelId)) return _channelCache.get(channelId);

  try {
    const merged = buildMerged(channelId);
    _channelCache.set(channelId, merged);
    return merged;
  } catch (err) {
    logger.warn({ err, channelId }, '[WidgetSettings] build failed — falling back to defaults');
    const fallback = { ...DEFAULTS };
    _channelCache.set(channelId, fallback);
    return fallback;
  }
}

/** Convenience: same as getForChannel(...) but returns the JSON string. */
function getJsonForChannel(channelId = 1, refresh = false) {
  return JSON.stringify(getForChannel(channelId, refresh));
}

/** Rebuild from DB without emitting. */
function rebuild(channelId = 1) {
  return getForChannel(channelId, true);
}

/**
 * Rebuild from DB and broadcast `widgetSettings` to every connected widget
 * for the channel. Called on boot and whenever POST /api/updateSettings
 * persists fresh values.
 */
function rebuildAndBroadcast(channelId = 1) {
  const merged = rebuild(channelId);
  sockets.broadcastToChannel('widgetSettings', merged, channelId, 'widget');
  logger.info(`[WidgetSettings] Rebuilt and broadcast (channelId=${channelId})`);
  return merged;
}

/** Drop the cached entry for a channel — next read reloads from DB. */
function invalidate(channelId) {
  _channelCache.delete(channelId);
}

module.exports = {
  DEFAULTS,
  getForChannel,
  getJsonForChannel,
  rebuild,
  rebuildAndBroadcast,
  invalidate,
  normalizeKey,
};
