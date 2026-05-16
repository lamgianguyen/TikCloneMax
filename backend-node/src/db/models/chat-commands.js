// Chat commands — text trigger → response. Per-profile.

const { makePerProfileTable, db } = require('./_helpers');
const base = makePerProfileTable('ChatCommands');

// Lazy-prepare — table doesn't exist until migrations run.
const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}
const insertSql = `
  INSERT INTO "ChatCommands"
    ("ChannelId","ProfileId","Command","Response","Cooldown","Enabled","Sort","CreatedAt")
  VALUES (@ChannelId,@ProfileId,@Command,@Response,@Cooldown,@Enabled,@Sort,@CreatedAt)
`;
const updateSql = `
  UPDATE "ChatCommands"
  SET "Command" = @Command, "Response" = @Response, "Cooldown" = @Cooldown,
      "Enabled" = @Enabled, "Sort" = @Sort
  WHERE "Id" = @Id
`;

function create(row) {
  const nowIso = new Date().toISOString();
  const r = {
    ChannelId: row.ChannelId,
    ProfileId: row.ProfileId || 1,
    Command: row.Command || '',
    Response: row.Response || '',
    Cooldown: typeof row.Cooldown === 'number' ? row.Cooldown : 0,
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
  stmt('update', updateSql).run({
    Id: id,
    Command: fields.Command ?? existing.Command,
    Response: fields.Response ?? existing.Response,
    Cooldown: fields.Cooldown ?? existing.Cooldown,
    Enabled: fields.Enabled === undefined ? existing.Enabled : (fields.Enabled ? 1 : 0),
    Sort: fields.Sort ?? existing.Sort,
  });
  return base.findById(id);
}

module.exports = { ...base, create, patch };
