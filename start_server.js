const express = require('express');
const http = require('http');
const https = require('https');
const compression = require('compression');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

console.warn('[LEGACY] start_server.js is now a legacy runtime.');
console.warn('[LEGACY] Use start_project.bat or backend/Program.cs for the canonical .NET web runtime.');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    pingTimeout: 120000,
    pingInterval: 30000,
    connectTimeout: 120000,
    transports: ['websocket', 'polling']
});
const PORT = 3005;
const downloadsDir = path.join(__dirname, 'downloads');
const REAL_ORIGIN = 'https://tikfinity.zerody.one';

// =============================================
// PRE-CACHE: Load everything into memory at startup
// =============================================
const memoryCache = new Map(); // path -> Buffer
const apiCache = new Map();    // apiName -> parsed JSON

function preloadFiles(dir, prefix = '') {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        const key = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
            preloadFiles(fullPath, key);
        } else {
            try {
                memoryCache.set('/' + key, fs.readFileSync(fullPath));
            } catch (e) { }
        }
    }
}

function preloadApis() {
    const apiDir = path.join(downloadsDir, 'api');
    if (!fs.existsSync(apiDir)) return;
    function walk(dir, prefix = '') {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = path.join(dir, entry.name);
            const key = prefix ? `${prefix}/${entry.name}` : entry.name;
            if (entry.isDirectory()) {
                walk(fullPath, key);
            } else {
                try {
                    const raw = fs.readFileSync(fullPath, 'utf8').trim();
                    if (raw) apiCache.set(key, JSON.parse(raw));
                } catch (e) { }
            }
        }
    }
    walk(apiDir);
}

console.log('[BOOT] Pre-loading all files into memory...');
const bootStart = Date.now();
preloadFiles(downloadsDir);
preloadApis();
console.log(`[BOOT] Loaded ${memoryCache.size} files + ${apiCache.size} API responses in ${Date.now() - bootStart}ms`);

// Pre-render index.html with injected scripts (once, not per-request)
const AUTH_INJECT_SCRIPT = `<script>
(function(){
  try {
    if(!localStorage.getItem("setting_channelid")){
      localStorage.setItem("setting_channelid","2228412");
      localStorage.setItem("setting_channelname","lamnguyen");
      localStorage.setItem("setting_channelsignature","ysFWNV5tcT");
      localStorage.setItem("setting_ispro","true");
      localStorage.setItem("setting_locale","VN");
    }
  }catch(e){}
})();
</script>`;

// Block Sentry + analytics at HTML level
const BLOCK_SCRIPT = `<script>
(function(){
  // Kill Sentry before it loads
  window.__SENTRY__={hub:{getClient:function(){return null}}};
  window.Sentry={init:function(){},captureException:function(){},captureMessage:function(){},configureScope:function(){}};
  // Block external tracking
  var _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(m, u) {
    if (typeof u === 'string' && (u.includes('sentry') || u.includes('contentsquare') || u.includes('pagead') || u.includes('google-analytics') || u.includes('googletagmanager'))) {
      this._blocked = true;
      return;
    }
    return _open.apply(this, arguments);
  };
  var _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    if (this._blocked) return;
    return _send.apply(this, arguments);
  };
  // Block fetch to external trackers
  var _fetch = window.fetch;
  window.fetch = function(url, opts) {
    if (typeof url === 'string' && (url.includes('sentry') || url.includes('contentsquare'))) {
      return Promise.resolve(new Response('', {status: 200}));
    }
    return _fetch.apply(this, arguments);
  };
})();
</script>`;

const rawHtml = memoryCache.get('/index.html')?.toString('utf8') || '';
const indexHtml = rawHtml.replace(/<head>/i, '<head>' + BLOCK_SCRIPT + AUTH_INJECT_SCRIPT);
const indexHtmlBuffer = Buffer.from(indexHtml, 'utf8');

// Helper: read cached API
function readCachedApi(name) {
    return apiCache.get(name) || null;
}

// MIME type map
const MIME_MAP = {
    '.js': 'application/javascript', '.mjs': 'application/javascript',
    '.css': 'text/css', '.html': 'text/html', '.htm': 'text/html',
    '.json': 'application/json', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
    '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.wav': 'audio/wav',
    '.webm': 'video/webm', '.ogg': 'audio/ogg',
};
function getMime(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_MAP[ext] || 'application/octet-stream';
}

