// Embedded TikTok LIVE bridge using `tiktok-live-connector` directly — no
// child-process WebSocket hop the way the C# version did. The bundle's
// Socket.IO clients receive the same event names they always did:
//   - chat, gift, like, share, follow, member, subscribe, emote, envelope,
//     questionNew, roomUser, liveIntro, streamEnd
//
// What this module owns end-to-end:
//   - Connection lifecycle (idempotent connect/disconnect, status snapshot)
//   - Per-event side effects: aggregates, goal counters, points, webhooks,
//     chat command matcher
//   - Socket.IO broadcasts (passed through SocketManager for /widget filtering)
//
// What this module does NOT own:
//   - HTTP REST surface (lives in routes/tiktok.js)
//   - Per-stream UI state on widgets (renderer-side, fed from the broadcasts)

const sockets = require('./socket-manager');
const aggregates = require('./aggregates');
const webhooks = require('./webhooks');
const chatBot = require('./chat-bot');
const points = require('./points');
const goalsModel = require('../db/models/goals');
const channels = require('../db/models/channels');
const config = require('../config');
const logger = require('../logger');

let TikTokLiveConnection = null;
function loadConnector() {
  if (TikTokLiveConnection) return TikTokLiveConnection;
  // eslint-disable-next-line global-require
  TikTokLiveConnection = require('tiktok-live-connector').TikTokLiveConnection;
  return TikTokLiveConnection;
}

const CONNECT_TIMEOUT_MS = 25_000;
const HTTP_TIMEOUT_MS = 10_000;

// Singleton state — only one channel can be LIVE at a time on a single-user
// install, so this is fine.
const _state = {
  connection: null,
  username: null,
  channelId: 0,
  connected: false,
  connecting: false,
  lastError: null,
  lastErrorAt: 0,
  roomId: null,
  roomInfo: null,
  // Watchdog: timestamp of the last inbound event (chat/like/gift/roomUser/etc).
  // The connector library doesn't always emit `streamEnd` reliably when a
  // host stops streaming or the network drops — we fall back on event quiet
  // to detect a dead connection.
  lastEventAt: 0,
};

// How long we tolerate event silence before assuming the stream ended.
// 4 min — low-activity rooms can be quiet, but TikTok itself sends roomUser
// heartbeats every ~30-60s while live so 4 min of total silence is decisive.
const EVENT_SILENCE_TIMEOUT_MS = 4 * 60 * 1000;

// Extract avatar URL from a webcast `Image` proto. v2 uses `url: string[]`
// (singular, despite holding multiple resolutions). Legacy converter sometimes
// emits `urls`. Some flows also expose `mUri` or a flat string. Try every
// shape — picking the first non-empty wins.
function pickAvatar(img) {
  if (!img) return '';
  if (typeof img === 'string') return img;
  const arr = img.url || img.urls || img.url_list;
  if (Array.isArray(arr) && arr.length) return arr[0];
  if (typeof arr === 'string') return arr;
  return '';
}

// Extract user info; v2 nests it under `data.user`. Mirror the helper in
// tiktok-bridge/index.js.
function getUser(data) {
  const u = data?.user || data || {};
  const avatar = u.profilePictureUrl  // legacy converter output (already flat)
    || pickAvatar(u.profilePicture)
    || pickAvatar(u.profilePictureMedium)
    || pickAvatar(u.profilePictureLarge)
    || pickAvatar(u.avatarThumb)
    || pickAvatar(u.avatarMedium)
    || pickAvatar(u.avatarLarger)
    || '';
  return {
    uniqueId: u.uniqueId || u.username || '',
    nickname: u.nickname || u.uniqueId || '',
    userId: String(u.userId || u.uid || u.id_str || ''),
    profilePictureUrl: avatar,
  };
}

// Broadcast scoped to widget-appType sockets only (used for widget-specific
// events like gift effects, lastX, ranking — those don't belong on the
// main bundle page).
function broadcast(channelId, eventName, data) {
  if (channelId > 0) {
    sockets.broadcastToChannel(eventName, data, channelId, 'widget');
  } else {
    sockets.broadcast(eventName, data);
  }
}

// Broadcast to EVERY socket on the channel regardless of appType. Used for
// events the bundle's main page consumes (chat for TTS, connected/
// disconnected for status pill, channelStatus for topbar pivot, etc) AND
// widgets need. Without this, widget-scoped broadcasts skip the main page
// → TTS doesn't get chat events → no audio readout.
function broadcastAll(channelId, eventName, data) {
  if (channelId > 0) {
    sockets.broadcastToChannel(eventName, data, channelId);  // no appType filter
  } else {
    sockets.broadcast(eventName, data);
  }
}

// ── Goal counter bumping ────────────────────────────────────────────────────
//
// Bumps Goals.Current for every goal whose Type matches the event. Loaded on
// demand (cached per channel). Refreshed when GoalsController writes.
const _goalsCache = new Map();
function loadGoalsFor(channelId) {
  if (_goalsCache.has(channelId)) return _goalsCache.get(channelId);
  const ch = channels.findById(channelId);
  const profileId = ch && ch.ProfileId > 0 ? ch.ProfileId : 1;
  const list = goalsModel.listByChannelProfile(channelId, profileId);
  _goalsCache.set(channelId, list);
  return list;
}
function bumpGoals(channelId, type, delta = 1) {
  if (delta <= 0) return;
  const list = loadGoalsFor(channelId);
  let dirty = false;
  for (const g of list) {
    if (!g.Enabled) continue;
    if ((g.Type || '').toLowerCase() !== type) continue;
    goalsModel.bumpCurrent(g.Id, delta);
    g.Current += delta;
    dirty = true;
  }
  if (dirty) {
    // Re-read once to give widgets fresh percentages.
    _goalsCache.delete(channelId);
    const refreshed = loadGoalsFor(channelId);
    broadcast(channelId, 'goalsUpdate', refreshed.map((g) => ({
      id: g.Id, type: g.Type, target: g.Target, current: g.Current,
      percent: g.Target > 0 ? Math.round((1000 * g.Current) / g.Target) / 10 : 0,
    })));
    // Bundle's `goal.html` listens for `goalStatus` with shape
    //   { config: { goal_<metric>_<key>: value },
    //     status: { <metric>: { current, percentage, target } } }
    // Without this the goal widget sits empty even when the goals table
    // is populated and bumpGoals is firing. Build both halves here.
    const goalStatus = { config: {}, status: {} };
    for (const g of refreshed) {
      const metric = (g.Type || '').toLowerCase();
      if (!metric) continue;
      goalStatus.status[metric] = {
        current: g.Current,
        target: g.Target,
        percentage: g.Target > 0 ? Math.round((1000 * g.Current) / g.Target) / 10 : 0,
      };
      goalStatus.config[`goal_${metric}_title`] = g.Name || '';
      goalStatus.config[`goal_${metric}_value`] = g.Target;
      goalStatus.config[`goal_${metric}_id`] = g.Id;
    }
    broadcast(channelId, 'goalStatus', goalStatus);
    // Gift-count goal widget (gcounter) uses its own event name.
    if (goalStatus.status.gifts) {
      broadcast(channelId, 'giftGoalStatus', goalStatus);
    }
  }
}
function refreshGoals(channelId) {
  _goalsCache.delete(channelId);
}

