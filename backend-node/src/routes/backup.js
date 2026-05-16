// /api/backup/export, /api/backup/import — full configuration backup.
//
// Direct port of `backend/Controllers/BackupController.cs`. Export bundles
// every channel-scoped, user-editable table into a single versioned JSON
// document. Import wipes those tables for the channel and rebuilds them
// inside a single SQLite transaction — atomic, so a malformed payload can't
// leave the DB half-written.

const express = require('express');
const db = require('../db/conn');
const channels = require('../db/models/channels');
const logger = require('../logger');

const router = express.Router();
const CURRENT_SCHEMA_VERSION = 1;

// All per-channel editable tables. Order chosen so that re-inserts replay in
// the same direction the C# EF version did, in case any rows carry implicit
// ordering assumptions.
const CHANNEL_SCOPED_TABLES = [
  'DynamicSettings',
  'Actions',
  'Sounds',
  'ChatCommands',
  'Goals',
  'Timers',
  'Overlays',
  'Widgets',
  'ChannelModules',
];

const PAYLOAD_KEY = {
  DynamicSettings: 'settings',
  Actions: 'actions',
  Sounds: 'sounds',
  ChatCommands: 'commands',
  Goals: 'goals',
  Timers: 'timers',
  Overlays: 'overlays',
  Widgets: 'widgets',
  ChannelModules: 'modules',
};

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

function selectAll(table, channelId) {
  return db.prepare(`SELECT * FROM "${table}" WHERE "ChannelId" = ?`).all(channelId);
}

router.get('/export', (req, res) => {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.status(400).json({ error: 'no channel' });

  const payload = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    channelId,
  };
  for (const tbl of CHANNEL_SCOPED_TABLES) {
    payload[PAYLOAD_KEY[tbl]] = selectAll(tbl, channelId);
  }

  const stamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 15);
  const filename = `tikfinity-backup-${stamp}.json`;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).end(JSON.stringify(payload, null, 2));
});

// Column-name catalog driven from sqlite_master so we don't need a hand-written
// list per table. Cached per process — schema doesn't change at runtime.
const _columnsCache = new Map();
function columnsOf(table) {
  if (_columnsCache.has(table)) return _columnsCache.get(table);
  const rows = db.prepare(`PRAGMA table_info("${table}")`).all();
  const names = rows.map((r) => r.name);
  _columnsCache.set(table, names);
  return names;
}

// Case-insensitive key lookup so backups from either PascalCase or camelCase
// roundtrip. C# EF exported PascalCase; some users hand-edit and lowercase.
function pickField(obj, name) {
  if (obj == null || typeof obj !== 'object') return undefined;
  if (name in obj) return obj[name];
  const lc = name.toLowerCase();
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase() === lc) return obj[k];
  }
  return undefined;
}

function importTable(table, items, channelId) {
  if (!Array.isArray(items) || items.length === 0) return 0;
  const cols = columnsOf(table).filter((c) => c !== 'Id');
  // ChannelId is forced; Id reset.
  const placeholders = cols.map(() => '?').join(',');
  const insert = db.prepare(
    `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(',')}) VALUES (${placeholders})`
  );

  let count = 0;
  // DynamicSettings: dedupe (ProfileId, Key) — legacy backups can carry
  // duplicates that violate the UNIQUE index.
  const seen = new Set();
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const row = cols.map((col) => {
      if (col === 'ChannelId') return channelId;
      let v = pickField(item, col);
      if (v === undefined) v = null;
      // Coerce booleans (legacy JSON may have stored Enabled as `true`).
      if (typeof v === 'boolean') v = v ? 1 : 0;
      // Coerce nested objects/arrays back to JSON strings for *Json columns.
      if (v && typeof v === 'object') v = JSON.stringify(v);
      return v;
    });

    if (table === 'DynamicSettings') {
      const profileIdx = cols.indexOf('ProfileId');
      const keyIdx = cols.indexOf('Key');
      const pid = Number(row[profileIdx]) || 1;
      row[profileIdx] = pid;
      const dedupeKey = `${pid}|${row[keyIdx]}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
    }

    try {
      insert.run(row);
      count++;
    } catch (err) {
      logger.warn({ err, table }, '[Backup] row insert failed — skipping');
    }
  }
  return count;
}

router.post('/import', (req, res) => {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.status(400).json({ error: 'no channel' });

  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'invalid payload' });
  }
  if (typeof payload.schemaVersion === 'number' && payload.schemaVersion > CURRENT_SCHEMA_VERSION) {
    return res.status(400).json({
      error: `Schema version ${payload.schemaVersion} chưa được hỗ trợ (max: ${CURRENT_SCHEMA_VERSION})`,
    });
  }

  const imported = {};
  const txn = db.transaction(() => {
    // Wipe channel-scoped tables first, then rebuild.
    for (const tbl of CHANNEL_SCOPED_TABLES) {
      db.prepare(`DELETE FROM "${tbl}" WHERE "ChannelId" = ?`).run(channelId);
    }
    for (const tbl of CHANNEL_SCOPED_TABLES) {
      const key = PAYLOAD_KEY[tbl];
      imported[key] = importTable(tbl, payload[key], channelId);
    }
  });

  try {
    txn();
  } catch (err) {
    logger.error({ err }, '[Backup] import failed');
    return res.status(500).json({ error: err.message });
  }

  res.json({ status: 200, imported });
});

module.exports = router;
