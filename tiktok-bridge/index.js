/**
 * TikTok LIVE Bridge v2 - connects to TikTok LIVE using tiktok-live-connector v2
 * Communicates with C# backend via WebSocket on port 5286.
 */

const { TikTokLiveConnection } = require('tiktok-live-connector');
const { WebSocketServer } = require('ws');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PREFERRED_PORT = parseInt(process.env.BRIDGE_PORT || '5288', 10);
const CONNECT_TIMEOUT_MS = parseInt(process.env.TIKTOK_CONNECT_TIMEOUT_MS || '12000', 10);
const HTTP_TIMEOUT_MS = parseInt(process.env.TIKTOK_HTTP_TIMEOUT_MS || '10000', 10);
const MAX_CONNECT_RETRIES = parseInt(process.env.TIKTOK_MAX_RETRIES || '1', 10);
const PRECHECK_ENABLED = (process.env.TIKTOK_PRECHECK || '1') !== '0';

// Resolve <userData>/tiktok-session.json the same way Electron does, so the
// bridge can read the captured cookie even though it was spawned BEFORE the
// user logged in (process.env doesn't propagate retroactively to children).
//
// Override with TIKTOK_SESSION_FILE if you want to point at a custom path.
function resolveSessionFile() {
    if (process.env.TIKTOK_SESSION_FILE) return process.env.TIKTOK_SESSION_FILE;
    const productDir = 'tikfinity-desktop';   // matches electron/package.json "name"
    const fileName = 'tiktok-session.json';
    if (process.platform === 'win32' && process.env.APPDATA) {
        return path.join(process.env.APPDATA, productDir, fileName);
    }
    if (process.platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support', productDir, fileName);
    }
    return path.join(os.homedir(), '.config', productDir, fileName);
}
const SESSION_FILE = resolveSessionFile();

function readStoredSession() {
    // 1. Env vars win if set fresh by a parent.
    if (process.env.TIKTOK_SESSIONID) {
        return {
            sessionId: process.env.TIKTOK_SESSIONID,
            ttTargetIdc: process.env.TIKTOK_TT_TARGET_IDC || null
        };
    }
    // 2. Fall back to the cookie file written by electron's tiktok-signin
    //    flow. Read fresh every connect so a re-login is picked up without
    //    restarting the bridge.
    try {
        if (!fs.existsSync(SESSION_FILE)) return null;
        const raw = fs.readFileSync(SESSION_FILE, 'utf-8');
        const data = JSON.parse(raw);
        if (data && typeof data.sessionId === 'string' && data.sessionId.length >= 8) {
            // Best-effort expiry check.
            if (data.expiresAt) {
                const exp = Date.parse(data.expiresAt);
                if (Number.isFinite(exp) && exp <= Date.now()) return null;
            }
            return { sessionId: data.sessionId, ttTargetIdc: data.ttTargetIdc || null };
        }
    } catch (err) {
        console.warn('[TikTok Bridge] readStoredSession failed:', err.message);
    }
    return null;
}

// Backwards-compat shim used by older callers.
function readStoredSessionId() {
    const s = readStoredSession();
    return s ? s.sessionId : null;
}

let currentConnection = null;
let currentUsername = null;
let backendWs = null;

// Surface uncaught errors as connectFailed so the backend watchdog and
// frontend popup get a clear message instead of waiting on silence.
process.on('uncaughtException', (err) => {
    const msg = (err && err.message) || String(err);
    console.error('[TikTok Bridge] uncaughtException:', err && err.stack || msg);
    if (backendWs && backendWs.readyState === 1) {
        try {
            backendWs.send(JSON.stringify({
                event: 'connectFailed',
                data: { username: currentUsername || '', message: 'Bridge error: ' + msg, reason: 'UNCAUGHT' }
            }));
        } catch (e) { /* ignore */ }
    }
});
process.on('unhandledRejection', (reason) => {
    const msg = (reason && reason.message) || String(reason);
    console.error('[TikTok Bridge] unhandledRejection:', reason && reason.stack || msg);
});

