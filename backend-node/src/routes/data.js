// /api/odata/*, /api/rest/*, /api/get*, /api/usage/log, /api/logError,
// /api/backup
//
// Port of `backend/Controllers/DataController.cs`. Mix of:
//   - Transaction log (real DB read, two URL shapes for ODATA-style vs REST)
//   - Stable empty-shape stubs the bundle expects on boot (channeluser
//     leaderboards, user counts, emotes — all empty for the local single-user
//     install)
//   - Cached big-file fixtures shipped with the bundle (`getAllGifts`,
//     `getAllAnimations`) — these JSON files live under `downloads/api/` and
//     are large (~400KB / ~43KB). Read once, hand back unmodified.

const express = require('express');
const fs = require('fs');
const path = require('path');
const transactions = require('../db/models/transactions');
const points = require('../services/points');
const channels = require('../db/models/channels');
const sockets = require('../services/socket-manager');
const actions = require('../db/models/actions');

function resolveProfileIdData(channelId) {
  const ch = channelId > 0 ? channels.findById(channelId) : null;
  return ch && ch.ProfileId > 0 ? ch.ProfileId : 1;
}
const config = require('../config');
const logger = require('../logger');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

// Bundle reads camelCase shape (ASP.NET Core 9 Web default).
function mapTransaction(t) {
  return {
    id: t.Id,
    transactionId: t.TransactionId,
    type: t.Type,
    amount: t.Amount,
    currency: t.Currency,
    status: t.Status,
    paymentMethod: t.PaymentMethod,
    paymentProvider: t.PaymentProvider,
    createdAt: t.CreatedAt,
  };
}

// In-memory cache for the bundle's pre-recorded data fixtures. These files
// never change at runtime — the C# version cached them too. Stored as raw
// pre-serialized strings to avoid re-stringifying ~400KB on every call.
const _bundleFixtureCache = new Map();

function loadBundleFixture(name) {
  if (_bundleFixtureCache.has(name)) return _bundleFixtureCache.get(name);
  const filePath = path.join(config.FRONTEND_PATH, 'api', name);
  if (!fs.existsSync(filePath)) {
    _bundleFixtureCache.set(name, null);
    return null;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    _bundleFixtureCache.set(name, raw);
    return raw;
  } catch (err) {
    logger.warn({ err, filePath }, '[Data] failed to read bundle fixture');
    _bundleFixtureCache.set(name, null);
    return null;
  }
}

function sendRawJson(res, rawString) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).end(rawString);
}

// ── Transactions ───────────────────────────────────────────────────────────

router.get('/odata/transaction', (req, res) => {
  const channelId = resolveChannelId(req);
  const list = channelId > 0 ? transactions.listByChannel(channelId).map(mapTransaction) : [];
  res.json({ value: list });
});

router.get('/rest/transaction', (req, res) => {
  const channelId = resolveChannelId(req);
  const list = channelId > 0 ? transactions.listByChannel(channelId).map(mapTransaction) : [];
  res.json({
    status: 200,
    message: 'OK',
    arrayKey: 'transactions',
    transactions: list,
    data: list,
    pageSize: Math.max(list.length, 1),
    page: 0,
    hasNext: false,
  });
});

// PUT /rest/transaction — manual points grant/adjust + reward redemption. The
// bundle (deobfuscated.js:72386) sends {userId,username,nickname,amount,isReward,
// isManual,description,...} and reads response.preBalanceValidationPassed +
// response.transaction + response.channeluser.totalRewardAmount. Points are
// stored as running per-user balances (services/points), not a per-row ledger,
// so we apply the delta and return the expected shape. Without this, manual
// grant 404'd SILENTLY (the bundle suppresses the error toast for this path).
router.put('/rest/transaction', (req, res) => {
  const channelId = resolveChannelId(req);
  const b = req.body || {};
  const username = String(b.username || b.userId || '').trim();
  const amount = Number(b.amount) || 0;
  if (!username || channelId <= 0) {
    return res.json({ status: 200, preBalanceValidationPassed: false });
  }
  const current = points.getBalance(channelId, username);
  const next = current + amount;
  // The bundle shows a BALANCE error when preBalanceValidationPassed===false;
  // reject a deduction that would drive the balance negative.
  if (next < 0) {
    return res.json({ status: 200, preBalanceValidationPassed: false, currentBalance: current });
  }
  points.setBalance(channelId, username, next);
  // Record viewer identity so later reads by numeric userId (the bundle's
  // rest/channeluser?userId= lookup + the !points leaderboard) resolve back to
  // this balance. Merged, so partial calls never wipe known fields.
  points.recordIdentity(channelId, username, {
    userId: b.userId,
    nickname: b.nickname,
    thumbnailUrl: b.thumbnailUrl,
  });
  const transaction = {
    id: 0,
    userId: b.userId ?? '',
    username,
    nickname: b.nickname ?? username,
    amount,
    isReward: !!b.isReward,
    isManual: !!b.isManual,
    description: b.description ?? '',
    thumbnailUrl: b.thumbnailUrl ?? '',
    createdAt: new Date().toISOString(),
  };
  res.json({
    status: 200,
    message: 'OK',
    preBalanceValidationPassed: true,
    transaction,
    channeluser: {
      userId: b.userId ?? '',
      username,
      nickname: b.nickname ?? username,
      balance: next,
      totalAmount: next,
      totalRewardAmount: next,
      thumbnailUrl: b.thumbnailUrl ?? '',
    },
  });
});

