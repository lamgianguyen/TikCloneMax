// Middleware that serves the bundled TikFinity frontend's index.html with
// the auth/reload/login injection payloads spliced in.
//
// Mirrors what `backend/Program.cs::BuildIndexHtml()` does, but reads its
// injection strings from `src/templates/*.txt` (extracted verbatim by
// `scripts/extract-templates.js`) instead of inlining ~4500 lines of JS into
// this file.
//
// Assembly order matches the C# version exactly:
//   - strip third-party telemetry script tags (posthog/sentry/gtag/feedback)
//   - rewrite cloud hostnames to local proxies
//   - inject after <head>:  reloadGuard + earlyCss + blockScript + authScript
//   - inject after <body>:  ttsVoiceShim + guestTopbar + loginPopupScript
//                           + tiktokConnectScript + ttsScript + twemojiScript
//                           + tiktokSigninGate + reloadMask
//
// Result is cached in memory after first build; the bundle on disk doesn't
// change at runtime so re-reading + re-injecting on every request would burn
// CPU for no reason.

const fs = require('fs');
const path = require('path');
const { FRONTEND_PATH, DEFAULT_CHANNEL_ID, DEFAULT_CHANNEL_NAME } = require('../config');
const logger = require('../logger');

const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

function readTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATES_DIR, `${name}.txt`), 'utf8');
}

// Bundle update notes:
//   The new TikFinity bundle (combo/app.js ≥3.9MB) added new i18n keys for the
//   voice picker modal, AI credits topup, daily limit dialog, etc. that aren't
//   in the older `downloads/index.html` SSR snapshot we ship. When user lands
//   on the default English route the bundle calls
//   `t('tts.voice_picker.ai_tab')` → undefined → renders the raw key.
//   Fix: extract the missing keys via `scripts/extract-new-i18n.js` (point
//   `--source=` at a fresh TikFinity gốc SSR HTML) and inject as a JS literal
//   into blockScript so an early IIFE merges them into every locale on the
//   page. Re-run the script after any combo/* replacement.
function readI18nPatch() {
  try {
    return fs.readFileSync(path.join(TEMPLATES_DIR, 'i18n-patch.json'), 'utf8');
  } catch (e) {
    logger.warn('[BUILD-HTML] i18n-patch.json missing — bundle modals may show raw keys until regenerated');
    return '{}';
  }
}

// Full voice catalog captured from production TikFinity gốc /api/tts/voices
// (118 voices: 18 ttsm + 100 polly). Interpolated into blockScript so the
// fetch/XHR mock interceptor can serve it when the bundle calls the endpoint.
// Re-saving voice-catalog.json picks up on next /api/_dev/reload-html.
function readVoiceCatalog() {
  try {
    return fs.readFileSync(path.join(TEMPLATES_DIR, 'voice-catalog.json'), 'utf8');
  } catch (e) {
    logger.warn('[BUILD-HTML] voice-catalog.json missing — voice picker modal will be empty');
    return '{"statusCode":200,"message":"Success","data":{"voices":[]}}';
  }
}

/**
 * Return the mtime (epoch ms, integer) of a static asset under
 * `downloads/<relative>`. Used as an auto-bumping cache buster — see
 * `tfConnectVersion` in the ctx below. Returns '0' on miss so the page
 * still loads (browser may serve stale, user can hard-refresh).
 */
function assetMtime(relativePath) {
  try {
    const stat = fs.statSync(path.join(FRONTEND_PATH, relativePath));
    return String(Math.trunc(stat.mtimeMs));
  } catch {
    return '0';
  }
}

/** Replace bundle-flavoured `{{var}}` placeholders with runtime values. */
function interpolate(text, ctx) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(ctx, key) ? String(ctx[key]) : ''
  );
}

// Cache the assembled HTML for a given (channelId, channelName) pair. The
// bundle only needs to be re-built when those defaults change (rare — usually
// once at boot when DB is read).
const _cache = new Map();

