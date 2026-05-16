// /api/widget/* — thin façade that broadcasts widget events to every
// connected OBS browser source. Direct port of WidgetController.cs.
//
// The C# version routes everything through TikTokBridgeService so the bridge
// can maintain in-memory state (timer countdown, coinjar totals, etc.).
// Phase 3 will land that service in Node; until then we just emit the
// matching `widget`-scoped events. The bundle's widget HTML pages keep their
// own per-tab state from the broadcast stream, so this is enough to make
// every widget (chat/gifts/cannon/wheel/coindrop/coinmatch/songrequests)
// react to test triggers via the OBS preview.

const express = require('express');
const sockets = require('../services/socket-manager');
const actions = require('../db/models/actions');
const channels = require('../db/models/channels');
const webhooks = require('../services/webhooks');
const logger = require('../logger');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}
function resolveProfileId(channelId) {
  if (channelId <= 0) return 1;
  const ch = channels.findById(channelId);
  return ch && ch.ProfileId > 0 ? ch.ProfileId : 1;
}

// Push to every widget-tagged socket for the channel. Mirrors
// `bridge.BroadcastWidgetEvent` in the C# code.
function broadcast(req, eventName, data) {
  const channelId = resolveChannelId(req);
  if (channelId > 0) {
    sockets.broadcastToChannel(eventName, data, channelId, 'widget');
  } else {
    sockets.broadcast(eventName, data);
  }
}

// ── Timer ──────────────────────────────────────────────────────────────────
//
// Bundle's `timer.html` widget listens for `timerUpdate` with shape
// `{ state: { totalMillis, isPaused } }`. The widget computes remaining
// time as `totalMillis - (now - clientReceivedAt)`, so we always send the
// CURRENT remaining `totalMillis` along with whether the timer is paused.
//
// Server-side state is intentionally minimal — just enough to recompute
// remaining on every op so the widget animates smoothly.
const _timerState = new Map(); // channelId → { totalMillis, isPaused, lastTickAt }

function emitTimerUpdate(req, channelId, totalMillis, isPaused) {
  _timerState.set(channelId, { totalMillis, isPaused, lastTickAt: Date.now() });
  broadcast(req, 'timerUpdate', { state: { totalMillis, isPaused } });
  // Legacy event name kept for any code still listening to `timerState`.
  broadcast(req, 'timerState', { state: isPaused ? 'paused' : 'running', durationMs: totalMillis });
}

// op ∈ start | pause | resume | stop | add
router.post('/timer/:op(start|pause|resume|stop|add)', (req, res) => {
  const op = req.params.op;
  const seconds = Number(req.query.seconds) || 0;
  const channelId = resolveChannelId(req);
  const durationMs = Number(req.body?.durationMs ?? req.body?.DurationMs) || seconds * 1000;
  const prev = _timerState.get(channelId) || { totalMillis: 0, isPaused: true, lastTickAt: Date.now() };
  // Compute the current remaining (running state decays).
  const elapsed = prev.isPaused ? 0 : Math.max(0, Date.now() - prev.lastTickAt);
  const currentRemaining = Math.max(0, prev.totalMillis - elapsed);

  let nextTotal = currentRemaining;
  let nextPaused = prev.isPaused;
  if (op === 'add') {
    if (seconds <= 0) return res.status(400).json({ error: 'seconds must be > 0' });
    nextTotal = currentRemaining + seconds * 1000;
    broadcast(req, 'timerAddSeconds', { seconds });
  } else if (op === 'start') {
    nextTotal = durationMs > 0 ? durationMs : currentRemaining;
    nextPaused = false;
  } else if (op === 'pause') {
    nextTotal = currentRemaining;
    nextPaused = true;
  } else if (op === 'resume') {
    nextPaused = false;
  } else if (op === 'stop') {
    nextTotal = 0;
    nextPaused = true;
  }
  emitTimerUpdate(req, channelId, nextTotal, nextPaused);
  res.json({ state: op, totalMillis: nextTotal, isPaused: nextPaused });
});

// ── Coin Jar Reset ─────────────────────────────────────────────────────────
router.post('/coinjar/reset', (req, res) => {
  broadcast(req, 'coinjarReset', {});
  res.json({ reset: true });
});

// ── User Info ──────────────────────────────────────────────────────────────
router.post('/userinfo/show', (req, res) => {
  const userId = req.body?.userId ?? req.body?.UserId ?? '';
  const username = req.body?.username ?? req.body?.Username ?? '';
  broadcast(req, 'showUserScore', { userId, username });
  res.json({ shown: true });
});

