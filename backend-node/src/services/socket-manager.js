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

// Per-channel set of widgetIds we've already seen connect, so `widgetConnected`
// fires once per (channel,widget) — not on every alive/ack ping. Cleared on the
// widget socket's disconnect so a reopened widget re-triggers the control page's
// live settings re-push. (gốc handshake the C# server did; the clone previously
// never relayed reportWidgetState/widgetConnected at all → RC-A of M-012.)
const _seenWidgets = new Map(); // channelId -> Set<widgetId>

/**
 * Attach the singleton Server instance. Call once from index.js after the
 * Socket.IO server is created.
 *
 * @param {import('socket.io').Server} ioServer
 */
// [TTS-FIX 2026-06-06] Default channel for sockets that connect but never send a
// valid channelId. ROOT CAUSE (runtime log): the control-page socket (bundle main
// window) CONNECTS (emits distributeEvent fine) but NEVER emits `login` with
// appType=controlpage — backend-debug.log shows 25 `login ok` all appType=widget,
// ZERO controlpage. So its socket.data.channelId stays 0 → broadcastToChannel
// (channelId=1) skips it → chat/gift never reach broadcastlistener.onChat →
// tts.onChat never runs → TTS Logs empty + no live FX on control page. Single-
// channel clone ⇒ defaulting any unset socket to the default channel is correct
// (widgetSettings stays appType='widget'-scoped, so no reload-loop on the main app).
function defaultChannelId() {
  try {
    const channels = require('../db/models/channels');
    const def = channels.findDefault();
    return def ? def.ChannelId : 0;
  } catch { return 0; }
}

