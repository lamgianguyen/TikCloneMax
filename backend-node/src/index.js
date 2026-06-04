// Backend entry point. Starts Express + Socket.IO on the bundle's expected
// port, applies pending DB migrations via Knex (one-shot at boot), seeds the
// default channel if the DB is fresh, and serves the bundle's index.html with
// all auth/reload/login injection payloads spliced in.

const http = require('http');
const path = require('path');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { Server: IoServer } = require('socket.io');

const config = require('./config');
const logger = require('./logger');
const sockets = require('./services/socket-manager');
const widgetSettings = require('./services/widget-settings-cache');
const { optionalAuth } = require('./middleware/auth');
const { indexHtmlMiddleware } = require('./middleware/index-html');
const { spaFallback } = require('./middleware/spa-fallback');

const meRouter = require('./routes/me');
const settingsRouter = require('./routes/settings');
const configRouter = require('./routes/config');
const authRouter = require('./routes/auth');
const actionsRouter = require('./routes/actions');
const soundsRouter = require('./routes/sounds');
const ttsRouter = require('./routes/tts');
const goalsRouter = require('./routes/goals');
const pointsRouter = require('./routes/points');
const commandsRouter = require('./routes/commands');
const widgetRouter = require('./routes/widget');
const dataRouter = require('./routes/data');
const notificationsRouter = require('./routes/notifications');
const backupRouter = require('./routes/backup');
const resetRouter = require('./routes/reset');
const seedRouter = require('./routes/seed');
const proRouter = require('./routes/pro');
const keyAuthRouter = require('./routes/key-auth');
const uploadRouter = require('./routes/upload');
const webhooksRouter = require('./routes/webhooks');
const obsRouter = require('./routes/obs');
const tikfinityImportRouter = require('./routes/tikfinity-import');
const tiktokRouter = require('./routes/tiktok');

// --- Apply DB migrations + seed BEFORE we accept any HTTP traffic. -----------
async function bootstrapDb() {
  const knex = require('knex')(require('../knexfile'));
  try {
    const [batchNo, applied] = await knex.migrate.latest();
    if (applied.length === 0) {
      logger.info('[DB] schema up to date');
    } else {
      logger.info(`[DB] applied batch #${batchNo}: ${applied.join(', ')}`);
    }
  } finally {
    // We use our own better-sqlite3 connection at runtime; knex was only
    // needed for the migration run. Closing here releases the file handle so
    // better-sqlite3 can open it without WAL contention.
    await knex.destroy();
  }

  const seed = require('./db/seed');
  return seed.run();
}

// --- Express + Socket.IO -----------------------------------------------------
const app = express();
const server = http.createServer(app);

app.disable('x-powered-by');
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(optionalAuth);

// Request log mirroring the C# parent's `[REQ]` format so the Electron host's
// existing log forwarding picks the lines up unchanged.
app.use((req, _res, next) => {
  if (req.path.startsWith('/socket.io')) return next();
  const qs = req.url.includes('?') ? ' ?' + req.url.split('?')[1] : '';
  logger.info(`[REQ] ${req.method} ${req.path}${qs}`);
  next();
});

// --- API routes (Phase 1 stubs; replaced in Phase 2). ------------------------
//
// Registered BEFORE express.static so our handlers win against any cached
// `downloads/api/<name>` static fixtures (TikFinity ships pre-recorded JSON
// fixtures under downloads/api/ — e.g. `me`, `getAllGifts`. They're useful as
// fallback for endpoints we haven't ported yet but must NOT shadow real
// handlers).
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', backend: 'node', ts: Date.now() });
});

// Dev helper: fire a synthetic chat event with the same shape the TikTok
// bridge produces. Hits every socket on channel 1 (controlpage + widgets),
// matching the real `chat` broadcast path. Useful for testing TTS / chat
// panel without an active live stream. Example:
//   curl -X POST http://localhost:5285/api/_dev/fake-chat?text=hello
app.post('/api/_dev/fake-chat', (req, res) => {
  const text = (req.query.text || req.body?.text || 'hello world').toString();
  const uniqueId = (req.query.user || req.body?.user || 'testuser').toString();
  const payload = {
    uniqueId,
    nickname: uniqueId,
    userId: '0',
    profilePictureUrl: '',
    comment: text,
    isModerator: false,
    isSubscriber: false,
    followRole: 0,
    userBadges: [],
  };
  try {
    sockets.broadcastToChannel('chat', payload, 1);  // no appType → all sockets
    res.json({ status: 'ok', emitted: 'chat', payload });
  } catch (err) {
    res.status(500).json({ error: err?.message || String(err) });
  }
});