// Auth headers for proxying
const AUTH_HEADERS = {
    'X-Channel-ID': '2228412',
    'X-Channel-Signature': 'ysFWNV5tcT',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Referer': REAL_ORIGIN + '/',
};

function proxyApiToReal(apiPath, req, res, fallback) {
    const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const url = `${REAL_ORIGIN}/api${apiPath}${qs}`;
    console.log(`[API-PROXY] ${url}`);
    const timeout = setTimeout(() => {
        console.log(`[API-PROXY] Timeout, using fallback`);
        res.json(fallback);
    }, 5000);
    https.get(url, { headers: AUTH_HEADERS }, (proxyRes) => {
        const chunks = [];
        proxyRes.on('data', c => chunks.push(c));
        proxyRes.on('end', () => {
            clearTimeout(timeout);
            try {
                const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                if (data && (data.status === 403 || data.status === 404)) return res.json(fallback);
                // Cache in memory + disk
                const key = apiPath.replace(/^\//, '');
                apiCache.set(key, data);
                const cachePath = path.join(downloadsDir, 'api', key);
                fs.mkdirSync(path.dirname(cachePath), { recursive: true });
                fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
                res.json(data);
            } catch (e) {
                res.json(fallback);
            }
        });
    }).on('error', () => { clearTimeout(timeout); res.json(fallback); });
}

// =============================================
// SOCKET.IO
// =============================================
io.on('connection', (socket) => {
    const { appType, instanceId } = socket.handshake.query;
    console.log(`[WS] Connected: ${appType} (${instanceId?.slice(0, 8)})`);

    const channelData = {
        status: 'ok', channelId: 2228412, channelName: 'lamnguyen',
        isPro: true, authenticated: true,
        channel: { channelId: 2228412, channelName: 'lamnguyen' }
    };

    // Wait for client's "login" event, then send loginResult to unlock boot
    socket.on('login', (data, cb) => {
        console.log(`[WS] Login from: ${data?.appType} channelId=${data?.channelId}`);
        // Send loginResult - THIS is what makes wsAuthSuccess=true and resolves boot promise
        socket.emit('loginResult', channelData);
        if (typeof cb === 'function') cb({ status: 'ok' });
    });

    socket.emit('connected', channelData);
    socket.emit('ready', { status: 'ok', channelId: 2228412 });
    socket.emit('init', { status: 'ok', channelId: 2228412, isPro: true });
    socket.emit('welcome', channelData);
    socket.emit('channelStatus', { connected: false, channelId: 2228412, channelName: 'lamnguyen', status: 'disconnected' });
    socket.emit('status', { connected: false, tiktok: false });
    socket.emit('stats', { viewers: 0, likes: 0, gifts: 0, diamonds: 0, followers: 0 });
    socket.emit('globalStats', { viewers: 0, channels: 0 });
    socket.emit('config', { debug: false, channelId: 2228412 });

    socket.onAny((event, ...args) => {
        const cb = args[args.length - 1];
        if (typeof cb === 'function') cb({ status: 'ok' });
    });

    socket.on('disconnect', () => { });
});

// =============================================
// MIDDLEWARE
// =============================================
app.use(compression({ level: 6, threshold: 1024 }));
app.use(cors());
app.use(express.json());

// Block noise - fast reject before any processing
app.use((req, res, next) => {
    const p = req.path;
    if (p.startsWith('/2l68') || p.startsWith('/g/') || p === '/g' ||
        p.startsWith('/pagead') || p.startsWith('/cdn-cgi') ||
        p.startsWith('/sentry') || p.startsWith('/rum') ||
        p.startsWith('/logError-mock') || p.startsWith('/mock-route')) {
        return res.status(204).send('');
    }
    if (req.hostname && (req.hostname.includes('sentry') || req.hostname.includes('contentsquare'))) {
        return res.status(204).send('');
    }
    next();
});

// =============================================
// WIDGET PATH REWRITE - serve from memory
// =============================================
const widgetRewriteMap = {
    'sharedio/sharedio.js': '/widget/sharedio/sharedio.js',
    'sharedio/sharedioworker.js': '/widget/sharedio/sharedioworker.js',
    'socketioclient.js': '/widget/socketioclient.js',
    'mediawrapper.js': '/widget/mediawrapper.js',
};

app.use('/widget', (req, res, next) => {
    const cleanPath = req.path.replace(/^\//, '').replace(/\?.*$/, '');

    // Try direct match first: /widget/cleanPath
    const directKey = '/widget/' + cleanPath;
    if (memoryCache.has(directKey)) {
        return res.type(getMime(cleanPath)).send(memoryCache.get(directKey));
    }

    // Rewrite: /widget/myactions/sharedio/sharedio.js -> /widget/sharedio/sharedio.js
    const parts = cleanPath.split('/');
    if (parts.length >= 2) {
        const relativePart = parts.slice(1).join('/');
        if (widgetRewriteMap[relativePart]) {
            const buf = memoryCache.get(widgetRewriteMap[relativePart]);
            if (buf) return res.type(getMime(relativePart)).send(buf);
        }
        // Also try /widget/relativePart (shared assets across widgets)
        const sharedKey = '/widget/' + relativePart;
        if (memoryCache.has(sharedKey)) {
            return res.type(getMime(relativePart)).send(memoryCache.get(sharedKey));
        }
    }

    // Try /js/ subfolder
    if (req.path.startsWith('/js/')) {
        const jsKey = req.path.replace(/\?.*$/, '');
        if (memoryCache.has(jsKey)) {
            return res.type('application/javascript').send(memoryCache.get(jsKey));
        }
    }

    next();
});

// =============================================
// API ENDPOINTS
// =============================================
app.use('/api/logError', (req, res) => res.json({ status: 200 }));

app.use('/api/init', (req, res) => {
    res.json(readCachedApi('init') || { status: 200, message: 'OK', countryCode: 'VN' });
});

app.use('/api/me', (req, res) => {
    const cached = readCachedApi('me');
    if (cached) return res.json(cached);
    res.json({
        status: 200, message: 'OK',
        channel: {
            channelId: 2228412, channelName: 'lamnguyen',
            channelSignature: 'ysFWNV5tcT', profileId: 1, locale: 'VN',
            isChatbotApproved: false, challengeRunning: false,
            dynamicSettings: {},
            profiles: [{ id: 1, name: 'Default', sort: 0 }]
        },
        subscription: { isPro: true, plan: 'pro', active: true },
        isPro: true
    });
});

app.use('/api/config', (req, res, next) => {
    const cached = readCachedApi('getAppConfig');
    if (cached) {
        cached.modules = cached.modules || [];
        cached.sounds = cached.sounds || [];
        cached.actions = cached.actions || [];
        cached.voices = cached.voices || [];
        return res.json(cached);
    }
    next();
});

app.use('/api/getAppConfig', (req, res) => {
    const cached = readCachedApi('getAppConfig');
    if (cached) {
        cached.modules = cached.modules || [];
        cached.sounds = cached.sounds || [];
        cached.actions = cached.actions || [];
        cached.voices = cached.voices || [];
        return res.json(cached);
    }
    const ds = readCachedApi('me')?.channel?.dynamicSettings || {};
    res.json({
        status: 200, message: 'OK', isPro: true,
        subscription: { isPro: true },
        config: { modules: [
            { id: 'actions', sort: 1 }, { id: 'events', sort: 2 },
            { id: 'sounds', sort: 3 }, { id: 'tts', sort: 4 },
            { id: 'media', sort: 5 }, { id: 'timers', sort: 6 },
            { id: 'commands', sort: 7 }, { id: 'spotify', sort: 8 },
            { id: 'webhooks', sort: 9 }, { id: 'overlays', sort: 10 }
        ], features: ['all'], settings: ds },
        modules: [
            { id: 'actions', name: 'Actions & Events', sort: 1, enabled: true },
            { id: 'events', name: 'Events', sort: 2, enabled: true },
            { id: 'sounds', name: 'Sound Alerts', sort: 3, enabled: true },
            { id: 'tts', name: 'Text to Speech', sort: 4, enabled: true },
            { id: 'media', name: 'Media Share', sort: 5, enabled: true },
            { id: 'timers', name: 'Timers', sort: 6, enabled: true },
            { id: 'commands', name: 'Chat Commands', sort: 7, enabled: true },
            { id: 'spotify', name: 'Spotify Integration', sort: 8, enabled: true },
            { id: 'webhooks', name: 'Webhooks', sort: 9, enabled: true },
            { id: 'overlays', name: 'Overlays', sort: 10, enabled: true }
        ],
        sounds: [], actions: [], voices: [], events: [], gifts: [],
        overlays: [], widgets: [], commands: [], goals: [], triggers: [],
        settings: ds, channelId: 2228412, version: '1.0.4'
    });
});

app.use('/api/getSystemConfig', (req, res) => {
    const cached = readCachedApi('getSystemConfig');
    if (cached) return res.json(cached);
    res.json({
        status: 200, message: 'OK',
        config: { modules: [
            { id: 'actions', sort: 1, enabled: true }, { id: 'events', sort: 2, enabled: true },
            { id: 'sounds', sort: 3, enabled: true }, { id: 'tts', sort: 4, enabled: true }
        ], features: ['all'], settings: {} },
        modules: [
            { id: 'actions', sort: 1, enabled: true }, { id: 'events', sort: 2, enabled: true },
            { id: 'sounds', sort: 3, enabled: true }, { id: 'tts', sort: 4, enabled: true }
        ],
        isPro: true, features: ['all'], ttsVoices: [],
        languages: ['en', 'de', 'es', 'fr', 'pt', 'vi'],
        supportedLanguages: ['en', 'de', 'es', 'fr', 'pt', 'vi'],
        defaultLanguage: 'en', maxSoundSize: 10485760, maxImageSize: 5242880
    });
});

app.use('/api/getTranslations', (req, res) => {
    res.json(readCachedApi('getTranslations') || { status: 200, message: 'OK' });
});

app.use('/api/getOverlayConfig', (req, res) => {
    res.json(readCachedApi('getOverlayConfig') || { status: 200, message: 'OK', overlays: [], widgets: [] });
});

app.use('/api/updateSettings', (req, res) => res.json({ status: 200, message: 'OK' }));

// Array APIs
['getAllGifts', 'getAllGiftsCached', 'modules', 'sounds', 'getGlobalTransactions', 'getMyInstants'].forEach(ep => {
    app.use('/api/' + ep, (req, res) => {
        const cached = readCachedApi(ep);
        if (cached) return res.json(cached);
        if (ep === 'getGlobalTransactions') {
            return proxyApiToReal('/' + ep, req, res, { status: 200, message: 'OK', globalTransactions: [] });
        }
        proxyApiToReal('/' + ep, req, res, []);
    });
});

// OData
app.use('/api/odata/channeluser', (req, res) => res.json(readCachedApi('odata/channeluser') || { value: [], '@odata.count': 0 }));
app.use('/api/odata/transaction', (req, res) => res.json(readCachedApi('odata/transaction') || { value: [], '@odata.count': 0 }));
app.use('/api/odata', (req, res) => res.json({ value: [], '@odata.count': 0 }));

app.use('/api/usage', (req, res) => res.json({ status: 200 }));

// Notifications
app.use('/api/notifications/list', (req, res) => res.json(readCachedApi('notifications/list') || { status: 200, notifications: [], items: [], total: 0 }));
app.use('/api/notifications/preferences', (req, res) => res.json(readCachedApi('notifications/preferences') || { status: 200, inApp: true }));
app.use('/api/notifications', (req, res) => res.json({ status: 200 }));

// REST
app.use('/api/rest/action', (req, res) => res.json(readCachedApi('rest/action') || { status: 200, arrayKey: 'actions', actions: [], pageSize: 0, page: 0, hasNext: false }));
app.use('/api/rest/channeluser', (req, res) => res.json(readCachedApi('rest/channeluser') || { status: 200, arrayKey: 'channelusers', channelusers: [] }));
app.use('/api/rest', (req, res) => res.json({ status: 200 }));

// Pro
app.use('/api/pro/tazapay/methods', (req, res) => res.json(readCachedApi('pro/tazapay/methods') || { status: 200, cached: true, country: 'VN', methods: [] }));
app.use('/api/pro/setUpgradeIntent', (req, res) => res.json({ status: 200 }));
app.use('/api/pro', (req, res) => res.json({ status: 200 }));

// Channel
app.use('/api/getChannelUserCount', (req, res) => res.json(readCachedApi('getChannelUserCount') || { status: 200, count: 0, userCount: 0 }));
app.use('/api/getChannelEmotes', (req, res) => res.json(readCachedApi('getChannelEmotes') || { status: 200, emotes: [] }));
app.use('/api/getLiveChannels', (req, res) => {
    const cached = readCachedApi('getLiveChannels');
    if (cached) return res.json(cached);
    proxyApiToReal('/getLiveChannels', req, res, { status: 200, liveChannelCount: 0, liveChannels: [] });
});

// API fallback
app.use('/api', (req, res) => {
    const apiPath = (req.originalUrl || req.url).replace(/^\/api\/?/, '').replace(/\?.*$/, '');
    if (apiPath) {
        const cached = readCachedApi(apiPath);
        if (cached) return res.json(cached);
    }
    console.log(`[API-MISS] ${req.method} ${req.originalUrl}`);
    if (req.method === 'GET' && apiPath) {
        return proxyApiToReal('/' + apiPath, req, res, { status: 200, total: 0, count: 0 });
    }
    res.json({ status: 200 });
});

// =============================================
// STATIC FILES - serve from memory first
// =============================================
app.get('/', (req, res) => {
    res.type('html').send(indexHtmlBuffer);
});

// Serve from memory cache (instant, no disk I/O)
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    const key = req.path.replace(/\?.*$/, '');
    const buf = memoryCache.get(key);
    if (buf) {
        const mime = getMime(key);
        // Long cache for JS/CSS (fingerprinted), short for others
        const maxAge = /\.(js|css)$/.test(key) ? 86400 : 3600;
        res.set({
            'Content-Type': mime,
            'Cache-Control': `public, max-age=${maxAge}`,
            'X-Served-From': 'memory'
        });
        return res.send(buf);
    }
    next();
});

