// TikFinity Desktop — Electron main process.
//
// Architecture:
//   1. Spawn the local Node backend (backend-node) on port 5285.
//   2. Show splash window while backend warms up (~2-5s on first run).
//   3. Configure session header rewriting + UA spoofing so embedded TikTok /
//      Spotify / Younow / Easemob / Agora flows pass anti-bot heuristics.
//   4. Launch a Desktop API WebSocket server on 127.0.0.1:21213 so external
//      plugins (Streamerbot, etc.) can subscribe to TikTok events.
//   5. Open the main window pointing at http://localhost:5285.
//   6. Poll backend status every 15s; when live, hold powerSaveBlocker so the
//      OS doesn't sleep. Notify renderer via newRoomIdDetected / isLiveDetected.
//   7. Mirror window-open behaviour from the original TikFinity Electron app
//      so #tfbridge / #ttlogin / #electron popups stay in-app instead of
//      bouncing to the user's default browser.
//
// Future: TikfinityServer (cloud auth + license + studio assets) at
//   process.env.TIKFINITY_AUTH_HOST will own login. This file already exposes
//   AUTH_HOST so the renderer can target it for /api/auth/login flows.

const {
    app, BrowserWindow, Tray, Menu, nativeImage, dialog, ipcMain, session,
    shell, protocol, powerSaveBlocker
} = require('electron');
const { spawn, spawnSync, exec } = require('child_process');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const authStore = require('./auth-store');
const tiktokSessionStore = require('./state-persistence');
const tiktokSignin = require('./auth-flow');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BACKEND_PORT = Number(process.env.TIKMAX_BACKEND_PORT) || 5285;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
const BACKEND_HEALTH = `${BACKEND_URL}/api/health`;
const BACKEND_STATUS = `${BACKEND_URL}/api/tiktok/status`;

// Cloud TikfinityServer (auth + license + studio assets). Renderer will hit
// this for login once integration lands; main only needs it to recognize
// in-app navigation targets.
const AUTH_HOST = process.env.TIKFINITY_AUTH_HOST || 'http://127.0.0.1:5194';

const DAPI_PORT = Number(process.env.TIKMAX_DAPI_PORT) || 21213;

// User-Agent for popup windows (TikTok login, etc.). Matches Zerody so that
// any TikTok endpoint allow-listing this app keeps working.
const TIKFINITY_UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) TikTokLIVEStudio/0.32.2-beta Chrome/104.0.5112.102 ' +
    'Electron/20.1.0-tt.6.release.mssdk.8 TTElectron/20.1.0-tt.6.release.mssdk.8 Safari/537.36';

const isWin = process.platform === 'win32';
const LIVE_POLL_INTERVAL_MS = 15000;
const BACKEND_HEALTH_TIMEOUT_S = 30;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let mainWindow = null;
let splashWindow = null;
let loginWindow = null;
let tray = null;
let backendProcess = null;
let backendLogStream = null;
let isQuitting = false;
let powerSaveBlockerId = null;
let liveStatusTimer = null;
let authReCheckTimer = null;
let currentUniqueId = null;
let currentRoomId = null;
let currentChannelId = null;
let dapi = null;
let originalUA = null;
let currentAuth = null;  // { type, token, keyId, username, expiresAt, lastValidatedAt }
let cachedBundleJwt = null;  // wsAuthToken fetched from /api/me for the bundle
let rendererAuthSeedPromise = null;
const AUTH_RECHECK_INTERVAL_MS = 60 * 60 * 1000; // 1h

// ---------------------------------------------------------------------------
// Crash diagnostics — log every reason main process or renderer might die.
// Without these, electron silently exits and we have no clue why.
// ---------------------------------------------------------------------------

process.on('uncaughtException', (err) => {
    console.error('[CRASH] uncaughtException:', err && err.stack || err);
});
process.on('unhandledRejection', (reason) => {
    console.error('[CRASH] unhandledRejection:', reason && reason.stack || reason);
});
app.on('render-process-gone', (_e, wc, details) => {
    console.error('[CRASH] render-process-gone:', JSON.stringify(details));
});
app.on('child-process-gone', (_e, details) => {
    console.error('[CRASH] child-process-gone:', JSON.stringify(details));
});
app.on('before-quit', () => { console.log('[LIFECYCLE] before-quit'); });
app.on('will-quit', () => { console.log('[LIFECYCLE] will-quit'); });
app.on('quit', (_e, code) => { console.log('[LIFECYCLE] quit code=' + code); });

// ---------------------------------------------------------------------------
// Single instance
// ---------------------------------------------------------------------------

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        } else {
            createMainWindow();
        }
    });
    bootstrap();
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

function bootstrap() {
    originalUA = app.userAgentFallback;
    app.userAgentFallback = TIKFINITY_UA;

    app.whenReady().then(async () => {
        console.log('[Electron] App ready');

        // Free up our well-known ports BEFORE anything else binds — a previous
        // crashed run can leave the backend node process zombied and still
        // holding TCP listeners. With the Node port the TikTok bridge runs
        // in-process so 5288 is only kept in the cleanup list for backwards
        // compatibility (old installs still have that port leased).
        // Runs synchronously so the rest of bootstrap sees clean ports.
        freeOurPorts();

        authStore.init(app.getPath('userData'));
        currentAuth = authStore.load();

        // TikTok session cookie store. hydrateEnv() pushes the saved cookie
        // into process.env.TIKTOK_SESSIONID so the Node backend (child of this
        // process, runs tiktok-live-connector in-process) inherits it.
        // Without this the bridge has to fall back to Eulerstream signing and
        // gets rate-limited / IP-flagged.
        tiktokSessionStore.init(app.getPath('userData'));
        await tiktokSignin.hydrateEnv();

        createSplash();
        configureSession();
        registerBytedanceProtocol();

        // DAPI WS server can start immediately — independent of backend.
        try {
            dapi = require('./wsserver');
            dapi.start({
                port: DAPI_PORT,
                onConnection: () => {
                    if (mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.webContents.send('dapiClientConnected', {
                            count: dapi.getClientCount()
                        });
                    }
                }
            });
        } catch (err) {
            console.error('[DAPI] failed to load:', err.message);
        }

        startBackend();

        // ── Bridge → DAPI relay ──────────────────────────────────────────
        // Some overlays (activity-feed, custom Streamerbot plugins, raw
        // websocket consumers in `downloads/widget/vite/`) connect to the
        // Desktop API at ws://localhost:21213 and expect TikTok events as
        // `{event, data}` JSON frames. The C# backend used to inject
        // events into that pipeline directly; the Node bridge only emits
        // via Socket.IO, so without this relay activity-feed connects but
        // never receives a single event.
        //
        // Subscribing here (Electron main) means we stay on a single
        // canonical event stream (Node bridge as source-of-truth) and
        // wsserver.js doesn't need to grow message-handling logic.
        startBridgeToDapiRelay();
        createTray();

        try {
            await waitForBackend(BACKEND_HEALTH_TIMEOUT_S * 4, 250);
            sendSplashStatus('Đang kiểm tra phiên đăng nhập...');
        } catch (err) {
            closeSplash();
            console.error('[Electron] Backend startup failed:', err.message);
            dialog.showErrorBox(
                'Startup Error',
                'Không thể khởi động TikFinity backend.\n\n' +
                `Hãy chắc chắn port ${BACKEND_PORT} đang rảnh và Node.js có sẵn (nếu chạy từ source).\n\n` +
                err.message
            );
            app.quit();
            return;
        }

        // Auth gate: re-validate cached token if any; otherwise show login.
        const decision = await decideAuthEntrypoint();
        console.log('[Auth] gate decision:', decision);
        if (decision.allow) {
            sendSplashStatus(decision.offline
                ? 'Đang vào ứng dụng (chế độ offline)...'
                : 'Đăng nhập đã xác thực — đang vào ứng dụng...');
            createMainWindow();
            startLivePolling();
            startAuthReCheck();
            setTimeout(setHighPriority, 5000);
        } else {
            sendSplashStatus('Cần đăng nhập để tiếp tục...');
            console.log('[Auth] showing login window, reason:', decision.reason);
            createLoginWindow(decision.reason);
        }
    });

    app.on('before-quit', () => {
        isQuitting = true;
        if (liveStatusTimer) { clearInterval(liveStatusTimer); liveStatusTimer = null; }
        if (authReCheckTimer) { clearInterval(authReCheckTimer); authReCheckTimer = null; }
        if (powerSaveBlockerId !== null) {
            try { powerSaveBlocker.stop(powerSaveBlockerId); } catch { /* already stopped */ }
            powerSaveBlockerId = null;
        }
        if (dapi) { try { dapi.stop(); } catch { /* not running */ } }
        stopBackend();
    });

    app.on('window-all-closed', () => {
        // Keep running in tray (matches TikFinity's behaviour). User must use
        // Tray → Thoát or app.quit() to fully exit.
    });

    app.on('activate', () => {
        if (mainWindow) mainWindow.show();
        else createMainWindow();
    });
}

// ---------------------------------------------------------------------------
// Port cleanup
// ---------------------------------------------------------------------------

/**
 * Kill any process listening on one of our well-known ports. Runs synchronously
 * during bootstrap so the rest of startup sees clean sockets.
 *
 * We target ports by PID (extracted from `netstat -ano`), not by process name,
 * so unrelated `node.exe` instances (VS Code, dev tools, other
 * apps) stay untouched. The taskkill itself is best-effort — if the PID is
 * already gone or owned by another user, we silently move on.
 */
function freeOurPorts() {
    if (!isWin) return; // POSIX uses lsof/kill — not needed in dev on macOS/Linux
    const ports = [BACKEND_PORT, 5288 /* bridge */, DAPI_PORT];
    const seenPids = new Set();
    try {
        const out = spawnSync('cmd.exe', ['/c', 'netstat -ano | findstr LISTENING'], {
            encoding: 'utf-8',
            timeout: 3000
        });
        const lines = (out.stdout || '').split(/\r?\n/);
        for (const line of lines) {
            // Format: "  TCP    0.0.0.0:5285    0.0.0.0:0    LISTENING    12345"
            const m = line.match(/:(\d+)\s+\S+\s+LISTENING\s+(\d+)/);
            if (!m) continue;
            const port = Number(m[1]);
            const pid = Number(m[2]);
            if (!ports.includes(port) || pid === process.pid || pid <= 0) continue;
            if (seenPids.has(pid)) continue;
            seenPids.add(pid);
            try {
                spawnSync('taskkill.exe', ['/F', '/PID', String(pid)], { timeout: 3000 });
                console.log(`[port-cleanup] killed PID ${pid} holding port ${port}`);
            } catch (err) {
                console.warn(`[port-cleanup] failed to kill PID ${pid}:`, err.message);
            }
        }
    } catch (err) {
        console.warn('[port-cleanup] enumerate failed:', err.message);
    }
}

