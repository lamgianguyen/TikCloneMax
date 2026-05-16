// Stream Profile rows. Per-channel named profiles — user can have e.g.
// "Gaming", "Just chatting", "Karaoke" with separate Actions/Sounds/Goals
// scoped per profile via the ProfileId column on those tables.

const db = require('../conn');

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

function listByChannel(channelId) {
  return stmt('listByChannel', `SELECT * FROM "Profiles" WHERE "ChannelId" = ? ORDER BY "Sort" ASC, "Id" ASC`).all(channelId);
}

function findById(profileId) {
  return stmt('findById', `SELECT * FROM "Profiles" WHERE "Id" = ? LIMIT 1`).get(profileId);
}

function create({ channelId, name, sort = 0 }) {
  const result = stmt('create', `
    INSERT INTO "Profiles" ("ChannelId","Name","Sort") VALUES (?,?,?)
  `).run(channelId, name, sort);
  return Number(result.lastInsertRowid);
}

function rename(profileId, name) {
  return stmt('rename', `UPDATE "Profiles" SET "Name" = ? WHERE "Id" = ?`).run(name, profileId);
}

function remove(profileId) {
  return stmt('remove', `DELETE FROM "Profiles" WHERE "Id" = ?`).run(profileId);
}

/**
 * Ensure at least one default profile exists for the given channel. Returns
 * the profile id of the first (sort 0) profile.
 */
function ensureDefault(channelId) {
  const existing = listByChannel(channelId);
  if (existing.length > 0) return existing[0].Id;
  return create({ channelId, name: 'Default', sort: 0 });
}

module.exports = {
  listByChannel,
  findById,
  create,
  rename,
  remove,
  ensureDefault,
};
