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

function broadcast(channelId, eventName, data) {
  if (channelId > 0) {
    sockets.broadcastToChannel(eventName, data, channelId, 'widget');
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

// ── Connection orchestration ───────────────────────────────────────────────

async function disconnect() {
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
const MAX_CONNECT_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

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
  }

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
    _state.roomId = state.roomId;
    _state.roomInfo = state.roomInfo;
    logger.info(`[TikTokBridge] connected @${_state.username} roomId=${state.roomId} (attempt ${attempt})`);
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
      logger.warn(
        { err: err?.message || err },
        `[TikTokBridge] connect() rejected but events arrived (attempt ${attempt}) — soft success`
      );
      return { success: true, soft: true };
    }
    // Hard failure: throw so the retry loop can re-arm.
    throw err;
  }
}

async function connect(username, channelId, opts) {
  if (!username || typeof username !== 'string') {
    throw new Error('username required');
  }
  const userClick = !!(opts && opts.userClick);
  const clean = username.trim().replace(/^@+/, '');
  // Idempotent: if we're already connected to the same username, just return
  // success. Bundle re-POSTs /api/tiktok/connect frequently (focus events,
  // status polls) — without this, every poll triggers a disconnect+reconnect
  // cycle that flickers the topbar between "Connected" and "Disconnected".
  if (_state.connected && _state.username === clean) {
    return { success: true, roomId: _state.roomId, roomInfo: _state.roomInfo, alreadyConnected: true };
  }
  if (_state.connecting) {
    throw new Error('already connecting');
  }
  await disconnect();

  // Keep `connecting: true` across all attempts so the bundle's status
  // poller doesn't prematurely flip to "Disconnected" between retries.
  _state.connecting = true;
  _state.username = clean;
  _state.channelId = channelId || (channels.findDefault()?.ChannelId || 0);

  let lastErr;
  for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt++) {
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

  conn.on('disconnected', () => {
    if (isStale()) return;
    broadcast(channelId, 'disconnected', { username, reason: 'disconnected' });
    sockets.broadcast('status', { connected: false, tiktok: false, connecting: false });
    sockets.broadcast('stats', { viewers: 0, likes: 0, gifts: 0, diamonds: 0, followers: 0 });
    _state.connected = false;
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
    broadcast(channelId, 'chat', payload);
    aggregates.recordChat(channelId, { userId: u.userId, username: u.uniqueId, nickname: u.nickname, profilePictureUrl: u.profilePictureUrl });
    points.setBalance(
      channelId, u.uniqueId,
      points.getBalance(channelId, u.uniqueId) + 1
    );
    bumpGoals(channelId, 'chats', 1);
    chatBot.onChat({
      channelId,
      username: u.uniqueId, nickname: u.nickname, userId: u.userId,
      comment: data.comment,
    });
    webhooks.dispatch(channelId, 'chat', payload).catch(() => {});
  });

  conn.on('gift', (data) => {
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
    webhooks.dispatch(channelId, 'gift', payload).catch(() => {});
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
    webhooks.dispatch(channelId, 'like', payload).catch(() => {});
  });

  conn.on('share', (data) => {
    const u = getUser(data);
    const payload = {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
    };
    broadcast(channelId, 'share', payload);
    aggregates.recordShare(channelId, { userId: u.userId, username: u.uniqueId, nickname: u.nickname, profilePictureUrl: u.profilePictureUrl });
    bumpGoals(channelId, 'shares', 1);
    webhooks.dispatch(channelId, 'share', payload).catch(() => {});
  });

  conn.on('follow', (data) => {
    const u = getUser(data);
    const payload = {
      uniqueId: u.uniqueId, nickname: u.nickname, userId: u.userId, profilePictureUrl: u.profilePictureUrl,
    };
    broadcast(channelId, 'follow', payload);
    aggregates.recordFollow(channelId, { userId: u.userId, username: u.uniqueId, nickname: u.nickname, profilePictureUrl: u.profilePictureUrl });
    bumpGoals(channelId, 'follows', 1);
    webhooks.dispatch(channelId, 'follow', payload).catch(() => {});
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
    webhooks.dispatch(channelId, 'subscribe', payload).catch(() => {});
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
    isLive: !!_state.connected,
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
  // Tear down the (likely-dead) connection. removeAllListeners first so the
  // late-firing `disconnected` event doesn't clobber a fresh state.
  if (_state.connection) {
    try { _state.connection.removeAllListeners?.(); } catch { /* ignore */ }
    try { _state.connection.disconnect(); } catch { /* ignore */ }
    _state.connection = null;
  }
  // Tell widgets + topbar.
  try {
    sockets.broadcast('status', { connected: false, tiktok: false, connecting: false });
    sockets.broadcast('channelStatus', {
      channelId, connected: false, connecting: false, tiktok: username,
      isConnectedToTikTok: false, isConnecting: false,
      reason: 'watchdog-silence',
    });
    if (channelId > 0) {
      sockets.broadcastToChannel('streamEnd', { username, reason: 'watchdog-silence' }, channelId, 'widget');
    }
  } catch { /* socket may not be bound during shutdown */ }
}, 30 * 1000).unref?.();

module.exports = {
  connect,
  disconnect,
  status,
  accountSnapshot,
  refreshGoals,
};