// Dev helper: blow away the per-(channelId,channelName) HTML cache so the
// next page request re-reads templates from disk. Useful while iterating on
// earlyCss / blockScript / authScript without restarting the whole backend.
// Also pushes a `tf-dev-reload` Socket.IO event to every connected client so
// the renderer auto-refreshes instead of needing a manual Ctrl+R.
app.post('/api/_dev/reload-html', (_req, res) => {
  const { invalidateCache } = require('./middleware/index-html');
  invalidateCache();
  try {
    sockets.broadcast('tf-dev-reload', { ts: Date.now() });
  } catch { /* socket may not be bound yet */ }
  res.json({ status: 'ok', reloaded: true, broadcast: true, ts: Date.now() });
});

// Watch template + injected-static-asset directories for edits — when
// anything we control changes, auto-invalidate the HTML cache + broadcast
// reload. The HTML carries an auto-bumping `?v={{tfConnectVersion}}`
// cache buster derived from tf-connect.js mtime, so clearing the cache
// here is what propagates the new version string to the next request.
try {
  const fs = require('fs');
  const path = require('path');
  const tplDir = path.resolve(__dirname, 'templates');
  const jsDir = path.resolve(__dirname, '..', '..', 'downloads', 'js');
  let _watchDebounce = null;
  function scheduleReload(filename) {
    if (_watchDebounce) clearTimeout(_watchDebounce);
    _watchDebounce = setTimeout(() => {
      const { invalidateCache } = require('./middleware/index-html');
      invalidateCache();
      try { sockets.broadcast('tf-dev-reload', { ts: Date.now(), trigger: filename }); }
      catch { /* ignore */ }
      logger.info(`[DEV] file change → reload broadcast (${filename})`);
    }, 200);  // Debounce: editors often emit multiple fs events per save.
  }
  fs.watch(tplDir, { persistent: false }, (eventType, filename) => {
    if (filename && filename.endsWith('.txt')) scheduleReload(filename);
  });
  fs.watch(jsDir, { persistent: false }, (eventType, filename) => {
    if (filename && filename.endsWith('.js')) scheduleReload(filename);
  });
} catch (err) {
  logger.warn({ err: err?.message || err }, '[DEV] file watcher init failed');
}

// Real /api/* handlers. Order matters: mount BEFORE express.static so the
// pre-recorded `downloads/api/*` JSON fixtures only fire as fallback for
// endpoints we haven't ported yet.
app.use('/api', meRouter);       // /me, /loginChannel, /switchProfile, /setAffiliate
app.use('/api', settingsRouter); // /updateSettings, /getOverlayConfig, /modules
app.use('/api', configRouter);   // /getAppConfig, /config, /getSystemConfig, /getTranslations, /init, /v2/sync

