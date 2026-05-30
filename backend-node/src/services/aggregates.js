// Stream-session aggregates that feed widgets:
//   - top gifters / top likers          (topgifter, topliker widgets)
//   - ranking (all-time per-user spend)  (ranking widget)
//   - last events                        (lastx widget)
//   - top gift                           (topg widget)
//   - stats counters                     (stats event for dashboard)
//
// Item shapes mirror the C# `TikTokBridgeService` exactly so the obfuscated
// widget JS reads the same field names it did before the Node port:
//   gifter:   { totalAmount, username, nickname, profilePictureUrl, userId }
//   liker:    { totalAmount, username, nickname, profilePictureUrl, userId }
//   ranking:  { totalAmount, username, nickname, profilePictureUrl, userId,
//               totalRewardAmount }
//   topGift:  { topGift:    { giftPictureUrl, username, title, count },
//               topStreaker: { giftPictureUrl, username, title, count } }
//   lastX:    { gift:  { name, profilePictureUrl }, like: {...},
//               follow: {...}, share: {...}, subscribe: {...},
//               chat:  {...}, member: {...} }
//   viewer:   { viewerCount, peakViewerCount }
//   stats:    { viewers, likes, gifts, diamonds, followers }
//
// In-memory only — clears on `resetAll()`. Persistent ranking would belong in
// DynamicSettings if a user ever asks for it; the bundle reads everything from
// the live stream.

const sockets = require('./socket-manager');

const _state = {
  viewerCount: 0,
  peakViewerCount: 0,
  likeCount: 0,
  giftCount: 0,
  diamondCount: 0,
  followerCount: 0,
  shareCount: 0,
  subscriberCount: 0,

  topGifters: new Map(), // key (uniqueId) → gifter item
  topLikers: new Map(),
  ranking: new Map(),
  lastEvents: new Map(), // type → { name, profilePictureUrl }
  // userId → profilePictureUrl. Populated by every event that carries a user
  // (chat/gift/like/follow/etc) so the `/img/user/:cid/:userId` route can
  // redirect to a TikTok CDN avatar. Survives resetAll — avatars are stable
  // even when stream-session aggregates reset.
  userAvatars: new Map(),

  topGiftUsername: '',
  topGiftPictureUrl: '',
  topGiftTitle: '',
  topGiftCount: 0,
};

function rememberAvatar(userId, profilePictureUrl) {
  if (!userId || !profilePictureUrl) return;
  _state.userAvatars.set(String(userId), profilePictureUrl);
}

function avatarFor(userId) {
  if (!userId) return null;
  return _state.userAvatars.get(String(userId)) || null;
}

function topByAmount(map, limit = 20) {
  return Array.from(map.values())
    .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
    .slice(0, limit);
}

// Build the lastX payload — keyed by event type. Widget reads `state[myX]`
// where `myX` is from the URL query (`?x=gift` etc). Bundle's bundled
// widget option also accepts numeric `?x=1` which is the same data — the
// bundle's UI lets users assign which event drives which slot. To play
// safe, expose both numeric AND event-keyed paths.
function buildLastXPayload() {
  // The bundle's "Last X Overlays" widget reads `state[myX]` where myX is the
  // overlay key from the URL (`?x=follower` etc) ∈ {follower, gifter,
  // subscriber, share, like, chatter}. The widget does `state[myX].testuser`
  // WITHOUT a null-guard (verified identical in gốc lastx.html:196), so
  // `state[myX]` MUST always be a defined object — exactly the shape the
  // main-app emits via `lastx.overlays`. Our internal `lastEvents` keys are the
  // raw TikTok event names; map each overlay key → its event and ALWAYS emit
  // all 6 keys (null user when no event yet) so the widget never crashes.
  // (Our previous flat `{state:{follow:...}}` was the bug: `state['follower']`
  // was undefined → `undefined.testuser` → Uncaught TypeError → dead preview.)
  const EVENT_FOR_OVERLAY = {
    follower: 'follow', gifter: 'gift', subscriber: 'subscribe',
    share: 'share', like: 'like', chatter: 'chat',
  };
  const out = {};
  for (const overlayKey of Object.keys(EVENT_FOR_OVERLAY)) {
    const ev = _state.lastEvents.get(EVENT_FOR_OVERLAY[overlayKey]);
    out[overlayKey] = ev
      ? { user: { name: ev.name, profilePictureUrl: ev.profilePictureUrl } }
      : { user: null };
  }
  // Numeric slot aliases (1..10) → most-recent event of any type (default
  // `?x=1` widgets). Null user when no event yet — still a defined object.
  const events = Array.from(_state.lastEvents.values());
  const latest = events.length ? events[events.length - 1] : null;
  const latestSlot = latest
    ? { user: { name: latest.name, profilePictureUrl: latest.profilePictureUrl } }
    : { user: null };
  for (let i = 1; i <= 10; i++) out[String(i)] = latestSlot;
  return { state: out };
}

