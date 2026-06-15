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

// Graphic-overlay widgets (webcam / overlay / talking) read their per-style
// settings under the NON-prefixed key `${widgetId}_${field}` — e.g. the webcam
// widget reads `webcam_pure_variation` (downloads/widget/webcam). But the
// bundle persists the variation under the `widget_`-prefixed form
// (`widget_webcam_pure_variation`), and normalizeKey() only de-prefixes keys
// whose de-prefixed form exists in DEFAULTS — which these per-style keys do
// not. Result: the variation never reaches the widget, so the in-app preview
// freezes on its built-in default while the carousel counter (which reads the
// prefixed key) still advances. Expose a de-prefixed alias for these keys
// WITHOUT dropping the prefixed original (the control page reads the prefixed
// form). The per-style variation/animation AND the colour filters
// (saturationFilter/hueFilter/grayScaleFilter) are aliased — the graphic
// widgets read all of these as `${WIDGET_ID}_<field>` (downloads/widget/webcam
// :627-629), none of which exist in DEFAULTS, so without the alias a user's
// hue/saturation/grayscale adjustment never reaches the overlay.
// IMPORTANT: the bundle persists these keys LOWERCASED
// (widget_webcam_sakura_saturationfilter) but the widget reads camelCase
// (`${WIDGET_ID}_saturationFilter`). So match case-insensitively and re-emit the
// camelCase form the widget actually reads. (variation/animation are already
// lowercase on both sides.)
// Widgets read these fields CAMEL-CASED (`${id}_saturationFilter`, `${id}_fontType`)
// but the bundle persists them LOWERCASED (widget_<id>_saturationfilter). For any
// merged (de-prefixed, lowercase) key ending in one of these fields, re-emit the
// camelCase form the widget reads. Generic across ALL overlay groups (webcam/overlay/
// talking + goal*/gcounter*/etc.) — previously only webcam/overlay/talking were
// aliased, so goal/gcounter per-style settings reverted on reload/OBS (perf audit
// 2026-06-12). Additive only (never overwrites an existing key), so it's safe for
// any group whose widget happens to use these field names.
const CAMEL_FIELD_CASE = {
  variation: 'variation',
  animation: 'animation',
  saturationfilter: 'saturationFilter',
  huefilter: 'hueFilter',
  grayscalefilter: 'grayScaleFilter',
  progresscolors: 'progressColors',
  fonttype: 'fontType',
  fontsize: 'fontSize',
  fontlinespacing: 'fontLineSpacing',
  fontletterspacing: 'fontLetterSpacing',
  righttoleft: 'rightToLeft',
};

function aliasGraphicOverlayKeys(merged) {
  for (const [key, value] of Object.entries(merged)) {
    const idx = key.lastIndexOf('_');
    if (idx <= 0) continue;
    const camel = CAMEL_FIELD_CASE[key.slice(idx + 1)];
    if (!camel || camel === key.slice(idx + 1)) continue; // unknown field or already camel
    const aliasKey = key.slice(0, idx + 1) + camel;
    if (merged[aliasKey] === undefined) merged[aliasKey] = value;
  }
  return merged;
}