// Bundle fetches `/config/localization/<lang>.json` directly at root (no /api
// prefix) when user switches language from the profile dropdown. If 404,
// bundle's loader throws "Error while loading translation for <lang>" →
// Vue mount crashes → black screen. If empty {}, bundle has no labels for
// that locale → entire UI renders raw keys (nav.search, menu_start, ...).
// Extract the baked tfPageloadData.localization.<lang> from the served HTML
// file for the requested lang, falling back to en for unsupported locales.
const LOCALE_FILES = { vi: 'vi', en: 'index.html', de: 'de', es: 'es' };
const localeCache = new Map();
function extractLocaleFromHtml(filePath, langKey) {
  if (localeCache.has(filePath + '|' + langKey)) return localeCache.get(filePath + '|' + langKey);
  try {
    const html = require('fs').readFileSync(filePath, 'utf8');
    // Find `localization:{<lang>:{...}}` block and parse value.
    const marker = 'localization:{' + langKey + ':{';
    const start = html.indexOf(marker);
    if (start < 0) { localeCache.set(filePath + '|' + langKey, null); return null; }
    // Walk braces to find matching close
    let i = start + marker.length;
    let depth = 1, inStr = false, esc = false, strChar = '';
    while (i < html.length && depth > 0) {
      const c = html[i];
      if (inStr) {
        if (esc) esc = false;
        else if (c === '\\') esc = true;
        else if (c === strChar) inStr = false;
      } else {
        if (c === '"' || c === "'") { inStr = true; strChar = c; }
        else if (c === '{') depth++;
        else if (c === '}') depth--;
      }
      i++;
    }
    if (depth !== 0) { localeCache.set(filePath + '|' + langKey, null); return null; }
    const inner = html.substring(start + marker.length, i - 1);
    // Convert JS object literal (unquoted keys + single quotes) to JSON via Function eval
    // SAFE: source is our own downloads/* file, not user input.
    const obj = new Function('return {' + inner + '}')();
    localeCache.set(filePath + '|' + langKey, obj);
    return obj;
  } catch (e) {
    localeCache.set(filePath + '|' + langKey, null);
    return null;
  }
}
app.get('/config/localization/:lang.json', (req, res) => {
  const langArg = String(req.params.lang || '').toLowerCase();
  const path = require('path');
  const downloadsDir = path.resolve(__dirname, '..', '..', 'downloads');
  // Try requested lang's bundled HTML first.
  let payload = null;
  if (LOCALE_FILES[langArg]) {
    payload = extractLocaleFromHtml(path.join(downloadsDir, LOCALE_FILES[langArg]), langArg);
  }
  // Fallback to EN baseline so UI still shows readable English labels.
  if (!payload) {
    payload = extractLocaleFromHtml(path.join(downloadsDir, 'index.html'), 'en') || {};
  }
  res.json(payload);
});
app.use('/api', authRouter);     // /auth/*, /v1/auth/*, /v1/flow/*, /v1/code/*
app.use('/api/rest', actionsRouter); // /rest/action (GET/POST/DELETE)
app.use('/api', soundsRouter);       // /sounds*, /rest/sound*
app.use('/api/tts', ttsRouter);      // /tts/generate
app.use('/api/goals', goalsRouter);  // /goals (CRUD + /reset)
app.use('/api/points', pointsRouter);// /points/leaderboard, /points/user/:name
app.use('/api/commands', commandsRouter); // /commands (CRUD + /test)
app.use('/api/widget', widgetRouter);     // /widget/* (timer, coinjar, wheel, coindrop, actions/test, ...)
app.use('/api', dataRouter);              // /odata/*, /rest/transaction, /getAllGifts, /usage/log, ...
app.use('/api/notifications', notificationsRouter); // /notifications/list, /markRead, /clear
app.use('/api/backup', backupRouter);     // /backup/export, /backup/import
app.use('/api/reset', resetRouter);       // /reset/aggregates, /reset/points, /reset/goals, /reset/all
app.use('/api/seed', seedRouter);         // /seed (POST import), /seed/status
app.use('/api/pro', proRouter);           // /pro/* (upgrade/status/stripe stubs)
app.use('/api/auth', keyAuthRouter);      // /auth/key-login (Serial Key gate → TikfinityServer)
app.use('/api', uploadRouter);            // /uploadFile, /uploadMedia, /upload, /uploads/list, /uploads/delete
app.use('/api/webhooks', webhooksRouter); // /webhooks (CRUD + /test)
app.use('/api/obs', obsRouter);           // /obs/status, /obs/connect, /obs/scenes, ...
app.use('/api/import', tikfinityImportRouter); // /import/tikfinity, /import/tikfinity/test
app.use('/api/tiktok', tiktokRouter);           // /tiktok/status, /tiktok/connect, /tiktok/disconnect, /tiktok/stats

// Myinstants sound library proxy — TRANSPARENT pass-through to zerody.
//
// GROUND TRUTH (verified 2026-05-30 via Network tab + curl, after decoding
// app.js:69838): the bundle's soundlibrary fetches the HARDCODED url
//   https://myinstantsapi.zerody.one/api/sounds/{trending|search}?region=X
//   &language=Y&page=N&q=<term>&clientVersion=2
// and reads `resp.sounds` (array of `{name, url, soundId}`).
//
// CORRECTION: zerody is NOT dead — an earlier test hit a FABRICATED path
// (`/api/sounds/recent/?country=`) that 404'd, wrongly concluding it was
// down. The REAL paths (trending/search with region=) return 200 with the
// exact `{fromCache, sounds:[...]}` shape the bundle expects, plus CORS `*`.
// So the prior myinstants.com translation was unnecessary + produced a
// wrong shape. We now forward 1:1 to zerody and pipe the response back
// unchanged — the bundle gets exactly what it was written for.
//
// The blockScript XHR rewrite (rewriteKnownRemoteUrl) sends the renderer's
// hardcoded zerody URL here (same-origin), so we proxy server-side to avoid
// any CSP/CORS edge cases. `${path}${query}` forwarded verbatim.
const MYINSTANTS_ORIGIN = 'https://myinstantsapi.zerody.one';
app.get(/^\/myinstants-proxy\/.*/, async (req, res) => {
  const upstreamPath = req.path.replace(/^\/myinstants-proxy/, '');
  const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const upstreamUrl = `${MYINSTANTS_ORIGIN}${upstreamPath}${qs}`;
  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TikMaxClient/1.0',
        'Accept': 'application/json',
      },
    });
    const body = await upstream.text();
    res.status(upstream.status);
    res.set('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.send(body);
  } catch (err) {
    logger.warn({ err: err.message, upstreamUrl }, '[myinstants-proxy] upstream fetch failed');
    res.status(502).json({ error: 'upstream fetch failed', message: err.message });
  }
});