// NOTE (2026-06-11): The backend no longer awards points on live chat events.
// The bundle owns the viewer-points economy CLIENT-SIDE — its "points per chat
// minute" feature is gated (enable checkbox + 60s/user throttle) and persists
// via PUT /rest/transaction. A flat backend +1/message double-fired with that
// (inflated balances when the feature was on, and granted points even when it
// was off), violating the "backend must NOT act on live events" doctrine. The
// in-memory points-batching queue that fed it was removed with its sole caller.

// ── Connection orchestration ───────────────────────────────────────────────

// `abortInFlight` is set by the user-facing /disconnect route. The internal
// connect path calls disconnect() with NO args (abortInFlight stays false) so it
// never awaits the very promise it runs under (no deadlock).
async function disconnect({ abortInFlight = false } = {}) {
  clearReconnectTimer(); // cancel any pending auto-reconnect on teardown
  // A user disconnect DURING the connecting window must abort the in-flight
  // connect retry loop. Otherwise the next attempt re-populates _state and the
  // session is silently resurrected CONNECTED after the user explicitly killed
  // it (§8 disconnect idempotency). Mirror the profile-switch pre-emption path.
  if (abortInFlight && _connectInFlight) {
    _connectAbortRequested = true;
    // Force the current attempt to tear down NOW so conn.connect() rejects fast
    // instead of running out the 25s timeout before the loop sees the abort.
    if (_state.connection) {
      try { _state.connection.removeAllListeners?.(); } catch { /* ignore */ }
      try { _state.connection.disconnect(); } catch { /* ignore */ }
      _state.connection = null;
    }
    try { await _connectInFlight; } catch { /* expected: aborted */ }
  }
  if (_state.connection) {
    try {
      // Strip event handlers BEFORE disconnect so the old connection's
      // `disconnected` / `error` events don't fire after we've already
      // started a fresh connection (race: bundle hits /connect on the same
      // username twice → old conn fires `disconnected` AFTER new conn's
      // `connected` arrives → _state.connected flips to false even though
      // we're actively streaming events on the new conn).
      _state.connection.removeAllListeners?.();
      _state.connection.disconnect();
    } catch (err) {
      logger.warn({ err }, '[TikTokBridge] disconnect threw');
    }
  }
  _state.connection = null;
  _state.username = null;
  _state.connected = false;
  _state.connecting = false;
  _state.roomId = null;
  _state.roomInfo = null;
}

// Number of attempts before declaring failure. tiktok-live-connector
// internally tries 3 sources (main page / API / Eulerstream) per attempt and
// fails fast when TikTok rate-limits or serves a captcha. The retry-with-delay
// pattern below mirrors the old tiktok-bridge/index.js and the C# bridge's
// reconnect loop — TikTok almost always succeeds on attempt 2-3 when the
// first one trips anti-bot.
// Eulerstream's free signing service (used by tiktok-live-connector when no
// SIGN_API_KEY is set) is flaky — it returns `missingExtension` randomly
// even for live rooms. 5 attempts × 3s backoff = ~15s before giving up,
// almost always lands on a working signer within that budget.
const MAX_CONNECT_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

// ── Auto-reconnect on mid-stream WS drop (RCA wf_91e6c62e: ws-drop-no-reconnect) ─
// TikTok rotates/closes the live WebSocket periodically (~15-20 min observed).
// The connector emits ONE `disconnected` and stops; without this the session
// stays dead until the user clicks Connect again. Bounded, backed-off reconnect
// for the SAME username only — see scheduleReconnect (§8: idempotent, capped).
const RECONNECT_BASE_DELAY_MS = 4000; // first retry wait; doubles each attempt
const RECONNECT_MAX_DELAY_MS = 60000; // backoff ceiling
const RECONNECT_MAX_ATTEMPTS = 6; // ~4+8+16+32+60+60s then give up

// Read roomId/roomInfo off the live connection instance. tiktok-live-connector
// v2 exposes them as getters (`get roomId()`, `get roomInfo()`) that are set
// during the WS handshake — available even when `connect()` rejects via the
// v2 empty-AggregateError bug. Getters may throw before the room is joined, so
// guard each.
function readConnRoom(conn) {
  let roomId = null;
  let roomInfo = null;
  try { roomId = conn.roomId || null; } catch (_) { roomId = null; }
  try { roomInfo = conn.roomInfo || null; } catch (_) { roomInfo = null; }
  return { roomId, roomInfo };
}

