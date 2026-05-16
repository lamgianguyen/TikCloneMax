// ChannelModules — feature toggles per channel (Actions, TTS, Sounds, etc.).
// Unique on (ChannelId, ModuleId).

const db = require('../conn');

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

function listByChannel(channelId) {
  return stmt(
    'listByChannel',
    `SELECT * FROM "ChannelModules" WHERE "ChannelId" = ? ORDER BY "Sort" ASC, "Id" ASC`
  ).all(channelId);
}

function findByModuleId(channelId, moduleId) {
  return stmt(
    'findByModuleId',
    `SELECT * FROM "ChannelModules" WHERE "ChannelId" = ? AND "ModuleId" = ? LIMIT 1`
  ).get(channelId, moduleId);
}

function upsert({ channelId, moduleId, name, enabled = true, sort = 0 }) {
  const existing = findByModuleId(channelId, moduleId);
  if (existing) {
    stmt('update', `
      UPDATE "ChannelModules" SET "Name" = ?, "Enabled" = ?, "Sort" = ? WHERE "Id" = ?
    `).run(name, enabled ? 1 : 0, sort, existing.Id);
    return existing.Id;
  }
  const result = stmt('insert', `
    INSERT INTO "ChannelModules" ("ChannelId","ModuleId","Name","Enabled","Sort")
    VALUES (?,?,?,?,?)
  `).run(channelId, moduleId, name, enabled ? 1 : 0, sort);
  return Number(result.lastInsertRowid);
}

function setEnabled(channelId, moduleId, enabled) {
  const existing = findByModuleId(channelId, moduleId);
  if (!existing) return null;
  stmt(
    'setEnabled',
    `UPDATE "ChannelModules" SET "Enabled" = ? WHERE "Id" = ?`
  ).run(enabled ? 1 : 0, existing.Id);
  return findByModuleId(channelId, moduleId);
}

// Default module list — mirrors AppDbContext seed comment + the bundle's
// expected feature toggles.
const DEFAULT_MODULES = [
  { moduleId: 'actions', name: 'Actions & Events', sort: 1 },
  { moduleId: 'tts', name: 'Text to Speech', sort: 2 },
  { moduleId: 'sounds', name: 'Sound Alerts', sort: 3 },
  { moduleId: 'media', name: 'Media Share', sort: 4 },
  { moduleId: 'timers', name: 'Timers', sort: 5 },
  { moduleId: 'commands', name: 'Chat Commands', sort: 6 },
  { moduleId: 'spotify', name: 'Spotify Integration', sort: 7 },
  { moduleId: 'webhooks', name: 'Webhooks', sort: 8 },
  { moduleId: 'overlays', name: 'Overlays', sort: 9 },
];

function ensureDefaults(channelId) {
  for (const m of DEFAULT_MODULES) {
    if (!findByModuleId(channelId, m.moduleId)) {
      upsert({ channelId, ...m, enabled: true });
    }
  }
}

module.exports = {
  listByChannel,
  findByModuleId,
  upsert,
  setEnabled,
  ensureDefaults,
  DEFAULT_MODULES,
};
