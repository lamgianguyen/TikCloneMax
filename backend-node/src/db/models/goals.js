// Live-stream goals (e.g. "100 gifts to unlock challenge"). Per-profile.

const { makePerProfileTable, db } = require('./_helpers');
const base = makePerProfileTable('Goals');

// Lazy-prepare — table doesn't exist until migrations run.
const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}
const insertSql = `
  INSERT INTO "Goals"
    ("ChannelId","ProfileId","Name","Type","Target","Current","Enabled","CreatedAt")
  VALUES (@ChannelId,@ProfileId,@Name,@Type,@Target,@Current,@Enabled,@CreatedAt)
`;
const updateSql = `
  UPDATE "Goals"
  SET "Name" = @Name, "Type" = @Type, "Target" = @Target,
      "Current" = @Current, "Enabled" = @Enabled
  WHERE "Id" = @Id
`;
const bumpSql = `UPDATE "Goals" SET "Current" = "Current" + ? WHERE "Id" = ?`;

function create(row) {
  const nowIso = new Date().toISOString();
  const r = {
    ChannelId: row.ChannelId,
    ProfileId: row.ProfileId || 1,
    Name: row.Name || '',
    Type: row.Type || 'gifts',
    Target: typeof row.Target === 'number' ? row.Target : 0,
    Current: typeof row.Current === 'number' ? row.Current : 0,
    Enabled: row.Enabled === false ? 0 : 1,
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
    Name: fields.Name ?? existing.Name,
    Type: fields.Type ?? existing.Type,
    Target: fields.Target ?? existing.Target,
    Current: fields.Current ?? existing.Current,
    Enabled: fields.Enabled === undefined ? existing.Enabled : (fields.Enabled ? 1 : 0),
  });
  return base.findById(id);
}

function bumpCurrent(id, delta) {
  stmt('bump', bumpSql).run(delta, id);
  return base.findById(id);
}

// Goals has no Sort column (unlike Actions/Sounds/ChatCommands), so the
// shared `listByChannelProfile` helper's `ORDER BY "Sort"` clause errors. Override
// with an Id-DESC-only ordering, matching the C# GoalsController.
function listByChannelProfile(channelId, profileId = 1) {
  return stmt(
    'listByChannelProfile',
    `SELECT * FROM "Goals" WHERE "ChannelId" = ? AND "ProfileId" = ? ORDER BY "Id" DESC`
  ).all(channelId, profileId);
}

module.exports = { ...base, listByChannelProfile, create, patch, bumpCurrent };