async function tryConnectOnce(clean, channelId, attempt) {
  loadConnector();
  _state.username = clean;
  _state.channelId = channelId || (channels.findDefault()?.ChannelId || 0);
  _state.connecting = true;
  _state.lastError = null;

  const ctorOpts = {
    processInitialData: true,
    enableExtendedGiftInfo: false,
    fetchRoomInfoOnConnect: false,
    enableRequestPolling: true,
    requestPollingIntervalMs: 2000,
    webClientOptions: { timeout: HTTP_TIMEOUT_MS },
    wsClientOptions: { timeout: HTTP_TIMEOUT_MS },
  };
  if (config.SIGN_API_KEY) ctorOpts.signApiKey = config.SIGN_API_KEY;
  if (process.env.TIKTOK_SESSIONID && process.env.TIKTOK_TT_TARGET_IDC) {
    ctorOpts.sessionId = process.env.TIKTOK_SESSIONID;
    ctorOpts.ttTargetIdc = process.env.TIKTOK_TT_TARGET_IDC;
    // CRITICAL (2026-06-12): the connector forwards sessionId/ttTargetIdc to the
    // signed WS upgrade ONLY when authenticateWs is truthy (tiktok-live-connector
    // dist/lib/client.js:199-200 — else both are passed undefined). Without this
    // flag a valid session is silently dropped and the live WS still uses the FREE
    // Eulerstream path → connect, leak a few events, WS dies in ~4-5 min → watchdog
    // kill → reconnect → "chat lúc có lúc không". Setting it makes TikTok treat the
    // WS as a logged-in viewer (stable), no paid signing key needed.
    ctorOpts.authenticateWs = true;
    // The connector refuses to send the session cookie to the sign server unless
    // the host is explicitly whitelisted (security opt-in: with authenticateWs the
    // TikTok sessionid is forwarded to the sign server so it can authenticate the
    // WS as a logged-in viewer). It validates envHost === URL(signBasePath).host
    // (fetch-signed-websocket-euler.js:26-33), basePath defaulting to
    // https://tiktok.eulerstream.com. Derive it from the SAME source so it always
    // matches even if SIGN_API_URL is overridden.
    if (!process.env.WHITELIST_AUTHENTICATED_SESSION_ID_HOST) {
      try {
        const signUrl = process.env.SIGN_API_URL || 'https://tiktok.eulerstream.com';
        process.env.WHITELIST_AUTHENTICATED_SESSION_ID_HOST = new URL(signUrl).host;
      } catch (_) {
        process.env.WHITELIST_AUTHENTICATED_SESSION_ID_HOST = 'tiktok.eulerstream.com';
      }
    }
  } else if (process.env.TIKTOK_SESSIONID && !process.env.TIKTOK_TT_TARGET_IDC) {
    // Session present but ttTargetIdc missing → the gate above can't enable
    // authenticated WS, so we silently downgrade to the flaky free tier. Surface it.
    logger.warn('[TikTokBridge] session present but TIKTOK_TT_TARGET_IDC missing → running FREE tier (flaky). Re-login to capture ttTargetIdc.');
  }

  // Diagnostic: which auth path is in effect. AUTHENTICATED WS (sessionId +
  // authenticateWs) is far more stable than free Eulerstream signing. ws=free +
  // signApiKey=no = flaky tier. If ws=free while the user IS logged in, the env
  // didn't reach the backend (restart) or the session store is empty/expired.
  logger.info(
    `[TikTokBridge] auth mode: ws=${ctorOpts.authenticateWs ? 'AUTHENTICATED (sessionId)' : 'free Eulerstream'}`
    + ` ttTargetIdc=${ctorOpts.ttTargetIdc || '-'}`
    + ` signApiKey=${ctorOpts.signApiKey ? 'YES' : 'no'}`
    + ` signHost=${process.env.WHITELIST_AUTHENTICATED_SESSION_ID_HOST || '-'}`
  );

  const conn = new TikTokLiveConnection(_state.username, ctorOpts);
  _state.connection = conn;
  wireEvents(conn, _state.channelId, _state.username);

  // Soft-success detector: tiktok-live-connector v2 sometimes rejects with
  // an empty AggregateError even when the WS is alive and events are
  // streaming. Treat any inbound event as proof of life.
  let firstEventAt = 0;
  conn.on('chat', () => { if (!firstEventAt) firstEventAt = Date.now(); });
  conn.on('like', () => { if (!firstEventAt) firstEventAt = Date.now(); });
  conn.on('roomUser', () => { if (!firstEventAt) firstEventAt = Date.now(); });

  try {
    const state = await Promise.race([
      conn.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), CONNECT_TIMEOUT_MS)
      ),
    ]);
    _state.connected = true;
    _state.connecting = false;
    const room0 = readConnRoom(conn);
    _state.roomId = state.roomId || room0.roomId;
    _state.roomInfo = state.roomInfo || room0.roomInfo;
    logger.info(`[TikTokBridge] connected @${_state.username} roomId=${_state.roomId} (attempt ${attempt})`);
    // `fetchRoomInfoOnConnect: false` (set above to keep the connect path
    // fast) means `state.roomInfo` is empty here. Fetch it explicitly in the
    // background so `accountSnapshot()` has owner avatar/follower/title to
    // feed the bundle profile chip + `/api/tiktok/account`. Failure is fine —
    // chip just keeps showing username with no avatar.
    setImmediate(() => {
      Promise.resolve()
        .then(() => conn.fetchRoomInfo?.())
        .then((info) => {
          if (info && _state.username === clean) {
            _state.roomInfo = info;
            logger.info(`[TikTokBridge] roomInfo fetched (owner=${info?.owner?.nickname || '?'})`);
            // Seed the Follower Counter widget (followercount) with the live total.
            // Widget listens io.on('updateFollowerCount', {followerCount}); base from
            // roomInfo here, then the 'follow' handler bumps it +1 per new follower.
            try {
              _state.followerCount = accountSnapshot().followerCount || 0;
              broadcast(_state.channelId, 'updateFollowerCount', { followerCount: _state.followerCount });
            } catch (e) { /* ignore — widget keeps placeholder until first follow */ }
          }
        })
        .catch((err) => {
          logger.warn({ err: err?.message || err }, '[TikTokBridge] fetchRoomInfo failed');
        });
    });
    return { success: true, roomId: state.roomId, roomInfo: state.roomInfo };
  } catch (err) {
    if (firstEventAt) {
      _state.connected = true;
      _state.connecting = false;
      // connect() rejected (v2 empty AggregateError) but the WS joined the room
      // and events are streaming → it IS live. Capture roomId/roomInfo from the
      // connection instance so accountSnapshot().isLive (which gates on roomId)
      // is correct — without this the topbar shows "Disconnected" mid-stream.
      // Fetch roomInfo in the background for avatar/title/status.
      const roomSoft = readConnRoom(conn);
      _state.roomId = roomSoft.roomId || _state.roomId;
      _state.roomInfo = roomSoft.roomInfo || _state.roomInfo;
      if (!_state.roomInfo) {
        setImmediate(() => {
          Promise.resolve()
            .then(() => conn.fetchRoomInfo?.())
            .then((info) => {
              if (info && _state.username === clean) {
                _state.roomInfo = info;
                // Seed Follower Counter widget on the SOFT-success path too (hard-success
                // does this; without it the widget sticks on placeholder 1234 until the
                // first live 'follow'). pre-release audit 2026-06-16.
                try {
                  _state.followerCount = accountSnapshot().followerCount || 0;
                  broadcast(_state.channelId, 'updateFollowerCount', { followerCount: _state.followerCount });
                } catch (e) { /* ignore */ }
              }
            })
            .catch(() => {});
        });
      } else {
        // roomInfo already captured from the connection (roomSoft) — seed now.
        try {
          _state.followerCount = accountSnapshot().followerCount || 0;
          broadcast(_state.channelId, 'updateFollowerCount', { followerCount: _state.followerCount });
        } catch (e) { /* ignore */ }
      }
      logger.warn(
        { err: err?.message || err },
        `[TikTokBridge] connect() rejected but events arrived (attempt ${attempt}) — soft success, roomId=${_state.roomId}`
      );
      return { success: true, soft: true, roomId: _state.roomId };
    }
    // Hard failure: throw so the retry loop can re-arm.
    throw err;
  }
}

