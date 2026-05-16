// RevokedTokens — JWT denylist. We check this on every authenticated request
// so a logout actually kills the token; otherwise the JWT remains valid until
// its 7-day expiry (bad for anyone who wants out NOW).

const db = require('../conn');

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

/**
 * Returns true when the given JWT id (jti claim) has been revoked.
 */
function isRevoked(jti) {
  const row = stmt(
    'isRevoked',
    `SELECT 1 AS hit FROM "RevokedTokens" WHERE "Jti" = ? LIMIT 1`
  ).get(jti);
  return !!row;
}

function revoke({ jti, channelId, expiresAt }) {
  const nowIso = new Date().toISOString();
  try {
    return stmt(
      'revoke',
      `INSERT INTO "RevokedTokens" ("Jti","ChannelId","RevokedAt","ExpiresAt") VALUES (?,?,?,?)`
    ).run(jti, channelId, nowIso, expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt);
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) {
      // Already revoked — that's fine, treat as no-op success.
      return { changes: 0, lastInsertRowid: 0 };
    }
    throw err;
  }
}

/**
 * Sweep expired entries — call periodically (e.g. once an hour) to keep the
 * denylist small. Anything past ExpiresAt is harmless to delete because the
 * token wouldn't validate anyway.
 */
function purgeExpired() {
  const nowIso = new Date().toISOString();
  return stmt('purgeExpired', `DELETE FROM "RevokedTokens" WHERE "ExpiresAt" < ?`).run(nowIso);
}

module.exports = { isRevoked, revoke, purgeExpired };
