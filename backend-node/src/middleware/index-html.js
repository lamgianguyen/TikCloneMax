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

function buildIndexHtml({ channelId, channelName }) {
  const cacheKey = `${channelId}|${channelName}`;
  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  const indexPath = path.join(FRONTEND_PATH, 'index.html');
  if (!fs.existsSync(indexPath)) {
    logger.warn(`[BUILD-HTML] index.html missing at ${indexPath}`);
    return Buffer.from('<html><body><h1>Frontend not found</h1><p>Place files in downloads/ folder</p></body></html>', 'utf8');
  }

  let html = fs.readFileSync(indexPath, 'utf8');

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
  };

  // Read every injection block once. The static blocks never change between
  // requests; only authScript has `{{defaultChannelId}}` / `{{defaultChannelName}}`.
  const blockScript = readTemplate('blockScript');
  const authScript = interpolate(readTemplate('authScript'), ctx);
  const loginPopupScript = readTemplate('loginPopupScript');
  const tiktokConnectScript = readTemplate('tiktokConnectScript');
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

    const buf = buildIndexHtml({ channelId, channelName });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).end(buf);
  };
}

module.exports = { buildIndexHtml, invalidateCache, indexHtmlMiddleware };