// In-flight connect promise — singleton mutex. All callers see the SAME
// promise until it resolves. Profile-switch race (user spam-clicking
// connect, bundle re-POSTing on focus, etc.) routes through this lock so
// we never have two TikTokLiveConnection instances racing.
let _connectInFlight = null;
let _connectAbortRequested = false;

// Auto-reconnect timer + attempt counter (see scheduleReconnect). The pending
// reconnect is identified by the target username — a user disconnect / profile
// switch changes `_state.username`, so a stale reconnect skips itself at fire
// time. clearReconnectTimer() cancels the pending timer (does NOT reset attempts,
// so an auto-reconnect's own internal disconnect() can't reset its own backoff).
let _reconnectTimer = null;
let _reconnectAttempts = 0;
function clearReconnectTimer() {
  if (_reconnectTimer) {
    clearTimeout(_reconnectTimer);
    _reconnectTimer = null;
  }
}

async function connect(username, channelId, opts) {
  if (!username || typeof username !== 'string') {
    throw new Error('username required');
  }
  const userClick = !!(opts && opts.userClick);
  const clean = username.trim().replace(/^@+/, '');

  // A user-initiated connect is a fresh session intent → drop any pending
  // auto-reconnect from a previous drop and reset its backoff counter.
  if (userClick) {
    _reconnectAttempts = 0;
    clearReconnectTimer();
  }

  // Already connected to the SAME username — short-circuit. Bundle re-POSTs
  // frequently (focus events, status polls); answering "already done"
  // prevents disconnect+reconnect flicker.
  if (_state.connected && _state.username === clean) {
    return { success: true, roomId: _state.roomId, roomInfo: _state.roomInfo, alreadyConnected: true };
  }

  // Connect already in-flight:
  //   - same target username → piggyback on the existing promise
  //   - different username (profile switch race) → request abort, await it,
  //     then start a fresh connect to the new target
  if (_connectInFlight) {
    if (_state.username === clean) {
      return _connectInFlight;
    }
    logger.info(`[TikTokBridge] connect-in-flight @${_state.username} pre-empted by @${clean}`);
    _connectAbortRequested = true;
    // Force the in-flight attempt to tear down NOW.
    if (_state.connection) {
      try { _state.connection.removeAllListeners?.(); } catch { /* ignore */ }
      try { _state.connection.disconnect(); } catch { /* ignore */ }
      _state.connection = null;
    }
    try { await _connectInFlight; } catch { /* expected: aborted */ }
  }

  _connectAbortRequested = false;
  _connectInFlight = _connectImpl(clean, channelId, userClick)
    .finally(() => { _connectInFlight = null; });
  return _connectInFlight;
}

async function _connectImpl(clean, channelId, userClick) {
  await disconnect();

  // Keep `connecting: true` across all attempts so the bundle's status
  // poller doesn't prematurely flip to "Disconnected" between retries.
  _state.connecting = true;
  _state.username = clean;
  _state.channelId = channelId || (channels.findDefault()?.ChannelId || 0);

  let lastErr;
  for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt++) {
    // Pre-attempt abort check — a newer connect() request may have
    // pre-empted us while we were waiting for backoff.
    if (_connectAbortRequested) {
      logger.info(`[TikTokBridge] connect @${clean} aborted before attempt ${attempt}`);
      throw new Error('connect aborted (superseded by newer request)');
    }
    try {
      return await tryConnectOnce(clean, _state.channelId, attempt);
    } catch (err) {
      lastErr = err;
      logger.warn(
        { err: err?.message || err },
        `[TikTokBridge] attempt ${attempt}/${MAX_CONNECT_ATTEMPTS} failed for @${clean}`
      );
      // Tear down the failed conn cleanly before retrying so the next
      // `new TikTokLiveConnection` starts from a blank slate.
      if (_state.connection) {
        try { _state.connection.removeAllListeners?.(); } catch { /* ignore */ }
        try { _state.connection.disconnect(); } catch { /* ignore */ }
        _state.connection = null;
      }
      // Bail out immediately on abort — don't sleep RETRY_DELAY_MS more.
      if (_connectAbortRequested) {
        throw new Error('connect aborted (superseded by newer request)');
      }
      if (attempt < MAX_CONNECT_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }
  }

  _state.connecting = false;
  _state.connected = false;
  // Only bump lastErrorAt for user-initiated clicks. Auto-connect calls
  // (bundle bootstrap, browserbridge hook, periodic re-hook) update
  // _state.lastError silently so the bundle can read the latest reason
  // via /api/tiktok/status, but tfConnectErrorPopup's "lastErrorAt
  // advanced" check stays put — no popup pops up.
  _state.lastError = lastErr?.message || String(lastErr);
  if (userClick) _state.lastErrorAt = Date.now();
  throw lastErr || new Error('Connection failed after retries');
}