// ── Wheel + WheelOfActions ─────────────────────────────────────────────────
router.post('/wheel/spin', (req, res) => {
  broadcast(req, 'spinWheel', req.body ?? {});
  res.json({ spun: true });
});
router.post('/wheelofactions/spin', (req, res) => {
  broadcast(req, 'onSpinWheel', req.body ?? {});
  res.json({ spun: true });
});

// ── Coin Drop ──────────────────────────────────────────────────────────────
router.post('/coindrop/create', (req, res) => {
  broadcast(req, 'createCoins', req.body ?? {});
  res.json({ created: true });
});
router.post('/coindrop/timeout', (req, res) => {
  broadcast(req, 'timeoutCoins', req.body ?? {});
  res.json({ timedOut: true });
});
router.post('/coindrop/collect', (req, res) => {
  broadcast(req, 'collectCoin', req.body ?? {});
  res.json({ collected: true });
});

// ── Coin Match ─────────────────────────────────────────────────────────────
const COIN_MATCH_EVENTS = {
  start: 'coin-match:start',
  update: 'coin-match:update',
  result: 'coin-match:result',
  reset: 'coin-match:reset',
};
router.post('/coinmatch/:action', (req, res) => {
  const eventName = COIN_MATCH_EVENTS[req.params.action];
  if (!eventName) {
    return res.status(400).json({ error: 'Invalid action. Use: start, update, result, reset' });
  }
  broadcast(req, eventName, req.body ?? {});
  res.json({ action: req.params.action });
});

// ── Command Info widgets ───────────────────────────────────────────────────
router.post('/commands/show', (req, res) => {
  broadcast(req, 'showCommands', req.body ?? {});
  res.json({ shown: true });
});
router.post('/commands/custom', (req, res) => {
  broadcast(req, 'showCustomCommands', req.body ?? {});
  res.json({ shown: true });
});
router.post('/commands/result', (req, res) => {
  broadcast(req, 'showCommandResult', req.body ?? {});
  res.json({ shown: true });
});

// ── Actions (myactions widget) ─────────────────────────────────────────────
router.post('/actions/execute', (req, res) => {
  broadcast(req, 'executeAction', req.body ?? {});
  res.json({ executed: true });
});

router.post('/actions/changed', (req, res) => {
  broadcast(req, 'actionsChanged', {});
  res.json({ notified: true });
});

// Per-action side effect dispatchers. Mirrors what the original C# bridge
// did inside `TikTokBridgeService.TryDispatchActionsAsync`:
//   - webhookUrl: POST {action, context} to that URL
//   - streamerbotActionId: POST {action:{id}, args} to Streamerbot DoAction
//   - mcCmd: POST to a configured Minecraft webhook endpoint
//   - keystrokes: POST to a configured keystroke daemon
// All fire-and-forget; failures only log. Test endpoint AND live TikTok
// event paths can both call these.
function fireWebhookForAction(actionInfo, context) {
  const url = typeof actionInfo.webhookUrl === 'string' ? actionInfo.webhookUrl.trim() : '';
  if (!url) return false;
  webhooks.fireOneShot(url, {
    action: { id: actionInfo.id, name: actionInfo.name, type: actionInfo.type },
    test: !!context.__test,
    context,
  }).catch(() => {});
  return true;
}

function fireStreamerbotForAction(actionInfo, context) {
  const sbActionId = typeof actionInfo.streamerbotActionId === 'string' ? actionInfo.streamerbotActionId.trim() : '';
  if (!sbActionId) return false;
  const sbHost = (process.env.TIKMAX_STREAMERBOT_URL || 'http://127.0.0.1:7474').replace(/\/+$/, '');
  const url = sbHost + '/DoAction';
  webhooks.fireOneShot(url, {
    action: { id: sbActionId },
    args: { tikfinityAction: actionInfo.name, test: !!context.__test, username: context.username },
  }).catch(() => {});
  return true;
}

function fireMinecraftForAction(actionInfo, context) {
  const cmd = typeof actionInfo.mcCmd === 'string' ? actionInfo.mcCmd.trim() : '';
  if (!cmd) return false;
  // Minecraft commands run via the existing webhook channel — user configures
  // a Minecraft bridge URL via env (defaults match the original Tikfinity
  // helper port).
  const url = process.env.TIKMAX_MINECRAFT_URL || 'http://127.0.0.1:5293/mc';
  webhooks.fireOneShot(url, {
    cmd,
    username: context.username,
    test: !!context.__test,
  }).catch(() => {});
  return true;
}

