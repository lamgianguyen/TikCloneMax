// Notifications — bell-icon feed. Mostly seeded once and read.

const db = require('../conn');

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

function listByChannel(channelId, { limit = 50 } = {}) {
  return stmt(
    'listByChannel',
    `SELECT * FROM "Notifications" WHERE "ChannelId" = ? ORDER BY "CreatedAt" DESC LIMIT ?`
  ).all(channelId, limit);
}

function countUnread(channelId) {
  const row = stmt(
    'countUnread',
    `SELECT COUNT(*) AS n FROM "Notifications" WHERE "ChannelId" = ? AND "IsRead" = 0`
  ).get(channelId);
  return row ? row.n : 0;
}

function markAllRead(channelId) {
  return stmt(
    'markAllRead',
    `UPDATE "Notifications" SET "IsRead" = 1, "IsSeen" = 1 WHERE "ChannelId" = ?`
  ).run(channelId);
}

function markRead(id) {
  return stmt('markRead', `UPDATE "Notifications" SET "IsRead" = 1, "IsSeen" = 1 WHERE "Id" = ?`).run(id);
}

function findByChannelAndId(channelId, id) {
  return stmt(
    'findByChannelAndId',
    `SELECT * FROM "Notifications" WHERE "ChannelId" = ? AND "Id" = ? LIMIT 1`
  ).get(channelId, id);
}

function clearAllForChannel(channelId) {
  return stmt(
    'clearAllForChannel',
    `DELETE FROM "Notifications" WHERE "ChannelId" = ?`
  ).run(channelId);
}

function markSeen(channelId) {
  return stmt('markSeen', `UPDATE "Notifications" SET "IsSeen" = 1 WHERE "ChannelId" = ?`).run(channelId);
}

function create(row) {
  const nowIso = row.CreatedAt || new Date().toISOString();
  return stmt('create', `
    INSERT INTO "Notifications"
      ("ChannelId","Subject","Body","Category","DataJson","IsRead","IsSeen","CreatedAt","TransactionId")
    VALUES (?,?,?,?,?,?,?,?,?)
  `).run(
    row.ChannelId,
    row.Subject || '',
    row.Body || '',
    row.Category || 'general',
    row.DataJson ?? null,
    row.IsRead ? 1 : 0,
    row.IsSeen ? 1 : 0,
    nowIso,
    row.TransactionId || ''
  );
}

module.exports = {
  listByChannel,
  countUnread,
  markAllRead,
  markRead,
  markSeen,
  findByChannelAndId,
  clearAllForChannel,
  create,
};