// Schedule a bounded, backed-off auto-reconnect for `username` after a connector-
// side WS drop. Only ever scheduled from the LIVE `disconnected` handler — user
// disconnect / profile switch / watchdog all removeAllListeners() before
// disconnect(), so they never reach the handler. Guards (§8): a user disconnect /
// profile switch changes `_state.username` → a stale reconnect skips at fire time;
// attempt cap + exponential backoff stop hammering a genuinely-ended stream;
// single timer + funnel through connect()'s mutex → never two connections.
function scheduleReconnect(channelId, username) {
  if (_reconnectAttempts >= RECONNECT_MAX_ATTEMPTS) {
    logger.warn(`[TikTokBridge] auto-reconnect giving up @${username} after ${_reconnectAttempts} attempts`);
    _reconnectAttempts = 0;
    _state.connecting = false; // give up → status reports Disconnected, not stuck "Connecting"
    return;
  }
  // Report `connecting:true` for the WHOLE reconnect window (backoff + attempts)
  // so the UI shows a continuous "Connecting..." instead of flashing idle
  // "Disconnected" between the drop and the next attempt.
  _state.connecting = true;
  const attempt = (_reconnectAttempts += 1);
  const delay = Math.min(RECONNECT_BASE_DELAY_MS * 2 ** (attempt - 1), RECONNECT_MAX_DELAY_MS);
  logger.warn(`[TikTokBridge] scheduling auto-reconnect ${attempt}/${RECONNECT_MAX_ATTEMPTS} @${username} in ${delay}ms`);
  clearReconnectTimer();
  _reconnectTimer = setTimeout(() => {
    _reconnectTimer = null;
    if (_state.connected) return; // already revived by something else
    if (_state.username !== username) {
      // user disconnected or switched profile → this reconnect is obsolete
      logger.info(`[TikTokBridge] auto-reconnect @${username} obsolete (now @${_state.username}) — skip`);
      _reconnectAttempts = 0;
      return;
    }
    if (_connectInFlight || _connectAbortRequested) return;
    logger.warn(`[TikTokBridge] auto-reconnect attempt ${attempt} @${username}`);
    // userClick:false → silent (no error popup). Reuses full connect() path.
    connect(username, channelId, { userClick: false })
      .then(() => {
        _reconnectAttempts = 0;
        logger.info(`[TikTokBridge] auto-reconnect succeeded @${username}`);
      })
      .catch((err) => {
        logger.warn({ err: err?.message || err }, `[TikTokBridge] auto-reconnect attempt ${attempt} failed @${username}`);
        // Re-arm the next backoff step only if still the current dead session.
        if (!_state.connected && _state.username === username && !_connectInFlight) {
          scheduleReconnect(channelId, username);
        }
      });
  }, delay);
  _reconnectTimer.unref?.();
}