// Bundle's overlay-preview iframe loads URLs like `/widget/coinmatch/?cid=1`
// (note the trailing slash before the querystring). express.static looks for
// `coinmatch/index.html` which doesn't exist, then falls through → 404. The
// actual widget HTML is at `downloads/widget/coinmatch` (no slash, no ext) or
// `downloads/widget/coinmatch.html`. Rewrite `/widget/<name>/` → `/widget/<name>`
// before express.static sees it.
//
// NOTE: matching the EXACT shape `/widget/<single-name>/` and nothing else.
// Express's `app.use('/widget/:name/', ...)` would also match
// `/widget/socketioclient.js` (loose-prefix matching), which would mark static
// `.js` assets as `text/html` and break the bundle's script-loader. Filter
// strictly on req.path here.
// Widget asset path normalization. TikFinity ships each widget as both:
//   - `downloads/widget/<name>.html` (flat)
//   - `downloads/widget/<name>/index.html` (subdirectory with same content)
//
// Shared scripts/sounds/images live ONLY at the widget ROOT
// (`downloads/widget/socketioclient.js`, `downloads/widget/sharedio/`,
//  `downloads/widget/sounds/`, `downloads/widget/img/`, ...).
//
// When the bundle iframe loads `/widget/coinjar/` (subdirectory form), the
// HTML's relative `socketioclient.js` resolves to
// `/widget/coinjar/socketioclient.js` — 404, since that file doesn't exist
// inside the per-widget subdirectory.
//
// We rewrite TWO categories of paths so express.static finds them:
//   1) `/widget/<bundle-root-asset>` → strip the leading `/widget` prefix
//      for assets shipped at the bundle root (`js/`, `css/`, `dx/`, `fa/`,
//      `twemoji/`).
//   2) `/widget/<widget-name>/<shared-widget-asset>` → strip the per-widget
//      directory so the shared asset at `/widget/<shared-widget-asset>` is
//      served instead.
const WIDGET_SHARED_ASSETS = [
  'socketioclient.js',
  'mediawrapper.js',
  'sharedio/',
  'sounds/',
  'img/',
  'eventcarousel/',
];

app.use((req, res, next) => {
  // (1) `/widget/js/...` → `/js/...` etc.
  if (req.path.startsWith('/widget/js/') || req.path.startsWith('/widget/css/')
   || req.path.startsWith('/widget/twemoji/') || req.path.startsWith('/widget/dx/')
   || req.path.startsWith('/widget/fa/')) {
    req.url = req.url.replace(/^\/widget/, '');
    return next();
  }
  // (2) `/widget/<name>/<shared>` → `/widget/<shared>` when <shared> is one
  // of the known per-widget-relative shared assets.
  const m = /^\/widget\/[^/]+\/(.+)$/.exec(req.path);
  if (m) {
    const rest = m[1];
    for (const asset of WIDGET_SHARED_ASSETS) {
      if (asset.endsWith('/') ? rest.startsWith(asset) : rest === asset || rest.startsWith(asset + '?')) {
        req.url = req.url.replace(/^\/widget\/[^/]+\//, '/widget/');
        return next();
      }
    }
  }
  next();
});

// Trailing-slash redirect for extensionless widget files. When browser
// loads `/widget/streambuddies` (no slash), it treats `/widget/` as the
// current directory — any relative `<script src="../foo.js">` in the
// served HTML then resolves to root `/foo.js` instead of the widget dir,
// 404s, and the spa-fallback returns text/html → "Refused to execute
// script" MIME errors. Redirecting to `/widget/<name>/` (with slash)
// forces the browser to treat the widget URL as a directory so relative
// resolution works correctly.
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const m = /^\/widget\/([^/.?]+)$/.exec(req.path);
  if (!m) return next();
  const name = m[1];
  const fs = require('fs');
  const candidate = path.join(config.FRONTEND_PATH, 'widget', name);
  // Only redirect if it's a real extensionless FILE under widget/ (otherwise
  // it'd be a 404 anyway). Stat must succeed and isFile() must be true.
  try {
    if (fs.statSync(candidate).isFile()) {
      const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
      return res.redirect(302, `/widget/${name}/${qs}`);
    }
  } catch { /* not a file → fall through */ }
  next();
});

app.use((req, res, next) => {
  const m = /^\/widget\/([^/]+)\/$/.exec(req.path);
  if (!m) return next();
  const name = m[1];
  // Skip names with a `.` in them (those are real files like `chat.html` —
  // express.static handles them correctly).
  if (name.includes('.')) return next();
  const fs = require('fs');
  const candidate = path.join(config.FRONTEND_PATH, 'widget', name);
  const candidateHtml = candidate + '.html';
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.sendFile(candidate);
  }
  if (fs.existsSync(candidateHtml)) {
    return res.sendFile(candidateHtml);
  }
  next();
});

// Cloudflare RUM (Real User Monitoring) beacon. The obfuscated bundle was
// instrumented with cdn-cgi/rum tracking that we don't proxy — silence the
// 404 storm with a no-op 204 instead of letting Sentry/PostHog report it.
app.all('/cdn-cgi/rum', (_req, res) => res.status(204).end());

