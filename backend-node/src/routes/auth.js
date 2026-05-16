// /api/auth/*, /api/v1/auth/*, /api/v1/flow/*, /api/v1/code/*
//
// Port of `backend/Controllers/AuthController.cs`. In the desktop/local
// deployment, real auth happens at the TikfinityServer license gate
// (127.0.0.1:5194) before this backend even gets traffic. The bundle still
// expects the cloud-flavoured shape, so we:
//
//   - `/sso-bridge`: mint a local JWT bound to the default channel — this
//     is what the Electron auth bridge calls after the license gate
//     accepts the user.
//   - `/logout`: revoke the token's jti so the same token can't be reused
//     after the user signs out.
//   - `/login`, `/register`, `/code/*`, `/flow/*`: kept as stable stubs
//     the obfuscated bundle's auth wiring expects. Returning the right
//     shape (vs. a 404) is what keeps the bundle from re-popping the
//     login modal on every focus.

const express = require('express');
const jwt = require('../services/jwt');
const channels = require('../db/models/channels');
const revokedTokens = require('../db/models/revoked-tokens');
const { extractToken } = require('../middleware/auth');
const logger = require('../logger');

const router = express.Router();

function getDefaultChannel() {
  return channels.findDefault();
}

// GET/POST /api/v1/auth/sso-bridge
// Returns a fresh access token for the default channel. Used by the Electron
// auth bridge after the TikfinityServer license gate clears.
router.all('/v1/auth/sso-bridge', (_req, res) => {
  const ch = getDefaultChannel();
  if (!ch) {
    return res.status(404).json({ status: 'error', message: 'No default channel' });
  }
  const { token } = jwt.generateAccessToken(ch.ChannelId, ch.ChannelName, ch.Email, true);
  res.json({
    status: 'ok',
    accessToken: token,
    channelId: ch.ChannelId,
    channelName: ch.ChannelName,
    email: ch.Email,
    isPro: true,
  });
});

// POST /api/auth/logout & /api/v1/auth/logout
function handleLogout(req, res) {
  const token = extractToken(req);
  if (!token) return res.json({ status: 'ok', message: 'Logged out' });

  const claims = jwt.validateToken(token);
  if (!claims || !claims.jti) {
    return res.json({ status: 'ok', message: 'Logged out' });
  }

  // exp is seconds since epoch; convert to ISO for the revocation row.
  let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  if (typeof claims.exp === 'number') {
    expiresAt = new Date(claims.exp * 1000).toISOString();
  }
  const channelId = Number(claims.channelId) || 0;

  try {
    revokedTokens.revoke({ jti: claims.jti, channelId, expiresAt });
    logger.info(`[AUTH] Logout revoked jti=${claims.jti} channelId=${channelId}`);
  } catch (err) {
    logger.warn({ err }, '[AUTH] revoke failed');
  }
  res.json({ status: 'ok', message: 'Logged out' });
}

router.post('/auth/logout', handleLogout);
router.post('/v1/auth/logout', handleLogout);

// ── Stubs the bundle's cloud-flavoured auth wiring expects ──────────────────

// /api/auth/login & /api/v1/auth/login — desktop deployment doesn't use
// password auth; the Serial Key gate upstream is the real check. Return 401
// so the bundle's login modal doesn't claim success on an empty submit.
function handleLoginStub(_req, res) {
  res.status(401).json({
    status: 'error',
    message: 'Login is handled by the TikfinityServer license gate',
  });
}
router.post('/auth/login', handleLoginStub);
router.post('/v1/auth/login', handleLoginStub);
router.post('/auth/register', handleLoginStub);
router.post('/v1/auth/register', handleLoginStub);

// Email code flow — bundle calls /code/send before showing the OTP modal.
// Return a stable flowId so the bundle moves to its next state, then
// /code/validate rejects with 401 to short-circuit the loop back to
// "use the desktop license gate".
router.post('/v1/code/send', (_req, res) => {
  res.json({ status: 'ok', flowId: 'local-flow-001' });
});
router.post('/v1/code/validate', (_req, res) => {
  res.status(401).json({
    status: 'error',
    message: 'Login via the TikfinityServer license gate',
  });
});

// OAuth-style flow stubs.
router.all('/v1/flow/start', (req, res) => {
  const accept = String(req.headers.accept || '');
  const appId = req.query.appId || req.body?.appId || 'tikfinity';
  logger.info(`[AUTH] Flow start appId=${appId} redirect=${req.query.redirectUrl || ''}`);

  if (accept.includes('text/html')) {
    // Bundle expected a login-popup HTML page here; in the desktop build
    // this never fires because the popup is rendered by Electron itself.
    // Return a minimal "already authed" page that posts a message back
    // and self-closes if it ever does open.
    return res
      .status(200)
      .type('html')
      .send(
        '<!doctype html><html><head><meta charset="utf-8"><title>TikFinity</title></head>' +
        '<body><script>try{window.opener&&window.opener.postMessage({type:"auth-complete"},"*");}catch(e){}window.close();</script></body></html>'
      );
  }
  res.json({ status: 'ok', flowId: 'local-flow-001', appId });
});

router.all(['/v1/flow/end', '/v1/flow/logout'], (req, res) => {
  // Match the C# version's safe-redirect logic: only honor localhost-ish
  // redirectUrl values, otherwise fall through to /logout.
  const raw = req.query.redirectUrl || req.body?.redirectUrl || '';
  let next = '/logout';
  if (typeof raw === 'string' && raw) {
    try {
      const url = new URL(raw);
      if (url.host === 'localhost' || url.hostname === '127.0.0.1') {
        next = `/logout?next=${encodeURIComponent(url.pathname + url.search + url.hash)}`;
      }
    } catch {
      if (raw.startsWith('/')) {
        next = `/logout?next=${encodeURIComponent(raw)}`;
      }
    }
  }
  res.redirect(next);
});

router.all('/v1/flow/callback', (_req, res) => {
  res.status(401).json({
    status: 'error',
    message: 'Login via the TikfinityServer license gate',
  });
});

router.all('/v1/flow/status', (req, res) => {
  const flowId = req.query.flowId || req.body?.flowId || 'local-flow-001';
  res.json({ status: 'ok', flowId, completed: true });
});

module.exports = router;