// ---------------------------------------------------------------------------
// Backend process
// ---------------------------------------------------------------------------

function getBackendLaunchConfig() {
    // Node port lives under `backend-node/` (sibling of `backend/`). Entry
    // point: `src/index.js`. In packaged builds the whole tree is shipped
    // under `resources/backend-node/` and we re-execute Electron itself in
    // Node mode (ELECTRON_RUN_AS_NODE=1) so we don't have to bundle a second
    // node.exe alongside the app.
    const projDir = app.isPackaged
        ? path.join(process.resourcesPath, 'backend-node')
        : path.join(__dirname, '..', 'backend-node');
    const entry = path.join(projDir, 'src', 'index.js');

    if (app.isPackaged) {
        return {
            command: process.execPath,
            args: [entry],
            cwd: projDir,
            label: `electron --node ${entry}`,
            extraEnv: { ELECTRON_RUN_AS_NODE: '1' },
        };
    }
    // Dev: use the user's node (faster startup than spinning up Electron). If
    // the user lacks a global node we'd still fall back to Electron-as-node,
    // but every dev box that has Electron also has Node.
    return {
        command: isWin ? 'node.exe' : 'node',
        args: [entry],
        cwd: projDir,
        label: `node ${entry}`,
        extraEnv: {},
    };
}

function startBackend() {
    const cfg = getBackendLaunchConfig();
    console.log(`[Electron] Starting backend: ${cfg.label}`);
    sendSplashStatus('Đang khởi động backend...');

    // Tee backend + bridge output to a log file the user can grab and share
    // when reporting issues. File rotates each app launch.
    const logPath = path.join(app.getPath('userData'), 'backend-debug.log');
    try { fs.unlinkSync(logPath); } catch { /* first run / not present */ }
    if (backendLogStream) {
        try { backendLogStream.end(); } catch { /* already closed */ }
        backendLogStream = null;
    }
    backendLogStream = fs.createWriteStream(logPath, { flags: 'a' });
    backendLogStream.write(`\n=== Backend launch ${new Date().toISOString()} ===\n`);
    console.log(`[Electron] Backend log file: ${logPath}`);

    try {
        // Pin data dir to per-user app dir so DB + uploads survive app updates.
        // Better-sqlite3 needs Electron's node ABI when running under Electron;
        // ELECTRON_RUN_AS_NODE in extraEnv handles that for packaged builds.
        const dataDir = path.join(app.getPath('userData'), 'tikfinity-data');
        try { fs.mkdirSync(dataDir, { recursive: true }); } catch { /* exists */ }

        backendProcess = spawn(cfg.command, cfg.args, {
            cwd: cfg.cwd,
            env: {
                ...process.env,
                ...(cfg.extraEnv || {}),
                PORT: String(BACKEND_PORT),
                HOST: '127.0.0.1',
                TIKMAX_DATA_DIR: dataDir,
                NODE_ENV: app.isPackaged ? 'production' : 'development',
            },
            stdio: ['ignore', 'pipe', 'pipe']
        });
        backendProcess.stdout.on('data', d => {
            const m = d.toString();
            try { backendLogStream && backendLogStream.write(m); } catch { /* ignore */ }
            const trimmed = m.trim();
            if (trimmed) console.log(`[Backend] ${trimmed}`);
        });
        backendProcess.stderr.on('data', d => {
            const m = d.toString();
            try { backendLogStream && backendLogStream.write('[ERR] ' + m); } catch { /* ignore */ }
            const trimmed = m.trim();
            if (trimmed) console.error(`[Backend ERR] ${trimmed}`);
        });
        backendProcess.on('exit', code => {
            console.log(`[Backend] exited with code ${code}`);
            backendProcess = null;
            if (backendLogStream) {
                try { backendLogStream.end(); } catch { /* ignore */ }
                backendLogStream = null;
            }
            if (isQuitting) return;
            dialog.showMessageBox({
                type: 'error',
                title: 'TikFinity Backend Error',
                message: `Backend đã thoát bất ngờ (code: ${code}).`,
                buttons: ['Khởi động lại', 'Thoát'],
                defaultId: 0
            }).then(({ response }) => {
                if (response === 0) {
                    startBackend();
                    waitForBackend(BACKEND_HEALTH_TIMEOUT_S * 4, 250)
                        .then(() => { if (mainWindow) mainWindow.reload(); })
                        .catch((e) => console.error('[Backend] restart failed:', e.message));
                } else {
                    app.quit();
                }
            });
        });
        backendProcess.on('error', err => {
            console.error('[Backend] failed to spawn:', err.message);
        });
    } catch (err) {
        console.error('[Electron] Failed to spawn backend:', err);
    }
}

// Relay TikTok events from Node bridge (Socket.IO) → Desktop API (raw WS at
// 21213) so raw-WS overlays (activity-feed, custom plugins) get events.
//
// The C# version had the bridge service itself dual-broadcast; the Node port
// only emits via Socket.IO. Without this relay, /downloads/widget/vite/
// overlays connect to DAPI fine but never see a single TikTok event.
//
// Events relayed (the set the activity-feed widget filters on, plus extras
// the original DAPI exposed): chat, gift, like, share, follow, member,
// subscribe, emote, envelope, questionNew, roomUser, connected,
// disconnected, streamEnd, error.
let _bridgeRelaySocket = null;
let _bridgeRelayRetryTimer = null;
const RELAYED_EVENTS = [
    'chat', 'gift', 'like', 'share', 'follow', 'member', 'subscribe',
    'emote', 'envelope', 'questionNew', 'roomUser', 'liveIntro',
    'connected', 'disconnected', 'streamEnd', 'error',
];

function startBridgeToDapiRelay() {
    let io;
    try { io = require('socket.io-client'); }
    catch (err) {
        console.warn('[Relay] socket.io-client not installed — bridge→DAPI relay disabled. Run `npm install` inside electron/.');
        return;
    }

    const connect = () => {
        if (_bridgeRelayRetryTimer) {
            clearTimeout(_bridgeRelayRetryTimer);
            _bridgeRelayRetryTimer = null;
        }
        if (_bridgeRelaySocket && _bridgeRelaySocket.connected) return;

        // Reconnect strategy: start at 2s, double up to 30s, jitter ±50%
        // to avoid thundering herd against a restarting backend. Without
        // jitter, every reconnect timer fires at the exact same instant
        // across sessions → all clients hammer the server simultaneously.
        const sock = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 30000,
            randomizationFactor: 0.5,
            timeout: 10000,
            autoConnect: true,
        });
        _bridgeRelaySocket = sock;

        sock.on('connect', () => {
            console.log('[Relay] Bridge→DAPI Socket.IO client connected (id=' + sock.id + ')');
            // Identify as a relay client so the bridge's per-channel
            // broadcasts don't filter us out (we want EVERY event).
            sock.emit('setContext', { channelId: 0, appType: 'relay' });
        });
        sock.on('disconnect', (reason) => {
            console.log('[Relay] Bridge→DAPI socket disconnected:', reason);
        });
        sock.on('connect_error', (err) => {
            // Backend not up yet — Socket.IO client auto-reconnects, no log spam.
            if (process.env.TIKMAX_RELAY_DEBUG === '1') {
                console.log('[Relay] connect_error:', err.message);
            }
        });

        // Forward each TikTok-shaped event to every DAPI client.
        for (const eventName of RELAYED_EVENTS) {
            sock.on(eventName, (data) => {
                if (!dapi) return;
                try {
                    dapi.broadcast({ event: eventName, data });
                } catch (err) {
                    console.warn('[Relay] dapi.broadcast threw:', err.message);
                }
            });
        }
    };

    // Try to connect immediately. If backend isn't up yet (race during
    // bootstrap), the Socket.IO client's internal reconnect loop handles it.
    connect();
}

function waitForBackend(maxRetries, delayMs) {
    return new Promise((resolve, reject) => {
        let attempt = 0;
        const check = () => {
            attempt++;
            // The maxRetries number (e.g. 120) is just a worst-case retry budget,
            // not a meaningful progress denominator — backend typically replies
            // within 1-3 attempts. Showing "1/120" confused users into thinking
            // the app would idle for 119 more steps. Surface only a simple
            // status string; let the splash spinner indicate progress visually.
            sendSplashStatus('Đang chờ backend...');
            const req = http.get(BACKEND_HEALTH, res => {
                if (res.statusCode === 200) resolve();
                else retry();
                res.resume();
            });
            req.on('error', retry);
            req.setTimeout(2000, () => { req.destroy(); retry(); });
        };
        const retry = () => {
            if (attempt >= maxRetries) {
                reject(new Error(`Backend không phản hồi sau ${maxRetries} lần thử`));
            } else {
                setTimeout(check, delayMs);
            }
        };
        check();
    });
}

function stopBackend() {
    if (backendProcess && !backendProcess.killed) {
        console.log('[Electron] Stopping backend...');
        backendProcess.kill('SIGTERM');
        setTimeout(() => {
            if (backendProcess && !backendProcess.killed) backendProcess.kill('SIGKILL');
        }, 5000);
    }
    backendProcess = null;
    if (backendLogStream) {
        try { backendLogStream.end(); } catch { /* already closed */ }
        backendLogStream = null;
    }
}

// ---------------------------------------------------------------------------
// Splash
// ---------------------------------------------------------------------------

