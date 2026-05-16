// Sound alerts — uploaded audio files triggered by Actions.

const { makePerProfileTable, db } = require('./_helpers');
const base = makePerProfileTable('Sounds');

// Lazy-prepare — table doesn't exist until migrations run.
const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}
const insertSql = `
  INSERT INTO "Sounds"
    ("ChannelId","ProfileId","Name","FileName","Url","Volume","Enabled","Sort","Category","CreatedAt")
  VALUES (@ChannelId,@ProfileId,@Name,@FileName,@Url,@Volume,@Enabled,@Sort,@Category,@CreatedAt)
`;
const updateSql = `
  UPDATE "Sounds"
  SET "Name" = @Name, "FileName" = @FileName, "Url" = @Url, "Volume" = @Volume,
      "Enabled" = @Enabled, "Sort" = @Sort, "Category" = @Category
  WHERE "Id" = @Id
`;

function create(row) {
  const nowIso = new Date().toISOString();
  const r = {
    ChannelId: row.ChannelId,
    ProfileId: row.ProfileId || 1,
    Name: row.Name || '',
    FileName: row.FileName ?? null,
    Url: row.Url ?? null,
    Volume: typeof row.Volume === 'number' ? row.Volume : 100,
    Enabled: row.Enabled === false ? 0 : 1,
    Sort: row.Sort || 0,
    Category: row.Category ?? null,
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
    FileName: fields.FileName ?? existing.FileName,
    Url: fields.Url ?? existing.Url,
    Volume: fields.Volume ?? existing.Volume,
    Enabled: fields.Enabled === undefined ? existing.Enabled : (fields.Enabled ? 1 : 0),
    Sort: fields.Sort ?? existing.Sort,
    Category: fields.Category ?? existing.Category,
  });
  return base.findById(id);
}

module.exports = { ...base, create, patch };
