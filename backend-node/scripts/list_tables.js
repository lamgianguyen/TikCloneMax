const Database = require('better-sqlite3');
const config = require('../src/config');

const dbPath = config.DB_PATH;
console.log('Opening database at:', dbPath);

try {
  const db = new Database(dbPath, { readonly: true });
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:');
  console.log(tables);
  
  for (const table of tables) {
    const schema = db.prepare(`PRAGMA table_info(${table.name})`).all();
    console.log(`Schema for ${table.name}:`, schema);
  }
} catch (err) {
  console.error('Error reading database:', err.message);
}
