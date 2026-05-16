// Subscriptions — 1:1 with Channels. Tracks Pro status, plan, expiry.

const db = require('../conn');

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

function findByChannel(channelId) {
  return stmt('findByChannel', `SELECT * FROM "Subscriptions" WHERE "ChannelId" = ? LIMIT 1`).get(channelId);
}

function upsert({ channelId, isPro, plan, active, proExpireAt = null, proExpireSetBy = null }) {
  const nowIso = new Date().toISOString();
  const existing = findByChannel(channelId);
  if (existing) {
    return stmt('update', `
      UPDATE "Subscriptions"
      SET "IsPro" = ?, "Plan" = ?, "Active" = ?, "ProExpireAt" = ?, "ProExpireSetBy" = ?, "UpdatedAt" = ?
      WHERE "ChannelId" = ?
    `).run(isPro ? 1 : 0, plan, active ? 1 : 0, proExpireAt, proExpireSetBy, nowIso, channelId);
  }
  return stmt('insert', `
    INSERT INTO "Subscriptions"
      ("ChannelId","IsPro","Plan","Active","ProExpireAt","ProExpireSetBy","CreatedAt","UpdatedAt")
    VALUES (?,?,?,?,?,?,?,?)
  `).run(channelId, isPro ? 1 : 0, plan, active ? 1 : 0, proExpireAt, proExpireSetBy, nowIso, nowIso);
}

module.exports = {
  findByChannel,
  upsert,
};
