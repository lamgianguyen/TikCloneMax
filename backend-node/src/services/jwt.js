// JWT service — direct port of backend/Services/JwtService.cs.
//
// The bundle (in renderer) holds two JWTs:
//   1. wsAuthToken    — signs requests back to us. Contains channelId+isPro.
//                       HS256, 7-day expiry. Bundle compares iat across reloads;
//                       if it sees a different iat it treats the session as
//                       stale and reloads — that's the reload-loop bug the C#
//                       backend works around by caching per-channel.
//   2. featurebaseToken — 30-day token signed for Featurebase widget embed.
//                         Same signing key, different audience.
//
// Match the C# claim shape EXACTLY:
//   - wsAuthToken claims: channelId, channelName, ClaimTypes.Email, isPro, jti
//   - featurebaseToken claims: name, userId, iat, email (optional)
//
// `iat` is a standard JWT claim and `jsonwebtoken` includes it automatically,
// but the C# featurebase path also sets it explicitly as an Integer64. We do
// the same so the token byte-for-byte matches what bundle saw before.

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } = require('../config');

const ACCESS_TOKEN_LIFETIME_SECONDS = 7 * 24 * 60 * 60;     // 7 days
const FEATUREBASE_LIFETIME_SECONDS = 30 * 24 * 60 * 60;    // 30 days

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    'TIKMAX_JWT_SECRET is missing or shorter than 32 chars. Set a strong secret before starting the server.'
  );
}

/**
 * Generate the bundle's `wsAuthToken` — signed identity token the bundle
 * stores in localStorage and replays on every backend call.
 *
 * @param {number} channelId
 * @param {string} channelName
 * @param {string} email
 * @param {boolean} isPro
 * @returns {{ token: string, jti: string, expiresAt: Date }}
 */
function generateAccessToken(channelId, channelName, email, isPro) {
  const jti = crypto.randomBytes(16).toString('hex');
  const nowSec = Math.floor(Date.now() / 1000);
  const expiresAtSec = nowSec + ACCESS_TOKEN_LIFETIME_SECONDS;

  const token = jwt.sign(
    {
      channelId: String(channelId),
      channelName: channelName || '',
      // C# uses ClaimTypes.Email which serialises as the long URL form. We
      // mirror both `email` (short) and the URL form so any consumer that
      // expects the .NET form still parses.
      email: email || '',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': email || '',
      isPro: isPro ? 'true' : 'false',
      jti,
      iat: nowSec,
      nbf: nowSec,
      exp: expiresAtSec,
      iss: JWT_ISSUER,
      aud: JWT_AUDIENCE,
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      // We've set iss/aud/iat/nbf/exp in the payload directly so jsonwebtoken
      // doesn't add duplicates. noTimestamp prevents jsonwebtoken from setting
      // its own iat over ours.
      noTimestamp: true,
    }
  );

  return {
    token,
    jti,
    expiresAt: new Date(expiresAtSec * 1000),
  };
}

/**
 * Generate the featurebaseGlobalAuth JWT. Bundle injects this into the
 * Featurebase widget for SSO. Same signing key, different claims, longer life.
 *
 * @param {string} name
 * @param {string} email
 * @param {string} userId
 * @returns {string}
 */
function generateFeaturebaseToken(name, email, userId) {
  const nowSec = Math.floor(Date.now() / 1000);
  const expiresAtSec = nowSec + FEATUREBASE_LIFETIME_SECONDS;

  const payload = {
    name: name && name.trim() ? name : 'user',
    userId: userId && String(userId).trim() ? String(userId) : '0',
    iat: nowSec,
    nbf: nowSec,
    exp: expiresAtSec,
  };
  if (email && email.trim()) payload.email = email;

  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    noTimestamp: true,
  });
}

/**
 * Verify a wsAuthToken. Returns the decoded claims or null on failure.
 * Allows a 60-second clock skew (matches C# ClockSkew = 1 min).
 *
 * @param {string} token
 * @returns {object|null}
 */
function validateToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      clockTolerance: 60,
    });
  } catch {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateFeaturebaseToken,
  validateToken,
  ACCESS_TOKEN_LIFETIME_SECONDS,
  FEATUREBASE_LIFETIME_SECONDS,
};
