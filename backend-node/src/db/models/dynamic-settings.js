// DynamicSettings — the bundle's main key/value bag, scoped per
// (channelId, profileId). Most bundle features store their config here so
// every endpoint that hands back /api/me eventually reads this table.

const db = require('../conn');

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

/**
 * Read all settings for a channel+profile as a `{ key: value }` map.
 * Returns an empty object when nothing is stored yet.
 */
function readAllAsMap(channelId, profileId = 1) {
  const rows = stmt(
    'readAllAsMap',
    `SELECT "Key","Value" FROM "DynamicSettings" WHERE "ChannelId" = ? AND "ProfileId" = ?`
  ).all(channelId, profileId);
  const map = {};
  for (const r of rows) map[r.Key] = r.Value ?? '';
  return map;
}

function readOne(channelId, profileId, key) {
  return stmt(
    'readOne',
    `SELECT "Value" FROM "DynamicSettings" WHERE "ChannelId" = ? AND "ProfileId" = ? AND "Key" = ? LIMIT 1`
  ).get(channelId, profileId, key);
}

function writeOne(channelId, profileId, key, value) {
  // UPSERT on the unique (Channel, Profile, Key) index.
  return stmt('writeOne', `
    INSERT INTO "DynamicSettings" ("ChannelId","ProfileId","Key","Value") VALUES (?,?,?,?)
    ON CONFLICT("ChannelId","ProfileId","Key") DO UPDATE SET "Value" = excluded."Value"
  `).run(channelId, profileId, key, value ?? '');
}

/**
 * Write multiple settings in a single transaction. Bundle's saveSettings call
 * arrives as a bag of key/value pairs.
 *
 * @param {number} channelId
 * @param {number} profileId
 * @param {Record<string, string>} kv
 */
function writeMany(channelId, profileId, kv) {
  const upsert = stmt('writeOne', `
    INSERT INTO "DynamicSettings" ("ChannelId","ProfileId","Key","Value") VALUES (?,?,?,?)
    ON CONFLICT("ChannelId","ProfileId","Key") DO UPDATE SET "Value" = excluded."Value"
  `);
  // db.transaction wraps the loop in a real SQLite BEGIN/COMMIT — orders of
  // magnitude faster than 100 individual INSERTs.
  const run = db.transaction((entries) => {
    for (const [k, v] of entries) upsert.run(channelId, profileId, k, v ?? '');
  });
  run(Object.entries(kv || {}));
}

function deleteOne(channelId, profileId, key) {
  return stmt(
    'deleteOne',
    `DELETE FROM "DynamicSettings" WHERE "ChannelId" = ? AND "ProfileId" = ? AND "Key" = ?`
  ).run(channelId, profileId, key);
}

function deleteAllForChannel(channelId) {
  return stmt('deleteAllForChannel', `DELETE FROM "DynamicSettings" WHERE "ChannelId" = ?`).run(channelId);
}

function deleteAllForProfile(channelId, profileId) {
  return stmt(
    'deleteAllForProfile',
    `DELETE FROM "DynamicSettings" WHERE "ChannelId" = ? AND "ProfileId" = ?`
  ).run(channelId, profileId);
}

module.exports = {
  readAllAsMap,
  readOne,
  writeOne,
  writeMany,
  deleteOne,
  deleteAllForChannel,
  deleteAllForProfile,
};