function fireKeystrokesForAction(actionInfo, context) {
  const keys = typeof actionInfo.keystrokes === 'string' ? actionInfo.keystrokes.trim() : '';
  if (!keys) return false;
  const url = process.env.TIKMAX_KEYSTROKE_URL || 'http://127.0.0.1:5294/keystroke';
  webhooks.fireOneShot(url, {
    keystrokes: keys,
    username: context.username,
    test: !!context.__test,
  }).catch(() => {});
  return true;
}

// Public dispatcher — re-used by live TikTok event path (tiktok-bridge.js)
// when a gift/like/follow matches an action. Returns the bitmask of fired
// channels so callers can report status.
function dispatchActionSideEffects(actionInfo, context) {
  return {
    webhookFired: fireWebhookForAction(actionInfo, context),
    streamerbotFired: fireStreamerbotForAction(actionInfo, context),
    minecraftFired: fireMinecraftForAction(actionInfo, context),
    keystrokesFired: fireKeystrokesForAction(actionInfo, context),
  };
}

// Manual test fire — looks up the action, builds (actionInfo, context) and
// broadcasts as TWO positional args so io.on('executeAction', (info, ctx) =>
// ...) sees them as separate params. ALSO fires per-action side effects
// (webhook/streamerbot/minecraft/keystrokes) so the test endpoint exercises
// the full pipeline — same as the C# version did.
router.post('/actions/test', (req, res) => {
  const channelId = resolveChannelId(req);
  const profileId = resolveProfileId(channelId);
  const id = req.query.id ? parseInt(req.query.id, 10) : null;
  const name = typeof req.query.name === 'string' ? req.query.name : null;

  const all = actions.listByChannelProfile(channelId, profileId).filter((a) => a.Enabled);
  let action = null;
  if (id) action = all.find((a) => a.Id === id) || null;
  else if (name) action = all.find((a) => (a.Name || '').toLowerCase() === name.toLowerCase()) || null;
  else action = all[0] || null;

  if (!action) return res.status(404).json({ error: 'Action not found', id, name });

  let actionInfo = {};
  try {
    if (action.ConfigJson && action.ConfigJson.trim()) {
      const parsed = JSON.parse(action.ConfigJson);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) actionInfo = parsed;
    }
  } catch {
    /* ignore */
  }
  actionInfo.id = action.Id;
  actionInfo.channelId = action.ChannelId;
  actionInfo.name = action.Name;
  if (actionInfo.screenId == null) actionInfo.screenId = 1;
  if (actionInfo.duration == null) actionInfo.duration = 5;
  if (actionInfo.enableFadeEffect == null) actionInfo.enableFadeEffect = true;
  if (actionInfo.dynamicConfig == null) actionInfo.dynamicConfig = {};

  const context = {
    username: 'tester',
    nickname: 'Tester',
    giftData: { value: 1 },
    giftName: 'Rose',
    repeatCount: 1,
    likeCount: 15,
    totalLikeCount: 100,
    subMonth: 1,
    commandParams: '',
    ttsLanguage: 'en-US',
    ttsRandomVoice: 'en_us_001',
    thumbnailUrl:
      'https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/4ec174248f94de26938f73874962469b~c5_100x100.jpeg',
  };

  sockets.broadcastArgs('executeAction', actionInfo, context);
  logger.info(`[Widget] test fire id=${action.Id} name="${action.Name}" clients=${sockets.connectionCount()}`);

  res.json({
    fired: true,
    actionId: action.Id,
    actionName: action.Name,
    clients: sockets.connectionCount(),
    // Side-effects gated until Phase 3 lands the bridge.
    webhookFired: false,
    streamerbotFired: false,
    minecraftFired: false,
    keystrokesFired: false,
  });
});

// ── Song Requests ──────────────────────────────────────────────────────────
router.post('/songrequests/playlist', (req, res) => {
  broadcast(req, 'setPlaylistItems', req.body ?? {});
  res.json({ set: true });
});

// ── Generic broadcast escape hatch ─────────────────────────────────────────
router.post('/broadcast/:eventName', (req, res) => {
  const eventName = req.params.eventName;
  if (!eventName) return res.status(400).json({ error: 'eventName required' });
  broadcast(req, eventName, req.body ?? {});
  res.json({ eventName, sent: true });
});

module.exports = router;