function topGiftDataPayload() {
  const card = {
    giftPictureUrl: _state.topGiftPictureUrl,
    username: _state.topGiftUsername,
    title: _state.topGiftTitle,
    count: _state.topGiftCount,
  };
  return { topGift: card, topStreaker: card };
}

function statsPayload() {
  return {
    viewers: _state.viewerCount,
    likes: _state.likeCount,
    gifts: _state.giftCount,
    diamonds: _state.diamondCount,
    followers: _state.followerCount,
  };
}

function broadcast(channelId, eventName, data) {
  sockets.broadcastToChannel(eventName, data, channelId, 'widget');
}

function broadcastAggregateBundle(channelId) {
  broadcast(channelId, 'updateTopGifter', topByAmount(_state.topGifters));
  broadcast(channelId, 'updateTopLiker', topByAmount(_state.topLikers));
  broadcast(channelId, 'updateRanking', topByAmount(_state.ranking, 50));
  broadcast(channelId, 'topGiftData', topGiftDataPayload());
  broadcast(channelId, 'stats', statsPayload());
  broadcast(channelId, 'setLastX', buildLastXPayload());
}

function recordGift(channelId, { userId, username, nickname, profilePictureUrl, giftName, diamondCount, repeatCount }) {
  const amount = (diamondCount || 0) * (repeatCount || 1);
  _state.giftCount += repeatCount || 1;
  _state.diamondCount += amount;

  const key = username || userId;
  if (key) {
    // Top Gifter aggregation.
    const existing = _state.topGifters.get(key) || {
      totalAmount: 0, username: key, nickname: nickname || key,
      profilePictureUrl: profilePictureUrl || '', userId: userId || '',
    };
    existing.totalAmount += amount;
    if (nickname) existing.nickname = nickname;
    if (profilePictureUrl) existing.profilePictureUrl = profilePictureUrl;
    if (userId) existing.userId = userId;
    _state.topGifters.set(key, existing);

    // Ranking aggregation (mirrors topGifter plus rewardAmount).
    const rk = _state.ranking.get(key) || {
      totalAmount: 0, username: key, nickname: nickname || key,
      profilePictureUrl: profilePictureUrl || '', userId: userId || '',
      totalRewardAmount: 0,
    };
    rk.totalAmount += amount;
    rk.totalRewardAmount += amount;
    if (nickname) rk.nickname = nickname;
    if (profilePictureUrl) rk.profilePictureUrl = profilePictureUrl;
    if (userId) rk.userId = userId;
    _state.ranking.set(key, rk);
  }

  // Top Gift — single best by diamond value (per-gift, not cumulative per user).
  if (diamondCount > _state.topGiftCount) {
    _state.topGiftCount = diamondCount;
    _state.topGiftUsername = username || '';
    _state.topGiftPictureUrl = ''; // gift picture set by caller via setTopGiftPic
    _state.topGiftTitle = giftName || _state.topGiftTitle;
  }

  _state.lastEvents.set('gift', { name: nickname || username, profilePictureUrl });
  rememberAvatar(userId, profilePictureUrl);
  broadcastAggregateBundle(channelId);
}

// The gift picture URL comes from a different field than the caller has
// when calling recordGift, so the bridge calls this right after.
function setTopGiftPicture(pictureUrl) {
  if (pictureUrl) _state.topGiftPictureUrl = pictureUrl;
}

function recordLike(channelId, { userId, username, nickname, profilePictureUrl, likeCount, totalLikeCount }) {
  _state.likeCount += likeCount || 0;
  const key = username || userId;
  if (key) {
    const l = _state.topLikers.get(key) || {
      totalAmount: 0, username: key, nickname: nickname || key,
      profilePictureUrl: profilePictureUrl || '', userId: userId || '',
    };
    l.totalAmount += likeCount || 0;
    if (nickname) l.nickname = nickname;
    if (profilePictureUrl) l.profilePictureUrl = profilePictureUrl;
    if (userId) l.userId = userId;
    _state.topLikers.set(key, l);
  }

  if (totalLikeCount && totalLikeCount > _state.likeCount) _state.likeCount = totalLikeCount;

  _state.lastEvents.set('like', { name: nickname || username, profilePictureUrl });
  rememberAvatar(userId, profilePictureUrl);
  broadcast(channelId, 'updateTopLiker', topByAmount(_state.topLikers));
  broadcast(channelId, 'setLastX', buildLastXPayload());
  broadcast(channelId, 'stats', statsPayload());
}