function bind(ioServer) {
  io = ioServer;

  io.on('connection', (socket) => {
    socket.data.channelId = defaultChannelId();   // was 0 → control-page (no login) got filtered out
    socket.data.appType = '';
    logger.info(`[SocketManager] Client connected: ${socket.id} (total: ${io.engine.clientsCount}) defaultChannel=${socket.data.channelId}`);

    // Bundle sends `setContext` after connect with { channelId, appType }.
    socket.on('setContext', (payload) => {
      if (payload && typeof payload === 'object') {
        // [TTS-FIX] fallback to default channel when payload.channelId<=0 (mirror handleLogin) —
        // the control page sends channelId=0 in the single-channel clone, which used to reset to 0.
        const cid = Number(payload.channelId) || 0;
        socket.data.channelId = cid > 0 ? cid : defaultChannelId();
        socket.data.appType = String(payload.appType || '');
        logger.info(`[SocketManager] setContext socket=${socket.id} channelId=${socket.data.channelId} appType=${socket.data.appType}`);
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

    // LIVE overlay preview. The main bundle emits `widgetSettings` on EVERY
    // Customize change (obsoverlays.refreshPublicSettings → emitWidgetSettings-
    // ToWidgets, app/deobfuscated.js:70944). The gốc server RELAYS it to widget
    // sockets so overlay previews update instantly; the clone server dropped it
    // (no handler) → settings only propagated via the slower POST/rebuild path,
    // so changing a setting "did nothing" live. Relay to widget-appType sockets
    // ONLY — the main page must NOT receive widgetSettings (it would clobber its
    // own dynamicSettings view — see the buildLoginPayload note below).
    // The bundle wraps EVERY client emit as an ENVELOPE:
    //   socketiowrapper.io.emit("distributeEvent", eventName, payload)
    //   (decompiled/app/deobfuscated.js:70903).
    // The gốc server unwraps "distributeEvent" + relays the inner event. Binding
    // the bare names (widgetSettings/goalStatus/giftGoalStatus) never fires, so
    // the control-page → widget preview push was dead. Unwrap + relay the
    // overlay-preview events to widget-appType sockets → Customize changes update
    // the preview/OBS widget INSTANTLY (the POST/rebuild path also delivers, but
    // ~700ms–2s slower; this is the ~0ms path).
    // Inner event names we unwrap from the distributeEvent envelope and relay
    // to widget-appType sockets. The settings/goal group pushes Customize
    // changes live; the overlay-FX group is what each overlay's test button
    // (and live-preview driver) emits via emitSocketEvent → distributeEvent.
    // Before this list was widened, ONLY the 3 settings/goal events were
    // relayed, so NO overlay effect (gift/wheel/coin/like/aggregates) animated
    // from the control page — RC-1 of mission-011 (overlay-socket-rca).
    //
    // Double-fire safety when LIVE: real TikTok gift/like events travel through
    // the bundle's emitWsEvent → Electron DAPI transport (NOT emitSocketEvent),
    // and every gift/onLikeReceived emitSocketEvent payload carries isTest:true
    // (verified decompiled/modules/deobfuscated.js:20249-20651). So the live
    // tiktok-bridge broadcast and this control-page relay never collide.
    // Relay target is ALWAYS appType='widget' — never echoed to controlpage
    // (that would retrigger settings.restore → reload loop; see buildLoginPayload).
    const RELAYABLE_DISTRIBUTE = new Set([
      // settings / goals (live Customize push — original whitelist)
      'widgetSettings', 'goalStatus', 'giftGoalStatus', 'testGoal', 'testGiftGoal',
      // countdown-goals overlay (Jun16 bundle) — countdowngoals.html listens
      // io.on('countdownGoalsStatus'); control page emits it via distributeEvent.
      'countdownGoalsStatus',
      // World Cup Penalty Battle / shootout (2026-06-19 bundle) — penaltybattle.html
      // listens io.on('penaltyShot') (resolved goal/save per shot) + io.on('penaltyBoard')
      // (full leaderboard sync / reset). Control page emits both via distributeEvent.
      'penaltyShot', 'penaltyBoard',
      // gift / like FX
      'gift', 'onLikeReceived',
      // coin jar / coin match / coin drop
      'coin-jar:gift', 'coin-jar:reset',
      'coin-match:start', 'coin-match:update', 'coin-match:result', 'coin-match:reset',
      'createCoins', 'timeoutCoins', 'collectCoin',
      // wheel
      'onSpinWheel', 'spinWheel',
      // aggregates / misc overlay
      'updateTopGifter', 'updateTopLiker', 'updateViewerCount', 'topGiftData',
      'newTransaction', 'showCommandResult', 'showCommands', 'showCustomCommands', 'showUserScore',
      // timer / countdown — timer.html + timer/index.html consume io.on('timerUpdate')
      // ONLY (no REST path); this is the event the staged Countdown Goal bundle needs.
      'timerUpdate',
      // activity-feed dock — activity-feed.html listens for 'dockData' (zero
      // alternate delivery path; without this the widget is fully dead).
      'dockData',
      // last-X overlay (lastx.html) + song-request playlist (songrequests.html).
      'setLastX', 'setPlaylistItems',
      // gift-cannon Test button (cannon.html listens 'giftCanonTest'; live FX use
      // the already-whitelisted 'gift').
      'giftCanonTest',
      // NOTE: deliberately NOT relayed here — 'chat' (live chat already reaches
      // widgets via tiktok-bridge broadcastAll; relaying test-chat risks
      // double-delivery to chat overlays), 'actionsChanged' (already broadcast by
      // the backend on REST mutations — me.js/widget.js), and 'christmas-event:*'
      // (seasonal + needs prefix matching this exact-match Set can't do).
    ]);
    socket.on('distributeEvent', (eventName, payload) => {
      try {
        if (!RELAYABLE_DISTRIBUTE.has(eventName)) return;
        const cid = socket.data.channelId;
        // Relay even when payload is undefined — reset events (coin-jar:reset,
        // coin-match:reset, wheel reset) carry no payload but the widget still
        // needs the signal.
        if (eventName === 'widgetSettings' && payload && typeof payload === 'object') {
          logger.info(`[WS-relay] LIVE widgetSettings cid=${cid} cannon_ballSize=${payload.cannon_ballSize} cannon_maxBalls=${payload.cannon_maxBalls} cannon_showCannon=${payload.cannon_showCannon}`);
        }
        if (eventName.startsWith('coin-jar:') || eventName.startsWith('coin-match:')) {  // [INSTR-2026-06-04] coinjar-reset-diag
          logger.info(`[WS-relay] RECV ${eventName} from socket appType="${socket.data.appType}" cid=${cid} (${cid > 0 ? 'will relay→widget' : 'DROPPED cid<=0'})`);
        }
        if (cid > 0) {
          broadcastToChannel(eventName, payload, cid, 'widget');
        }
      } catch (err) {
        logger.warn({ err, eventName }, '[SocketManager] distributeEvent relay failed');
      }
    });

    // Widget → control-page handshake (gốc: the C# server relayed these). Each
    // widget tab periodically emits `reportWidgetState` (socketioclient.js:129).
    // The control page listens for `widgetState` (onWidgetState → activeWidgets/
    // lastWidgetAck) and `widgetConnected` (→ emitWidgetSettingsToWidgets, which
    // re-pushes the LIVE settings snapshot). Without relaying these, a widget
    // that (re)opens — or opens mid-unsaved-edit — only ever gets the login-time
    // DB bag and never the fresh live snapshot. Relay control-page-scoped ONLY
    // (never to widgets → no reload loop).
    socket.on('reportWidgetState', (payload) => {
      try {
        const cid = socket.data.channelId;
        if (!(cid > 0) || !payload || typeof payload !== 'object') return;
        // Always forward raw state so the bundle tracks live/active widgets.
        broadcastToChannel('widgetState', payload, cid, 'controlpage');
        // First sighting of this widgetId on this channel → announce connect so
        // the control page re-pushes the live snapshot. Gated (seen-set) to
        // avoid a re-push on every alive/ack ping.
        // Composite key (widgetId|screenId) so 2 instances of the SAME overlay
        // on different screens each get their own first-seen handshake (a bare
        // widgetId would make instance #2 miss the live re-push, and instance #1
        // disconnecting would wrongly clear it).
        const wid = payload.widgetId ? (payload.widgetId + '|' + (payload.screenId || 1)) : null;
        if (wid) {
          socket.data.widgetId = wid;
          let seen = _seenWidgets.get(cid);
          if (!seen) { seen = new Set(); _seenWidgets.set(cid, seen); }
          if (!seen.has(wid)) {
            seen.add(wid);
            broadcastToChannel('widgetConnected', {}, cid, 'controlpage');
          }
        }
      } catch (err) {
        logger.warn({ err }, '[SocketManager] reportWidgetState relay failed');
      }
    });

    socket.on('disconnect', (reason) => {
      // Forget this widget so a reopen re-triggers widgetConnected → live re-push.
      const cid = socket.data.channelId;
      const wid = socket.data.widgetId;
      if (cid > 0 && wid && _seenWidgets.has(cid)) {
        _seenWidgets.get(cid).delete(wid);
      }
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
  //
  // IMPORTANT: only emit `widgetSettings` to widget-type sockets. The main
  // app (appType='controlpage') already has the settings via /api/me's
  // dynamicSettings, and receiving a fresh `widgetSettings` event there
  // re-triggers the bundle's settings.restore() — which detects a diff
  // (even when content matches, the bundle's hash check is fragile) and
  // initiates a full page reload. Boot path then loops because each reload
  // re-runs login → re-emits widgetSettings → re-restore → reload.
  try {
    const isWidget = String(socket.data.appType || '').toLowerCase() === 'widget';
    if (isWidget) {
      socket.emit('widgetSettings', out.widgetSettings);
    }
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
  let delivered = 0;
  const deliveredTo = [];
  for (const [, sock] of io.of('/').sockets) {
    const sockApp = (sock.data.appType || '').toLowerCase();
    // `relay` clients (the Electron→DAPI bridge) subscribe to every channel
    // regardless of appType filter — they need the full event stream to
    // forward raw-WS overlay clients (activity-feed, plugins). Without this
    // exception, channel-scoped emits get filtered out and DAPI consumers
    // never receive a single TikTok event.
    if (sockApp === 'relay') {
      // Don't forward control-page TEST events (isTest:true — fired by the
      // overlay "Bài kiểm tra" buttons) to DAPI/raw-WS plugins; they'd react to
      // a fake gift/like. Real bridge events never carry isTest.
      if (!(data && data.isTest)) {
        sock.emit(eventName, data);
        delivered++;
        deliveredTo.push('relay');
      }
      continue;
    }
    if (sock.data.channelId !== channelId) continue;
    if (appType && sockApp !== appType.toLowerCase()) continue;
    sock.emit(eventName, data);
    delivered++;
    deliveredTo.push(sockApp || '(empty)');
  }
  // Diagnostic log — only for events we care about during TTS debugging.
  // Comment out the `if` to log EVERYTHING (warning: chat-heavy rooms spam).
  if (eventName === 'chat' || eventName === 'connected' || eventName === 'disconnected' || eventName === 'channelStatus'
      || eventName === 'widgetSettings' || eventName === 'goalStatus' || eventName === 'giftGoalStatus'
      || eventName.startsWith('coin-jar:') || eventName.startsWith('coin-match:')) {  // [INSTR-2026-06-04] coinjar-reset-diag
    logger.info(`[Broadcast] ${eventName} channelId=${channelId} appType="${appType}" delivered=${delivered} to=[${deliveredTo.join(',')}]`);
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
