// Desktop API WebSocket server.
//
// Mirrors the local TikFinity/Zerody behaviour: third-party plugins (Streamerbot,
// custom bots, OBS extensions) connect to 127.0.0.1:21213 to receive TikTok events
// and send commands back. The renderer-side bundle expects this socket to exist
// and exposes a "Plugin Status" panel based on its connected-client count.

let WSServer = null;
try {
    ({ WebSocketServer: WSServer } = require('ws'));
} catch (err) {
    // `ws` module not installed yet — start() will warn and skip.
}

let wss = null;
let onConnect = null;

function start({ port = 21213, host = '127.0.0.1', onConnection } = {}) {
    if (wss) return wss;
    if (!WSServer) {
        console.warn(`[DAPI] 'ws' module not installed — Desktop API server disabled. Run 'npm install' inside electron/.`);
        return null;
    }
    onConnect = onConnection;
    try {
        wss = new WSServer({ host, port });
        wss.on('connection', (ws) => {
            console.log(`[DAPI] client connected; total=${wss.clients.size}`);
            if (typeof onConnect === 'function') {
                try { onConnect(ws); } catch (e) { console.error('[DAPI] onConnection threw:', e); }
            }
            ws.on('close', () => {
                // [GUARD-2026-06-05] on app shutdown wss is nulled but a pending conn's
                // 'close' still fires → `wss.clients` threw uncaughtException. Null-safe.
                console.log(`[DAPI] client disconnected; total=${(wss && wss.clients) ? wss.clients.size : 0}`);
            });
            ws.on('error', (e) => console.error('[DAPI] client error:', e.message));
        });
        wss.on('error', (err) => console.error('[DAPI] server error:', err.message));
        console.log(`[DAPI] WebSocket server listening on ${host}:${port}`);
    } catch (err) {
        console.error(`[DAPI] failed to bind ${host}:${port}:`, err.message);
        wss = null;
    }
    return wss;
}

function broadcast(payload) {
    if (!wss) return 0;
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    let sent = 0;
    for (const client of wss.clients) {
        if (client.readyState === 1) {
            try { client.send(data); sent++; } catch { /* socket dropped mid-send */ }
        }
    }
    return sent;
}

function getClientCount() {
    return wss ? wss.clients.size : 0;
}

function stop() {
    if (wss) {
        try { wss.close(); } catch { /* ignore */ }
        wss = null;
    }
}

module.exports = { start, broadcast, getClientCount, stop };