function recordFollow(channelId, { userId, username, nickname, profilePictureUrl }) {
  _state.followerCount++;
  _state.lastEvents.set('follow', { name: nickname || username, profilePictureUrl });
  rememberAvatar(userId, profilePictureUrl);
  broadcast(channelId, 'setLastX', buildLastXPayload());
  broadcast(channelId, 'stats', statsPayload());
}

function recordShare(channelId, { userId, username, nickname, profilePictureUrl }) {
  _state.shareCount++;
  _state.lastEvents.set('share', { name: nickname || username, profilePictureUrl });
  rememberAvatar(userId, profilePictureUrl);
  broadcast(channelId, 'setLastX', buildLastXPayload());
}

function recordSubscribe(channelId, { userId, username, nickname, profilePictureUrl }) {
  _state.subscriberCount++;
  _state.lastEvents.set('subscribe', { name: nickname || username, profilePictureUrl });
  rememberAvatar(userId, profilePictureUrl);
  broadcast(channelId, 'setLastX', buildLastXPayload());
}

function recordMember(channelId, { userId, username, nickname, profilePictureUrl }) {
  _state.lastEvents.set('member', { name: nickname || username, profilePictureUrl });
  rememberAvatar(userId, profilePictureUrl);
  broadcast(channelId, 'setLastX', buildLastXPayload());
}

function recordChat(channelId, { userId, username, nickname, profilePictureUrl }) {
  rememberAvatar(userId, profilePictureUrl);
  _state.lastEvents.set('chat', { name: nickname || username, profilePictureUrl });
  broadcast(channelId, 'setLastX', buildLastXPayload());
}

function recordRoomUser(channelId, { viewerCount }) {
  _state.viewerCount = viewerCount || 0;
  if (_state.viewerCount > _state.peakViewerCount) _state.peakViewerCount = _state.viewerCount;
  broadcast(channelId, 'updateViewerCount', {
    viewerCount: _state.viewerCount,
    peakViewerCount: _state.peakViewerCount,
  });
  broadcast(channelId, 'stats', statsPayload());
}

// Called by socket-manager on each new widget login so freshly-connected
// widgets see current aggregates without waiting for the next event.
function emitInitialState(channelId) {
  broadcast(channelId, 'updateTopGifter', topByAmount(_state.topGifters));
  broadcast(channelId, 'updateTopLiker', topByAmount(_state.topLikers));
  broadcast(channelId, 'updateRanking', topByAmount(_state.ranking, 50));
  broadcast(channelId, 'topGiftData', topGiftDataPayload());
  broadcast(channelId, 'stats', statsPayload());
  broadcast(channelId, 'updateViewerCount', {
    viewerCount: _state.viewerCount,
    peakViewerCount: _state.peakViewerCount,
  });
  broadcast(channelId, 'setLastX', buildLastXPayload());
}

function snapshot() {
  return {
    viewerCount: _state.viewerCount,
    peakViewerCount: _state.peakViewerCount,
    likeCount: _state.likeCount,
    giftCount: _state.giftCount,
    diamondCount: _state.diamondCount,
    followerCount: _state.followerCount,
    shareCount: _state.shareCount,
    subscriberCount: _state.subscriberCount,
    topGifters: topByAmount(_state.topGifters),
    topLikers: topByAmount(_state.topLikers),
    topGift: {
      username: _state.topGiftUsername,
      profilePictureUrl: _state.topGiftPictureUrl,
      title: _state.topGiftTitle,
      count: _state.topGiftCount,
    },
  };
}

function counters() {
  return {
    viewerCount: _state.viewerCount,
    likeCount: _state.likeCount,
    giftCount: _state.giftCount,
    diamondCount: _state.diamondCount,
    followerCount: _state.followerCount,
    shareCount: _state.shareCount,
    subscriberCount: _state.subscriberCount,
  };
}

function resetAll(channelId) {
  _state.viewerCount = 0;
  _state.peakViewerCount = 0;
  _state.likeCount = 0;
  _state.giftCount = 0;
  _state.diamondCount = 0;
  _state.followerCount = 0;
  _state.shareCount = 0;
  _state.subscriberCount = 0;
  _state.topGifters.clear();
  _state.topLikers.clear();
  _state.ranking.clear();
  _state.lastEvents.clear();
  _state.topGiftUsername = '';
  _state.topGiftPictureUrl = '';
  _state.topGiftTitle = '';
  _state.topGiftCount = 0;
  if (channelId > 0) broadcastAggregateBundle(channelId);
}

module.exports = {
  recordGift,
  setTopGiftPicture,
  recordLike,
  recordFollow,
  recordShare,
  recordSubscribe,
  recordMember,
  recordChat,
  recordRoomUser,
  emitInitialState,
  avatarFor,
  snapshot,
  counters,
  resetAll,
};
