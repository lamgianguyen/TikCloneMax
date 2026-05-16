// Knex config — only used for migrations. Runtime queries use better-sqlite3
// directly (see src/db/conn.js).
//
// We resolve the DB path at require-time the same way src/config.js does so
// `npm run migrate` reads/writes the same file as the running server.

const path = require('path');
const fs = require('fs');

function resolveDataDir() {
  if (process.env.TIKMAX_DATA_DIR) return process.env.TIKMAX_DATA_DIR;
  if (process.env.APPDATA) return path.join(process.env.APPDATA, 'tikfinity-desktop');
  return path.resolve(__dirname, 'data');
}

const DATA_DIR = resolveDataDir();
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch { /* exists */ }

module.exports = {
  client: 'better-sqlite3',
  connection: {
    filename: path.join(DATA_DIR, 'tikfinity.db'),
  },
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'src', 'db', 'migrations'),
    extension: 'js',
    loadExtensions: ['.js'],
  },
  pool: {
    afterCreate: (conn, done) => {
      // Enable WAL for better concurrency + foreign keys.
      conn.pragma('journal_mode = WAL');
      conn.pragma('foreign_keys = ON');
      conn.pragma('synchronous = NORMAL');
      done();
    },
  },
};