function createSplash() {
    splashWindow = new BrowserWindow({
        width: 420,
        height: 300,
        frame: false,
        resizable: false,
        movable: true,
        skipTaskbar: true,
        alwaysOnTop: true,
        backgroundColor: '#1a1a1a',
        icon: getIconPath(),
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload-splash.js')
        }
    });
    splashWindow.loadFile(path.join(__dirname, 'splash.html'));
    splashWindow.once('ready-to-show', () => {
        if (splashWindow && !splashWindow.isDestroyed()) {
            splashWindow.webContents.send('splash:version', app.getVersion());
        }
    });
    splashWindow.on('closed', () => { splashWindow = null; });
}

let _splashStatusCount = 0;
function sendSplashStatus(text) {
    _splashStatusCount++;
    if (splashWindow && !splashWindow.isDestroyed()) {
        try {
            splashWindow.webContents.send('splash:status', text);
            // Progress: 1 per status update, cap at 10
            const progressStep = Math.min(10, _splashStatusCount);
            splashWindow.webContents.send('splash:progress', progressStep);
        } catch { /* race with close */ }
    }
}

function closeSplash() {
    if (splashWindow && !splashWindow.isDestroyed()) {
        try { splashWindow.close(); } catch { /* already closed */ }
    }
    splashWindow = null;
}


// ---------------------------------------------------------------------------
// Auth gate
// ---------------------------------------------------------------------------

// Decide what to show after splash: main app, or the login window.
// STRICT mode: server validation is mandatory on every launch — no offline
// grace period. If TikfinityServer is unreachable, the user lands on the
// login window with a clear "cần kết nối server" message.
//
// Order:
//   1. No cached token → check TikTok session; if saved, allow offline entry.
//   2. Cached token exists → validate with server.
//   3. Server unreachable → login (SERVER_UNREACHABLE).
//   4. Server says invalid/expired/revoked → clear cache, login.
//   5. Server says valid → allow + refresh lastValidatedAt.
async function decideAuthEntrypoint() {
    const cached = currentAuth;
    
    // If no Serial Key but TikTok session exists, allow offline entry with saved session
    if (!cached) {
        const ttSession = tiktokSessionStore.load();
        if (ttSession && ttSession.sessionId) {
            console.log('[Auth] No Serial Key, but TikTok session exists — allowing offline entry');
            return { allow: true, offline: true, reason: 'TT_SESSION_ONLY' };
        }
        return { allow: false, reason: 'NO_TOKEN' };
    }

    sendSplashStatus('Đang xác thực Serial Key với server...');
    const remote = await remoteValidateToken(cached);

    if (!remote.reachable) {
        // Server unreachable: if user has saved TikTok session, allow offline
        // entry so the app stays usable. Otherwise fall through to login.
        const ttSession = tiktokSessionStore.load();
        if (ttSession && ttSession.sessionId) {
            console.log('[Auth] Server unreachable — allowing offline entry with saved TikTok session');
            return { allow: true, offline: true, reason: 'SERVER_UNREACHABLE_OFFLINE' };
        }
        return { allow: false, reason: 'SERVER_UNREACHABLE' };
    }

    if (!remote.valid) {
        authStore.clear();
        currentAuth = null;
        return { allow: false, reason: remote.reason || 'INVALID' };
    }

    currentAuth = authStore.save({
        ...cached,
        expiresAt: remote.expiresAt || cached.expiresAt,
        lastValidatedAt: new Date().toISOString()
    });
    return { allow: true, offline: false };
}

/**
 * Periodic key revalidation while the app is running. If the key expires or
 * gets revoked mid-session, we clear auth and quit cleanly (next launch will
 * land on the login window). Runs every AUTH_RECHECK_INTERVAL_MS.
 */
function startAuthReCheck() {
    if (authReCheckTimer) return;
    authReCheckTimer = setInterval(async () => {
        if (!currentAuth) return;

        // Local expiry check first — cheap, doesn't need server.
        if (currentAuth.expiresAt) {
            const exp = Date.parse(currentAuth.expiresAt);
            if (Number.isFinite(exp) && exp <= Date.now()) {
                console.log('[Auth] Key expired during session — kicking back to login.');
                showExpiryNotice('⏰ Serial Key đã hết hạn',
                    'Vui lòng nhập key mới hoặc gia hạn.');
                setTimeout(() => performLogout(), 2500);
                return;
            }
        }

        // Remote re-validation — only if server is reachable. Tolerant of brief
        // network blips (don't kick user out on every transient error).
        try {
            const remote = await remoteValidateToken(currentAuth);
            if (remote.reachable && !remote.valid) {
                console.log(`[Auth] Server says invalid (${remote.reason}) — kicking back to login.`);
                showExpiryNotice('🚫 Serial Key không còn hợp lệ',
                    `Lý do: ${describeAuthReason(remote.reason) || remote.reason}.`);
                setTimeout(() => performLogout(), 2500);
            } else if (remote.reachable && remote.valid) {
                // Refresh stored expiry so tray label / next-launch grace period stay accurate.
                currentAuth = authStore.save({
                    ...currentAuth,
                    expiresAt: remote.expiresAt || currentAuth.expiresAt,
                    lastValidatedAt: new Date().toISOString()
                });
                refreshTrayMenu();
            }
        } catch { /* network blip — ignore until next tick */ }
    }, AUTH_RECHECK_INTERVAL_MS);
}

function showExpiryNotice(title, body) {
    if (mainWindow && !mainWindow.isDestroyed()) {
        try {
            dialog.showMessageBox(mainWindow, {
                type: 'warning',
                title: 'TikFinity',
                message: title,
                detail: body,
                buttons: ['OK']
            });
        } catch { /* dialog races with app.quit */ }
    }
}

// Hit TikfinityServer to confirm a cached token is still valid. Returns
// { reachable, valid, reason?, expiresAt? }.
async function remoteValidateToken(cached) {
    if (!AUTH_HOST) return { reachable: false, valid: false };

    if (cached.type === 'key' && cached.keyId) {
        try {
            const res = await tfsRequest('POST', '/api/keys/validate', { keyId: cached.keyId });
            if (!res || !res.ok) return { reachable: false, valid: false };
            const body = res.body || {};
            return {
                reachable: true,
                valid: body.valid === true,
                reason: body.reason,
                expiresAt: body.expiredAt || null
            };
        } catch {
            return { reachable: false, valid: false };
        }
    }

    if (cached.type === 'user' && cached.token) {
        try {
            const res = await tfsRequest('GET', '/api/auth/validate', null, {
                Authorization: `Bearer ${cached.token}`
            });
            if (!res || !res.ok) return { reachable: false, valid: false };
            const body = res.body || {};
            return { reachable: true, valid: body.valid === true };
        } catch {
            return { reachable: false, valid: false };
        }
    }

    return { reachable: true, valid: false, reason: 'UNKNOWN_TYPE' };
}

// Lightweight HTTP client targeted at TikfinityServer. Returns
// { ok: boolean, status: number, body: any } or throws on transport error.
function tfsRequest(method, path, body, extraHeaders) {
    return new Promise((resolve, reject) => {
        const url = AUTH_HOST.replace(/\/+$/, '') + path;
        const lib = url.startsWith('https:') ? https : http;
        const opts = {
            method,
            headers: {
                'Accept': 'application/json',
                ...(extraHeaders || {})
            },
            // Self-signed certs are common on dev TikfinityServer.
            rejectUnauthorized: false
        };
        const payload = body ? JSON.stringify(body) : null;
        if (payload) {
            opts.headers['Content-Type'] = 'application/json';
            opts.headers['Content-Length'] = Buffer.byteLength(payload);
        }
        const req = lib.request(url, opts, res => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                const buf = Buffer.concat(chunks).toString('utf-8');
                let parsed = buf;
                const ct = (res.headers['content-type'] || '').toLowerCase();
                if (ct.includes('application/json')) {
                    try { parsed = JSON.parse(buf); } catch { /* keep raw */ }
                }
                resolve({
                    ok: res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    body: parsed
                });
            });
        });
        req.on('error', reject);
        req.setTimeout(8000, () => req.destroy(new Error('TIMEOUT')));
        if (payload) req.write(payload);
        req.end();
    });
}

// ---------------------------------------------------------------------------
// Login window
// ---------------------------------------------------------------------------

function createLoginWindow(reason) {
    if (loginWindow && !loginWindow.isDestroyed()) {
        loginWindow.show();
        loginWindow.focus();
        return;
    }

    loginWindow = new BrowserWindow({
        width: 480,
        height: 660,
        frame: false,
        resizable: false,
        maximizable: false,
        minimizable: true,
        movable: true,
        show: false,
        skipTaskbar: false,
        title: 'TikFinity — Đăng nhập',
        backgroundColor: '#1a1a1a',
        icon: getIconPath(),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload-login.js')
        }
    });

    loginWindow.loadFile(path.join(__dirname, 'login.html'));

    loginWindow.once('ready-to-show', () => {
        if (loginWindow && !loginWindow.isDestroyed()) loginWindow.show();
        closeSplash();
        if (reason && reason !== 'NO_TOKEN') {
            const msg = describeAuthReason(reason);
            if (msg && loginWindow && !loginWindow.isDestroyed()) {
                loginWindow.webContents.send('auth:state', { kind: 'error', message: msg });
            }
        }
    });

    loginWindow.on('closed', () => {
        loginWindow = null;
        // If user closed login without authenticating and no main window is up,
        // quit. Otherwise the app would be left running headless in tray.
        if (!mainWindow && !isQuitting) {
            isQuitting = true;
            app.quit();
        }
    });
}

function describeAuthReason(reason) {
    switch (reason) {
        case 'EXPIRED':            return '⏰ Serial Key đã hết hạn. Vui lòng gia hạn hoặc nhập key mới.';
        case 'INVALID':            return 'Serial Key không hợp lệ. Vui lòng nhập lại.';
        case 'SERVER_UNREACHABLE': return '🌐 Không kết nối được server xác thực. Hãy kiểm tra mạng / chạy TikfinityServer rồi thử lại.';
        case 'OFFLINE_EXPIRED':    return 'Đã hơn 7 ngày offline. Cần kết nối server để xác thực Serial Key.';
        case 'DISABLED':           return '🚫 Serial Key đã bị khoá. Liên hệ admin để mở lại.';
        case 'NOT_FOUND':          return 'Serial Key không tồn tại trong hệ thống.';
        case 'NOT_ACTIVATED':      return 'Serial Key chưa được kích hoạt (chưa có chủ sở hữu).';
        case 'INVALID_KEY_CODE':   return 'Key Code không khớp với Serial Key.';
        case 'LOGOUT':             return null;  // user-initiated, không cần thông báo
        default:                   return null;
    }
}