// DevExtreme icon fonts ship as 188-byte HTML placeholders in downloads/
// (the real binaries weren't included). Browser parses them, fails
// `invalid sfntVersion: 171731045` (= "\\n<a!" prefix) and spams the log.
// Respond with a minimal valid empty-font response so the parser silently
// falls back to the next font in the stack.
app.get(/^\/dx\/css\/icons\/dxicons\.(woff2|woff|ttf)$/, (_req, res) => {
  res.status(204).end();  // Browser treats 204 as no-resource → silent fallback.
});

// Tikfinity's Google Tag Manager analytics proxy lived at `/2l68/`. Their
// inline IIFE dynamically injects `<script src="/2l68/">` which expects a
// JS response — without it, our spa-fallback returns index.html, browser
// tries to execute as JS, throws `SyntaxError: Unexpected token '<'` at
// `/2l68/:1`. This propagates up to the bundle's fatal error boundary
// ("Oh no! :(" crash page) and degrades to the legacy navigation layout.
// Stub the whole subtree with an empty JS so the inject succeeds silently.
app.get(/^\/2l68(\/.*)?$/, (_req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.status(200).end('/* tf: GTM proxy stub */');
});

// Avatar proxy. Bundle's widgets (tops, userinfo, viewercount, …) point
// `<img>` tags at `/img/user/<channelId>/<userId>`. The original C# bridge
// kept a userId → profilePicture lookup; here the same data is collected by
// `aggregates.rememberAvatar` on every event that carries a user. Resolve the
// URL and 302-redirect to the TikTok CDN so the browser streams the bytes
// directly. Falls back to the shipped `/img/nothumb.webp` when unknown.
app.get('/img/user/:channelId/:userId', (req, res) => {
  const aggregates = require('./services/aggregates');
  const url = aggregates.avatarFor(req.params.userId);
  if (url) return res.redirect(302, url);
  return res.redirect(302, '/img/nothumb.webp');
});

// Pin SPA deep-link HTML paths to the processed-HTML middleware BEFORE
// express.static gets a chance to serve the raw `downloads/` source files.
//
// Background: the bundle uses URL patterns like `/tiktok/obsoverlays`,
// `/tiktok/setup`, `/streamerbot-integration` etc. for client-side routing.
// `downloads/` ships matching static HTML files for each of those routes
// (legacy SSR pages for direct-load + SEO). With express.static mounted
// upstream, a Ctrl+R while on any of those routes was served the RAW static
// file directly — which has no reloadGuard, no PostHog stub, no
// data-new-navigation-design body attribute. Bundle's app.js then read an
// uninitialised posthog (empty Array queue) and fell back to the legacy
// text-sidebar layout.
//
// Forcing these paths through indexHtmlMiddleware guarantees every HTML
// document load gets the full injection. The bundle's own client-side
// router then reads location.pathname and renders the correct page.
//
// Regex matches:
//   /                        → already handled by app.get('/', ...) below
//   /index            /index.html
//   /tiktok/<anything>
//   /streamerbot-integration  /chatbot-troubleshooting
//   /get-tiktok-username      /studiofix
//   /de  /es  /en             (language root variants in downloads/)
//   /de/<anything>            /es/<anything>            /en/<anything>
const SPA_HTML_ROUTES = /^\/(index(\.html?)?|tiktok\/[^.]*|streamerbot-integration|chatbot-troubleshooting|get-tiktok-username|studiofix|(de|es|en|vi)(\/[^.]*)?)$/;
app.get(SPA_HTML_ROUTES, (req, res, next) => {
  // Only intercept genuine document loads — never asset fetches that happen
  // to land on a path-without-extension. If Accept doesn't request HTML
  // (e.g. an XHR or fetch for a JSON fixture), fall through to express.static.
  const accept = String(req.headers.accept || '');
  if (!accept.includes('text/html')) return next();
  return indexHtmlMiddleware()(req, res, next);
});