function wireEvents(conn, channelId, username) {
  // Ignore events from a stale connection. When the bundle re-POSTs
  // /api/tiktok/connect, the previous `conn` may still fire `disconnected`
  // a moment after we've already started a fresh `conn`. Without this
  // guard the new connection's `_state.connected=true` gets clobbered to
  // `false` by the old handler. `removeAllListeners` in disconnect() is
  // the primary defense; this is a belt-and-braces backup.
  const isStale = () => _state.connection && _state.connection !== conn;

  // Universal event-clock bump. Any real inbound event proves the room is
  // still alive — feed the watchdog so it doesn't kill the connection.
  conn.on('*', () => { if (!isStale()) _state.lastEventAt = Date.now(); });
  // Some versions of the connector don't support '*' — wire a few specific
  // high-traffic events as fallback. Harmless when '*' already fired.
  ['chat', 'like', 'gift', 'roomUser', 'member', 'follow', 'share'].forEach((ev) => {
    conn.on(ev, () => { if (!isStale()) _state.lastEventAt = Date.now(); });
  });

  conn.on('connected', (state) => {
    if (isStale()) return;
    _reconnectAttempts = 0;           // healthy connection → reset reconnect backoff
    _state.lastEventAt = Date.now();  // arm watchdog on connect
    broadcast(channelId, 'connected', {
      username, roomId: state.roomId, roomInfo: state.roomInfo || {},
    });
    // C#-parity: broadcast `status` and reset `stats` on fresh connect.
    sockets.broadcast('status', { connected: true, tiktok: true, connecting: false });
    sockets.broadcast('stats', { viewers: 0, likes: 0, gifts: 0, diamonds: 0, followers: 0 });
    sockets.broadcast('channelStatus', {
      channelId, connected: true, connecting: false, tiktok: username,
      roomId: state.roomId, isConnectedToTikTok: true, isConnecting: false,
    });
    // Emit current aggregates so freshly-connected widgets see real data.
    try { aggregates.emitInitialState(channelId); } catch { /* ignore */ }
  });

  conn.on('disconnected', (info) => {
    if (isStale()) return;
    // Log the close reason the connector emits (was silently discarded) so the
    // drop class is diagnosable: code 1000 = clean/heartbeat-timeout, else abnormal.
    const code = info?.code ?? info?.closeCode ?? null;
    const reason = info?.reason ?? info?.message ?? '';
    logger.warn(`[TikTokBridge] disconnected @${username} code=${code} reason="${reason}" roomId=${_state.roomId}`);
    broadcast(channelId, 'disconnected', { username, reason: 'disconnected' });
    sockets.broadcast('status', { connected: false, tiktok: false, connecting: false });
    sockets.broadcast('stats', { viewers: 0, likes: 0, gifts: 0, diamonds: 0, followers: 0 });
    _state.connected = false;
    // Mid-stream WS drop (the bug this fixes). user-disconnect / profile-switch /
    // watchdog strip listeners before disconnect, so they never reach here → it's
    // safe to attempt a bounded auto-reconnect for the same username.
    scheduleReconnect(channelId, username);
  });

  // Don't broadcast `connectFailed` from per-error event — the connector
  // emits `error` multiple times during a single attempt (signing fail,
  // websocket teardown, retry intermediate) which would stack popups.
  // The route handler (routes/tiktok.js) emits ONE `connectFailed` on the
  // final user-initiated attempt failure. Internal retries + watchdog
  // disconnects stay silent.
  conn.on('error', (err) => {
    if (isStale()) return;
    const msg = err?.info || err?.message || String(err);
    logger.warn(`[TikTokBridge] error: ${msg}`);
    broadcast(channelId, 'error', { message: msg, username });
  });

  conn.on('streamEnd', (actionId) => {
    if (isStale()) return;
    logger.info(`[TikTokBridge] streamEnd @${username}`);
    broadcast(channelId, 'streamEnd', { username, actionId });
    sockets.broadcast('status', { connected: false, tiktok: false, connecting: false });
    _state.connected = false;
    _state.connecting = false;
    _state.lastEventAt = 0;
    // The host ENDED the stream — don't auto-reconnect into a dead room. The
    // connector emits a follow-up `disconnected` right after streamEnd; strip
    // listeners + tear down so it can't reach the disconnected handler and kick
    // off a reconnect storm against an offline host (mirrors the watchdog).
    clearReconnectTimer();
    if (_state.connection === conn) {
      try { conn.removeAllListeners?.(); } catch { /* ignore */ }
      try { conn.disconnect(); } catch { /* ignore */ }
      _state.connection = null;
    }
  });

  conn.on('chat', async (data) => {
    const u = getUser(data);
    const payload = {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
      comment: data.comment,
      isModerator: data.isModerator || false,
      isSubscriber: data.isSubscriber || false,
      followRole: data.followRole || 0,
      userBadges: data.userBadges || [],
    };
    // Chat reaches BOTH widgets AND main page (TTS, chat panel, transaction
    // viewer all live on main bundle). Widget-only would starve TTS module.
    broadcastAll(channelId, 'chat', payload);
    aggregates.recordChat(channelId, { userId: u.userId, username: u.uniqueId, nickname: u.nickname, profilePictureUrl: u.profilePictureUrl });
    // Points are NOT awarded here — the bundle owns chat-points client-side (see
    // the points-batching removal note above). We still record identity below so
    // the bundle's by-userId balance read-back resolves.
    // Record identity (userId ⇆ username) so a chat-only viewer's balance is
    // resolvable by numeric userId (the bundle's !points / rest/channeluser
    // read path). recordIdentity no-ops once nothing new is learned, so it does
    // not write on every message. Guarded so a DB error never breaks the rest
    // of the chat chain (chatBot.onChat / TTS / webhooks below).
    try {
      points.recordIdentity(channelId, u.uniqueId, {
        userId: u.userId,
        nickname: u.nickname,
        thumbnailUrl: u.profilePictureUrl,
      });
    } catch (err) {
      logger.warn({ err }, '[Bridge] recordIdentity failed');
    }
    bumpGoals(channelId, 'chats', 1);
    chatBot.onChat({
      channelId,
      username: u.uniqueId, nickname: u.nickname, userId: u.userId,
      comment: data.comment,
    });
    webhooks.dispatch(channelId, 'chat', payload).catch((err) => {
      logger.warn({ err, event: 'chat' }, 'webhook dispatch failed');
    });
  });

  conn.on('gift', (data) => {
    logger.info(`[Bridge] gift event channelId=${channelId} giftType=${data.giftType} repeatEnd=${data.repeatEnd} gift="${data.giftName || data.describe || ''}" from=${data.uniqueId || data.user?.uniqueId || '?'}`);
    // Streak de-dup — match gốc bundle (app/deobfuscated.js:71976). For
    // streakable gifts (giftType===1) TikTok emits one event PER repeat tick
    // (repeatEnd=false) then a final tick (repeatEnd=true). Process ONLY the
    // final tick — otherwise every gift overlay (cannon, coin jar, gifts,
    // goals) fires once per tick AND gift/diamond counters inflate massively
    // (an x10 combo counted as 1+2+…+10 = the "fires like an AK" + 151k-gift
    // bug). Non-streak gifts (giftType!==1) have no streak so they pass through.
    if (data.giftType === 1 && !data.repeatEnd) return;
    const u = getUser(data);
    let giftPicUrl = data.giftPictureUrl || '';
    if (!giftPicUrl && data.giftDetails?.giftImage?.url?.length) {
      giftPicUrl = data.giftDetails.giftImage.url[0];
    }
    const giftName = data.giftName || data.giftDetails?.describe || data.describe || '';
    const diamondCount = data.diamondCount || data.giftDetails?.diamondCount || 0;
    const payload = {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
      giftId: data.giftId, giftName,
      giftPictureUrl: giftPicUrl, diamondCount,
      repeatCount: data.repeatCount || 1, repeatEnd: data.repeatEnd || false,
      giftType: data.giftType || 1, describe: giftName,
    };
    broadcast(channelId, 'gift', payload);
    // Derived `coin-jar:gift` — bundle's coin-jar widget listens for THIS
    // event, not raw `gift`. Shape matches widget addGift({...}) exactly.
    broadcast(channelId, 'coin-jar:gift', {
      giftPictureUrl: giftPicUrl,
      value: diamondCount,
      repeatCount: payload.repeatCount,
      giftName,
      username: u.uniqueId,
      nickname: u.nickname,
      profilePictureUrl: u.profilePictureUrl,
    });
    // Derived `newTransaction` — drives the transaction viewer widget.
    // Shape matches C# bridge: description is "Gift: <giftName>".
    broadcast(channelId, 'newTransaction', {
      show: true,
      description: `Gift: ${giftName}`,
      userId: u.userId,
      thumbnailUrl: u.profilePictureUrl,
      amount: diamondCount * (payload.repeatCount || 1),
      username: u.uniqueId,
      nickname: u.nickname,
    });
    // Record into aggregates BEFORE setting topGift picture so the picture
    // applies to the freshly-promoted top gift (if this gift beats current).
    aggregates.recordGift(channelId, {
      userId: u.userId,
      username: u.uniqueId,
      nickname: u.nickname,
      profilePictureUrl: u.profilePictureUrl,
      giftName,
      diamondCount,
      repeatCount: payload.repeatCount,
    });
    aggregates.setTopGiftPicture(giftPicUrl);
    bumpGoals(channelId, 'gifts', payload.repeatCount);
    bumpGoals(channelId, 'diamonds', diamondCount * payload.repeatCount);
    webhooks.dispatch(channelId, 'gift', payload).catch((err) => {
      logger.warn({ err, event: 'gift' }, 'webhook dispatch failed');
    });
  });

  conn.on('like', (data) => {
    const u = getUser(data);
    const payload = {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
      likeCount: data.likeCount || 1,
      totalLikeCount: data.totalLikeCount || 0,
    };
    broadcast(channelId, 'like', payload);
    // Derived `onLikeReceived` — likefountain widget. Shape from C# bridge:
    // `{ likeCount, profilePictureUrl, userId }`.
    broadcast(channelId, 'onLikeReceived', {
      likeCount: payload.likeCount,
      profilePictureUrl: u.profilePictureUrl,
      userId: u.userId,
      username: u.uniqueId,
      nickname: u.nickname,
      isTest: false,
    });
    aggregates.recordLike(channelId, {
      userId: u.userId,
      username: u.uniqueId,
      nickname: u.nickname,
      profilePictureUrl: u.profilePictureUrl,
      likeCount: payload.likeCount,
      totalLikeCount: payload.totalLikeCount,
    });
    bumpGoals(channelId, 'likes', payload.likeCount);
    webhooks.dispatch(channelId, 'like', payload).catch((err) => {
      logger.warn({ err, event: 'like' }, 'webhook dispatch failed');
    });
  });

  conn.on('share', (data) => {
    const u = getUser(data);
    const payload = {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
    };
    broadcast(channelId, 'share', payload);
    aggregates.recordShare(channelId, { userId: u.userId, username: u.uniqueId, nickname: u.nickname, profilePictureUrl: u.profilePictureUrl });
    bumpGoals(channelId, 'shares', 1);
    webhooks.dispatch(channelId, 'share', payload).catch((err) => {
      logger.warn({ err, event: 'share' }, 'webhook dispatch failed');
    });
  });

  conn.on('follow', (data) => {
    const u = getUser(data);
    const payload = {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
    };
    broadcast(channelId, 'follow', payload);
    aggregates.recordFollow(channelId, { userId: u.userId, username: u.uniqueId, nickname: u.nickname, profilePictureUrl: u.profilePictureUrl });
    bumpGoals(channelId, 'follows', 1);
    // Follower Counter widget: bump the running total + push so it ticks live.
    _state.followerCount = (_state.followerCount || 0) + 1;
    broadcast(channelId, 'updateFollowerCount', { followerCount: _state.followerCount });
    webhooks.dispatch(channelId, 'follow', payload).catch((err) => {
      logger.warn({ err, event: 'follow' }, 'webhook dispatch failed');
    });
  });

  conn.on('member', (data) => {
    const u = getUser(data);
    broadcast(channelId, 'member', {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
      actionId: data.actionId,
    });
    aggregates.recordMember(channelId, { userId: u.userId, username: u.uniqueId, nickname: u.nickname, profilePictureUrl: u.profilePictureUrl });
  });

  conn.on('roomUser', (data) => {
    const payload = { viewerCount: data.viewerCount || 0, topViewers: data.topViewers || [] };
    broadcast(channelId, 'roomUser', payload);
    aggregates.recordRoomUser(channelId, payload);
  });

  conn.on('subscribe', (data) => {
    const u = getUser(data);
    const payload = {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
      subMonth: data.subMonth || 0,
    };
    broadcast(channelId, 'subscribe', payload);
    aggregates.recordSubscribe(channelId, { userId: u.userId, username: u.uniqueId, nickname: u.nickname, profilePictureUrl: u.profilePictureUrl });
    bumpGoals(channelId, 'subscribers', 1);
    webhooks.dispatch(channelId, 'subscribe', payload).catch((err) => {
      logger.warn({ err, event: 'subscribe' }, 'webhook dispatch failed');
    });
  });

  conn.on('emote', (data) => {
    const u = getUser(data);
    broadcast(channelId, 'emote', {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
      emoteId: data.emoteId,
      emoteImageUrl: data.emoteImageUrl,
    });
  });

  conn.on('envelope', (data) => {
    broadcast(channelId, 'envelope', {
      coins: data.coins, canOpen: data.canOpen, timestamp: data.timestamp,
    });
  });

  conn.on('questionNew', (data) => {
    const u = getUser(data);
    broadcast(channelId, 'questionNew', {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
      questionText: data.questionText,
    });
  });

  conn.on('liveIntro', (data) => broadcast(channelId, 'liveIntro', data));
}