// --- WebSocket server (try preferred port, fallback to OS-assigned) ---
function startWss(port) {
    return new Promise((resolve, reject) => {
        const server = new WebSocketServer({ port, host: '127.0.0.1' });
        server.on('listening', () => resolve(server));
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE' && port !== 0) {
                console.log(`[TikTok Bridge] Port ${port} busy, trying random port...`);
                resolve(startWss(0));
            } else {
                reject(err);
            }
        });
    });
}

let wss;
let PORT;
(async () => {
    wss = await startWss(PREFERRED_PORT);
    PORT = wss.address().port;
    console.log(`[TikTok Bridge] WebSocket server listening on ws://127.0.0.1:${PORT}`);
    setupWss();
})();

function setupWss() {

wss.on('connection', (ws) => {
    console.log('[TikTok Bridge] Backend connected');
    if (backendWs && backendWs !== ws && backendWs.readyState <= 1) {
        try { backendWs.close(); } catch (e) { }
    }
    backendWs = ws;
    sendToBackend({ event: 'bridgeStatus', data: { connected: !!currentConnection, username: currentUsername } });

    ws.on('message', (raw) => {
        try { handleCommand(JSON.parse(raw.toString())); }
        catch (e) { console.error('[TikTok Bridge] Invalid message:', e.message); }
    });
    ws.on('close', () => { if (backendWs === ws) backendWs = null; });
    ws.on('error', (err) => console.error('[TikTok Bridge] WS error:', err.message));
});

function sendToBackend(msg) {
    if (backendWs && backendWs.readyState === 1) backendWs.send(JSON.stringify(msg));
}

// --- Command handler ---
function handleCommand(msg) {
    if (msg.action === 'connect') connectToTikTok(msg.username, msg.options || {});
    else if (msg.action === 'disconnect') disconnectFromTikTok();
    else if (msg.action === 'status') sendToBackend({ event: 'bridgeStatus', data: { connected: !!currentConnection, username: currentUsername } });
}

// Helper: extract user info from v2 event data (handles both v1 and v2 formats)
function getPreferredPic(picUrls) {
    if (!Array.isArray(picUrls) || !picUrls.length) return '';
    return picUrls.find(x => x.includes('100x100') && x.includes('.webp'))
        || picUrls.find(x => x.includes('100x100') && x.includes('.jpeg'))
        || picUrls.find(x => x.includes('100x100'))
        || picUrls[0];
}
function getUser(data) {
    var user = data.user || data;
    // v2 format: profilePicture.url is array; v1/legacy: profilePictureUrl is string
    var profilePictureUrl = '';
    if (user.profilePicture && Array.isArray(user.profilePicture.url)) {
        profilePictureUrl = getPreferredPic(user.profilePicture.url);
    } else if (user.profilePictureUrl) {
        profilePictureUrl = user.profilePictureUrl;
    }
    return {
        uniqueId: user.uniqueId || '',
        nickname: user.nickname || '',
        userId: (user.userId || '').toString(),
        profilePictureUrl: profilePictureUrl || ''
    };
}

// --- Connect to TikTok LIVE ---
async function connectToTikTok(username, options = {}) {
    if (!username) { sendToBackend({ event: 'error', data: { message: 'Username is required' } }); return; }

    // If we're already connected to the same user, don't tear down and rebuild —
    // just re-emit a "connected" event so the (possibly reloaded) backend knows
    // we're already live. Forcing a disconnect/reconnect here is what made
    // Ctrl+Shift+R trigger missingExtension: the active session got dropped,
    // and the fresh attempt has to re-sign via eulerstream which often fails.
    var normalized = String(username).trim().replace(/^@/, '');
    if (currentConnection && currentUsername && currentUsername.toLowerCase() === normalized.toLowerCase()) {
        console.log('[TikTok Bridge] connectToTikTok called for already-connected user @' + normalized + ' — skipping reconnect');
        try {
            sendToBackend({ event: 'connected', data: {
                username: currentUsername,
                roomId: (currentConnection.state && currentConnection.state.roomId) || '',
                roomInfo: (currentConnection.state && currentConnection.state.roomInfo) || {}
            }});
        } catch (err) {
            console.warn('[TikTok Bridge] re-emit connected failed:', err && err.message);
        }
        return;
    }

    if (currentConnection) await disconnectFromTikTok();

    // Pull a TikTok session cookie from env or the on-disk file written by
    // the electron tiktok-signin flow. Either path lets the connector skip
    // the public signing service (Eulerstream free tier rate-limit, IP
    // reputation issues) and reuse the user's authenticated browser
    // session — same cleaner path that tikfinity.zerody.one's cloud takes
    // server-side.
    if (!options.sessionId) {
        const stored = readStoredSession();
        if (stored && stored.sessionId) {
            options = {
                ...options,
                sessionId: stored.sessionId,
                ttTargetIdc: stored.ttTargetIdc || options.ttTargetIdc
            };
            console.log('[TikTok Bridge] Using stored sessionId (len ' + stored.sessionId.length
                + ', tt-target-idc=' + (stored.ttTargetIdc ? 'present' : 'missing')
                + ', source: ' + (process.env.TIKTOK_SESSIONID ? 'env' : SESSION_FILE) + ')');
        }
    }

    currentUsername = username;
    console.log(`[TikTok Bridge] Connecting to @${username}...`);
    sendToBackend({ event: 'connecting', data: { username } });

    // Pre-check: hit TikTok's public live-status API to see if the user is actually
    // streaming. Saves users from waiting the full 12s only to find out their
    // account isn't live. Only fail-fast on a CONCLUSIVE answer — anything
    // ambiguous (parse error, missing fields, network glitch) falls through to
    // the real connect, since the public API often returns junk for valid users.
    if (PRECHECK_ENABLED) {
        const status = await checkLiveStatus(username);
        if (status.blocked) {
            console.warn(`[TikTok Bridge] Pre-check blocked: ${status.error}`);
            currentConnection = null; currentUsername = null;
            sendToBackend({ event: 'connectFailed', data: {
                username,
                message: 'TikTok đang chặn IP của bạn (HTTP 403). Hãy TẮT Cloudflare WARP / VPN rồi thử lại.',
                reason: 'IP_BLOCKED'
            }});
            return;
        }
        if (status.conclusive && status.userExists === false) {
            console.log(`[TikTok Bridge] @${username} does not exist on TikTok.`);
            currentConnection = null; currentUsername = null;
            sendToBackend({ event: 'connectFailed', data: {
                username,
                message: `Không tìm thấy tài khoản @${username} trên TikTok.`,
                reason: 'USER_NOT_FOUND'
            }});
            return;
        }
        if (status.conclusive && status.userExists && status.isLive === false) {
            console.log(`[TikTok Bridge] @${username} is offline (status=${status.statusCode}).`);
            currentConnection = null; currentUsername = null;
            sendToBackend({ event: 'connectFailed', data: {
                username,
                message: `Kênh @${username} đang offline. Hãy bật LIVE rồi bấm Connect lại.`,
                reason: 'NOT_LIVE'
            }});
            return;
        }
        if (status.conclusive && status.isLive) {
            console.log(`[TikTok Bridge] Pre-check OK — @${username} is live (roomId=${status.roomId}).`);
        } else {
            console.warn(`[TikTok Bridge] Pre-check inconclusive (${status.error || 'unknown'}). Falling through to full connect.`);
        }
    }

    // Retry wrapper — WebSocket "Unexpected server response: 200" is often transient
    // (Euler signing service rate limit or temporary failure)
    let lastError = null;
    let lastReason = null;
    for (let attempt = 1; attempt <= MAX_CONNECT_RETRIES; attempt++) {
        console.log(`[TikTok Bridge] Attempt ${attempt}/${MAX_CONNECT_RETRIES} for @${username}...`);
        const result = await tryConnect(username, options, attempt);
        if (result.success) return; // Connected!
        lastError = result.error;
        lastReason = result.reason;

        // Skip retry for unrecoverable failures — keeps the UI from flickering
        // through connecting → failed → connecting → failed.
        if (lastReason === 'RATE_LIMIT' || lastReason === 'NOT_LIVE' || lastReason === 'NOT_FOUND') {
            console.log(`[TikTok Bridge] Skipping retry for terminal reason: ${lastReason}`);
            break;
        }

        if (attempt < MAX_CONNECT_RETRIES) {
            console.log(`[TikTok Bridge] Retrying in 2s...`);
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    // All retries failed
    console.error(`[TikTok Bridge] All ${MAX_CONNECT_RETRIES} attempts failed for @${username}:`, lastError);
    currentConnection = null; currentUsername = null;
    sendToBackend({ event: 'connectFailed', data: {
        username,
        message: lastError || 'Connection failed after retries',
        reason: lastReason || 'UNKNOWN'
    }});
}

/**
 * Quick pre-check via TikTok's public api-live endpoint. Returns:
 *   { reachable, isLive, statusCode, roomId, error }
 *
 * status === 2 → user is currently live, status === 3 → paused, others → not live.
 */
function checkLiveStatus(username) {
    return new Promise((resolve) => {
        const url = `https://www.tiktok.com/api-live/user/room/?aid=1988&sourceType=54&uniqueId=${encodeURIComponent(username)}`;
        const opts = {
            timeout: 5000,
            // Cloudflare WARP / corporate proxies inject their own root CA — Node won't
            // trust it by default. Pre-check is a low-risk read so we relax this here.
            // The full TikTok WebSocket connection still uses default TLS via the
            // tiktok-live-connector lib.
            rejectUnauthorized: false,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                'Accept': 'application/json,text/html,*/*;q=0.9',
                'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8'
            }
        };
        const req = https.get(url, opts, (res) => {
            let body = '';
            res.on('data', (c) => body += c);
            res.on('end', () => {
                // 403/451 = TikTok blocked the IP (Cloudflare WARP / VPN / region).
                if (res.statusCode === 403 || res.statusCode === 451) {
                    resolve({ reachable: false, conclusive: false, blocked: true, error: `HTTP ${res.statusCode}` });
                    return;
                }
                try {
                    const json = JSON.parse(body);
                    const user = json?.data?.user;
                    // No user object → response shape changed or rate-limited HTML body.
                    // Treat as inconclusive so we still try the full connect.
                    if (!user) {
                        resolve({ reachable: true, conclusive: false, error: 'no user object in response' });
                        return;
                    }
                    // user.status: 2 / 3 = LIVE. 4 = ended. 0 / undefined = offline.
                    // Some accounts also surface a non-zero roomId while offline,
                    // so trust `status` first and use roomId as a secondary signal.
                    const statusCode = user.status;
                    const roomId = user.roomId;
                    const isLive = statusCode === 2 || statusCode === 3;
                    const userExists = Boolean(user.uniqueId || user.id);
                    resolve({ reachable: true, conclusive: true, userExists, isLive, statusCode, roomId });
                } catch (err) {
                    // Body wasn't JSON (TikTok sometimes returns an HTML page).
                    // Inconclusive — fall through, don't block the user from connecting.
                    resolve({ reachable: true, conclusive: false, error: 'parse: ' + err.message });
                }
            });
        });
        req.on('error', (err) => resolve({
            reachable: false,
            conclusive: false,
            error: err.message,
            blocked: /unable to verify|self.signed|cert/i.test(err.message)
        }));
        req.on('timeout', () => { req.destroy(); resolve({ reachable: false, conclusive: false, error: 'timeout' }); });
    });
}

async function tryConnect(username, options, attempt) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`[TRY CONNECT] attempt=${attempt} username=@${username}`);
    console.log(`[TRY CONNECT] options.sessionId      = ${options.sessionId ? 'present(len=' + options.sessionId.length + ')' : 'MISSING'}`);
    console.log(`[TRY CONNECT] options.ttTargetIdc    = ${options.ttTargetIdc || 'MISSING'}`);
    console.log(`[TRY CONNECT] env.TIKTOK_SESSIONID   = ${process.env.TIKTOK_SESSIONID ? 'present' : 'MISSING'}`);
    console.log(`[TRY CONNECT] env.TIKTOK_TT_TARGET_IDC = ${process.env.TIKTOK_TT_TARGET_IDC || 'MISSING'}`);
    console.log(`[TRY CONNECT] env.SIGN_API_KEY       = ${process.env.SIGN_API_KEY ? 'present' : 'MISSING (free Eulerstream)'}`);
    console.log(`[TRY CONNECT] CONNECT_TIMEOUT_MS     = ${CONNECT_TIMEOUT_MS}`);
    console.log('═══════════════════════════════════════════════════════════');

    if (currentConnection) {
        try { currentConnection.disconnect(); } catch (e) { }
        currentConnection = null;
    }

    // Library v2 throws synchronously inside the constructor for things like
    // "tt-target-idc is required when sessionId is set". Catch it here and
    // surface as a normal connectFailed result instead of crashing tryConnect.
    let connection;
    try {
        const ttTargetIdc = options.ttTargetIdc || process.env.TIKTOK_TT_TARGET_IDC || null;
        const useSession = options.sessionId && ttTargetIdc;
        console.log(`[TRY CONNECT] useSession = ${useSession} (sessionId+ttTargetIdc both present? ${useSession ? 'YES → skip Eulerstream' : 'NO → using Eulerstream public signing'})`);
        if (options.sessionId && !ttTargetIdc) {
            console.warn('[TRY CONNECT] WARNING: sessionId set but no tt-target-idc — skipping sessionId, falling back to public signing.');
        }
        // enableExtendedGiftInfo: causes "Failed to fetch available gifts. aborted"
        //   that fails the whole connect even when WS would otherwise be fine.
        //   Default OFF — gift events still arrive with basic info.
        // fetchRoomInfoOnConnect: similar story (lib aborts the fetch on slow links).
        //   Off so connect doesn't hinge on a side-fetch.
        const ctorOpts = {
            processInitialData: true,
            enableExtendedGiftInfo: false,
            fetchRoomInfoOnConnect: false,
            enableRequestPolling: true,
            requestPollingIntervalMs: 2000,
            webClientOptions: { timeout: HTTP_TIMEOUT_MS },
            wsClientOptions: { timeout: HTTP_TIMEOUT_MS },
            ...(useSession ? { sessionId: options.sessionId, ttTargetIdc } : {}),
            ...(process.env.SIGN_API_KEY ? { signApiKey: process.env.SIGN_API_KEY } : {})
        };
        console.log('[TRY CONNECT] Constructor options keys:', Object.keys(ctorOpts).join(', '));
        connection = new TikTokLiveConnection(username, ctorOpts);
        console.log('[TRY CONNECT] ✓ Constructor succeeded');
    } catch (ctorErr) {
        const msg = (ctorErr && ctorErr.message) || String(ctorErr);
        console.error('[TRY CONNECT] ✗ Constructor THREW:', msg);
        console.error('[TRY CONNECT] Stack:', ctorErr && ctorErr.stack);
        return { success: false, error: 'Init failed: ' + msg, reason: 'INIT_FAILED' };
    }
    currentConnection = connection;
    let connectTimedOut = false;
    let connectTimeoutHandle = null;
    // tiktok-live-connector v2 sometimes rejects connect() with an AggregateError
    // even though the WebSocket is up and live events are flowing. We track
    // any inbound data event so we can treat connect as a soft success when the
    // promise rejects but data is clearly arriving.
    //   firstEventAt = timestamp of FIRST event (for soft-success detection)
    //   lastEventAt  = timestamp of LATEST event (for silence watchdog)
    let firstEventAt = 0;
    let lastEventAt = 0;
    function markEvent() {
        const now = Date.now();
        if (!firstEventAt) firstEventAt = now;
        lastEventAt = now;
    }

    // --- Connection events ---
    connection.on('connected', (state) => {
        if (connectTimeoutHandle) {
            clearTimeout(connectTimeoutHandle);
            connectTimeoutHandle = null;
        }
        if (connectTimedOut) {
            console.log('[EVENT connected] arrived AFTER timeout already fired — disconnecting');
            try { connection.disconnect(); } catch (e) { }
            return;
        }
        console.log(`[EVENT connected] ✓ @${username} roomId=${state.roomId} viewers=${state.viewerCount || 0}`);
        sendToBackend({ event: 'connected', data: { username, roomId: state.roomId, roomInfo: state.roomInfo || {} } });
    });

    connection.on('disconnected', () => {
        console.log(`[TikTok Bridge] Disconnected from @${username}`);
        currentConnection = null; currentUsername = null;
        sendToBackend({ event: 'disconnected', data: { username, reason: 'disconnected' } });
    });

    connection.on('error', (err) => {
        var msg = shortenConnectError(err, username);
        // err often is { info, exception, errors[] } in v2 — surface the human-readable bits.
        var info = err && err.info ? String(err.info) : '';
        var innerMsg = err && Array.isArray(err.errors) && err.errors[0] ? err.errors[0].message : '';
        console.error(`[TikTok Bridge] Error:`, info || msg, innerMsg ? `(${innerMsg})` : '');
        sendToBackend({ event: 'error', data: { message: msg, username } });
    });

    connection.on('streamEnd', (actionId) => {
        console.log(`[TikTok Bridge] Stream ended for @${username}`);
        currentConnection = null; currentUsername = null;
        sendToBackend({ event: 'streamEnd', data: { username, actionId } });
    });

    // --- Live events (v2 data format: user info in data.user) ---
    connection.on('chat', (data) => {
        markEvent();
        var u = getUser(data);
        sendToBackend({ event: 'chat', data: {
            uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
            comment: data.comment,
            isModerator: data.isModerator || false, isSubscriber: data.isSubscriber || false,
            followRole: data.followRole || 0, userBadges: data.userBadges || []
        }});
    });

    connection.on('gift', (data) => {
        var u = getUser(data);
        // v2: giftDetails.giftImage.url[]; v1: giftPictureUrl string
        var giftPicUrl = data.giftPictureUrl || '';
        if (!giftPicUrl && data.giftDetails?.giftImage?.url?.length) {
            giftPicUrl = data.giftDetails.giftImage.url[0];
        }
        var giftName = data.giftName || data.giftDetails?.describe || data.describe || '';
        var diamondCount = data.diamondCount || data.giftDetails?.diamondCount || 0;
        sendToBackend({ event: 'gift', data: {
            uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
            giftId: data.giftId, giftName: giftName,
            giftPictureUrl: giftPicUrl, diamondCount: diamondCount,
            repeatCount: data.repeatCount || 1, repeatEnd: data.repeatEnd || false,
            giftType: data.giftType || 1, describe: giftName
        }});
    });

    connection.on('like', (data) => {
        markEvent();
        var u = getUser(data);
        sendToBackend({ event: 'like', data: {
            uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
            likeCount: data.likeCount || 1, totalLikeCount: data.totalLikeCount || 0
        }});
    });

    connection.on('share', (data) => {
        var u = getUser(data);
        sendToBackend({ event: 'share', data: { uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl } });
    });

    connection.on('follow', (data) => {
        var u = getUser(data);
        sendToBackend({ event: 'follow', data: { uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl } });
    });

    connection.on('member', (data) => {
        markEvent();
        var u = getUser(data);
        sendToBackend({ event: 'member', data: { uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl, actionId: data.actionId } });
    });

    connection.on('roomUser', (data) => {
        markEvent();
        sendToBackend({ event: 'roomUser', data: { viewerCount: data.viewerCount || 0, topViewers: data.topViewers || [] } });
    });

    connection.on('subscribe', (data) => {
        var u = getUser(data);
        sendToBackend({ event: 'subscribe', data: { uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl, subMonth: data.subMonth || 0 } });
    });

    connection.on('emote', (data) => {
        var u = getUser(data);
        sendToBackend({ event: 'emote', data: { uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl, emoteId: data.emoteId, emoteImageUrl: data.emoteImageUrl } });
    });

    connection.on('envelope', (data) => {
        sendToBackend({ event: 'envelope', data: { coins: data.coins, canOpen: data.canOpen, timestamp: data.timestamp } });
    });

    connection.on('questionNew', (data) => {
        var u = getUser(data);
        sendToBackend({ event: 'questionNew', data: { uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl, questionText: data.questionText } });
    });

    connection.on('liveIntro', (data) => sendToBackend({ event: 'liveIntro', data }));
    connection.on('websocketConnected', () => console.log('[TRY CONNECT] ✓ WebSocket upgraded (TikTok webcast WS established)'));

    // --- Connect ---
    console.log('[TRY CONNECT] Calling connection.connect()...');
    const startTs = Date.now();
    try {
        const state = await Promise.race([
            connection.connect(),
            new Promise((_, reject) => {
                connectTimeoutHandle = setTimeout(() => {
                    connectTimedOut = true;
                    reject(new Error('Connection timeout. User may not be live or is unreachable.'));
                }, CONNECT_TIMEOUT_MS);
            })
        ]);
        if (connectTimeoutHandle) {
            clearTimeout(connectTimeoutHandle);
            connectTimeoutHandle = null;
        }
        const elapsed = Date.now() - startTs;
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`[TRY CONNECT] ✓✓✓ SUCCESS in ${elapsed}ms`);
        console.log(`[TRY CONNECT] Room ID: ${state.roomId}`);
        console.log(`[TRY CONNECT] Viewers: ${state.viewerCount || 0}`);
        console.log(`[TRY CONNECT] Title: ${(state.roomInfo && state.roomInfo.title) || '(none)'}`);
        console.log('═══════════════════════════════════════════════════════════');
        return { success: true };
    } catch (err) {
        if (connectTimeoutHandle) {
            clearTimeout(connectTimeoutHandle);
            connectTimeoutHandle = null;
        }
        const elapsed = Date.now() - startTs;

        // tiktok-live-connector v2 oddity: connect() rejects with an empty
        // AggregateError even when the WebSocket is alive and live events
        // are streaming. If we already received events (chat/like/roomUser/
        // member), the WS is good — treat this as a SOFT SUCCESS and emit
        // the connected event manually so the rest of the pipeline runs.
        if (firstEventAt && (Date.now() - firstEventAt) < 10000) {
            console.log('═══════════════════════════════════════════════════════════');
            console.log(`[TRY CONNECT] ⚡ Library rejected after ${elapsed}ms BUT live events flowed`);
            console.log(`[TRY CONNECT] First event at +${firstEventAt - startTs}ms — treating as SOFT SUCCESS`);
            console.log('═══════════════════════════════════════════════════════════');
            // Fire `connected` to backend manually since the library's own
            // `connected` event may have been swallowed by the rejected init.
            sendToBackend({ event: 'connected', data: { username, roomId: 'unknown', roomInfo: {} } });

            // Silence watchdog: lib internally tears down after rejecting, so
            // events may stop flowing after a short burst. Track latest event
            // time; if we go 60s without ANY data event, surface a disconnect
            // so the UI/bundle can re-issue connect (debounce allows it after 8s).
            const silenceCheck = setInterval(() => {
                if (currentConnection !== connection) { clearInterval(silenceCheck); return; }
                const silentMs = Date.now() - (lastEventAt || firstEventAt);
                if (silentMs > 60000) {
                    console.warn(`[SOFT SUCCESS] Silence detected — no event for ${Math.round(silentMs/1000)}s, marking disconnected`);
                    clearInterval(silenceCheck);
                    try { connection.disconnect(); } catch (e) { }
                    currentConnection = null; currentUsername = null;
                    sendToBackend({ event: 'disconnected', data: { username, reason: 'silence-watchdog' } });
                }
            }, 15000);

            return { success: true, soft: true };
        }

        var info = err && err.info ? String(err.info) : '';
        var innerMsg = err && Array.isArray(err.errors) && err.errors[0] ? err.errors[0].message : (err && err.message) || '';
        var allText = info + ' ' + innerMsg;
        // Classify so caller can skip retry for terminal failures.
        var reason = 'UNKNOWN';
        if (/rate.?limit|too many connections/i.test(allText)) reason = 'RATE_LIMIT';
        else if (/not.found|no such user/i.test(allText)) reason = 'NOT_FOUND';
        else if (/not.live|user.*not.*live/i.test(allText)) reason = 'NOT_LIVE';
        else if (/missing.*extension/i.test(allText)) reason = 'MISSING_EXTENSION';
        else if (/timeout/i.test(allText)) reason = 'TIMEOUT';

        console.error('═══════════════════════════════════════════════════════════');
        console.error(`[TRY CONNECT] ✗✗✗ FAILED in ${elapsed}ms`);
        console.error(`[TRY CONNECT] reason  = ${reason}`);
        console.error(`[TRY CONNECT] info    = ${info || '(none)'}`);
        console.error(`[TRY CONNECT] innerMsg= ${innerMsg || '(none)'}`);
        if (err && Array.isArray(err.errors)) {
            err.errors.forEach((e, i) => console.error(`[TRY CONNECT] errors[${i}] = ${e && e.message || String(e)}`));
        }
        if (err && err.exception) console.error('[TRY CONNECT] exception =', err.exception);
        console.error('═══════════════════════════════════════════════════════════');
        try { connection.disconnect(); } catch (e) { }
        return { success: false, error: shortenConnectError(err, username), reason };
    }
}

