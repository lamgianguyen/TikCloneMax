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
const channels = require('../db/models/channels');
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

// ── Channel users (leaderboards) — empty in local mode ─────────────────────

router.get('/odata/channeluser', (_req, res) => {
  res.json({ value: [] });
});

router.get('/rest/channeluser', (_req, res) => {
  res.json({
    status: 200,
    message: 'OK',
    arrayKey: 'channelusers',
    channelusers: [],
    pageSize: 3,
    page: 0,
    orderType: 'DESC',
    orderColumn: 'id',
    hasNext: false,
  });
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