function closeLoginWindow() {
    if (loginWindow && !loginWindow.isDestroyed()) {
        try { loginWindow.close(); } catch { /* already closed */ }
    }
    loginWindow = null;
}

// IPC: validate a license key with TikfinityServer.
ipcMain.handle('auth:validate-key', async (_evt, payload) => {
    const keyId = (payload?.keyId || '').trim();
    const keyCode = (payload?.keyCode || '').trim();
    if (!keyId) return { ok: false, message: 'Vui lòng nhập Serial Key.' };

    try {
        const res = await tfsRequest('POST', '/api/keys/validate', {
            keyId,
            keyCode: keyCode || null
        });
        if (!res || !res.ok) {
            return { ok: false, message: `Server trả lỗi (HTTP ${res?.status || 'unknown'}).` };
        }
        const body = res.body || {};
        if (!body.valid) {
            return { ok: false, message: body.message || describeAuthReason(body.reason) || 'Key không hợp lệ.' };
        }
        currentAuth = authStore.save({
            type: 'key',
            token: body.keyId || keyId,        // server doesn't issue JWT for keys; use keyId as the bearer
            keyId: body.keyId || keyId,
            keyCode: keyCode || null,
            expiresAt: body.expiredAt || null,
            lastValidatedAt: new Date().toISOString()
        });
        clearRendererAuthSeed();
        finishLogin();
        return { ok: true, daysLeft: body.daysLeft };
    } catch (err) {
        return { ok: false, message: 'Không kết nối được server license.' };
    }
});

// IPC: login with username + password.
ipcMain.handle('auth:login-user', async (_evt, payload) => {
    const username = (payload?.username || '').trim();
    const password = payload?.password || '';
    if (!username || !password) return { ok: false, message: 'Nhập đầy đủ tài khoản và mật khẩu.' };

    try {
        const res = await tfsRequest('POST', '/api/auth/login', { username, password });
        if (!res) return { ok: false, message: 'Không kết nối được server.' };
        if (!res.ok) {
            return {
                ok: false,
                message: res.body?.message || `Đăng nhập thất bại (HTTP ${res.status}).`
            };
        }
        const body = res.body || {};
        if (!body.token) return { ok: false, message: 'Server không trả token.' };

        currentAuth = authStore.save({
            type: 'user',
            token: body.token,
            username: body.username || username,
            userId: body.id || null,
            roles: body.roles || [],
            lastValidatedAt: new Date().toISOString()
        });
        clearRendererAuthSeed();
        finishLogin();
        return { ok: true };
    } catch (err) {
        return { ok: false, message: 'Không kết nối được server.' };
    }
});

ipcMain.handle('auth:get-state', () => {
    if (!currentAuth) return null;
    return {
        type: currentAuth.type,
        keyId: currentAuth.keyId || null,
        username: currentAuth.username || null,
        expiresAt: currentAuth.expiresAt || null
    };
});

ipcMain.on('auth:get-renderer-seed', (event) => {
    // Sync read returns whatever's in cache (may be stale right after a reload).
    // We push fresh seed via 'auth:seed-updated' once the async refresh completes —
    // preload re-applies it to localStorage so bundle picks up new profileId.
    event.returnValue = buildRendererAuthSeed();

    // Fire-and-forget refresh + push back to renderer when done.
    refreshInitialApiState().then(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            const seed = buildRendererAuthSeed();
            if (seed) {
                try { mainWindow.webContents.send('auth:seed-updated', seed); }
                catch { /* renderer gone */ }
            }
        }
    }).catch(() => { /* swallow — preload will fall back to stale seed */ });
});

ipcMain.handle('auth:quit', () => {
    isQuitting = true;
    app.quit();
});

ipcMain.handle('auth:logout', () => {
    performLogout({ relaunchApp: true });
});

// ── TikTok inline sign-in (passport flow) ──
//
// Renderer calls these to drive the "TikTok Login required" modal. The
// captured sessionid is persisted to <userData>/tiktok-session.json and
// piped into process.env.TIKTOK_SESSIONID so the bridge picks it up on
// the next connect attempt without an app restart.

ipcMain.handle('tiktok:get-signin-status', () => {
    return tiktokSessionStore.getStatus();
});

ipcMain.handle('tiktok:sign-in', async () => {
    try {
        const result = await tiktokSignin.openSignIn(mainWindow);
        return result;
    } catch (err) {
        return { ok: false, error: err && err.message ? err.message : String(err) };
    }
});

ipcMain.handle('tiktok:clear-session', () => {
    tiktokSignin.clearSession();
    return { ok: true };
});

/**
 * Sign-out routine. Clears auth.json, closes the main window, stops the
 * in-session re-check, and pops the login window so the user can enter a
 * new Serial Key. Does NOT quit the app — the user expects to land back on
 * the same login screen they used at startup, not have to relaunch.
 */
function performLogout(options = {}) {
    const relaunchApp = options.relaunchApp === true;

    authStore.clear();
    currentAuth = null;
    clearRendererAuthSeed();

    // Also drop the TikTok session — otherwise decideAuthEntrypoint's
    // "no Serial Key but TT session exists" offline path would silently
    // re-admit the user on relaunch and skip the login screen entirely.
    try { tiktokSignin.clearSession(); } catch (err) {
        console.warn('[Auth] clear TT session on logout failed:', err && err.message ? err.message : err);
    }

    if (authReCheckTimer) { clearInterval(authReCheckTimer); authReCheckTimer = null; }
    if (liveStatusTimer)  { clearInterval(liveStatusTimer);  liveStatusTimer = null; }
    if (powerSaveBlockerId !== null) {
        try { powerSaveBlocker.stop(powerSaveBlockerId); } catch { /* already stopped */ }
        powerSaveBlockerId = null;
    }

    refreshTrayMenu();

    if (mainWindow && !mainWindow.isDestroyed()) {
        try { mainWindow.removeAllListeners('close'); mainWindow.destroy(); }
        catch { /* race */ }
        mainWindow = null;
    }

    if (relaunchApp) {
        isQuitting = true;

        closeSplash();
        closeLoginWindow();

        if (tray && !tray.isDestroyed()) {
            try { tray.destroy(); } catch { /* already destroyed */ }
            tray = null;
        }

        if (dapi) {
            try { dapi.stop(); } catch { /* already stopped */ }
            dapi = null;
        }

        stopBackend();

        try {
            app.relaunch();
            app.exit(0);
            return;
        } catch (err) {
            isQuitting = false;
            console.warn('[Auth] app.relaunch failed, fallback to in-app login window:', err && err.message ? err.message : err);
            createLoginWindow('LOGOUT');
            return;
        }
    }

    createLoginWindow('LOGOUT');
}

// Called when login flow succeeds — closes login, opens main.
function finishLogin() {
    closeLoginWindow();
    refreshTrayMenu();
    if (!mainWindow || mainWindow.isDestroyed()) {
        createMainWindow();
        startLivePolling();
        setTimeout(setHighPriority, 5000);
    } else {
        clearRendererAuthSeed();
        prepareRendererAuthSeed()
            .catch((err) => console.warn('[tfs] renderer auth refresh failed:', err.message))
            .finally(() => {
                if (!mainWindow || mainWindow.isDestroyed()) return;
                mainWindow.reload();
                mainWindow.show();
                mainWindow.focus();
            });
    }
}

// ---------------------------------------------------------------------------
// Session: header rewriting + UA spoofing for plugin compatibility
// ---------------------------------------------------------------------------

