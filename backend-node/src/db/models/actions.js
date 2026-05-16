// Actions (a.k.a. "Actions & Events" page). Triggered by gifts/likes/follows/
// chat commands. Per-channel, per-profile.

const { makePerProfileTable, db } = require('./_helpers');
const base = makePerProfileTable('Actions');

// Lazy-prepare: routes are require()d at boot before migrations have created
// the table. Calling db.prepare() up front would throw `no such table: Actions`.
const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}
const insertSql = `
  INSERT INTO "Actions"
    ("ChannelId","ProfileId","Name","Type","TriggerValue","ConfigJson","Enabled","Sort","CreatedAt")
  VALUES (@ChannelId,@ProfileId,@Name,@Type,@TriggerValue,@ConfigJson,@Enabled,@Sort,@CreatedAt)
`;
const updateSql = `
  UPDATE "Actions"
  SET "Name" = @Name, "Type" = @Type, "TriggerValue" = @TriggerValue,
      "ConfigJson" = @ConfigJson, "Enabled" = @Enabled, "Sort" = @Sort
  WHERE "Id" = @Id
`;

function create(row) {
  const nowIso = new Date().toISOString();
  const r = {
    ChannelId: row.ChannelId,
    ProfileId: row.ProfileId || 1,
    Name: row.Name || '',
    Type: row.Type || '',
    TriggerValue: row.TriggerValue ?? null,
    ConfigJson: row.ConfigJson ?? null,
    Enabled: row.Enabled === false ? 0 : 1,
    Sort: row.Sort || 0,
    CreatedAt: row.CreatedAt || nowIso,
  };
  const result = stmt('insert', insertSql).run(r);
  return Number(result.lastInsertRowid);
}

function patch(id, fields) {
  const existing = base.findById(id);
  if (!existing) return null;
  const merged = {
    Id: id,
    Name: fields.Name ?? existing.Name,
    Type: fields.Type ?? existing.Type,
    TriggerValue: fields.TriggerValue ?? existing.TriggerValue,
    ConfigJson: fields.ConfigJson ?? existing.ConfigJson,
    Enabled: fields.Enabled === undefined ? existing.Enabled : (fields.Enabled ? 1 : 0),
    Sort: fields.Sort ?? existing.Sort,
  };
  stmt('update', updateSql).run(merged);
  return base.findById(id);
}

module.exports = { ...base, create, patch };