async function disconnectFromTikTok() {
    if (currentConnection) {
        try { currentConnection.disconnect(); } catch (e) { }
        currentConnection = null; currentUsername = null;
        sendToBackend({ event: 'disconnected', data: { reason: 'user_disconnect' } });
    }
}

/**
 * Reduce an axios/Euler/AggregateError into a short, user-friendly message.
 * tiktok-live-connector v2 wraps multiple fetch attempts in AggregateError —
 * we unwrap to the first underlying cause so users see something actionable.
 */
function shortenConnectError(err, username) {
    if (!err) return 'Connection failed';

    // tiktok-live-connector v2 uses AggregateError-like shape: { info, exception, errors[] }
    var info = (err && err.info) ? String(err.info) : '';
    var inner = null;
    if (Array.isArray(err.errors) && err.errors.length > 0) {
        inner = err.errors[0];
    } else if (err.exception) {
        inner = err.exception;
    }
    var innerMsg = (inner && typeof inner.message === 'string') ? inner.message : '';
    var innerCode = inner && inner.code;
    var innerStatus = inner && inner.response && inner.response.status;

    var code = err.code || innerCode || (err.cause && err.cause.code) || '';
    var status = (err.response && err.response.status) || innerStatus || err.status || 0;
    var raw = innerMsg || (err && typeof err.message === 'string' ? err.message : '') || info;

    // Friendliest case: "Failed to retrieve Room ID from all sources" → user not live or TikTok blocked.
    if (/retrieve room id|fetchRoomId/i.test(info) || /retrieve room id/i.test(raw)) {
        return `@${username || 'user'} không đang LIVE, hoặc TikTok đang chặn truy cập từ máy bạn. Thử bật stream rồi connect lại, hoặc cài SIGN_API_KEY (Euler signing).`;
    }
    if (/timeout|ETIMEDOUT/i.test(code) || /timeout/i.test(raw)) {
        return 'Quá thời gian chờ — TikTok không phản hồi. Có thể user chưa live hoặc TikTok đang chặn từ IP của bạn.';
    }
    if (code === 'ECONNRESET' || code === 'ECONNREFUSED') {
        return 'TikTok signing service từ chối kết nối. Đợi vài giây rồi thử lại.';
    }
    if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
        return 'Lỗi mạng — không tới được server TikTok. Kiểm tra Internet/DNS.';
    }
    if (status === 404 || /not.*found|no such user/i.test(raw)) {
        return `Không tìm thấy user @${username || 'unknown'} hoặc user chưa live.`;
    }
    if (status === 429 || /rate.?limit/i.test(raw)) {
        return 'Bị TikTok rate-limit. Đợi 1-2 phút rồi thử lại.';
    }
    if (status >= 500) {
        return `TikTok lỗi service (HTTP ${status}). Thử lại sau ít phút.`;
    }

    // Fallback: combine info + first line of raw — but de-duplicate when both
    // halves carry the same text (e.g. info="Error while connecting",
    // raw="Error while connecting" → don't render "Error while connecting:
    // Error while connecting").
    var firstLine = (raw || '').split('\n')[0].trim();
    var infoTrim = (info || '').trim();
    var combined;
    if (infoTrim && firstLine && infoTrim.toLowerCase() !== firstLine.toLowerCase()) {
        combined = infoTrim + ': ' + firstLine;
    } else {
        combined = infoTrim || firstLine;
    }
    if (!combined) combined = 'Connection failed';
    if (combined.length > 200) combined = combined.slice(0, 197) + '...';
    return combined;
}

process.on('SIGINT', () => { disconnectFromTikTok(); wss.close(); process.exit(0); });
process.on('SIGTERM', () => { disconnectFromTikTok(); wss.close(); process.exit(0); });
process.on('uncaughtException', (err) => console.error('[TikTok Bridge] Uncaught:', err));

} // end setupWss()