function buildMerged(channelId) {
  const ch = channels.findById(channelId);
  const profileId = ch && ch.ProfileId > 0 ? ch.ProfileId : 1;
  const rows = dynamicSettings.readAllAsMap(channelId, profileId);

  // Defaults first (frozen — clone before mutating).
  const merged = { ...DEFAULTS };
  // Multiple raw rows can normalize to the SAME canonical key:
  //   - the DIRECT key the current bundle saves (lowercased): `cannon_ballsize`
  //   - a stray case-variant: `cannon_ballSize`
  //   - a STALE legacy `widget_`-prefixed row from older versions:
  //     `widget_cannon_ballsize` / `widget_cannon_ballSize`
  // normalizeKey() de-prefixes the legacy `widget_` form to the same canonical
  // key, so a never-cleaned-up legacy row would CLOBBER the user's fresh save on
  // every read (the "settings save but revert on reload/OBS" bug). Resolve the
  // collision by precedence (lower tier wins): a direct key always beats a legacy
  // `widget_`-prefixed key, and within each, the lowercase form (what the bundle
  // actually writes) beats a case-variant — independent of row order.
  //   tier 0 = direct, lowercase   1 = direct, case-variant
  //   tier 2 = widget_, lowercase  3 = widget_, case-variant
  const canonTier = {};
  for (const [rawKey, value] of Object.entries(rows)) {
    if (value === '' || value === null || value === undefined) continue;
    // Per-viewer points data (`points_user_<u>` balance, `pointsmeta_<u>` identity)
    // and the self-referential `dynamicsettings` blob are NOT widget settings — no
    // widget ever reads them. After many streams they bloat to ~10mb of rows; merging
    // them into the broadcast bag makes the widget's
    // `localStorage.setItem('cachedSettings', bag)` throw QuotaExceededError → the
    // widget crashes to a BLANK PAGE (e.g. cannon.html:208). routes/settings.js strips
    // them on WRITE; this strips them on the READ/broadcast path too so the bag stays
    // small (~50KB of real UI config). Keep the `points.*` CONFIG namespace — only the
    // two per-viewer prefixes + dynamicsettings are dropped. 2026-06-15.
    if (rawKey.indexOf('pointsmeta_') === 0 || rawKey.indexOf('points_user_') === 0) continue;
    const lcRaw = rawKey.toLowerCase();
    if (lcRaw === 'dynamicsettings') continue;
    const canon = normalizeKey(rawKey);
    const lc = rawKey.toLowerCase();
    // Legacy only if normalizeKey actually de-prefixed it to a real canonical key
    // (graphic-overlay `widget_webcam_*` keys stay un-normalized → treated direct,
    // still handled by aliasGraphicOverlayKeys below).
    const isLegacyPrefixed = lc.startsWith('widget_') && canon !== rawKey;
    const isLower = rawKey === lc;
    const tier = (isLegacyPrefixed ? 2 : 0) + (isLower ? 0 : 1);
    if (canonTier[canon] !== undefined && tier > canonTier[canon]) continue;
    merged[canon] = coerce(value);
    canonTier[canon] = tier;
  }
  aliasGraphicOverlayKeys(merged);
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

// [save-lag fix] Debounce the widget broadcast per channel. A Ball-Size slider
// drag fires many POST /api/updateSettings in <1s; without this each one emits
// widgetSettings to every connected widget → visible save-time lag. Persist
// (writeMany) stays synchronous; only the rebuild+broadcast is coalesced.
const _broadcastTimers = new Map();
const BROADCAST_DEBOUNCE_MS = 250;

/**
 * Rebuild from DB and broadcast `widgetSettings` to every connected widget
 * for the channel. Called on boot and whenever POST /api/updateSettings
 * persists fresh values. The cache is refreshed synchronously (return value is
 * current); the socket broadcast is debounced to collapse rapid POST bursts.
 */
function rebuildAndBroadcast(channelId = 1) {
  const merged = rebuild(channelId);            // sync: cache fresh immediately
  const existing = _broadcastTimers.get(channelId);
  if (existing) clearTimeout(existing);
  _broadcastTimers.set(channelId, setTimeout(() => {
    _broadcastTimers.delete(channelId);
    try {
      sockets.broadcastToChannel('widgetSettings', rebuild(channelId), channelId, 'widget');
      logger.info(`[WidgetSettings] Rebuilt and broadcast (channelId=${channelId})`);
    } catch (err) {
      logger.warn({ err, channelId }, '[WidgetSettings] debounced broadcast failed');
    }
  }, BROADCAST_DEBOUNCE_MS));
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
  _aliasGraphicOverlayKeys: aliasGraphicOverlayKeys,
};