// Derive the connected TikTok account's owner / room snapshot from the raw
// tiktok-live-connector roomInfo blob. `fetchRoomInfo()` returns the TikTok
// webcast `room/info/` API response which can be shaped as either:
//   - { data: { owner, title, stats, ... }, extra: {...} }   (typical)
//   - { owner, title, stats, ... }                            (legacy / direct)
//   - { liveRoomUserInfo: { user, stats, ... } }              (HTML SIGI fallback)
// Walk all three shapes so the chip avatar shows up regardless of which
// route the connector took. The bundle's connection / profile UI reads
// `avatarUrl` / `profilePictureUrl` / `owner.avatar_thumb.url_list` — flatten
// the common variants here so the same payload satisfies every caller.
function accountSnapshot() {
  // Self-heal: a soft-success connect (connect() rejected but events flowed) may
  // not have captured roomId. Backfill lazily from the live connection instance
  // so isLive reflects reality without forcing a reconnect (fixes the existing
  // session on the next status poll).
  if (_state.connected && !_state.roomId && _state.connection) {
    try { _state.roomId = _state.connection.roomId || _state.roomId; } catch (_) { /* getter may throw pre-join */ }
  }
  const raw = _state.roomInfo || {};
  // Unwrap common envelopes: TikTok wraps in `data`, HTML fallback in `liveRoomUserInfo`.
  const ri = raw.data || raw.liveRoomUserInfo || raw;
  // SIGI HTML fallback puts the streamer under `user`, not `owner`.
  const owner = ri.owner || ri.host || ri.user || raw.user || {};
  const avatarList = owner.avatar_thumb?.url_list
    || owner.avatar_medium?.url_list
    || owner.avatar_large?.url_list
    || owner.avatarThumb?.urlList
    || owner.avatarMedium?.urlList
    || owner.avatarLarger?.urlList
    || [];
  const avatarUrl = (Array.isArray(avatarList) && avatarList[0])
    || owner.avatar_url
    || owner.avatarUrl
    || owner.profilePictureUrl
    || '';
  const followerCount = owner.follow_info?.follower_count
    ?? owner.follower_count
    ?? 0;
  const followingCount = owner.follow_info?.following_count
    ?? owner.following_count
    ?? 0;
  const stats = ri.live_room_stats || ri.stats || {};
  return {
    username: _state.username || owner.unique_id || owner.uniqueId || '',
    uniqueId: owner.unique_id || owner.uniqueId || _state.username || '',
    nickname: owner.nickname || owner.display_id || _state.username || '',
    userId: String(owner.user_id || owner.userId || owner.id_str || ''),
    avatarUrl,
    profilePictureUrl: avatarUrl,
    bioDescription: owner.bio_description || owner.signature || '',
    followerCount,
    followingCount,
    roomId: _state.roomId || ri.id_str || ri.roomId || null,
    title: ri.title || '',
    coverUrl: (ri.cover?.url_list && ri.cover.url_list[0]) || '',
    viewerCount: stats.user_count_composition?.total
      ?? stats.viewerCount
      ?? aggregates.counters().viewerCount
      ?? 0,
    // `isLive` only true when user is ACTIVELY broadcasting. Bridge caches
    // roomId after a stream ends, so we additionally check TikTok's own
    // live-status signals on roomInfo.data:
    //   - data.status === 2 → currently broadcasting (live)
    //   - data.status === 4 → live ended
    //   - data.finish_time > 0 → live ended (timestamp of end)
    // Earlier conditions (just connected, or connected + roomId) lit the
    // LIVE badge minutes/hours after a stream ended because the bridge
    // never refreshed roomInfo — confusing users into thinking they were
    // still "live" when they weren't.
    isLive: !!(
      _state.connected
      && _state.roomId
      && ri && (ri.status === 2 || (ri.status !== 4 && !ri.finish_time))
    ),
    startedAtMs: ri.create_time ? Number(ri.create_time) * 1000 : null,
  };
}