// CDN proxy helper — used by /flag-icons + /widget/streambuddies routes.
// Caches upstream responses in memory 24h. Mounted BEFORE express.static
// so route-specific match wins over static 404 fallback.
const _cdnProxyCache = new Map();
const CDN_PROXY_TTL_MS = 24 * 60 * 60 * 1000;
const CDN_PROXY_CACHE_MAX = parseInt(process.env.TF_CDN_CACHE_MAX, 10) || 2000;
// 1×1 transparent PNG. Returned (200) when an IMAGE proxy upstream fails so the
// <img> resolves to a valid-but-empty image instead of entering the browser's
// "broken" state — which made coin-jar.js drawImage() throw InvalidStateError
// every animation frame (red console spam + stalled canvas) whenever a gift or
// avatar's signed TikTok CDN URL had expired (403) or failed to fetch.
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);
// opts.fallbackImage: on upstream failure, send TRANSPARENT_PNG (200, uncached
// so a later request retries the real URL) instead of an error status.
async function cdnProxyFetch(_req, res, cacheKey, upstreamUrl, opts = {}) {
  const sendImageFallback = () => {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    return res.send(TRANSPARENT_PNG);
  };
  const cached = _cdnProxyCache.get(cacheKey);
  if (cached && (Date.now() - cached.fetchedAt) < CDN_PROXY_TTL_MS) {
    res.setHeader('Content-Type', cached.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(cached.body);
  }
  try {
    const r = await fetch(upstreamUrl, { headers: { 'User-Agent': 'TikMax-clone/1.0' } });
    if (!r.ok) return opts.fallbackImage ? sendImageFallback() : res.status(r.status).end();
    const contentType = r.headers.get('content-type') ||
      (cacheKey.endsWith('.css') ? 'text/css' :
       cacheKey.endsWith('.svg') ? 'image/svg+xml' :
       cacheKey.endsWith('.js') ? 'application/javascript' :
       cacheKey.endsWith('.json') ? 'application/json' :
       'application/octet-stream');
    const body = Buffer.from(await r.arrayBuffer());
    _cdnProxyCache.set(cacheKey, { body, contentType, fetchedAt: Date.now() });
    // FIFO eviction — Map preserves insertion order, so .keys().next().value
    // gives the oldest entry. Bounded at CDN_PROXY_CACHE_MAX to prevent
    // unbounded memory growth if many distinct URLs are requested over a
    // long-running backend session. 2000 × ~30KB avg WebP ≈ 60MB worst case.
    if (_cdnProxyCache.size > CDN_PROXY_CACHE_MAX) {
      const oldestKey = _cdnProxyCache.keys().next().value;
      if (oldestKey) _cdnProxyCache.delete(oldestKey);
    }
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(body);
  } catch (err) {
    logger.warn({ upstreamUrl, err: err.message }, '[cdn-proxy] fetch failed');
    return opts.fallbackImage ? sendImageFallback() : res.status(502).end();
  }
}

// /flag-icons/* → jsdelivr CDN. CSS + ~200 country SVG flags.
app.get(/^\/flag-icons\/(.+)$/, async (req, res) => {
  return cdnProxyFetch(req, res, 'flag-icons/' + req.params[0],
    'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7/' + req.params[0]);
});

// /widget/streambuddies/{assets,images,sounds}/* → gốc TikFinity. Vite hash
// assets + sprite/sound files don't exist locally → 404. Proxy fetches.
app.get(/^\/widget\/streambuddies\/(assets\/.+|images\/.+|sounds\/.+|buddiestester\.js)$/, async (req, res) => {
  return cdnProxyFetch(req, res, 'streambuddies/' + req.params[0],
    'https://tikfinity.zerody.one/widget/streambuddies/' + req.params[0]);
});

// /tiktok-img-cache/<host>/<path...> → https://<host>/<path...>
// Caches gift / animation thumbnails from TikTok CDN. Without this, the
// Sound Alerts trigger dropdown fetches ~50 cross-origin WebP images per
// open + decode, freezing the renderer ~8s on first click. With same-origin
// cached responses, subsequent opens reuse Electron's HTTP disk cache —
// instant. Host pattern restricted to *.tiktokcdn.com to block SSRF.
app.get(/^\/tiktok-img-cache\/([^/]+)\/(.+)$/, async (req, res) => {
  const host = req.params[0];
  // Express strips ?query into req.query before regex matches; reconstruct
  // it onto the upstream path so signed CDN URLs (?x-expires=, etc.) reach
  // upstream intact. Cache key also includes the query so distinct signed
  // variants don't collide.
  const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const upstreamPath = req.params[1] + qs;
  if (!/^[a-z0-9-]+\.tiktokcdn\.com$/i.test(host)) {
    return res.status(400).type('text/plain').send('host not allowed');
  }
  return cdnProxyFetch(req, res, 'tiktok-img/' + host + '/' + upstreamPath,
    'https://' + host + '/' + upstreamPath, { fallbackImage: true });
});

// /tf-cdn/<host>/<path...> → https://<host>/<path...> for TikFinity's OWN asset
// CDNs (credit-chip + icons on tikfinity-assets.b-cdn.net, webcam/overlay frames
// on assets.tikfinity.com). DISK-cached under downloads/tf-assets-cache/<host>/
// so the clone serves them LOCALLY forever after the first fetch — no runtime
// dependency on TikFinity's CDN (user: "tải về của mình, không xài gốc"). The
// Electron webRequest layer redirects these hosts here (electron/main.js).
// SSRF-locked to an explicit host allow-list + path-traversal guard.
const TF_CDN_HOSTS = new Set(['tikfinity-assets.b-cdn.net', 'assets.tikfinity.com']);
const TF_CDN_CACHE_DIR = path.join(config.FRONTEND_PATH, 'tf-assets-cache');
function tfCdnContentType(p) {
  if (/\.png$/i.test(p)) return 'image/png';
  if (/\.webp$/i.test(p)) return 'image/webp';
  if (/\.jpe?g$/i.test(p)) return 'image/jpeg';
  if (/\.gif$/i.test(p)) return 'image/gif';
  if (/\.svg$/i.test(p)) return 'image/svg+xml';
  if (/\.webm$/i.test(p)) return 'video/webm';
  if (/\.mp4$/i.test(p)) return 'video/mp4';
  if (/\.css$/i.test(p)) return 'text/css';
  if (/\.js$/i.test(p)) return 'application/javascript';
  if (/\.json$/i.test(p)) return 'application/json';
  if (/\.woff2$/i.test(p)) return 'font/woff2';
  if (/\.woff$/i.test(p)) return 'font/woff';
  return 'application/octet-stream';
}
app.get(/^\/tf-cdn\/([^/]+)\/(.+)$/, async (req, res) => {
  const fsp = require('fs').promises;
  const host = req.params[0];
  if (!TF_CDN_HOSTS.has(host.toLowerCase())) {
    return res.status(400).type('text/plain').send('host not allowed');
  }
  const rawPath = req.params[1];
  const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  // Path-traversal guard: the on-disk path MUST stay under the host's cache dir.
  const hostDir = path.join(TF_CDN_CACHE_DIR, host);
  const diskPath = path.join(hostDir, path.normalize(rawPath));
  if (diskPath !== hostDir && !diskPath.startsWith(hostDir + path.sep)) {
    return res.status(400).type('text/plain').send('bad path');
  }
  const ct = tfCdnContentType(rawPath);
  const isImg = /\.(png|webp|jpe?g|gif)$/i.test(rawPath);
  const sendImgFallback = () => {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    return res.send(TRANSPARENT_PNG);
  };
  // 1) Serve from local disk if already downloaded.
  try {
    const buf = await fsp.readFile(diskPath);
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=604800');
    return res.send(buf);
  } catch (_) { /* not on disk yet — fetch + persist below */ }
  // 2) Fetch from upstream once, persist to disk, serve.
  try {
    const r = await fetch('https://' + host + '/' + rawPath + qs, { headers: { 'User-Agent': 'TikMax-clone/1.0' } });
    if (!r.ok) return isImg ? sendImgFallback() : res.status(r.status).end();
    const body = Buffer.from(await r.arrayBuffer());
    fsp.mkdir(path.dirname(diskPath), { recursive: true })
      .then(() => fsp.writeFile(diskPath, body))
      .catch((err) => logger.warn({ err: err.message, diskPath }, '[tf-cdn] disk write failed'));
    res.setHeader('Content-Type', r.headers.get('content-type') || ct);
    res.setHeader('Cache-Control', 'public, max-age=604800');
    return res.send(body);
  } catch (err) {
    logger.warn({ host, err: err.message }, '[tf-cdn] fetch failed');
    return isImg ? sendImgFallback() : res.status(502).end();
  }
});

// Static bundle assets + the `downloads/api/*` JSON fixtures TikFinity ships.
// Mounted AFTER our real /api handlers so the fixtures only fire for endpoints
// we haven't ported yet (Phase 2 progressively shrinks that surface).
//
// IMPORTANT: TikFinity's `downloads/widget/` and `downloads/api/` ship files
// WITHOUT extensions (e.g. `downloads/widget/streambuddies`,
// `downloads/api/me`). Without an extension, express.static defaults to
// `application/octet-stream` → Electron treats the response as a download
// and pops a "Save As" dialog instead of rendering the widget HTML.
// `setHeaders` here detects extensionless files served from `/widget/` or
// `/api/` and pins the right Content-Type.
app.use(
  express.static(config.FRONTEND_PATH, {
    index: false,            // we serve index.html via indexHtmlMiddleware below
    fallthrough: true,
    // Auto-append `.html` so `/widget/activity-feed` resolves to
    // `downloads/widget/activity-feed.html` (TikFinity only ships a no-ext
    // version for SOME widgets — for the rest, only `<name>.html` exists).
    extensions: ['html'],
    setHeaders(res, filePath, _stat) {
      const ext = path.extname(filePath).toLowerCase();
      if (!ext) {
        // Heuristic for extensionless files (TikFinity ships many — widgets,
        // api fixtures, deep-link landing pages under /tiktok/). Default
        // Content-Type is octet-stream → Electron triggers download. Pin
        // based on parent dir.
        // `path.sep` is `\` on Windows, `/` on POSIX — normalize.
        const norm = filePath.replace(/\\/g, '/');
        if (norm.includes('/api/')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        } else {
          // Everything else extensionless under downloads/ is HTML — widgets,
          // /tiktok/<page>, /streamerbot-integration, /get-tiktok-username,
          // /chatbot-troubleshooting, etc.
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
        }
      } else if (ext === '.js' || ext === '.css' || ext === '.png' || ext === '.svg') {
        // Bundle assets are content-hashed-ish (well, names are stable enough)
        // — cache them aggressively in renderer.
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    },
  })
);

// Final /api catch-all — only reached when neither a real handler nor a
// fixture matched. Logging makes Phase 2 progress visible in the backend log.
app.use('/api', (req, res) => {
  logger.warn(`[404] Unhandled API: ${req.method} ${req.path}`);
  res.status(404).json({ status: 404, message: 'Not Found', path: req.path });
});

// SPA: serve index.html for `/` and any non-asset HTML route.
app.get('/', indexHtmlMiddleware());
app.use(spaFallback());

// Socket.IO — bound to SocketManager so callers everywhere can broadcast.
const io = new IoServer(server, {
  cors: { origin: true, credentials: true },
});
sockets.bind(io);
app.locals.io = io;

// --- Boot --------------------------------------------------------------------
(async () => {
  let bootChannel;
  try {
    bootChannel = await bootstrapDb();
    logger.info(`[BOOT] default channel ready: id=${bootChannel.ChannelId} name="${bootChannel.ChannelName}" profile=${bootChannel.ProfileId}`);
  } catch (err) {
    logger.fatal({ err }, '[BOOT] DB bootstrap failed');
    process.exit(1);
  }

  // Warm the widget settings cache so the first /api/me + every widget that
  // connects after boot sees the merged bag immediately.
  try {
    widgetSettings.rebuild(bootChannel.ChannelId);
    logger.info(`[BOOT] widget settings cache warmed for channel ${bootChannel.ChannelId}`);
  } catch (err) {
    logger.warn({ err }, '[BOOT] widget settings warm failed (continuing)');
  }

  // Pre-build the assembled index.html so the FIRST request from Electron
  // hits a hot cache — no cold rebuild during the renderer's initial
  // bootstrap chain. Without this, the first navigation waits a few hundred
  // ms while templates load + interpolate, during which the bundle's auto-
  // reload chain races against partially-applied CSS → first frame looks
  // "broken" until the user Ctrl+R'd.
  try {
    const { buildIndexHtml } = require('./middleware/index-html');
    buildIndexHtml({ channelId: bootChannel.ChannelId, channelName: bootChannel.ChannelName });
    logger.info(`[BOOT] index.html pre-warmed for channel "${bootChannel.ChannelName}"`);
  } catch (err) {
    logger.warn({ err }, '[BOOT] index.html pre-warm failed (continuing)');
  }

  server.listen(config.PORT, config.HOST, () => {
    logger.info(`[BOOT] TikFinity Node backend listening on http://${config.HOST}:${config.PORT}`);
    logger.info(`[BOOT] Frontend path: ${config.FRONTEND_PATH}`);
    logger.info(`[BOOT] Data dir: ${config.DATA_DIR}`);
    logger.info(`[BOOT] DB path: ${config.DB_PATH}`);
  });

  // Background sync of bundle fixtures from gốc TikFinity. Fire-and-forget:
  // backend serves stale data for the first few seconds while fetch runs,
  // then `/api/getAllGifts` returns fresh data on subsequent requests.
  // See [services/bundle-fixtures-sync.js] for which endpoints are synced.
  const bundleFixturesSync = require('./services/bundle-fixtures-sync');
  bundleFixturesSync.syncAll(config.FRONTEND_PATH).catch((err) => {
    logger.error({ err }, '[BOOT] bundle-fixtures-sync uncaught');
  });

  // Background pre-warm of the /tiktok-img-cache/* in-memory cache. Without
  // this, the Sound Alerts trigger dropdown's first open after boot still
  // pays ~50 cross-origin TikTok CDN fetches + WebP decodes (~1-2s freeze).
  // We fetch the top ~200 popular gift images (sorted by diamond_count ASC)
  // and populate _cdnProxyCache so the proxy serves from memory on first
  // dropdown open. See [services/tiktok-image-prewarm.js].
  const { prewarmTikTokImages } = require('./services/tiktok-image-prewarm');
  prewarmTikTokImages(config.FRONTEND_PATH, _cdnProxyCache, logger).catch((err) => {
    logger.error({ err }, '[BOOT] tiktok-image-prewarm uncaught');
  });
})();

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, '[CRASH] uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, '[CRASH] unhandledRejection');
});
process.on('SIGINT', () => {
  logger.info('[LIFECYCLE] SIGINT — shutting down');
  server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
  logger.info('[LIFECYCLE] SIGTERM — shutting down');
  server.close(() => process.exit(0));
});

module.exports = { app, server, io };
