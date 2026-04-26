/**
 * TikTok LIVE Bridge v2 - connects to TikTok LIVE using tiktok-live-connector v2
 * Communicates with C# backend via WebSocket on port 5286.
 */

const { TikTokLiveConnection } = require('tiktok-live-connector');
const { WebSocketServer } = require('ws');

const PREFERRED_PORT = parseInt(process.env.BRIDGE_PORT || '5288', 10);
const CONNECT_TIMEOUT_MS = parseInt(process.env.TIKTOK_CONNECT_TIMEOUT_MS || '30000', 10);
const MAX_CONNECT_RETRIES = parseInt(process.env.TIKTOK_MAX_RETRIES || '1', 10);

let currentConnection = null;
let currentUsername = null;
let backendWs = null;

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
    if (currentConnection) await disconnectFromTikTok();

    currentUsername = username;
    console.log(`[TikTok Bridge] Connecting to @${username}...`);
    sendToBackend({ event: 'connecting', data: { username } });

    // Retry wrapper — WebSocket "Unexpected server response: 200" is often transient
    // (Euler signing service rate limit or temporary failure)
    let lastError = null;
    for (let attempt = 1; attempt <= MAX_CONNECT_RETRIES; attempt++) {
        console.log(`[TikTok Bridge] Attempt ${attempt}/${MAX_CONNECT_RETRIES} for @${username}...`);
        const result = await tryConnect(username, options, attempt);
        if (result.success) return; // Connected!
        lastError = result.error;
        if (attempt < MAX_CONNECT_RETRIES) {
            console.log(`[TikTok Bridge] Retrying in 2s...`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    // All retries failed
    console.error(`[TikTok Bridge] All ${MAX_CONNECT_RETRIES} attempts failed for @${username}:`, lastError);
    currentConnection = null; currentUsername = null;
    sendToBackend({ event: 'connectFailed', data: { username, message: lastError || 'Connection failed after retries' } });
}

async function tryConnect(username, options, attempt) {
    if (currentConnection) {
        try { currentConnection.disconnect(); } catch (e) { }
        currentConnection = null;
    }

    const connection = new TikTokLiveConnection(username, {
        processInitialData: true,
        enableExtendedGiftInfo: true,
        fetchRoomInfoOnConnect: true,
        enableRequestPolling: true,  // Fallback to HTTP polling if WebSocket fails
        requestPollingIntervalMs: 2000,
        webClientOptions: { timeout: 15000 },
        wsClientOptions: { timeout: 15000 },
        ...(options.sessionId ? { sessionId: options.sessionId } : {}),
        ...(process.env.SIGN_API_KEY ? { signApiKey: process.env.SIGN_API_KEY } : {})
    });
    currentConnection = connection;
    let connectTimedOut = false;
    let connectTimeoutHandle = null;

    // --- Connection events ---
    connection.on('connected', (state) => {
        if (connectTimeoutHandle) {
            clearTimeout(connectTimeoutHandle);
            connectTimeoutHandle = null;
        }
        if (connectTimedOut) {
            try { connection.disconnect(); } catch (e) { }
            return;
        }
        console.log(`[TikTok Bridge] Connected to @${username} (roomId: ${state.roomId})`);
        sendToBackend({ event: 'connected', data: { username, roomId: state.roomId, roomInfo: state.roomInfo || {} } });
    });

    connection.on('disconnected', () => {
        console.log(`[TikTok Bridge] Disconnected from @${username}`);
        currentConnection = null; currentUsername = null;
        sendToBackend({ event: 'disconnected', data: { username, reason: 'disconnected' } });
    });

    connection.on('error', (err) => {
        var msg = shortenConnectError(err, username);
        console.error(`[TikTok Bridge] Error:`, err && err.code, err && err.message);
        sendToBackend({ event: 'error', data: { message: msg, username } });
    });

    connection.on('streamEnd', (actionId) => {
        console.log(`[TikTok Bridge] Stream ended for @${username}`);
        currentConnection = null; currentUsername = null;
        sendToBackend({ event: 'streamEnd', data: { username, actionId } });
    });

    // --- Live events (v2 data format: user info in data.user) ---
    connection.on('chat', (data) => {
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
        var u = getUser(data);
        sendToBackend({ event: 'member', data: { uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl, actionId: data.actionId } });
    });

    connection.on('roomUser', (data) => {
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
    connection.on('websocketConnected', () => console.log('[TikTok Bridge] WebSocket upgraded'));

    // --- Connect ---
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
        console.log(`[TikTok Bridge] Successfully connected. Room: ${state.roomId}, Viewers: ${state.viewerCount || 0}`);
        return { success: true };
    } catch (err) {
        if (connectTimeoutHandle) {
            clearTimeout(connectTimeoutHandle);
            connectTimeoutHandle = null;
        }
        console.error(`[TikTok Bridge] Attempt failed:`, err && err.code, err && err.message);
        try { connection.disconnect(); } catch (e) { }
        return { success: false, error: shortenConnectError(err, username) };
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
 * Reduce an axios/Euler error into a short, user-friendly message.
 * Raw errors contain the full request config and serialize into a
 * multi-line JSON blob that used to get rendered straight into the UI.
 */
function shortenConnectError(err, username) {
    if (!err) return 'Connection failed';
    var code = err.code || (err.cause && err.cause.code) || '';
    var status = (err.response && err.response.status) || err.status || 0;
    var raw = (err && typeof err.message === 'string') ? err.message : '';

    if (/timeout|ETIMEDOUT/i.test(code) || /timeout/i.test(raw)) {
        return 'Connection timeout — user may not be live or unreachable.';
    }
    if (code === 'ECONNRESET' || code === 'ECONNREFUSED') {
        return 'TikTok signing service refused the connection. Try again shortly.';
    }
    if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
        return 'Network error — cannot reach TikTok servers.';
    }
    if (status === 404 || /not.*found|no such user/i.test(raw)) {
        return 'TikTok user @' + (username || 'unknown') + ' not found or not live.';
    }
    if (status === 429 || /rate.?limit/i.test(raw)) {
        return 'Rate-limited by TikTok. Wait a minute and try again.';
    }
    if (status >= 500) {
        return 'TikTok service error (' + status + '). Try again shortly.';
    }

    // Fallback: one short line, no stack traces or JSON dumps.
    var firstLine = raw.split('\n')[0] || 'Connection failed';
    if (firstLine.length > 160) firstLine = firstLine.slice(0, 157) + '...';
    return firstLine;
}

process.on('SIGINT', () => { disconnectFromTikTok(); wss.close(); process.exit(0); });
process.on('SIGTERM', () => { disconnectFromTikTok(); wss.close(); process.exit(0); });
process.on('uncaughtException', (err) => console.error('[TikTok Bridge] Uncaught:', err));

} // end setupWss()