function configureSession() {
    const sess = session.defaultSession;
    let lastEasemobOrigin = null;

    // Log any 404 from our local backend so we can spot missing assets.
    sess.webRequest.onCompleted({ urls: ['http://localhost:5285/*'] }, (details) => {
        if (details.statusCode === 404) {
            console.log(`[ASSET-404] ${details.url}`);
        }
    });

    // Network-level block of third-party telemetry / SDK calls the bundle
    // makes despite our inline XHR/fetch monkey-patches in blockScript.txt.
    // Some SDKs (Featurebase, Sentry) bypass our patches by using sendBeacon,
    // <script> injection, or capturing fresh XHR refs before our patch loads.
    // Blocking at the session.webRequest layer is unconditional — any request
    // matching the deny list gets a 400 response without leaving Electron.
    const BLOCK_URLS = [
        '*://*.featurebase.app/*',
        '*://*.sentry.io/*',
        '*://*.contentsquare.net/*',
        '*://pagead2.googlesyndication.com/*',
        '*://*.googletagmanager.com/*',
        '*://*.google-analytics.com/*',
        '*://ph.tikfinity.com/*',
    ];
    sess.webRequest.onBeforeRequest({ urls: BLOCK_URLS }, (details, callback) => {
        if (process.env.TIKMAX_NETBLOCK_DEBUG === '1') {
            console.log('[NetBlock]', details.method, details.url);
        }
        callback({ cancel: true });
    });

    // Bundle's overlay-gallery UI links to `/widget/<name>?cid=1&preview=1`
    // using an `<a download>` element. Chromium honours `download` attribute
    // for same-origin URLs and shows a Save dialog INSTEAD of navigating —
    // even though Content-Type is text/html. Cancel that download and re-open
    // the URL in a real BrowserWindow so the user sees the widget render.
    sess.on('will-download', (event, item, _wc) => {
        const url = item.getURL();
        // Backend serves extensionless HTML landing pages under multiple
        // paths — /widget/<name>, /tiktok/<page>, /streamerbot-integration,
        // /chatbot-troubleshooting, /get-tiktok-username, /studiofix etc.
        // Any of these can trigger Chromium's download path if the response
        // Content-Type slips back to octet-stream OR the bundle uses
        // `<a download>`. Catch all local-backend URLs without a file
        // extension and open them in a popup window instead of downloading.
        const isLocalBackend =
            url.startsWith(BACKEND_URL + '/') ||
            url.startsWith('http://localhost:' + BACKEND_PORT + '/') ||
            url.startsWith('http://127.0.0.1:' + BACKEND_PORT + '/');
        if (!isLocalBackend) return;
        // Extract path, drop trailing slash + query, check for extension.
        let pathPart = '';
        try { pathPart = new URL(url).pathname; } catch { return; }
        const hasExt = /\.[a-z0-9]{1,5}$/i.test(pathPart);
        // Don't intercept asset extensions (.zip, .png, .json...) — those
        // SHOULD download if the user explicitly requested them. Only
        // intercept extensionless paths that look like HTML pages.
        if (hasExt) return;
        // Skip /api/* — backend handles those itself; downloads of API
        // responses are not part of the bundle's UI flow.
        if (pathPart.startsWith('/api/')) return;

        event.preventDefault();
        try { item.cancel(); } catch { /* may already be torn down */ }
        const popup = new BrowserWindow({
            show: false,
            width: 800,
            height: 600,
            autoHideMenuBar: true,
            title: 'TikFinity',
            backgroundColor: '#1c1d22',
            parent: mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined,
            webPreferences: { contextIsolation: false, nodeIntegration: false },
        });
        popup.setMenuBarVisibility(false);
        popup.once('ready-to-show', () => { if (!popup.isDestroyed()) popup.show(); });
        popup.loadURL(url).catch((err) => {
            console.warn('[Preview Popup] loadURL failed:', err.message);
            if (!popup.isDestroyed()) popup.close();
        });
    });


    // Strip CSP / open CORS for the third-party domains TikFinity plugins hit.
    sess.webRequest.onHeadersReceived({
        urls: [
            'https://*.tiktok.com/*',
            'https://accounts.spotify.com/*',
            'https://clienttoken.spotify.com/*',
            'https://api-partner.spotify.com/*',
            'https://*.easemob.com/*',
            'https://*.agora.io/*'
        ]
    }, (details, callback) => {
        const headers = details.responseHeaders || {};

        if (details.url.startsWith('https://www.tiktok.com/')) {
            // Embedded TikTok views need scripts/iframes that CSP blocks by default.
            delete headers['content-security-policy'];
            delete headers['Content-Security-Policy'];
            delete headers['content-security-policy-report-only'];
            delete headers['Content-Security-Policy-Report-Only'];
        }

        // Extend Spotify cookie lifetime so re-auth doesn't fire mid-stream.
        if (details.url.startsWith('https://accounts.spotify.com/')) {
            const setCookie = headers['set-cookie'] || headers['Set-Cookie'];
            if (Array.isArray(setCookie)) {
                for (let i = 0; i < setCookie.length; i++) {
                    if (setCookie[i].startsWith('sp_') &&
                        !/expires|max-age/i.test(setCookie[i])) {
                        setCookie[i] += ';Max-Age=999999999';
                    }
                }
            }
        }

        // Spotify partner / clienttoken APIs need wide-open CORS for the bundle to read JSON.
        if (details.url.includes('clienttoken.spotify.com') ||
            details.url.includes('api-partner.spotify.com')) {
            delete headers['Access-Control-Allow-Origin'];
            delete headers['access-control-allow-origin'];
            headers['access-control-allow-origin'] = '*';
            headers['access-control-allow-credentials'] = 'true';
            headers['access-control-allow-methods'] = 'GET,POST,OPTIONS,PUT,DELETE,HEAD';
            headers['access-control-allow-headers'] = '*';
        }

        // Easemob/Agora chat (younow plugin) — preserve original Origin from request.
        if (details.url.includes('agora') || details.url.includes('easemob')) {
            headers['access-control-allow-origin'] = lastEasemobOrigin || '*';
            delete headers['Access-Control-Allow-Origin'];
        }

        callback({ responseHeaders: headers });
    });

    sess.webRequest.onBeforeSendHeaders({
        urls: [
            'https://*.spotify.com/*',
            'https://*.younow.com/*',
            'https://*.algolia.net/*',
            'https://*.propsproject.com/*',
            'https://*.easemob.com/*',
            'https://*.agora.io/*'
        ]
    }, (details, callback) => {
        const h = details.requestHeaders || {};

        if (details.url.startsWith('https://api.spotify.com/') ||
            details.url.startsWith('https://clienttoken.spotify.com/') ||
            details.url.startsWith('https://api-partner.spotify.com/')) {
            h['Origin'] = 'https://open.spotify.com';
            h['Referer'] = 'https://open.spotify.com/';
            h['User-Agent'] =
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                '(KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';
        }

        const masquerade =
            details.url.includes('younow.com') ||
            details.url.includes('algolia') ||
            details.url.includes('propsproject') ||
            details.url.includes('agora') ||
            details.url.includes('easemob');

        if (masquerade) {
            if (details.url.includes('easemob') || details.url.includes('agora')) {
                lastEasemobOrigin = h['Origin'] || h['origin'] || lastEasemobOrigin;
            }
            const chromeMajor = randomInt(125, 134);
            h['User-Agent'] =
                `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ` +
                `(KHTML, like Gecko) Chrome/${chromeMajor}.0.0.0 Safari/537.36`;
            h['Referer'] = 'https://www.younow.com/';
            h['Origin'] = 'https://www.younow.com';
        }

        callback({ requestHeaders: h });
    });
}

// ---------------------------------------------------------------------------
// bytedance:// protocol — silently block deep-link attempts from embedded views.
// ---------------------------------------------------------------------------

function registerBytedanceProtocol() {
    try {
        protocol.registerHttpProtocol('bytedance', (request, callback) => {
            console.log(`[Electron] Blocked bytedance:// URL: ${request.url}`);
            try { callback({ cancel: true }); } catch { /* electron version difference */ }
        });
    } catch (err) {
        console.warn('[Electron] bytedance protocol register failed:', err.message);
    }
}

// ---------------------------------------------------------------------------
// Main window
// ---------------------------------------------------------------------------

function clearRendererAuthSeed() {
    cachedBundleJwt = null;
    rendererAuthSeedPromise = null;
}

function buildRendererAuthSeed() {
    if (!currentAuth) return null;

    const displayName = currentAuth.username || currentAuth.keyId || 'User';
    const state = cachedInitialApiState || {};
    return {
        displayName,
        tokenForBundle: cachedBundleJwt || currentAuth.token || currentAuth.keyId || 'tfs-session',
        userPayload: JSON.stringify({
            type: currentAuth.type,
            keyId: currentAuth.keyId || null,
            username: currentAuth.username || null,
            expiresAt: currentAuth.expiresAt || null
        }),
        // From backend /api/me snapshot — replaces preload hardcoded values.
        channelId: state.channelId ?? 1,
        profileId: state.profileId ?? 1,
        channelName: state.channelName ?? displayName,
        isPro: state.isPro ?? true
    };
}

// Cache of initial /api/me snapshot for renderer seed. Avoid hardcoding values
// in preload.js — pull real channelId / profileId / channelName from backend.
// MUST be refreshed after profile switch, otherwise preload seeds the renderer
// with stale profileId on the next reload.
let cachedInitialApiState = null;
let _apiStateRefreshInFlight = null;

function refreshInitialApiState() {
    if (_apiStateRefreshInFlight) return _apiStateRefreshInFlight;
    _apiStateRefreshInFlight = new Promise((resolve) => {
        const req = http.get(`${BACKEND_URL}/api/me`, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
                    cachedInitialApiState = {
                        channelId: parsed?.channel?.ChannelId || parsed?.channel?.channelId || null,
                        profileId: parsed?.channel?.ProfileId || parsed?.channel?.profileId || null,
                        channelName: parsed?.channelName || parsed?.channel?.ChannelName || null,
                        email: parsed?.channel?.Email || parsed?.channel?.email || null,
                        isPro: parsed?.isPro ?? parsed?.subscription?.isPro ?? true
                    };
                } catch { /* keep stale cache */ }
                _apiStateRefreshInFlight = null;
                resolve(cachedInitialApiState);
            });
        });
        req.on('error', () => { _apiStateRefreshInFlight = null; resolve(cachedInitialApiState); });
        req.setTimeout(2000, () => req.destroy(new Error('TIMEOUT')));
    });
    return _apiStateRefreshInFlight;
}

