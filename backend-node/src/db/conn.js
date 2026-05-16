// Singleton better-sqlite3 connection.
//
// SQLite is single-writer so a single Database instance shared across the
// process is the simplest correct setup — no pool to manage, no async
// coordination. We enable WAL + foreign keys here so every consumer of the
// connection sees consistent behaviour.

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { DB_PATH } = require('../config');
const logger = require('../logger');

// Ensure dir exists before better-sqlite3 tries to open the file.
try { fs.mkdirSync(path.dirname(DB_PATH), { recursive: true }); } catch { /* exists */ }

const db = new Database(DB_PATH, {
  // verbose: logger.debug.bind(logger),  // uncomment for SQL trace
});

// Pragmas must be set as raw statements, not via .pragma() if we want to
// confirm the value back.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');
db.pragma('busy_timeout = 5000');

logger.info({ path: DB_PATH }, '[DB] better-sqlite3 connection ready');

module.exports = db;
