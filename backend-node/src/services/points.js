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

// ── Viewer identity map ─────────────────────────────────────────────────────
//
// Balances are keyed by `username` (the TikTok uniqueId, lowercased), but the
// bundle READS a viewer's balance by numeric `userId`
// (`api.get("rest/channeluser", {userId})` — decompiled/modules:4218) and the
// `!points` leaderboard (4205) needs each row's `.userId`. The C# server stored
// the full ChannelUser row; the clone only stored the bare number. We persist a
// small identity record per viewer (`pointsmeta_<username>` = JSON) at write
// time so reads can resolve userId ⇆ username and surface nickname/thumbnail.
//
// `pointsmeta_<username>` cannot collide with the `points_user_%` leaderboard
// scan: in SQL LIKE, `points_user_%` requires "user" at offset 8, but the meta
// key has "eta_" there.
const META_PREFIX = 'pointsmeta_';

function recordIdentity(channelId, username, identity = {}) {
  const uname = username && String(username).trim().toLowerCase();
  if (!uname || !channelId) return;
  const key = META_PREFIX + uname;
  let existing = {};
  const row = stmt(
    'getMetaForMerge',
    `SELECT "Value" FROM "DynamicSettings"
      WHERE "ChannelId" = ? AND "Key" = ? ORDER BY "ProfileId" ASC LIMIT 1`
  ).get(channelId, key);
  if (row?.Value) {
    try { existing = JSON.parse(row.Value) || {}; } catch { existing = {}; }
  }
  // Merge so a call that omits a field (e.g. chat path has no thumbnail) does
  // not wipe a previously-recorded value.
  const merged = {
    userId:
      identity.userId != null && identity.userId !== ''
        ? String(identity.userId)
        : existing.userId || '',
    nickname: identity.nickname || existing.nickname || '',
    thumbnailUrl: identity.thumbnailUrl || existing.thumbnailUrl || '',
  };
  // Nothing new to learn → skip the write (keeps chat-heavy streams quiet).
  if (
    merged.userId === (existing.userId || '') &&
    merged.nickname === (existing.nickname || '') &&
    merged.thumbnailUrl === (existing.thumbnailUrl || '')
  ) {
    return;
  }
  stmt(
    'upsertMeta',
    `INSERT INTO "DynamicSettings" ("ChannelId","ProfileId","Key","Value") VALUES (?,?,?,?)
      ON CONFLICT("ChannelId","ProfileId","Key") DO UPDATE SET "Value" = excluded."Value"`
  ).run(channelId, POINTS_PROFILE_ID, key, JSON.stringify(merged));
}

function getMeta(channelId, username) {
  const uname = username && String(username).trim().toLowerCase();
  if (!uname) return {};
  const row = stmt(
    'getMeta',
    `SELECT "Value" FROM "DynamicSettings"
      WHERE "ChannelId" = ? AND "Key" = ? ORDER BY "ProfileId" ASC LIMIT 1`
  ).get(channelId, META_PREFIX + uname);
  if (row?.Value) {
    try { return JSON.parse(row.Value) || {}; } catch { return {}; }
  }
  return {};
}

function findUsernameByUserId(channelId, userId) {
  if (userId == null || userId === '') return null;
  const target = String(userId);
  const rows = stmt(
    'metaScan',
    `SELECT "Key","Value" FROM "DynamicSettings"
      WHERE "ChannelId" = ? AND "Key" LIKE 'pointsmeta_%'`
  ).all(channelId);
  for (const r of rows) {
    let m = {};
    try { m = JSON.parse(r.Value) || {}; } catch { m = {}; }
    if (m.userId != null && String(m.userId) === target) {
      return r.Key.startsWith(META_PREFIX) ? r.Key.slice(META_PREFIX.length) : r.Key;
    }
  }
  return null;
}

// The ChannelUser shape the bundle expects from rest/channeluser + odata. The
// clone tracks one running balance, so totalAmount (spendable, used for wheel /
// transfer cost checks) and totalRewardAmount (lifetime, used for level) are
// the same value — matching what PUT rest/transaction already returns.
function toChannelUser(channelId, username, balance, meta = {}) {
  return {
    userId: meta.userId || '',
    id: 0,
    channelId,
    username,
    nickname: meta.nickname || username,
    thumbnailUrl: meta.thumbnailUrl || null,
    totalAmount: balance,
    totalRewardAmount: balance,
    challengeStartAmount: 0,
    challengeStartRewardAmount: 0,
    archivedAmount: 0,
    archivedRewardAmount: 0,
  };
}

// Resolve a single viewer by userId OR username (the bundle queries by either).
function getChannelUser(channelId, { userId, username } = {}) {
  let uname = username && String(username).trim().toLowerCase();
  let meta = null;
  if (!uname && userId != null && userId !== '') {
    uname = findUsernameByUserId(channelId, userId);
    if (uname) meta = getMeta(channelId, uname);
  }
  if (!uname) return null;
  if (!meta) meta = getMeta(channelId, uname);
  return toChannelUser(channelId, uname, getBalance(channelId, uname), meta);
}

// Enriched leaderboard (balance + identity) for the Points page grid + the
// !points "top 100" check.
function listChannelUsers(channelId, limit = 100) {
  return listLeaderboard(channelId, limit).map((row) =>
    toChannelUser(channelId, row.username, row.balance, getMeta(channelId, row.username))
  );
}

// Wipe ALL viewer points + identity rows for a channel. Backs the Setup
// "Reset Points" / "DB Reset" button (bundle POSTs /api/deleteAllUsers ->
// setup.resetDbPoints, decompiled/modules:2674). Clears BOTH balance rows
// (points_user_) and identity rows (pointsmeta_).
function clearAll(channelId) {
  if (!channelId) return 0;
  const r = stmt(
    'clearAll',
    `DELETE FROM "DynamicSettings"
      WHERE "ChannelId" = ? AND ("Key" LIKE 'points_user_%' OR "Key" LIKE 'pointsmeta_%')`
  ).run(channelId);
  return r.changes || 0;
}

module.exports = {
  getBalance,
  setBalance,
  listLeaderboard,
  pointsKeyFor,
  clearAll,
  recordIdentity,
  getMeta,
  findUsernameByUserId,
  getChannelUser,
  listChannelUsers,
};
