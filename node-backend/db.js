// Database module - wraps better-sqlite3 for TikFinity SQLite
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'backend', 'tikfinity.db');
let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

// --- Channel ---
function getChannel(channelId) {
  const d = getDb();
  const ch = d.prepare('SELECT * FROM Channels WHERE ChannelId = ?').get(channelId);
  if (!ch) return null;
  ch.Subscription = d.prepare('SELECT * FROM Subscriptions WHERE ChannelId = ?').get(channelId) || { IsPro: 1, Plan: 'pro', Active: 1 };
  ch.Profiles = d.prepare('SELECT Id, Name, Sort FROM Profiles WHERE ChannelId = ? ORDER BY Sort').all(channelId);
  ch.DynamicSettings = d.prepare('SELECT Key, Value FROM DynamicSettings WHERE ChannelId = ?').all(channelId);
  return ch;
}

function getFirstChannel() {
  const d = getDb();
  const ch = d.prepare('SELECT * FROM Channels ORDER BY ChannelId LIMIT 1').get();
  if (!ch) return null;
  return getChannel(ch.ChannelId);
}

function getChannelByName(name) {
  const d = getDb();
  const ch = d.prepare('SELECT * FROM Channels WHERE ChannelName = ?').get(name);
  if (!ch) return null;
  return getChannel(ch.ChannelId);
}

function getChannelByEmail(email) {
  const d = getDb();
  const ch = d.prepare('SELECT * FROM Channels WHERE Email = ?').get(email);
  if (!ch) return null;
  return getChannel(ch.ChannelId);
}

function createChannel(name, email, passwordHash) {
  const d = getDb();
  const now = new Date().toISOString();
  const result = d.prepare(`
    INSERT INTO Channels (ChannelName, Email, PasswordHash, OwnerUserId, ChannelSignature, Sub, Locale, IsChatbotApproved, ChallengeRunning, SignupAuthProvider, CreatedAt, UpdatedAt)
    VALUES (?, ?, ?, '', '', '', 'VN', 0, 0, 'local', ?, ?)
  `).run(name, email, passwordHash, now, now);
  const channelId = result.lastInsertRowid;
  d.prepare('INSERT INTO Subscriptions (ChannelId, IsPro, Plan, Active, CreatedAt, UpdatedAt) VALUES (?, 1, ?, ?, ?, ?)').run(channelId, 'pro', 1, now, now);
  return getChannel(channelId);
}

// --- Dynamic Settings ---
function getDynamicSettings(channelId) {
  const rows = getDb().prepare('SELECT Key, Value FROM DynamicSettings WHERE ChannelId = ?').all(channelId);
  const map = {};
  for (const r of rows) map[r.Key] = r.Value;
  return map;
}

function upsertDynamicSetting(channelId, key, value) {
  const d = getDb();
  const existing = d.prepare('SELECT Id FROM DynamicSettings WHERE ChannelId = ? AND Key = ?').get(channelId, key);
  if (existing) {
    d.prepare('UPDATE DynamicSettings SET Value = ? WHERE Id = ?').run(value, existing.Id);
  } else {
    d.prepare('INSERT INTO DynamicSettings (ChannelId, Key, Value) VALUES (?, ?, ?)').run(channelId, key, value);
  }
}

// --- Actions ---
function getActions(channelId) {
  return getDb().prepare('SELECT * FROM ActionItems WHERE ChannelId = ? ORDER BY Sort, Id DESC').all(channelId);
}

function saveAction(channelId, data) {
  const d = getDb();
  const now = new Date().toISOString();
  if (data.id && data.id > 0) {
    d.prepare('UPDATE ActionItems SET Name=?, Type=?, TriggerValue=?, ConfigJson=?, Enabled=?, Sort=? WHERE Id=? AND ChannelId=?')
      .run(data.name, data.type, data.triggerValue || '', JSON.stringify(data.config || {}), data.enabled ? 1 : 0, data.sort || 0, data.id, channelId);
    return data.id;
  } else {
    const r = d.prepare('INSERT INTO ActionItems (ChannelId, Name, Type, TriggerValue, ConfigJson, Enabled, Sort, CreatedAt) VALUES (?,?,?,?,?,?,?,?)')
      .run(channelId, data.name, data.type, data.triggerValue || '', JSON.stringify(data.config || {}), data.enabled ? 1 : 0, data.sort || 0, now);
    return r.lastInsertRowid;
  }
}

function deleteAction(channelId, id) {
  getDb().prepare('DELETE FROM ActionItems WHERE Id = ? AND ChannelId = ?').run(id, channelId);
}

// --- Sounds ---
function getSounds(channelId) {
  return getDb().prepare('SELECT * FROM Sounds WHERE ChannelId = ? ORDER BY Sort, Id').all(channelId);
}

function saveSound(channelId, data) {
  const d = getDb();
  if (data.id && data.id > 0) {
    d.prepare('UPDATE Sounds SET Name=?, FileName=?, Url=?, Volume=?, Enabled=?, Sort=?, Category=? WHERE Id=? AND ChannelId=?')
      .run(data.name, data.fileName || '', data.url || '', data.volume || 100, data.enabled ? 1 : 0, data.sort || 0, data.category || '', data.id, channelId);
    return data.id;
  } else {
    const r = d.prepare('INSERT INTO Sounds (ChannelId, Name, FileName, Url, Volume, Enabled, Sort, Category) VALUES (?,?,?,?,?,?,?,?)')
      .run(channelId, data.name, data.fileName || '', data.url || '', data.volume || 100, data.enabled ? 1 : 0, data.sort || 0, data.category || '');
    return r.lastInsertRowid;
  }
}

function deleteSound(channelId, id) {
  getDb().prepare('DELETE FROM Sounds WHERE Id = ? AND ChannelId = ?').run(id, channelId);
}

// --- Transactions ---
function getTransactions(channelId, limit = 50) {
  return getDb().prepare('SELECT * FROM Transactions WHERE ChannelId = ? ORDER BY CreatedAt DESC LIMIT ?').all(channelId, limit);
}

// --- Notifications ---
function getNotifications(channelId, limit = 50) {
  return getDb().prepare('SELECT * FROM Notifications WHERE ChannelId = ? ORDER BY CreatedAt DESC LIMIT ?').all(channelId, limit);
}

function markNotificationRead(channelId, id) {
  getDb().prepare('UPDATE Notifications SET IsRead = 1, IsSeen = 1 WHERE Id = ? AND ChannelId = ?').run(id, channelId);
}

// --- Overlays ---
function getOverlays(channelId) {
  return getDb().prepare('SELECT * FROM Overlays WHERE ChannelId = ? ORDER BY Sort, Id').all(channelId);
}

// --- Widget Settings Cache ---
function buildWidgetSettings(channelId) {
  const ds = getDynamicSettings(channelId);
  // Return all settings that start with common widget prefixes
  const result = {};
  for (const [k, v] of Object.entries(ds)) {
    result[k] = v;
  }
  return result;
}

module.exports = {
  getDb, getChannel, getFirstChannel, getChannelByName, getChannelByEmail, createChannel,
  getDynamicSettings, upsertDynamicSetting,
  getActions, saveAction, deleteAction,
  getSounds, saveSound, deleteSound,
  getTransactions, getNotifications, markNotificationRead,
  getOverlays, buildWidgetSettings
};
