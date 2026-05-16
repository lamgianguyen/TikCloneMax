// Generic row-helpers for the family of "per-channel, per-profile" tables
// (Actions, Sounds, Goals, ChatCommands). All share the same shape:
//
//   - PK Id (autoincrement)
//   - ChannelId FK
//   - ProfileId int (default 1)
//   - other columns vary
//
// This module gives each model file a small `makePerProfileTable(name)` factory
// that returns the common CRUD ops, so adding a new per-profile table is a
// one-line module instead of 100 lines of boilerplate.

const db = require('../conn');

function makePerProfileTable(tableName) {
  const tbl = `"${tableName}"`;
  const _stmts = {};
  const stmt = (key, sql) => {
    if (!_stmts[key]) _stmts[key] = db.prepare(sql);
    return _stmts[key];
  };

  return {
    listByChannelProfile(channelId, profileId = 1) {
      return stmt(
        'listByChannelProfile',
        `SELECT * FROM ${tbl} WHERE "ChannelId" = ? AND "ProfileId" = ? ORDER BY "Sort" ASC, "Id" DESC`
      ).all(channelId, profileId);
    },
    findById(id) {
      return stmt('findById', `SELECT * FROM ${tbl} WHERE "Id" = ? LIMIT 1`).get(id);
    },
    countByChannelProfile(channelId, profileId = 1) {
      const row = stmt(
        'count',
        `SELECT COUNT(*) AS n FROM ${tbl} WHERE "ChannelId" = ? AND "ProfileId" = ?`
      ).get(channelId, profileId);
      return row ? row.n : 0;
    },
    remove(id) {
      return stmt('remove', `DELETE FROM ${tbl} WHERE "Id" = ?`).run(id);
    },
    removeForChannelProfile(channelId, profileId) {
      return stmt(
        'removeForChannelProfile',
        `DELETE FROM ${tbl} WHERE "ChannelId" = ? AND "ProfileId" = ?`
      ).run(channelId, profileId);
    },
    raw: db,  // escape hatch for endpoint-specific queries
    table: tableName,
  };
}

module.exports = { makePerProfileTable, db };
