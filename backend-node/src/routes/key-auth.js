// POST /api/auth/key-login — Serial Key gate.
//
// Direct port of `backend/Controllers/KeyAuthController.cs`. Calls the
// TikfinityServer license validator at AUTH_HOST (default
// http://127.0.0.1:5194), and on success mints a local JWT bound to either
// an existing channel keyed by the license keyId or a freshly created one.
//
// This is the ONLY auth path the desktop bundle actually uses in production
// — the username/password endpoints in routes/auth.js are kept only because
// the obfuscated bundle calls them defensively and we don't want 404s.

const express = require('express');
const config = require('../config');
const channels = require('../db/models/channels');
const subscriptions = require('../db/models/subscriptions');
const jwt = require('../services/jwt');
const logger = require('../logger');

const router = express.Router();

const LICENSE_KEY_SETTING_PROVIDER = 'license-key';

/**
 * Find an existing channel by its license key (stored on Channels.Sub), or
 * create a fresh one. Mirrors `ChannelService.FindOrCreateByLicenseKey` in
 * the C# code.
 */
function findOrCreateByLicenseKey(keyId, expiresAtIso) {
  // Try to find by Sub === keyId first.
  const all = channels.listAll();
  let channel = all.find((c) => c.Sub === keyId) || null;

  if (!channel) {
    // Reuse the single default channel if one exists and has no Sub yet —
    // single-user mode shouldn't fan out into N channels per key.
    const def = channels.findDefault();
    if (def && !def.Sub) {
      // PATCH existing default channel — write keyId into Sub column. There
      // is no dedicated channels.updateSub() so use raw stmt path through
      // affId path (it's nullable string too) — actually safer to add one.
      // Inline raw update for this rare boot-time flow.
      const db = require('../db/conn');
      db.prepare(`UPDATE "Channels" SET "Sub" = ?, "UpdatedAt" = ? WHERE "ChannelId" = ?`).run(
        keyId,
        new Date().toISOString(),
        def.ChannelId
      );
      channel = channels.findById(def.ChannelId);
    } else {
      const id = channels.create({
        ChannelName: 'user',
        Email: '',
        Sub: keyId,
        SignupAuthProvider: LICENSE_KEY_SETTING_PROVIDER,
      });
      channel = channels.findById(id);
    }
  }

  // Mark Pro + carry expiry from license.
  subscriptions.upsert({
    channelId: channel.ChannelId,
    isPro: true,
    plan: 'pro',
    active: true,
    proExpireAt: expiresAtIso,
    proExpireSetBy: 'license',
  });

  return channel;
}

router.post('/key-login', async (req, res) => {
  const keyId = (req.body?.keyId ?? req.body?.KeyId ?? '').toString().trim().toUpperCase();
  const keyCode = (req.body?.keyCode ?? req.body?.KeyCode ?? '').toString().trim();

  if (!keyId) {
    return res.status(400).json({
      status: 'error',
      reason: 'INVALID_INPUT',
      message: 'Vui lòng nhập Serial Key.',
    });
  }

  const baseUrl = (config.AUTH_HOST || 'http://127.0.0.1:5194').replace(/\/+$/, '');
  const validateUrl = `${baseUrl}/api/keys/validate`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10_000);
  let result;
  try {
    const resp = await fetch(validateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyId, keyCode }),
      signal: ctrl.signal,
    });
    if (!resp.ok) {
      logger.warn(`[KEY-AUTH] License server returned ${resp.status}`);
      return res.status(502).json({
        status: 'error',
        reason: 'UPSTREAM_ERROR',
        message: `License server lỗi (${resp.status}).`,
      });
    }
    result = await resp.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      logger.warn('[KEY-AUTH] License server timeout');
      return res.status(504).json({
        status: 'error',
        reason: 'TIMEOUT',
        message: 'License server không phản hồi.',
      });
    }
    logger.error({ err, validateUrl }, '[KEY-AUTH] cannot reach license server');
    return res.status(503).json({
      status: 'error',
      reason: 'UNREACHABLE',
      message: 'Không kết nối được tới license server. Kiểm tra mạng hoặc URL.',
      licenseServerUrl: baseUrl,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!result || typeof result !== 'object') {
    return res.status(502).json({
      status: 'error',
      reason: 'BAD_RESPONSE',
      message: 'License server trả response rỗng.',
    });
  }

  if (!result.valid) {
    return res.status(401).json({
      status: 'error',
      reason: result.reason || 'INVALID',
      message: result.message || 'Serial Key không hợp lệ.',
      expiredAt: result.expiredAt,
    });
  }

  const expiresAtIso = result.expiredAt || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString();
  const channel = findOrCreateByLicenseKey(keyId, expiresAtIso);
  const sub = subscriptions.findByChannel(channel.ChannelId);
  const isPro = sub ? !!sub.IsPro : true;

  const { token } = jwt.generateAccessToken(channel.ChannelId, channel.ChannelName, channel.Email, isPro);
  logger.info(`[KEY-AUTH] Login ok keyId=${keyId} channelId=${channel.ChannelId} daysLeft=${result.daysLeft}`);

  res.json({
    status: 'ok',
    accessToken: token,
    channelId: channel.ChannelId,
    channelName: channel.ChannelName,
    isPro,
    license: {
      keyId,
      expiredAt: result.expiredAt,
      daysLeft: result.daysLeft,
    },
  });
});

module.exports = router;
