// Socket.IO broadcast wrapper. Replaces backend/Services/SocketManager.cs.
//
// The C# version hand-builds Socket.IO v2 frames (`42[name, data]`) because it
// wears the WebSocket directly. On Node we have a real `socket.io` server, so
// these helpers reduce to `io.emit(...)` plus a small per-channel filter for
// the few endpoints that need targeted delivery.
//
// Connection tracking (channelId / appType) lives on the socket itself via
// `socket.data` — no separate Map needed.

const logger = require('../logger');

/** @type {import('socket.io').Server | null} */
let io = null;

/**
 * Attach the singleton Server instance. Call once from index.js after the
 * Socket.IO server is created.
 *
 * @param {import('socket.io').Server} ioServer
 */
function bind(ioServer) {
  io = ioServer;

  io.on('connection', (socket) => {
    socket.data.channelId = 0;
    socket.data.appType = '';
    logger.info(`[SocketManager] Client connected: ${socket.id} (total: ${io.engine.clientsCount})`);

    // Bundle sends `setContext` after connect with { channelId, appType }.
    socket.on('setContext', (payload) => {
      if (payload && typeof payload === 'object') {
        socket.data.channelId = Number(payload.channelId) || 0;
        socket.data.appType = String(payload.appType || '');
      }
    });

    // Bundle handshake: after Socket.IO `connect`, the renderer (main app
    // window AND every widget tab) emits `login` with `{ appType, token }`
    // and waits for `loginResult` before considering the socket usable.
    // Without responding, the bundle waits up to ~30s then logs
    // "Socket connection timeout" and refuses to render widget panes.
    //
    // We answer with the same shape the bundle expects (and the C# version
    // emitted): user + channel snapshot + widget settings bag. Pull from
    // the DB + cache so widgets boot immediately with the right defaults.
    socket.on('login', (payload, ack) => {
      handleLogin(socket, payload || {}, ack);
    });

    socket.on('channelStatus', (payload, ack) => {
      try {
        const status = buildChannelStatus(socket.data.channelId);
        if (typeof ack === 'function') ack(status);
        socket.emit('channelStatus', status);
      } catch (err) {
        logger.warn({ err }, '[SocketManager] channelStatus failed');
      }
    });

    socket.on('disconnect', (reason) => {
      logger.info(`[SocketManager] Client disconnected: ${socket.id} (${reason}) total=${io.engine.clientsCount}`);
    });
  });
}

// Build a per-channel snapshot the bundle's main window + widgets expect on
// `login`. Mirrors C# SocketManager's handshake response shape.
function buildLoginPayload(channelId) {
  // Lazy-require to dodge a circular dep at module-load time. socket-manager
  // is required by tiktok-bridge, which is required by some route files;
  // requiring those models up here would loop back through `db/conn` early.
  const channels = require('../db/models/channels');
  const subscriptions = require('../db/models/subscriptions');
  const widgetSettings = require('./widget-settings-cache');

  const channel = channelId > 0 ? channels.findById(channelId) : null;
  if (!channel) {
    return {
      status: 'ok',
      userId: 0,
      channelId: 0,
      channelName: '',
      isPro: false,
      widgetSettings: { ...widgetSettings.DEFAULTS },
    };
  }
  const sub = subscriptions.findByChannel(channelId);
  return {
    status: 'ok',
    userId: channel.OwnerUserId || channel.ChannelId,
    channelId: channel.ChannelId,
    channelName: channel.ChannelName,
    email: channel.Email || '',
    isPro: true, // license gate passed upstream → bundle expects Pro here
    subscription: {
      isPro: true,
      plan: (sub && sub.Plan) || 'pro',
      active: !!(sub && sub.Active),
    },
    widgetSettings: widgetSettings.getForChannel(channelId),
  };
}

function buildChannelStatus(channelId) {
  // Lightweight status snapshot — bundle polls this when the topbar needs
  // a refresh. Real connection state comes from the TikTok bridge.
  const bridge = require('./tiktok-bridge');
  const s = bridge.status();
  return {
    channelId: channelId || s.channelId || 0,
    connected: s.connected,
    connecting: s.connecting,
    tiktok: s.username || null,
    roomId: s.roomId || null,
  };
}

