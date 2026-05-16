// Webhooks — outbound HTTP fires on TikTok events. Used by Streamerbot etc.

const db = require('../conn');

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

function listByChannel(channelId) {
  return stmt(
    'listByChannel',
    `SELECT * FROM "Webhooks" WHERE "ChannelId" = ? ORDER BY "Id" ASC`
  ).all(channelId);
}

function findById(id) {
  return stmt('findById', `SELECT * FROM "Webhooks" WHERE "Id" = ? LIMIT 1`).get(id);
}

function listEnabledForEvent(channelId, eventType) {
  // EventTypesCsv stores comma-separated event names (e.g. "gift,like,member").
  // SQLite has no JSON_ARRAY_CONTAINS so we do a substring match on a
  // ,-padded copy to avoid matching "gift" inside "giftCombo".
  return stmt('listEnabledForEvent', `
    SELECT * FROM "Webhooks"
    WHERE "ChannelId" = ? AND "Enabled" = 1
      AND (',' || "EventTypesCsv" || ',') LIKE ?
  `).all(channelId, `%,${eventType},%`);
}

function create(row) {
  const nowIso = row.CreatedAt || new Date().toISOString();
  const result = stmt('create', `
    INSERT INTO "Webhooks"
      ("ChannelId","Name","Url","Method","EventTypesCsv","HeadersJson","TemplateJson",
       "Enabled","RetryCount","TimeoutSeconds","CreatedAt")
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    row.ChannelId,
    row.Name || '',
    row.Url || '',
    row.Method || 'POST',
    row.EventTypesCsv || '',
    row.HeadersJson ?? null,
    row.TemplateJson ?? null,
    row.Enabled === false ? 0 : 1,
    row.RetryCount || 0,
    row.TimeoutSeconds || 10,
    nowIso
  );
  return Number(result.lastInsertRowid);
}

function patch(id, fields) {
  const existing = findById(id);
  if (!existing) return null;
  stmt('patch', `
    UPDATE "Webhooks"
    SET "Name" = ?, "Url" = ?, "Method" = ?, "EventTypesCsv" = ?,
        "HeadersJson" = ?, "TemplateJson" = ?, "Enabled" = ?,
        "RetryCount" = ?, "TimeoutSeconds" = ?
    WHERE "Id" = ?
  `).run(
    fields.Name ?? existing.Name,
    fields.Url ?? existing.Url,
    fields.Method ?? existing.Method,
    fields.EventTypesCsv ?? existing.EventTypesCsv,
    fields.HeadersJson ?? existing.HeadersJson,
    fields.TemplateJson ?? existing.TemplateJson,
    fields.Enabled === undefined ? existing.Enabled : (fields.Enabled ? 1 : 0),
    fields.RetryCount ?? existing.RetryCount,
    fields.TimeoutSeconds ?? existing.TimeoutSeconds,
    id
  );
  return findById(id);
}

function remove(id) {
  return stmt('remove', `DELETE FROM "Webhooks" WHERE "Id" = ?`).run(id);
}

module.exports = {
  listByChannel,
  listEnabledForEvent,
  findById,
  create,
  patch,
  remove,
};