// DELETE /rest/transaction/:id — the bundle removes a points ledger entry. The
// clone keeps only running balances (no per-row ledger), so there is nothing to
// delete; ack 200 so the UI does not error.
router.delete('/rest/transaction/:id', (_req, res) => {
  res.json({ status: 200 });
});

// ── Channel users (leaderboards) — empty in local mode ─────────────────────

// Leaderboard grid (DevExtreme ODataStore on the Points page — decompiled
// modules:9772/13716/14042). Surface the stored balances, highest first.
router.get('/odata/channeluser', (req, res) => {
  const channelId = resolveChannelId(req);
  const list = channelId > 0 ? points.listChannelUsers(channelId, 500) : [];
  res.json({ value: list, '@odata.count': list.length });
});

// rest/channeluser drives: !points (single read by userId + top-100 check —
// modules:4205/4218), wheel-spin + transfer balance checks (9256/14684), and
// the app.js single read ($.get ...?userId= — 70492). The bundle queries by
// numeric userId OR username; honour both. Previously returned [] always, so
// every awarded balance read back as 0.
router.get('/rest/channeluser', (req, res) => {
  const channelId = resolveChannelId(req);
  const envelope = {
    status: 200,
    message: 'OK',
    arrayKey: 'channelusers',
    page: 0,
    orderType: 'DESC',
    orderColumn: 'totalAmount',
    hasNext: false,
  };
  if (channelId <= 0) {
    return res.json({ ...envelope, channelusers: [], data: [], pageSize: 1 });
  }
  const userId = req.query.userId;
  const username = req.query.username;
  let list;
  if ((userId != null && userId !== '') || (username != null && username !== '')) {
    const one = points.getChannelUser(channelId, { userId, username });
    list = one ? [one] : [];
  } else {
    const pageSize = Math.max(1, Math.min(500, Number(req.query.pageSize) || 100));
    list = points.listChannelUsers(channelId, pageSize);
  }
  res.json({ ...envelope, channelusers: list, data: list, pageSize: Math.max(list.length, 1) });
});

// POST /deleteAllUsers — Setup "Reset Points" / "DB Reset" button. The bundle
// (setup.resetDbPoints, decompiled/modules:2674) does POST deleteAllUsers and
// shows "DB reset success!" on 200. The route did NOT exist → 404 swallowed by
// the bundle's empty error callback → the button appeared to do nothing. Wipes
// all viewer points + identity rows for the channel.
router.post('/deleteAllUsers', (req, res) => {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.json({ status: 200, message: 'OK', removed: 0 });
  const removed = points.clearAll(channelId);
  // Snap any live points displays to empty (the Points leaderboard grid
  // re-fetches on its own via odata/channeluser).
  try { sockets.broadcastToChannel('pointsReset', { channelId, removed }, channelId, 'widget'); } catch (_) {}
  try { sockets.broadcast('pointsReset', { channelId, removed }); } catch (_) {}
  res.json({ status: 200, message: 'OK', removed });
});