// Proxy missing static files to real server (fallback)
const STATIC_EXTS = /\.(js|css|woff2?|ttf|svg|png|jpg|jpeg|gif|webp|ico|mp3|mp4|json)$/i;
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();

    if (STATIC_EXTS.test(req.path)) {
        const proxyUrl = `${REAL_ORIGIN}${req.url}`;
        console.log(`[PROXY] ${req.path}`);
        const timeout = setTimeout(() => res.status(504).send('Proxy timeout'), 8000);
        const proxyReq = https.request(proxyUrl, {
            headers: { host: 'tikfinity.zerody.one', 'user-agent': 'Mozilla/5.0' }
        }, (proxyRes) => {
            clearTimeout(timeout);
            if (proxyRes.statusCode === 200) {
                const chunks = [];
                proxyRes.on('data', c => chunks.push(c));
                proxyRes.on('end', () => {
                    const buf = Buffer.concat(chunks);
                    // Cache in memory for next request
                    memoryCache.set(req.path, buf);
                    // Save to disk
                    try {
                        const savePath = path.join(downloadsDir, req.path);
                        fs.mkdirSync(path.dirname(savePath), { recursive: true });
                        fs.writeFileSync(savePath, buf);
                    } catch (e) { }
                    res.set('Content-Type', proxyRes.headers['content-type'] || 'application/octet-stream');
                    res.send(buf);
                });
            } else {
                res.status(proxyRes.statusCode || 404).send('');
            }
        });
        proxyReq.on('error', () => { clearTimeout(timeout); res.status(502).send(''); });
        proxyReq.end();
        return;
    }

    // SPA fallback
    if (req.accepts('html')) {
        return res.type('html').send(indexHtmlBuffer);
    }
    next();
});

// =============================================
// START
// =============================================
server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==============================================`);
    console.log(` TikFinity Standalone Server`);
    console.log(`==============================================`);
    console.log(`  Local:    http://localhost:${PORT}`);
    console.log(`  Network:  http://0.0.0.0:${PORT}`);
    console.log(`  Memory:   ${memoryCache.size} files cached`);
    console.log(`  APIs:     ${apiCache.size} responses cached`);
    console.log(`==============================================\n`);
});