function fetchBundleJwt() {
    return new Promise((resolve, reject) => {
        const req = http.get(`${BACKEND_URL}/api/me`, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
                    // Snapshot useful fields for the renderer seed (run before
                    // bundle loads). Real values, not hardcoded "1".
                    cachedInitialApiState = {
                        channelId: parsed?.channel?.ChannelId || parsed?.channel?.channelId || null,
                        profileId: parsed?.channel?.ProfileId || parsed?.channel?.profileId || null,
                        channelName: parsed?.channelName || parsed?.channel?.ChannelName || null,
                        email: parsed?.channel?.Email || parsed?.channel?.email || null,
                        isPro: parsed?.isPro ?? parsed?.subscription?.isPro ?? true
                    };
                    resolve(parsed?.wsAuthToken || null);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(3000, () => req.destroy(new Error('TIMEOUT')));
    });
}

async function prepareRendererAuthSeed() {
    if (!currentAuth) return null;
    if (cachedBundleJwt) return buildRendererAuthSeed();
    if (rendererAuthSeedPromise) return rendererAuthSeedPromise;

    rendererAuthSeedPromise = (async () => {
        try {
            const wsAuthToken = await fetchBundleJwt();
            if (wsAuthToken) cachedBundleJwt = wsAuthToken;
        } catch (err) {
            console.warn('[tfs] /api/me wsAuthToken fetch failed:', err.message);
        } finally {
            rendererAuthSeedPromise = null;
        }

        return buildRendererAuthSeed();
    })();

    return rendererAuthSeedPromise;
}

// Persist window position/size/maximize state across launches so the user's
// chosen layout survives reload + restart. Without this, every relaunch
// reset the user to 1400x900 and force-unmaximize, which clashed with the
// idol's preference for a fullscreen TikFinity panel.
function loadWindowState() {
    const file = path.join(app.getPath('userData'), 'window-state.json');
    try {
        if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch { /* corrupt — fall through to defaults */ }
    return null;
}
function saveWindowState(win) {
    if (!win || win.isDestroyed()) return;
    try {
        const bounds = win.getBounds();
        const state = { ...bounds, isMaximized: win.isMaximized() };
        const file = path.join(app.getPath('userData'), 'window-state.json');
        fs.writeFileSync(file, JSON.stringify(state, null, 2));
    } catch (err) {
        console.warn('[window-state] save failed:', err.message);
    }
}

function createMainWindow() {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show();
        return;
    }

    const saved = loadWindowState();
    const defaults = { width: 1400, height: 900 };
    const init = saved && Number.isFinite(saved.width) && Number.isFinite(saved.height)
        ? { width: saved.width, height: saved.height, x: saved.x, y: saved.y }
        : defaults;

    mainWindow = new BrowserWindow({
        ...init,
        minWidth: 1230,
        minHeight: 700,
        show: false,
        title: 'TikFinity',
        // Match earlyCss.txt #1c1d22 so the BrowserWindow background doesn't
        // bleed a lighter strip on the right/bottom when the bundle is mid-
        // reload (e.g. during the "Connecting websocket..." splash chain).
        backgroundColor: '#1c1d22',
        icon: getIconPath(),
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
            allowRunningInsecureContent: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    if (saved && saved.isMaximized) {
        try { mainWindow.maximize(); } catch { /* ignore */ }
    }
    // Save state on every move/resize/maximize toggle so a hard crash still
    // preserves the most recent layout.
    let _saveDebounce = null;
    const debouncedSave = () => {
        if (_saveDebounce) clearTimeout(_saveDebounce);
        _saveDebounce = setTimeout(() => saveWindowState(mainWindow), 500);
    };
    mainWindow.on('resize', debouncedSave);
    mainWindow.on('move', debouncedSave);
    mainWindow.on('maximize', debouncedSave);
    mainWindow.on('unmaximize', debouncedSave);

    // Use Chromium's default UA on the main window — only popups (TikTok login,
    // bridge windows) need the spoofed TikTokLIVEStudio UA from app.userAgentFallback.
    if (originalUA) mainWindow.webContents.setUserAgent(originalUA);

    mainWindow.menuBarVisible = false;
    mainWindow.setMenuBarVisibility(false);

    mainWindow.once('ready-to-show', () => {
        try { mainWindow.webContents.setZoomFactor(1); } catch { /* page not ready */ }
        // NOTE: we used to force-unmaximize + setSize(1400, 900) here on
        // every `ready-to-show` because the bundle's CSS at wide widths
        // (e.g. fullscreen on a 1920x1080 panel) overflows buttons off-screen.
        // That was a sledgehammer fix — every bundle reload reset the user's
        // chosen window size, which felt jittery. The bundle ships
        // `.obsOverlayContainer { zoom: 0.9 }` at >=1914px and
        // `zoom: 1` again at >=2100px (combo/modules.css), so HD/QHD users
        // get a responsive layout natively. For the 1500-1900px gap we
        // inject scale-clamp CSS in backend-node/src/templates/earlyCss.txt.
        if (process.env.TIKMAX_DEVTOOLS === '1') {
            try { mainWindow.webContents.openDevTools({ mode: 'detach' }); } catch { /* ignore */ }
        }
    });

    // Defer mainWindow.show() until the renderer stabilizes. The bundle's
    // bootstrap chain triggers several reloads in the first 2-4 seconds,
    // which the user would otherwise see as jittery flicker. We keep the
    // splash up and only swap to the main window once did-finish-load has
    // been quiet for SETTLE_MS. A hard timeout guarantees we never hang.
    // Bumped SETTLE 3s→4s and MAX_WAIT 5s→7s — cold boot on a fresh
    // localStorage occasionally chains 5-6 reloads which previously raced
    // past the 3s settle window, surfacing a mid-bootstrap "broken UI"
    // frame before the final reload landed.
    const SETTLE_MS = 4000;
    const MAX_WAIT_MS = 7000;
    const MAX_BOOT_NAVS = 6;
    let _settleTimer = null;
    let _hasShown = false;
    let _initialBootPhase = true;
    let _bootNavCount = 0;
    function showMainWindowOnce() {
        if (_hasShown) return;
        _hasShown = true;
        _initialBootPhase = false;   // <<< THÊM DÒNG NÀY
        if (_settleTimer) { clearTimeout(_settleTimer); _settleTimer = null; }
        try { mainWindow.show(); } catch { /* destroyed */ }
        closeSplash();
        console.log('[Main-Boot] main window shown (renderer settled)');
    }

    const _maxWaitTimer = setTimeout(() => {
        console.warn(`[Main-Boot] hard timeout ${MAX_WAIT_MS}ms — showing main window anyway`);
        showMainWindowOnce();
    }, MAX_WAIT_MS);

    // Trigger reload mask in the bundle when a top-level navigation starts.
    // The mask is a solid black div that covers the screen during reload,
    // auto-hiding after 150ms so the bundle's own loading screen takes over.
    mainWindow.webContents.on('did-start-navigation', (_e, url, isInPlace, isMainFrame) => {
        if (!_hasShown) return;
        if (!isMainFrame || isInPlace) return;
        if (!isBackendMainUrl(url)) return;
        try {
            mainWindow.webContents.executeJavaScript(
                'window.TFS && window.TFS.__reloadMask && window.TFS.__reloadMask.show && window.TFS.__reloadMask.show()'
            ).catch(() => { /* page not ready */ });
        } catch { /* ignore */ }

        // Refresh /api/me snapshot before preload runs next. This prevents
        // stale profileId from being seeded after a switch-profile reload.
        refreshInitialApiState();
    });

    mainWindow.webContents.on('did-finish-load', () => {
        applyAuthOverlay();
        if (_hasShown) {
            // Reload finished. The in-bundle reload mask (injected via
            // BuildIndexHtml) hides itself via its own scheduleHide() timer
            // after ~800ms — no main-process action needed here.
            return;
        }
        if (_settleTimer) clearTimeout(_settleTimer);
        _settleTimer = setTimeout(() => {
            clearTimeout(_maxWaitTimer);
            showMainWindowOnce();
        }, SETTLE_MS);
    });

    // Forward renderer warnings and errors to main log (kept for ongoing
    // diagnosis). TF-TRACE uses console.warn (level 2) so we must include
    // level >= 2. Cap at 2000 chars to keep stacks readable.
    //
    // ALSO append every renderer error to a dedicated file at
    // `<userData>/renderer-errors.log` so users can share it for analysis
    // without having to copy/paste from F12. Rotates when >2MB.
    const rendererErrorLog = path.join(app.getPath('userData'), 'renderer-errors.log');
    function appendRendererLog(line) {
        try {
            const stat = fs.existsSync(rendererErrorLog) ? fs.statSync(rendererErrorLog) : null;
            if (stat && stat.size > 2 * 1024 * 1024) {
                try { fs.renameSync(rendererErrorLog, rendererErrorLog + '.old'); } catch { /* ignore */ }
            }
            fs.appendFileSync(rendererErrorLog, line + '\n', 'utf8');
        } catch { /* don't crash the main process on log write failure */ }
    }
    // Header so each session is identifiable in the rolling log.
    appendRendererLog(`\n=== Session start ${new Date().toISOString()} app=${app.getVersion()} ===`);

    mainWindow.webContents.on('console-message', (_evt, level, message, line, sourceId) => {
        if (typeof message !== 'string') return;
        if (level < 2) return;
        const trimmed = message.length > 2000 ? message.slice(0, 1997) + '...' : message;
        const prefix = level >= 3 ? '[Renderer ERR]' : '[Renderer WARN]';
        console.log(`${prefix} ${trimmed}`);
        // File log: include source + line so we can pinpoint the script tag.
        const loc = sourceId ? ` @ ${sourceId}:${line}` : '';
        appendRendererLog(`${new Date().toISOString()} ${prefix}${loc}\n  ${trimmed}`);
    });

    // Surface unhandled promise rejections + uncaught errors from the renderer
    // process — these don't go through console-message reliably on every
    // Electron version. The `render-process-gone` event covers crashes.
    mainWindow.webContents.on('render-process-gone', (_e, details) => {
        const line = `${new Date().toISOString()} [Renderer CRASH] reason=${details.reason} exitCode=${details.exitCode}`;
        console.error(line);
        appendRendererLog(line);
    });
    mainWindow.webContents.on('did-fail-load', (_e, code, desc, url) => {
        if (code === -3) return; // ABORTED (normal during redirects)
        const line = `${new Date().toISOString()} [Renderer LOAD-FAIL] code=${code} desc=${desc} url=${url}`;
        appendRendererLog(line);
    });

    // Also count fetches per second by URL — exposed on a loop in the renderer.
    mainWindow.webContents.on('did-navigate', (_e, url) => {
        console.log(`[Renderer NAV] ${url}`);
    });
    mainWindow.webContents.on('did-navigate-in-page', (_e, url) => {
        console.log(`[Renderer SPA-NAV] ${url}`);
    });



    mainWindow.webContents.on('will-navigate', (event, url) => {
        // External payment / OAuth pages shouldn't replace the main app shell.
        if (url.startsWith('https://www.paypal.com/') ||
            url.startsWith('https://www.sandbox.paypal.com/')) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });

    // Reload guard tuned for the bundle's switch-profile behaviour. A single
    // user click triggers a bootstrap chain of several reloads in quick
    // succession (~1 every 100-500ms). A real loop fires reloads continuously
    // with no breathing room.
    //
    // Strategy: track the last N reloads. If they all happened within a tight
    // window AND there's been NO 1.5s gap, we're in a loop — block until the
    // gap appears. User can switch any number of times because each click's
    // chain ends with a > 1.5s settling period before the next click.
    // Electron-level safety net: cap reload bursts at 15 to prevent runaway
    // loops. The user-visible flicker is hidden by a JS-injected overlay
    // (see Program.cs), so allowing the bundle to do its bootstrap reload
    // chain is fine — but a runaway infinite loop must be stopped.
    // Electron-level Main-Guard is now LOG-ONLY. The in-bundle reload guard
    // (sessionStorage-based, injected via BuildIndexHtml) is the primary cap.
    // preventDefault() here used to leave the renderer in a half-loaded
    // broken state (black screen) when it kicked in during a real switch.
    // Main-process reload rate limiter. The in-renderer reload guard catches
    // location.reload/assign/replace/href/search/pathname/history.go/form.submit
    // but the bundle's settings.restore may still slip through via paths we
    // cannot intercept. This is the last line of defence.
    //
    // Profile switch: bundle fires a chain of 8-12 reloads with ~100-500ms
    // between them. A runaway loop has the same fast cadence but never settles.
    // We use a SETTLE_GAP to tell them apart:
    //   - If gap since last nav > SETTLE_GAP_MS, reset the chain counter
    //     (the previous burst ended, this is a new chain).
    //   - Allow up to CHAIN_LIMIT navs per chain (profile switch needs ~12).
    //   - If a chain exceeds CHAIN_LIMIT without ever settling, it's a loop —
    //     block further reloads until a settle gap is observed.
    const SETTLE_GAP_MS = 1500;
    const CHAIN_LIMIT = 15;
    let _chainCount = 0;
    let _lastNavTs = 0;
    let _chainBlocked = false;

    function isBackendMainUrl(url) {
        return typeof url === 'string' && url.startsWith(BACKEND_URL);
    }

    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (!isBackendMainUrl(url)) return;

        const now = Date.now();
        const gap = _lastNavTs ? now - _lastNavTs : Infinity;

        // Settle gap observed — previous chain ended, this is a new one.
        if (gap > SETTLE_GAP_MS) {
            if (_chainBlocked) console.log(`[Main-Guard] Chain released after ${gap}ms settle gap`);
            _chainCount = 0;
            _chainBlocked = false;
        }

        _lastNavTs = now;

        // Boot phase: tolerate a few chained navs while the bundle mounts.
        // Cap at MAX_BOOT_NAVS so a runaway loop during boot can't accumulate
        // forever; once exceeded, force-end the boot phase and let the chain
        // limiter kick in below.
        if (_initialBootPhase) {
            _bootNavCount++;
            if (_bootNavCount <= MAX_BOOT_NAVS) {
                console.log(`[InitialBoot] nav during boot (#${_bootNavCount}/${MAX_BOOT_NAVS}): ${url}`);
                _chainCount = 0;
                return;
            }
            // Too many boot navs — force-end boot phase and fall through to
            // the post-boot chain limiter.
            console.warn(`[InitialBoot] exceeded ${MAX_BOOT_NAVS} navs — ending boot phase early`);
            _initialBootPhase = false;
        }

        // Already blocked — wait for a settle gap.
        if (_chainBlocked) {
            console.warn(`[Main-Guard] BLOCKED reload (chain stuck, awaiting ${SETTLE_GAP_MS}ms settle gap, gap so far ${gap}ms) url=${url}`);
            event.preventDefault();
            return;
        }

        _chainCount++;
        if (_chainCount > CHAIN_LIMIT) {
            _chainBlocked = true;
            console.warn(`[Main-Guard] CHAIN OVERFLOW (>${CHAIN_LIMIT} navs without settle). Blocking until ${SETTLE_GAP_MS}ms gap. url=${url}`);
            event.preventDefault();
        }
    });

    mainWindow.webContents.on('did-start-navigation', (_e, url, isInPlace, isMainFrame) => {
        if (!isMainFrame || isInPlace) return;
        if (isBackendMainUrl(url)) {
            console.log(`[Main-Diag] mainFrame nav (chain=${_chainCount}) url=${url}`);
        } else {
            console.log(`[Main-Diag] did-start-navigation (external) url=${url}`);
        }
    });
    mainWindow.webContents.on('did-fail-load', (_e, code, desc, url) => {
        console.error(`[Main-Diag] did-fail-load code=${code} desc=${desc} url=${url}`);
    });
    mainWindow.webContents.on('unresponsive', () => {
        console.error('[Main-Diag] webContents unresponsive');
    });
    mainWindow.webContents.on('responsive', () => {
        console.log('[Main-Diag] webContents responsive');
    });

    mainWindow.webContents.setWindowOpenHandler(handleWindowOpen);

    // When a popup is allowed by handleWindowOpen, ensure it only becomes
    // visible after the page loads — otherwise the user sees a blank desktop
    // window for a few seconds. Also close it automatically if nav fails so
    // empty popups don't linger.
    mainWindow.webContents.on('did-create-window', (child, details) => {
        const url = (details && details.url) || '';
        console.log('[Popup] created url=' + url);
        // Belt-and-suspenders: hide menu on every popup, even ones whose
        // overrideBrowserWindowOptions forgot to do so.
        try { child.setMenuBarVisibility(false); } catch { /* fine */ }
        try { child.setAutoHideMenuBar(true); } catch { /* fine */ }
        const hidden = url.includes('#hidden') || url.includes('#tfbridge');
        if (hidden) return;
        child.once('ready-to-show', () => {
            if (!child.isDestroyed()) child.show();
        });
        child.webContents.on('did-fail-load', (_e, code, desc) => {
            if (code === -3) return; // ABORTED (normal during redirects)
            console.warn('[Popup] did-fail-load', code, desc, url);
            if (!child.isDestroyed()) child.close();
        });
    });

    mainWindow.on('close', e => {
        if (!isQuitting) {
            e.preventDefault();
            mainWindow.hide();
        }
    });
    mainWindow.on('closed', () => { mainWindow = null; });

    prepareRendererAuthSeed()
        .catch((err) => console.warn('[tfs] renderer auth seed prepare failed:', err.message))
        .finally(() => {
            if (!mainWindow || mainWindow.isDestroyed()) return;
            mainWindow.loadURL(BACKEND_URL);
        });
}

/**
 * Post-load DOM cleanup only. Storage and cookies are now seeded from preload
 * so the bundle sees auth before it boots.
 */
function applyAuthOverlay() {
    if (!mainWindow || mainWindow.isDestroyed() || !currentAuth) return;
    const persist = `
    (function() {
      try {
        if (document.body.classList.contains('tf-logged-out')) {
          document.body.classList.remove('tf-logged-out');
        }
        if (!document.body.classList.contains('tf-logged-in')) {
          document.body.classList.add('tf-logged-in');
        }

        var guest = document.getElementById('tf-guest-topbar');
        if (guest && guest.style.display !== 'none') guest.style.display = 'none';

        // Remove leftover dev mounts only on first run.
        if (!window.__tfOverlayCleaned) {
          window.__tfOverlayCleaned = true;
          ['tf-topbar-mount', 'tf-topbar-style', 'tf-pro-badge', 'tf-pro-style'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.remove();
          });
          document.body.style.paddingTop = '';
        }
      } catch (e) {}
    })();
    `;
    mainWindow.webContents.executeJavaScript(persist, true).catch(() => { /* page navigated mid-inject */ });
}

function handleWindowOpen(details) {
    const { url } = details;
    const isTikTokUrl = url.startsWith('https://www.tiktok.com/');
    let hash = '';
    let pathname = '';

    if (isTikTokUrl) {
        try {
            const parsed = new URL(url);
            hash = parsed.hash || '';
            pathname = (parsed.pathname || '').toLowerCase();
        } catch {
            hash = '';
            pathname = '';
        }
    }

    const lowerHash = hash.toLowerCase();
    const wantsTikTokLogin =
        lowerHash.includes('ttlogin') ||
        pathname.startsWith('/login') ||
        pathname === '/passport/web/login' ||
        pathname.startsWith('/passport/web/login/');
    const wantsTikTokLogout = lowerHash.includes('ttlogout');

    // TikTok bridge — invisible window for cookie / chat connection setup.
    if (url.startsWith('https://www.tiktok.com/') && url.includes('#tfbridge')) {
        const signInStatus = tiktokSessionStore.getStatus();
        if (!signInStatus || !signInStatus.signedIn) {
            setImmediate(() => {
                const parentWindow = mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined;
                tiktokSignin.openSignIn(parentWindow).catch((err) => {
                    console.error('[TikTok Login] Failed to open sign-in from tfbridge:', err.message);
                });
            });
            return { action: 'deny' };
        }

        // Bridge MUST stay hidden. The `show=1` debug flag was leaking and
        // surfacing the raw TikTok UI to end users — never honour it in
        // production paths. Anyone debugging the bridge can flip this here.
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                show: false,
                height: randomInt(900, 1200),
                width: randomInt(1800, 2300),
                skipTaskbar: true,
                autoHideMenuBar: true,
                title: 'TikFinity Bridge',
                webPreferences: {
                    contextIsolation: false,
                    backgroundThrottling: false
                }
            }
        };
    }

    // TikTok login must go through the dedicated Passport flow window instead
    // of a generic TikTok popup, otherwise TikTok often lands on the feed.
    // Must run BEFORE the generic isTikTokUrl→openExternal branch below, or
    // the dedicated sign-in flow would never fire.
    if (isTikTokUrl && wantsTikTokLogin) {
        setImmediate(() => {
            const parentWindow = mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined;
            tiktokSignin.openSignIn(parentWindow).catch((err) => {
                console.error('[TikTok Login] Failed to open dedicated sign-in window:', err.message);
            });
        });
        return { action: 'deny' };
    }

    if (isTikTokUrl && wantsTikTokLogout) {
        setImmediate(() => {
            try {
                tiktokSignin.clearSession();
            } catch (err) {
                console.error('[TikTok Logout] Failed to clear session:', err.message);
            }
        });
        return { action: 'deny' };
    }

    // Any other TikTok URL (settings pages, feeds, profile) — open in the
    // user's default browser instead of a popup. The bundle navigating to
    // privacy/settings inside the Electron shell was bleeding TikTok's full
    // chrome (with default File/Edit/View menu) into the desktop app.
    if (isTikTokUrl) {
        shell.openExternal(url);
        return { action: 'deny' };
    }

    // Widget preview popups — the bundle's overlay configurator opens
    // `http://localhost:5285/widget/<name>?cid=1&preview=1` in a new window
    // when the user clicks the box-with-arrow "open externally" icon.
    // Without explicit handling, Electron falls through to `shell.openExternal`
    // (which can pop a Save dialog because the OS file-handler for localhost
    // HTML is undefined on some Windows configs). Keep these in-app so the
    // user sees the rendered widget instead of a Save dialog.
    if (url.startsWith(BACKEND_URL + '/widget/') || url.startsWith('http://localhost:' + BACKEND_PORT + '/widget/')) {
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                show: true,
                width: 800,
                height: 600,
                autoHideMenuBar: true,
                title: 'TikFinity Widget',
                backgroundColor: '#000000',
                parent: mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined,
                webPreferences: {
                    contextIsolation: false,
                    nodeIntegration: false,
                },
            },
        };
    }

    // In-app popups (Spotify auth, settings panes, widget previews, future
    // TikfinityServer login). Without explicit overrides Electron defaults to
    // a blank window with the OS title (package name) and the full File/Edit
    // menu — looks like a leftover desktop window. We apply sensible defaults
    // here so any #electron popup at least looks intentional.
    if (url.includes('#electron')) {
        const hidden = url.includes('#hidden');
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                show: false,
                width: 560,
                height: 720,
                autoHideMenuBar: true,
                title: 'TikFinity',
                parent: mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined,
                webPreferences: {
                    contextIsolation: true,
                    nodeIntegration: false
                },
                ...(!hidden && { backgroundColor: '#1a1a1a' })
            }
        };
    }

    // TikfinityServer login window — keep in-app once integration lands.
    if (AUTH_HOST && url.startsWith(AUTH_HOST)) {
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                width: 800,
                height: 700,
                modal: true,
                parent: mainWindow || undefined
            }
        };
    }

    // Anything else (donate, docs, social) → user's default browser.
    if (url.startsWith('http://') || url.startsWith('https://')) {
        shell.openExternal(url);
    }
    return { action: 'deny' };
}

