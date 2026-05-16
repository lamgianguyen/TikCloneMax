// Auth middleware. Extracts the wsAuthToken from the Authorization header or
// `tf_login_token` cookie, validates it, and stashes the channel id on
// req.auth. Routes that need a known channel call `requireAuth`; routes that
// just want it when present call `optionalAuth`.
//
// The token is the JWT minted by services/jwt.js::generateAccessToken. It
// embeds `channelId`, `channelName`, `email`, `isPro`, and a `jti` we check
// against the RevokedTokens denylist on every request.

const { validateToken } = require('../services/jwt');
const revokedTokens = require('../db/models/revoked-tokens');

function extractToken(req) {
  const h = req.headers.authorization;
  if (h && h.toLowerCase().startsWith('bearer ')) return h.slice(7).trim();
  if (req.cookies && req.cookies.tf_login_token) return req.cookies.tf_login_token;
  return null;
}

/**
 * Populate req.auth when a valid token is present. Never rejects.
 * req.auth shape: { channelId, channelName, email, isPro, jti } or undefined.
 */
function optionalAuth(req, _res, next) {
  const token = extractToken(req);
  if (!token) return next();
  const claims = validateToken(token);
  if (!claims) return next();
  if (claims.jti && revokedTokens.isRevoked(claims.jti)) return next();
  req.auth = {
    channelId: Number(claims.channelId) || 0,
    channelName: claims.channelName || '',
    email: claims.email || '',
    isPro: claims.isPro === 'true' || claims.isPro === true,
    jti: claims.jti,
    exp: claims.exp,
  };
  next();
}

/** Reject 401 when no valid token. */
function requireAuth(req, res, next) {
  optionalAuth(req, res, () => {
    if (!req.auth || !req.auth.channelId) {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    next();
  });
}

module.exports = { optionalAuth, requireAuth, extractToken };
