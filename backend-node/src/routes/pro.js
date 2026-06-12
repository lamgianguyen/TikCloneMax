// /api/pro/* — Pro subscription endpoints.
//
// Port of `backend/Controllers/ProController.cs`. In the desktop deployment
// the Serial Key gate (TikfinityServer at 127.0.0.1:5194) is the real Pro
// validator. These endpoints exist so the bundle's pro-upgrade UI doesn't
// 404 on payment-method enumeration; the upgrade flow is a no-op locally.

const express = require('express');
const subscriptions = require('../db/models/subscriptions');
const transactions = require('../db/models/transactions');
const channels = require('../db/models/channels');
const crypto = require('crypto');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

router.post('/setUpgradeIntent', (_req, res) => {
  res.json({ status: 200 });
});

router.all('/tazapay/methods', (_req, res) => {
  res.json({
    status: 200,
    message: 'OK',
    cached: true,
    country: 'VN',
    methods: [
      { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
      { id: 'bank', name: 'Bank Transfer', icon: 'bank' },
      { id: 'momo', name: 'MoMo Wallet', icon: 'wallet' },
    ],
  });
});

router.post('/upgrade', (req, res) => {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.json({ status: 200, subscription: { isPro: false, plan: 'free', active: false } });

  const dto = req.body || {};
  const plan = (dto.Plan ?? dto.plan ?? 'pro').toString();
  const months = Math.max(1, Number(dto.Months ?? dto.months ?? 1) | 0);
  const amount = Number(dto.Amount ?? dto.amount ?? 0);
  const currency = (dto.Currency ?? dto.currency ?? 'USD').toString();
  const paymentMethod = dto.PaymentMethod ?? dto.paymentMethod ?? null;
  const paymentProvider = dto.PaymentProvider ?? dto.paymentProvider ?? 'manual';

  const expireAt = plan === 'lifetime' ? null : new Date(Date.now() + months * 30 * 24 * 3600 * 1000).toISOString();

  subscriptions.upsert({
    channelId,
    isPro: true,
    plan,
    active: true,
    proExpireAt: expireAt,
    proExpireSetBy: 'payment',
  });

  // Record the transaction so the user can audit upgrades later. UUID-style
  // TransactionId so multiple upgrades on the same channel don't collide.
  transactions.create({
    ChannelId: channelId,
    TransactionId: crypto.randomUUID(),
    Type: 'pro_upgrade',
    Amount: String(amount),
    Currency: currency,
    Status: 'completed',
    PaymentMethod: paymentMethod,
    PaymentProvider: paymentProvider,
  });

  res.json({
    status: 200,
    message: 'Pro upgrade successful',
    subscription: { isPro: true, plan, active: true, proExpireAt: expireAt },
  });
});

// Stub endpoints — desktop deployment never actually deactivates Pro because
// the license gate is the source of truth.
router.post('/deactivate', (_req, res) => res.json({ status: 200, message: 'OK' }));
router.post('/reactivate', (_req, res) => res.json({ status: 200, message: 'OK' }));
router.post('/setPayment', (_req, res) => res.json({ status: 200, message: 'OK' }));
router.all('/stripe', (_req, res) => res.json({ status: 200, message: 'OK', url: '' }));
router.all('/xsolla', (_req, res) => res.json({ status: 200, message: 'OK', url: '' }));
router.all('/lemonsqueezy', (_req, res) => res.json({ status: 200, message: 'OK', url: '' }));

// READ-ONLY. The desktop deployment is ALL-PRO by design (CLAUDE.md §1.0 — the
// license gate at startup is the source of truth) and the stubs above never
// deactivate Pro. This endpoint used to upsert IsPro=0/Active=0 to the DB when
// ProExpireAt lapsed — the ONE path that could persist isPro=false, directly
// against the ALL-PRO invariant. Report status without ever mutating it.
router.get('/status', (req, res) => {
  const channelId = resolveChannelId(req);
  const sub = channelId > 0 ? subscriptions.findByChannel(channelId) : null;
  res.json({
    status: 200,
    isPro: !!(sub && sub.IsPro),
    plan: (sub && sub.Plan) || 'free',
    active: !!(sub && sub.Active),
    proExpireAt: sub ? sub.ProExpireAt : null,
  });
});

module.exports = router;