// ---------------------------------------------------------------------------
// Tray
// ---------------------------------------------------------------------------

// 16×16 PNG fallback so the tray slot isn't blank if the icon file is missing.
const TRAY_FALLBACK_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAi0lEQVR42q2TwQ3AIAhFnYAR3M' +
    'ARGMERHIENGMERHCGuwAh+Q5MmprHmS96FwHsJEgAcgAjwAobxAjbAAGS8gKM0+gI24AKsm9' +
    '4XUC95NUqf6QssrwaIAU6T1Ml4AVVS+QJWFHwBVvSFL7BVfYHX6QtolHwBjZIvoFHyBTRKvo' +
    'BG2ReYBKzAA0gATsLpA2nZAAAAAElFTkSuQmCC',
    'base64'
);

function createTray() {
    let icon = nativeImage.createFromPath(getIconPath());
    if (icon.isEmpty()) icon = nativeImage.createFromBuffer(TRAY_FALLBACK_PNG);

    tray = new Tray(icon);
    tray.setToolTip('TikFinity');
    refreshTrayMenu();
    tray.on('double-click', () => mainWindow ? mainWindow.show() : createMainWindow());
}

function refreshTrayMenu() {
    if (!tray) return;
    const who = currentAuth?.username || currentAuth?.keyId || null;
    const items = [
        { label: 'Hiện cửa sổ', click: () => mainWindow ? mainWindow.show() : createMainWindow() },
        { type: 'separator' }
    ];
    if (who) {
        items.push({ label: `Đã đăng nhập: ${who}`, enabled: false });
        // Show days remaining if we know the expiry.
        if (currentAuth?.expiresAt) {
            const exp = Date.parse(currentAuth.expiresAt);
            if (Number.isFinite(exp)) {
                const daysLeft = Math.max(0, Math.ceil((exp - Date.now()) / (1000 * 60 * 60 * 24)));
                const expiryLabel = daysLeft <= 0
                    ? '⏰ Key đã hết hạn'
                    : daysLeft <= 7
                        ? `⚠️ Còn ${daysLeft} ngày — sắp hết hạn`
                        : `Còn ${daysLeft} ngày`;
                items.push({ label: expiryLabel, enabled: false });
            }
        }
        items.push({
            label: 'Đăng xuất',
            click: async () => {
                const { response } = await dialog.showMessageBox({
                    type: 'question',
                    buttons: ['Đăng xuất', 'Hủy'],
                    defaultId: 1,
                    cancelId: 1,
                    title: 'TikFinity',
                    message: 'Đăng xuất khỏi ứng dụng?',
                    detail: 'Bạn sẽ phải nhập lại Serial Key để dùng tiếp.'
                });
                if (response === 0) {
                    performLogout();
                }
            }
        });
        items.push({ type: 'separator' });
    }
    items.push({ label: 'Khởi động lại backend', click: () => { stopBackend(); startBackend(); } });
    items.push({ type: 'separator' });
    items.push({ label: 'Thoát', click: () => { isQuitting = true; app.quit(); } });
    tray.setContextMenu(Menu.buildFromTemplate(items));
}