function status() {
  const account = accountSnapshot();
  return {
    // Bundle reads any of these — old code paths use `tiktok` /
    // `isConnectedToTikTok` / `currentUsername`, newer ones use the plain
    // `connected` / `username`. Ship all aliases so every Vue component
    // gets the same view of the world.
    connected: _state.connected,
    connecting: _state.connecting,
    isConnectedToTikTok: _state.connected,
    isConnecting: _state.connecting,
    // Top-level `isLive` aliases account.isLive — some bundle components
    // read this directly instead of digging through .account. Mirrors the
    // strict broadcasting check (connected + roomId + status===2).
    isLive: account.isLive,
    isBroadcasting: account.isLive,
    username: _state.username,
    tiktok: _state.username,
    currentUsername: _state.username,
    channelId: _state.channelId,
    roomId: _state.roomId,
    roomInfo: _state.roomInfo || null,
    account,
    // Bundle profile chip looks at top-level `nickname` / `avatarUrl` —
    // flatten the most-used owner fields so they don't have to dig.
    nickname: account.nickname,
    avatarUrl: account.avatarUrl,
    profilePictureUrl: account.avatarUrl,
    followerCount: account.followerCount,
    lastError: _state.lastError,
    lastErrorAt: _state.lastErrorAt,
    stats: aggregates.snapshot(),
  };
}

// Liveness watchdog. Some streams die without TikTok ever sending a
// `streamEnd` / `disconnected` packet — network drops, host-side glitches,
// or the connector library missing the control message. Every 30s we
// inspect `lastEventAt`; if a "connected" room hasn't produced any event
// in EVENT_SILENCE_TIMEOUT_MS, we treat it as ended: tear down the conn,
// broadcast disconnect to widgets, and clear `_state.connected` so the
// topbar/profile chip stops lying that the stream is LIVE.
setInterval(() => {
  if (!_state.connected) return;
  if (!_state.lastEventAt) return;          // not armed yet (just connected)
  const silence = Date.now() - _state.lastEventAt;
  if (silence < EVENT_SILENCE_TIMEOUT_MS) return;

  const channelId = _state.channelId;
  const username = _state.username;
  logger.warn(`[TikTokBridge] watchdog: no events for ${Math.round(silence / 1000)}s @${username} — marking disconnected`);
  _state.connected = false;
  _state.connecting = false;
  // Reset event clock so the next connection round starts fresh.
  _state.lastEventAt = 0;
  clearReconnectTimer(); // clear any pending reconnect before re-scheduling below
  // Tear down the (stalled) connection. removeAllListeners first so the
  // late-firing `disconnected` event doesn't clobber a fresh state.
  if (_state.connection) {
    try { _state.connection.removeAllListeners?.(); } catch { /* ignore */ }
    try { _state.connection.disconnect(); } catch { /* ignore */ }
    _state.connection = null;
  }
  // Tell widgets + topbar we dropped (status will flip back on reconnect).
  try {
    sockets.broadcast('status', { connected: false, tiktok: false, connecting: true });
    sockets.broadcast('channelStatus', {
      channelId, connected: false, connecting: true, tiktok: username,
      isConnectedToTikTok: false, isConnecting: true,
      reason: 'watchdog-silence',
    });
  } catch { /* socket may not be bound during shutdown */ }
  // Event silence on an ACTIVE stream is almost always an Eulerstream/WS stall,
  // NOT a real stream end (real ends arrive via the `streamEnd` handler, which
  // tears down WITHOUT reconnect). So attempt a bounded auto-reconnect for the
  // same user — this is the "để idle một hồi nó tự ngắt rồi nằm chết" fix.
  // scheduleReconnect's fire-time guards (username unchanged, attempt cap +
  // exponential backoff) stop it from hammering a genuinely-ended stream.
  scheduleReconnect(channelId, username);
}, 30 * 1000).unref?.();

module.exports = {
  connect,
  disconnect,
  status,
  accountSnapshot,
  refreshGoals,
};