// Language-aware base HTML. When `lang` is set (e.g. "vi", "de", "es"), read
// `downloads/<lang>` instead of `downloads/index.html`. Each language file is
// a pre-localized HTML built by TikFinity gốc (strings baked in at build
// time, no runtime translation API). Cache key includes lang so multiple
// language variants coexist without collision.
function buildIndexHtml({ channelId, channelName, lang = '' }) {
  const cacheKey = `${channelId}|${channelName}|${lang}`;
  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  // Map lang code → physical filename under downloads/. Bundle gốc ships
  // each locale as an extensionless HTML next to index.html (`downloads/vi`,
  // `downloads/de`, `downloads/es`). For languages WITHOUT a dedicated HTML
  // file (id, ja, ko, ms, th, tl, tr, pt-BR), serve index.html (English base)
  // and inject the corresponding bucket from `downloads/config/localization/
  // <lang>.json` into the inline `tfPageloadData.localization` object — that
  // way vue-i18n's messages contain the target language at INIT (no async
  // fetch race, no first-paint flicker in the wrong locale).
  const baseFile = lang ? lang : 'index.html';
  let indexPath = path.join(FRONTEND_PATH, baseFile);
  let usedFallback = false;
  if (lang && !fs.existsSync(indexPath)) {
    logger.info(`[BUILD-HTML] lang file '${baseFile}' missing — using index.html + JSON injection for '${lang}'`);
    indexPath = path.join(FRONTEND_PATH, 'index.html');
    usedFallback = true;
  }
  if (!fs.existsSync(indexPath)) {
    logger.warn(`[BUILD-HTML] index.html missing at ${indexPath}`);
    return Buffer.from('<html><body><h1>Frontend not found</h1><p>Place files in downloads/ folder</p></body></html>', 'utf8');
  }

  let html = fs.readFileSync(indexPath, 'utf8');

  // Inject lang JSON into tfPageloadData.localization for HTML-less locales.
  // Bundle's vue-i18n initializes from `tfPageloadData.localization` at script
  // load. Without this bucket present, the bundle's switchLanguage runtime
  // fetch lands AFTER vue-i18n has snapshotted English → UI stays English
  // even though localization.languageCode='th'.
  if (usedFallback && lang) {
    const jsonPath = path.join(FRONTEND_PATH, 'config', 'localization', `${lang}.json`);
    if (fs.existsSync(jsonPath)) {
      try {
        const jsonContent = fs.readFileSync(jsonPath, 'utf8').trim();
        // Validate JSON parses (defensive — bad JSON would corrupt the inline
        // tfPageloadData literal and crash the bundle at script-parse time).
        const parsed = JSON.parse(jsonContent);
        // Re-serialize via JSON.stringify(parsed) so we own the textual output
        // (no whitespace surprises, no trailing junk). Then escape any
        // `</script>` sequence to `<\/script>` — JSON.stringify does NOT do this
        // by itself, and an unescaped `</script>` inside the inline literal
        // would break out of the surrounding <script> tag, enabling HTML
        // injection from a malicious/poisoned localization JSON file.
        const serialized = JSON.stringify(parsed).replace(/<\/script>/gi, '<\\/script>');
        // Insert `<langKey>:<serialized>,` right after `localization:{` so the
        // bundle reads our bucket alongside the default `en:{...}` bucket.
        // The marker must be the REAL tfPageloadData assignment, NOT the same
        // string inside our blockScript.txt comments. Anchor the search to
        // `tfPageloadData=` first to skip any prior occurrences in injected
        // <head> scripts.
        const langKey = lang.includes('-') ? `"${lang}"` : lang;
        const anchor = 'tfPageloadData=';
        const marker = 'localization:{';
        const anchorIdx = html.indexOf(anchor);
        const idx = anchorIdx >= 0 ? html.indexOf(marker, anchorIdx) : -1;
        if (idx >= 0) {
          html = html.slice(0, idx + marker.length)
               + `${langKey}:${serialized},`
               + html.slice(idx + marker.length);
          logger.info(`[BUILD-HTML] injected ${lang}.json (${serialized.length} bytes) into tfPageloadData.localization`);
        } else {
          logger.warn(`[BUILD-HTML] could not find tfPageloadData.localization marker — '${lang}' bucket not injected`);
        }
      } catch (err) {
        logger.warn(`[BUILD-HTML] failed to inject ${lang}.json: ${err.message}`);
      }
    } else {
      logger.warn(`[BUILD-HTML] no JSON at ${jsonPath} — '${lang}' will fall back to English`);
    }
  }

  // Strip third-party telemetry script tags — same regexes as the C# version.
  html = html.replace(/<script src="https:\/\/t\.contentsquare\.net\/uxa\/19b56fd959e33\.js"><\/script>/gi, '');
  html = html.replace(/<script>\(\(o,i\)=>[\s\S]*?posthog\.init\([\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script>\(\(e,t\)=>\{let a="featurebase-sdk"[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script\s+type="module">\s*import\s+\*\s+as\s+Sentry\s+from\s+['"][^'"]*@sentry\/browser[^'"]*['"];[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script>function gTag\(e\)[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<noscript><iframe src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=[^"]+" height="0" width="0" style="display:none;visibility:hidden"><\/iframe><\/noscript>/gi, '');

  // Rewrite cloud hosts → local proxies. Bundle's appConfig is generated
  // server-side as a giant inline JS literal; we patch the strings before they
  // reach the renderer.
  html = html.replace('authApiHost:"https://auth.zerody.one/"', 'authApiHost:""');
  html = html.replace('myinstantsApiHost:"https://myinstantsapi.zerody.one/"', 'myinstantsApiHost:"/myinstants-proxy/"');
  html = html.replace('connectorHost:"https://tikfinity-cws-{instance}.zerody.one/"', 'connectorHost:""');

  const ctx = {
    defaultChannelId: String(channelId || DEFAULT_CHANNEL_ID),
    defaultChannelName: channelName || DEFAULT_CHANNEL_NAME,
    // Auto-bumping cache buster for static JS we control. Reads file mtime
    // so any edit to /downloads/js/<name> updates the version string in
    // the served HTML — browsers fetch the new file without a manual bump.
    // Falls back to '0' if the file is missing so the page still loads.
    tfConnectVersion: assetMtime('js/tf-connect.js'),
    // Raw JSON literal of new i18n keys missing from English bundle. Injected
    // verbatim into blockScript as `var patch = {{i18nPatchJson}}` so the
    // early IIFE can merge them into every locale at runtime. Re-read on every
    // build so `scripts/extract-new-i18n.js` regenerations pick up via
    // /api/_dev/reload-html without needing an Electron restart.
    i18nPatchJson: readI18nPatch(),
    // Raw JSON literal of the voice catalog. The blockScript mock interceptor
    // builds TF_MOCK_VOICES from `{{voiceCatalogJson}}.data.voices`. Re-read on
    // every build so swapping the catalog file picks up via reload-html.
    voiceCatalogJson: readVoiceCatalog(),
  };

  // Read every injection block once. The static blocks never change between
  // requests; only authScript / tiktokConnectScript have `{{var}}` placeholders.
  // blockScript now carries `{{i18nPatchJson}}` so it must be interpolated.
  const blockScript = interpolate(readTemplate('blockScript'), ctx);
  const authScript = interpolate(readTemplate('authScript'), ctx);
  const loginPopupScript = readTemplate('loginPopupScript');
  // tiktokConnectScript carries `{{tfConnectVersion}}` cache buster.
  const tiktokConnectScript = interpolate(readTemplate('tiktokConnectScript'), ctx);
  const earlyCss = readTemplate('earlyCss');
  const guestTopbar = readTemplate('guestTopbar');
  const ttsVoiceShim = readTemplate('ttsVoiceShim');
  const ttsScript = readTemplate('ttsScript');
  const twemojiScript = readTemplate('twemojiScript');
  const tiktokSigninGate = readTemplate('tiktokSigninGate');
  const reloadMask = readTemplate('reloadMask');
  const reloadGuard = readTemplate('reloadGuard');

  // Head injection: reload guard FIRST so it patches Location.prototype before
  // any bundle script captures a reference to the original `location.reload`.
  const headInsert = reloadGuard + earlyCss + blockScript + authScript;
  html = html.replace(/<head>/i, `<head>${headInsert}`);

  // Body injection: same order as the C# version, after the new `<body>` tag
  // which we tag with `tf-logged-out` so the guest topbar shows until JWT
  // arrives.
  const bodyInsert =
    ttsVoiceShim +
    guestTopbar +
    loginPopupScript +
    tiktokConnectScript +
    ttsScript +
    twemojiScript +
    tiktokSigninGate +
    reloadMask;
  html = html.replace(/<body>/i, `<body class="tf-logged-out">${bodyInsert}`);

  const buf = Buffer.from(html, 'utf8');
  _cache.set(cacheKey, buf);
  logger.info(`[BUILD-HTML] assembled ${buf.length} bytes for channel ${channelId} (${channelName})`);
  return buf;
}

function invalidateCache() {
  _cache.clear();
}

/**
 * Express middleware factory. Returns a handler that serves the cached HTML
 * for the SPA root and known SPA fallback paths. Static assets are handled
 * separately by `express.static(downloads/)` mounted upstream.
 */
// Detect language code from request — URL prefix wins, then cookie, then
// Accept-Language. Returns '' (empty = English/default) if no match.
// All 12 langs that bundle's picker offers — even those without a dedicated
// `downloads/<lang>` HTML are honored via runtime JSON injection below.
const SUPPORTED_LANGS = new Set(['vi', 'de', 'es', 'id', 'ja', 'ko', 'ms', 'th', 'tl', 'tr', 'pt-BR']);
// Bundle's language picker writes its own cookie `tf_locale=VN|DE|ES|EN|TH|...`
// using the locale (NOT the lang code) — uppercase, two letters, country-style.
// We honor that mapping so the picker's choice survives navigation and the
// browser hits the right localized HTML even when on `/tiktok/...` URLs that
// don't carry a `/vi/` prefix.
// EN / US → '' (empty = serve default index.html which already has English).
const TF_LOCALE_TO_LANG = {
  VN: 'vi', VI: 'vi',
  DE: 'de',
  ES: 'es',
  ID: 'id',
  JA: 'ja', JP: 'ja',
  KO: 'ko', KR: 'ko',
  MS: 'ms', MY: 'ms',
  TH: 'th',
  TL: 'tl', PH: 'tl',
  TR: 'tr',
  BR: 'pt-BR', 'PT-BR': 'pt-BR',
  EN: '', US: '',
};
function detectLang(req) {
  // URL prefix: /vi/..., /de/..., /es/...
  const m = String(req.path || '').match(/^\/([a-z]{2})(\/|$)/);
  if (m && SUPPORTED_LANGS.has(m[1])) return m[1];
  const cookieStr = String(req.headers.cookie || '');
  // Bundle-set cookie (`tf_locale=VN`) — uppercase, locale code, not lang.
  const cookieLocale = cookieStr.match(/(?:^|;\s*)tf_locale=([A-Za-z]{2})/);
  const localeKey = cookieLocale ? String(cookieLocale[1]).toUpperCase() : '';
  if (localeKey && Object.prototype.hasOwnProperty.call(TF_LOCALE_TO_LANG, localeKey)) {
    return TF_LOCALE_TO_LANG[localeKey];
  }
  // Our own cookie (`tf_lang=vi` or `tf_lang=pt-BR`) — lowercase + optional
  // hyphenated suffix (e.g. pt-BR). Match longer codes first.
  const cookieLang = cookieStr.match(/(?:^|;\s*)tf_lang=([a-zA-Z]{2,3}(?:-[A-Za-z]{2,3})?)/);
  if (cookieLang && SUPPORTED_LANGS.has(cookieLang[1])) return cookieLang[1];
  // Accept-Language fallback (browser preference).
  const al = String(req.headers['accept-language'] || '').toLowerCase();
  for (const code of SUPPORTED_LANGS) {
    if (al.startsWith(code) || al.includes(`,${code}`) || al.includes(`;${code}`)) return code;
  }
  return '';
}

function indexHtmlMiddleware() {
  return function (req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const accept = String(req.headers.accept || '');
    // Only intercept document loads, not asset requests.
    if (!accept.includes('text/html') && req.path !== '/') return next();

    const channels = require('../db/models/channels');
    const channel = channels.findDefault();
    const channelId = channel ? channel.ChannelId : DEFAULT_CHANNEL_ID;
    const channelName = channel ? channel.ChannelName : DEFAULT_CHANNEL_NAME;
    const lang = detectLang(req);

    // When URL has explicit /<lang>/ prefix, persist that choice as a cookie
    // so subsequent navigations without the prefix (bundle's client-side
    // router strips it on /tiktok/* page navigations) still receive the
    // localized HTML with baked-in translations.
    const urlLangMatch = String(req.path || '').match(/^\/([a-z]{2})(\/|$)/);
    if (urlLangMatch && SUPPORTED_LANGS.has(urlLangMatch[1])) {
      res.setHeader('Set-Cookie',
        `tf_lang=${urlLangMatch[1]}; Path=/; Max-Age=31536000; SameSite=Lax`);
    }

    const buf = buildIndexHtml({ channelId, channelName, lang });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).end(buf);
  };
}

module.exports = { buildIndexHtml, invalidateCache, indexHtmlMiddleware, detectLang };