// ---------------------------------------------------------------------------
// Live-status polling — drives isLive UI badge + powerSaveBlocker.
// ---------------------------------------------------------------------------

function startLivePolling() {
    if (liveStatusTimer) return;
    liveStatusTimer = setInterval(pollLiveStatus, LIVE_POLL_INTERVAL_MS);
    pollLiveStatus();
}

function pollLiveStatus() {
    const req = http.get(BACKEND_STATUS, res => {
        let buf = '';
        res.on('data', d => buf += d);
        res.on('end', () => {
            let status;
            try { status = JSON.parse(buf); } catch { return; }
            const isLive = status?.connected === true;
            const roomId = status?.roomId || null;

            if (roomId && roomId !== currentRoomId) {
                currentRoomId = roomId;
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('newRoomIdDetected', { roomId });
                }
            }

            if (isLive) {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('isLiveDetected', { roomId });
                }
                if (powerSaveBlockerId === null) {
                    try { powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension'); }
                    catch (e) { console.warn('[powerSaveBlocker] start:', e.message); }
                }
            } else if (powerSaveBlockerId !== null) {
                try { powerSaveBlocker.stop(powerSaveBlockerId); }
                catch { /* already stopped */ }
                powerSaveBlockerId = null;
            }
        });
    });
    req.on('error', () => { /* backend not reachable yet — silent */ });
    req.setTimeout(3000, () => req.destroy());
}

// ---------------------------------------------------------------------------
// Process priority (Windows) — reduces gift-animation jitter.
// ---------------------------------------------------------------------------

function setHighPriority() {
    if (!isWin) return;
    const exeName = path.basename(process.execPath);
    exec(
        `wmic process where name="${exeName}" CALL setpriority "high priority"`,
        (err) => {
            if (err) console.warn('[Electron] WMIC priority failed:', err.message);
            else console.log('[Electron] Process priority set to high');
        }
    );
}

// ---------------------------------------------------------------------------
// PowerShell exec — exposed via window.API.toMain({ action: 'execPsCommand' }).
// ---------------------------------------------------------------------------

function execPsCommand(command, returnResult) {
    if (!isWin || !command) return;
    const { stdout, stderr, status } = spawnSync('powershell', ['-NoProfile', '-Command', command]);
    if (returnResult && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('execPsCommandResult', {
            command,
            stdout: stdout ? stdout.toString() : '',
            stderr: stderr ? stderr.toString() : '',
            status
        });
    }
    if (status !== 0 && stderr && stderr.toString()) {
        console.warn('[PS] error:', stderr.toString().trim());
    }
}

// ---------------------------------------------------------------------------
// IPC bridge — window.API.toMain(...)
// ---------------------------------------------------------------------------

ipcMain.handle('toMain', async (_evt, data) => {
    if (!data || typeof data !== 'object') return;

    switch (data.action) {
        case 'fetchUrl':
            return await handleFetchUrl(data);

        case 'setUniqueId':
            currentUniqueId = data.uniqueId || null;
            console.log('[ipc] setUniqueId', currentUniqueId);
            break;

        case 'setChannelId':
            currentChannelId = data.channelId || null;
            console.log('[ipc] setChannelId', currentChannelId);
            break;

        case 'execPsCommand':
            execPsCommand(data.command, data.returnResult);
            break;

        case 'execAutoItCommand':
            // AutoIt automation isn't shipped — tell renderer so it can show install prompt.
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('autoItNotInstalled', {});
            }
            break;

        case 'initKeyboardListener':
            // Native global keyboard hook isn't shipped with the clone yet.
            console.log('[ipc] initKeyboardListener — not implemented');
            break;

        case 'emitWs':
            if (dapi) dapi.broadcast(data.payload);
            break;

        case 'sendBrowserLog':
        case 'onFeatureFlags':
            // Accepted, no-op (cloud-only telemetry from the original app).
            break;

        default:
            console.warn('[ipc] unknown toMain action:', data.action);
    }
});

async function handleFetchUrl(data) {
    try {
        const url = data.url;
        if (!url) throw new Error('fetchUrl: missing url');
        const lib = url.startsWith('https:') ? https : http;
        const reqOpts = {
            method: data.method || 'GET',
            headers: { ...(data.headers || {}) }
        };
        let body = null;
        if (data.data !== undefined && data.data !== null) {
            body = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
            if (!reqOpts.headers['Content-Type'] && !reqOpts.headers['content-type']) {
                reqOpts.headers['Content-Type'] = 'application/json';
            }
        }
        const responseData = await new Promise((resolve, reject) => {
            const req = lib.request(url, reqOpts, res => {
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => {
                    const buf = Buffer.concat(chunks).toString('utf-8');
                    const ct = (res.headers['content-type'] || '').toLowerCase();
                    let parsed = buf;
                    if (ct.includes('application/json')) {
                        try { parsed = JSON.parse(buf); } catch { /* keep raw */ }
                    }
                    resolve({ status: res.statusCode, data: parsed });
                });
            });
            req.on('error', reject);
            req.setTimeout(30000, () => { req.destroy(new Error('Request timeout')); });
            if (body) req.write(body);
            req.end();
        });
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('fetchUrlResponse', {
                requestId: data.requestId,
                responseData: responseData.data,
                responseCode: responseData.status
            });
        }
    } catch (err) {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('fetchUrlResponse', {
                requestId: data.requestId,
                error: err.toString()
            });
        }
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getIconPath() {
    const ico = path.join(__dirname, 'icon.ico');
    const png = path.join(__dirname, 'icon.png');
    if (isWin && fs.existsSync(ico)) return ico;
    if (fs.existsSync(png)) return png;
    return ico; // Electron will fall back gracefully if neither exists.
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
