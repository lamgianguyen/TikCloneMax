// Points / channel-currency service. Persists per-viewer balances as
// DynamicSettings rows keyed `points_user_<username>` at the channel level
// (NOT per-profile — points follow the channel even after profile switches,
// matching the original C# PointsService behaviour where the column had no
// ProfileId filter).
//
// All writes go to ProfileId=1 so they live in one consistent bucket; reads
// span all profiles via SELECT WHERE Key LIKE 'points_user_%'.

const db = require('../db/conn');

const POINTS_PROFILE_ID = 1;
const KEY_PREFIX = 'points_user_';

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

function pointsKeyFor(username) {
  if (!username) return null;
  return KEY_PREFIX + String(username).trim().toLowerCase();
}

function parseDouble(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatBalance(value) {
  // Match the C# `0.##` invariant culture format: drop trailing zeros, no
  // thousands separator, '.' decimal point.
  const n = Number(value) || 0;
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toString();
}

function getBalance(channelId, username) {
  const key = pointsKeyFor(username);
  if (!key) return 0;
  const row = stmt(
    'getBalance',
    `SELECT "Value" FROM "DynamicSettings"
      WHERE "ChannelId" = ? AND "Key" = ?
      ORDER BY "ProfileId" ASC LIMIT 1`
  ).get(channelId, key);
  return parseDouble(row?.Value);
}

function setBalance(channelId, username, value) {
  const key = pointsKeyFor(username);
  if (!key) return;
  const formatted = formatBalance(value);
  stmt(
    'upsert',
    `INSERT INTO "DynamicSettings" ("ChannelId","ProfileId","Key","Value") VALUES (?,?,?,?)
      ON CONFLICT("ChannelId","ProfileId","Key") DO UPDATE SET "Value" = excluded."Value"`
  ).run(channelId, POINTS_PROFILE_ID, key, formatted);
}

function listLeaderboard(channelId, limit = 50) {
  const cap = Math.max(1, Math.min(500, limit | 0));
  const rows = stmt(
    'leaderboard',
    `SELECT "Key","Value" FROM "DynamicSettings"
      WHERE "ChannelId" = ? AND "Key" LIKE 'points_user_%'`
  ).all(channelId);

  return rows
    .map((r) => ({
      username: r.Key.startsWith(KEY_PREFIX) ? r.Key.slice(KEY_PREFIX.length) : r.Key,
      balance: parseDouble(r.Value),
    }))
    .filter((x) => x.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, cap);
}

module.exports = {
  getBalance,
  setBalance,
  listLeaderboard,
  pointsKeyFor,
};