// POST /executeAction — the bundle fires this on EVERY matched action (live +
// test): api.doAction("POST","executeAction",{actionId,context}) (decompiled
// modules:9061). On 200 the bundle's success callback awards points
// (transaction.put, :9067); on 404 it skipped the award AND showed an "API
// Error (404)" toast every fire. ACK 200 + fire the action's overlay to widget
// sockets (what the C# server did) so live actions display.
router.post('/executeAction', (req, res) => {
  const channelId = resolveChannelId(req);
  const b = req.body || {};
  const actionId = parseInt(b.actionId, 10);
  const context = (b.context && typeof b.context === 'object') ? b.context : {};
  try {
    if (actionId && channelId > 0) {
      const profileId = resolveProfileIdData(channelId);
      const action = actions.listByChannelProfile(channelId, profileId).find((a) => a.Id === actionId && a.Enabled);
      if (action) {
        let actionInfo = {};
        try {
          if (action.ConfigJson && action.ConfigJson.trim()) {
            const p = JSON.parse(action.ConfigJson);
            if (p && typeof p === 'object' && !Array.isArray(p)) actionInfo = p;
          }
        } catch { /* ignore */ }
        actionInfo.id = action.Id;
        actionInfo.channelId = action.ChannelId;
        actionInfo.name = action.Name;
        if (actionInfo.screenId == null) actionInfo.screenId = 1;
        if (actionInfo.duration == null) actionInfo.duration = 5;
        if (actionInfo.enableFadeEffect == null) actionInfo.enableFadeEffect = true;
        if (actionInfo.dynamicConfig == null) actionInfo.dynamicConfig = {};
        sockets.broadcastArgs('executeAction', actionInfo, context);
      }
    }
  } catch (err) {
    logger.warn({ err }, '[Data] executeAction failed');
  }
  res.json({ status: 200, message: 'OK' });
});

// POST /deleteChannelUsers — bundle's Points-page "delete selected viewers"
// (modules:2814/13820, body {userIds:[…]}). Was 404. Resolve each userId →
// username (identity map) and zero its balance (the leaderboard filters
// balance>0, so they drop off). deleteAllUsers wipes everyone; this is scoped.
router.post('/deleteChannelUsers', (req, res) => {
  const channelId = resolveChannelId(req);
  const b = req.body || {};
  const userIds = Array.isArray(b.userIds) ? b.userIds : (b.userId != null ? [b.userId] : []);
  let removed = 0;
  if (channelId > 0) {
    for (const uid of userIds) {
      const uname = points.findUsernameByUserId(channelId, uid);
      if (uname) { points.setBalance(channelId, uname, 0); removed++; }
    }
  }
  res.json({ status: 200, message: 'OK', removed });
});

router.all('/getChannelUserCount', (_req, res) => {
  res.json({ status: 200, message: 'OK', count: 0 });
});

router.all('/getChannelEmotes', (_req, res) => {
  const empty = [];
  res.json({
    status: 200,
    message: 'OK',
    isPro: true,
    data: { isPro: true },
    value: empty,
    items: empty,
    results: empty,
    subscription: { isPro: true },
    list: empty,
    sounds: empty,
    actions: empty,
    triggers: empty,
    events: empty,
    gifts: empty,
    emotes: empty,
    channels: empty,
    users: empty,
    total: 0,
    count: 0,
  });
});

// ── Bundle pre-recorded fixtures ───────────────────────────────────────────
//
// The C# version reads `downloads/api/getAllGifts` (no extension!) and
// returns the raw JSON. Match that filename exactly — TikFinity didn't add
// .json. Falls back to empty array when the fixture is missing.

router.all(['/getAllGifts', '/getAllGiftsCached'], (_req, res) => {
  const raw = loadBundleFixture('getAllGifts');
  if (raw) return sendRawJson(res, raw);
  res.json([]);
});

router.all('/getAllAnimations', (_req, res) => {
  const raw = loadBundleFixture('getAllAnimations');
  if (raw) return sendRawJson(res, raw);
  res.json({ status: 200, message: 'OK', animations: [] });
});

router.all('/getLiveChannels', (_req, res) => {
  res.json({
    status: 200,
    message: 'OK',
    liveChannelCount: 0,
    liveChannels: [],
    channels: [],
  });
});

router.all('/getGlobalTransactions', (_req, res) => {
  res.json({
    status: 200,
    message: 'OK',
    globalTransactions: [],
    transactions: [],
  });
});

router.all('/getMyInstants', (_req, res) => {
  res.json({
    status: 200,
    message: 'OK',
    arrayKey: 'instants',
    instants: [],
    data: [],
    pageSize: 50,
    page: 0,
    hasNext: false,
  });
});

// ── Telemetry endpoints — accept and discard ───────────────────────────────

router.post('/usage/log', (_req, res) => res.json({ status: 200 }));
router.post('/logError', (_req, res) => res.json({ status: 200 }));
router.post('/backup', (_req, res) => res.json({ status: 200, message: 'OK' }));

module.exports = router;