function handleLogin(socket, payload, ack) {
  // Token (when present) drives the channelId; otherwise fall back to the
  // default channel so widgets that bypass auth still get a usable bag.
  let channelId = 0;
  if (payload.token && typeof payload.token === 'string') {
    try {
      const jwt = require('./jwt');
      const claims = jwt.validateToken(payload.token);
      if (claims) channelId = Number(claims.channelId) || 0;
    } catch (err) {
      logger.warn({ err: err.message }, '[SocketManager] login token validate failed');
    }
  }
  if (channelId <= 0) {
    const channels = require('../db/models/channels');
    const def = channels.findDefault();
    if (def) channelId = def.ChannelId;
  }
  socket.data.channelId = channelId;
  socket.data.appType = String(payload.appType || '');

  const out = buildLoginPayload(channelId);
  // Emit BOTH ways: ack callback (newer Socket.IO clients) AND `loginResult`
  // event (older clients + most widget tabs). Sending both is harmless.
  if (typeof ack === 'function') {
    try { ack(out); } catch { /* client may not have callback */ }
  }
  socket.emit('loginResult', out);

  // Push initial widgetSettings + channelStatus + current aggregate state
  // so widget tabs render with real data without waiting for the next
  // event. Mirrors C# bridge's `EmitInitialAggregateStateAsync`.
  try {
    socket.emit('widgetSettings', out.widgetSettings);
    socket.emit('channelStatus', buildChannelStatus(channelId));
    // Aggregates: fire updateTopGifter/Liker/Ranking, topGiftData, stats,
    // updateViewerCount, setLastX directly to this socket so a freshly-
    // opened widget tab sees the existing state immediately.
    try {
      const aggregates = require('./aggregates');
      aggregates.emitInitialState(channelId);
    } catch {
      /* aggregates not loaded yet (boot race) — next event will catch up */
    }
  } catch (err) {
    logger.warn({ err }, '[SocketManager] initial broadcast after login failed');
  }
  logger.info(`[SocketManager] login ok socket=${socket.id} channelId=${channelId} appType=${socket.data.appType}`);
}

function ensureBound() {
  if (!io) throw new Error('SocketManager not bound — call bind(io) during boot');
}

/**
 * Broadcast `eventName` with a single data argument to every connected client.
 *
 * @param {string} eventName
 * @param {any} data
 */
function broadcast(eventName, data) {
  ensureBound();
  io.emit(eventName, data);
}

/**
 * Broadcast with multiple positional arguments — handlers see them as separate
 * params: `io.on('executeAction', (actionInfo, context) => ...)`.
 *
 * @param {string} eventName
 * @param  {...any} args
 */
function broadcastArgs(eventName, ...args) {
  ensureBound();
  io.emit(eventName, ...args);
}

/**
 * Broadcast to clients that registered with the matching channelId (and
 * optionally appType).
 *
 * @param {string} eventName
 * @param {any} data
 * @param {number} channelId
 * @param {string} [appType]
 */
function broadcastToChannel(eventName, data, channelId, appType = '') {
  ensureBound();
  for (const [, sock] of io.of('/').sockets) {
    const sockApp = (sock.data.appType || '').toLowerCase();
    // `relay` clients (the Electron→DAPI bridge) subscribe to every channel
    // regardless of appType filter — they need the full event stream to
    // forward raw-WS overlay clients (activity-feed, plugins). Without this
    // exception, channel-scoped emits get filtered out and DAPI consumers
    // never receive a single TikTok event.
    if (sockApp === 'relay') {
      sock.emit(eventName, data);
      continue;
    }
    if (sock.data.channelId !== channelId) continue;
    if (appType && sockApp !== appType.toLowerCase()) continue;
    sock.emit(eventName, data);
  }
}

/** Send to one specific socket id. */
function sendTo(sessionId, eventName, data) {
  ensureBound();
  io.to(sessionId).emit(eventName, data);
}

/** Active connection count. */
function connectionCount() {
  return io ? io.engine.clientsCount : 0;
}

module.exports = {
  bind,
  broadcast,
  broadcastArgs,
  broadcastToChannel,
  sendTo,
  connectionCount,
};
