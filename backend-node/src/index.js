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

// Real /api/* handlers. Order matters: mount BEFORE express.static so the
// pre-recorded `downloads/api/*` JSON fixtures only fire as fallback for
// endpoints we haven't ported yet.
app.use('/api', meRouter);       // /me, /loginChannel, /switchProfile, /setAffiliate
app.use('/api', settingsRouter); // /updateSettings, /getOverlayConfig, /modules
app.use('/api', configRouter);   // /getAppConfig, /config, /getSystemConfig, /getTranslations, /init, /v2/sync
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
        // Heuristic: anything under widget/ is HTML; anything under api/ is JSON.
        // `path.sep` is `\` on Windows, `/` on POSIX — normalize.
        const norm = filePath.replace(/\\/g, '/');
        if (norm.includes('/widget/')) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
        } else if (norm.includes('/api/')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
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

  server.listen(config.PORT, config.HOST, () => {
    logger.info(`[BOOT] TikFinity Node backend listening on http://${config.HOST}:${config.PORT}`);
    logger.info(`[BOOT] Frontend path: ${config.FRONTEND_PATH}`);
    logger.info(`[BOOT] Data dir: ${config.DATA_DIR}`);
    logger.info(`[BOOT] DB path: ${config.DB_PATH}`);
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
