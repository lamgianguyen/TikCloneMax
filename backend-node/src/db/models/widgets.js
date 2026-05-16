// Widgets — same shape as Overlays. Separate table because the bundle treats
// them as different feature categories (in-app vs OBS browser-source).

const db = require('../conn');

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

function listByChannel(channelId) {
  return stmt(
    'listByChannel',
    `SELECT * FROM "Widgets" WHERE "ChannelId" = ? ORDER BY "Sort" ASC, "Id" DESC`
  ).all(channelId);
}

function findById(id) {
  return stmt('findById', `SELECT * FROM "Widgets" WHERE "Id" = ? LIMIT 1`).get(id);
}

function create(row) {
  const nowIso = row.CreatedAt || new Date().toISOString();
  const result = stmt('create', `
    INSERT INTO "Widgets" ("ChannelId","Name","Type","ConfigJson","Enabled","Sort","CreatedAt")
    VALUES (?,?,?,?,?,?,?)
  `).run(
    row.ChannelId,
    row.Name || '',
    row.Type || '',
    row.ConfigJson ?? null,
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
    UPDATE "Widgets"
    SET "Name" = ?, "Type" = ?, "ConfigJson" = ?, "Enabled" = ?, "Sort" = ?
    WHERE "Id" = ?
  `).run(
    fields.Name ?? existing.Name,
    fields.Type ?? existing.Type,
    fields.ConfigJson ?? existing.ConfigJson,
    fields.Enabled === undefined ? existing.Enabled : (fields.Enabled ? 1 : 0),
    fields.Sort ?? existing.Sort,
    id
  );
  return findById(id);
}

function remove(id) {
  return stmt('remove', `DELETE FROM "Widgets" WHERE "Id" = ?`).run(id);
}

module.exports = { listByChannel, findById, create, patch, remove };
