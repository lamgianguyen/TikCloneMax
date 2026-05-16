// Periodic timers that fire actions every N seconds while live.

const db = require('../conn');

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

function listByChannel(channelId) {
  return stmt(
    'listByChannel',
    `SELECT * FROM "Timers" WHERE "ChannelId" = ? ORDER BY "Sort" ASC, "Id" DESC`
  ).all(channelId);
}

function findById(id) {
  return stmt('findById', `SELECT * FROM "Timers" WHERE "Id" = ? LIMIT 1`).get(id);
}

function create(row) {
  const nowIso = row.CreatedAt || new Date().toISOString();
  const result = stmt('create', `
    INSERT INTO "Timers"
      ("ChannelId","Name","IntervalSeconds","ActionJson","Enabled","Sort","CreatedAt")
    VALUES (?,?,?,?,?,?,?)
  `).run(
    row.ChannelId,
    row.Name || '',
    row.IntervalSeconds || 60,
    row.ActionJson ?? null,
    row.Enabled === false ? 0 : 1,
    row.Sort || 0,
    nowIso
  );
  return Number(result.lastInsertRowid);
}

function patch(id, fields) {
  const existing = findById(id);
  if (!existing) return null;
  stmt('patch', `
    UPDATE "Timers"
    SET "Name" = ?, "IntervalSeconds" = ?, "ActionJson" = ?, "Enabled" = ?, "Sort" = ?
    WHERE "Id" = ?
  `).run(
    fields.Name ?? existing.Name,
    fields.IntervalSeconds ?? existing.IntervalSeconds,
    fields.ActionJson ?? existing.ActionJson,
    fields.Enabled === undefined ? existing.Enabled : (fields.Enabled ? 1 : 0),
    fields.Sort ?? existing.Sort,
    id
  );
  return findById(id);
}

function remove(id) {
  return stmt('remove', `DELETE FROM "Timers" WHERE "Id" = ?`).run(id);
}

module.exports = { listByChannel, findById, create, patch, remove };
