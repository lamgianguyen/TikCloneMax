// JWT and auth helpers
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'TikFinityBackendSuperSecretKey2024!@#$%^&*()LongEnoughForHmacSha256';
const JWT_ISSUER = 'TikFinityBackend';
const JWT_AUDIENCE = 'TikFinityFrontend';
const PASSWORD_SALT = 'tikfinity-local-salt';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + PASSWORD_SALT).digest('hex');
}

function generateToken(channelId, channelName, email, isPro) {
  return jwt.sign(
    { channelId, channelName, email, isPro, jti: crypto.randomUUID() },
    JWT_SECRET,
    { expiresIn: '30d', issuer: JWT_ISSUER, audience: JWT_AUDIENCE }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER, audience: JWT_AUDIENCE });
  } catch { return null; }
}

function generateFeaturebaseToken(channelName, email, channelId) {
  return jwt.sign(
    { name: channelName, email: email || `${channelName}@local`, id: String(channelId) },
    JWT_SECRET,
    { expiresIn: '30d', algorithm: 'HS256' }
  );
}

// Express middleware: extract channelId from Bearer token
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ') && auth.length > 20) {
    const token = auth.slice(7);
    const decoded = verifyToken(token);
    if (decoded) {
      req.channelId = decoded.channelId || 1;
      req.channelName = decoded.channelName || '';
      req.isPro = true;
      next();
      return;
    }
    // Non-JWT token but long enough (e.g. dev token) — treat as authenticated
    if (token.length >= 10) {
      req.channelId = 1;
      req.channelName = '';
      req.isPro = true;
      next();
      return;
    }
  }
  // Fallback: check cookie
  const cookieToken = req.cookies?.tf_login_token;
  if (cookieToken && cookieToken.length >= 10) {
    const decoded = verifyToken(cookieToken);
    req.channelId = decoded?.channelId || 1;
    req.channelName = decoded?.channelName || '';
    req.isPro = true;
  } else {
    req.channelId = 0;
    req.channelName = '';
    req.isPro = false;
  }
  next();
}

module.exports = { hashPassword, generateToken, verifyToken, generateFeaturebaseToken, authMiddleware };
