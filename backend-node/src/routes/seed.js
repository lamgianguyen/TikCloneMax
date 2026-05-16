// /api/seed, /api/seed/status — dev-time import from the bundle's
// `downloads/api/*` JSON fixtures.
//
// Port of `backend/Controllers/SeedController.cs`. In production the boot
// seed (`src/db/seed.js`) does the bare-minimum row creation; this endpoint
// is the heavier "ingest the bundled snapshot" tool for testing UI against
// a realistic action/notification set.

const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../db/conn');
const channels = require('../db/models/channels');
const subscriptions = require('../db/models/subscriptions');
const config = require('../config');
const logger = require('../logger');

const router = express.Router();

function readJsonFromBundleApi(rel) {
  const filePath = path.join(config.FRONTEND_PATH, 'api', ...rel.split('/'));
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    logger.warn({ err, filePath }, '[Seed] failed to parse bundled fixture');
    return null;
  }
}

function tableCounts() {
  const tables = [
    'Channels', 'Actions', 'DynamicSettings', 'ChannelModules', 'Notifications',
    'Subscriptions', 'Sounds', 'Overlays', 'Widgets', 'Goals', 'Timers', 'ChatCommands',
  ];
  const out = {};
  for (const t of tables) {
    try {
      const row = db.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get();
      const key = t === 'ChannelModules' ? 'modules' :
                  t === 'ChatCommands' ? 'commands' :
                  t.charAt(0).toLowerCase() + t.slice(1);
      out[key] = row ? row.n : 0;
    } catch {
      out[t] = 0;
    }
  }
  return out;
}

router.get('/status', (_req, res) => {
  res.json(tableCounts());
});

function importChannelData(channelId, me) {
  const ch = me && me.channel;
  if (!ch) return { skipped: true, reason: 'no channel block' };
  const existing = channels.findById(channelId);
  if (!existing) return { skipped: true, reason: 'channel not found' };

  const updates = {};
  if (typeof ch.ownerUserId === 'string') updates.OwnerUserId = ch.ownerUserId;
  if (typeof ch.channelSignature === 'string') updates.ChannelSignature = ch.channelSignature;
  if (typeof ch.sub === 'string') updates.Sub = ch.sub;
  if (typeof ch.locale === 'string') updates.Locale = ch.locale;
  if (Number.isFinite(ch.profileId)) updates.ProfileId = ch.profileId;

  if (Object.keys(updates).length === 0) return { updated: false };

  // Build dynamic UPDATE — beats hand-listing every column.
  const cols = Object.keys(updates).map((k) => `"${k}" = ?`).join(', ');
  const vals = Object.values(updates);
  db.prepare(`UPDATE "Channels" SET ${cols}, "UpdatedAt" = ? WHERE "ChannelId" = ?`).run(
    ...vals,
    new Date().toISOString(),
    channelId
  );
  return { updated: true };
}

function importDynamicSettings(channelId, me) {
  const ds = me && me.channel && me.channel.dynamicSettings;
  if (!ds || typeof ds !== 'object') return { skipped: true };

  db.prepare(`DELETE FROM "DynamicSettings" WHERE "ChannelId" = ?`).run(channelId);
  const insert = db.prepare(
    `INSERT INTO "DynamicSettings" ("ChannelId","ProfileId","Key","Value") VALUES (?,?,?,?)`
  );
  let count = 0;
  for (const [key, value] of Object.entries(ds)) {
    let v = typeof value === 'string' ? value : JSON.stringify(value);
    if (v.length > 4000) v = v.slice(0, 4000);
    insert.run(channelId, 1, key, v);
    count++;
  }
  return { imported: count };
}

function importActions(channelId, fixture) {
  if (!fixture || !Array.isArray(fixture.actions)) return { skipped: true };
  db.prepare(`DELETE FROM "Actions" WHERE "ChannelId" = ?`).run(channelId);
  const insert = db.prepare(`
    INSERT INTO "Actions" ("ChannelId","ProfileId","Name","Type","TriggerValue","ConfigJson","Enabled","Sort","CreatedAt")
    VALUES (?,?,?,?,?,?,?,?,?)
  `);
  const nowIso = new Date().toISOString();
  let count = 0;
  for (const a of fixture.actions) {
    if (!a || typeof a !== 'object') continue;
    insert.run(
      channelId,
      1,
      typeof a.name === 'string' ? a.name : 'Unnamed',
      typeof a.type === 'string' ? a.type : '',
      typeof a.triggerValue === 'string' ? a.triggerValue : null,
      JSON.stringify(a),
      1,
      count,
      nowIso
    );
    count++;
  }
  return { imported: count };
}

function importModules(channelId, fixture) {
  if (!Array.isArray(fixture)) return { skipped: true };
  db.prepare(`DELETE FROM "ChannelModules" WHERE "ChannelId" = ?`).run(channelId);
  const insert = db.prepare(`
    INSERT INTO "ChannelModules" ("ChannelId","ModuleId","Name","Enabled","Sort")
    VALUES (?,?,?,?,?)
  `);
  let count = 0;
  for (const m of fixture) {
    if (!m || typeof m !== 'object') continue;
    insert.run(
      channelId,
      typeof m.id === 'string' ? m.id : '',
      typeof m.name === 'string' ? m.name : '',
      m.enabled ? 1 : 0,
      Number.isFinite(m.sort) ? m.sort : count
    );
    count++;
  }
  return { imported: count };
}

function importNotifications(channelId, fixture) {
  if (!fixture || !Array.isArray(fixture.notifications)) return { skipped: true };
  db.prepare(`DELETE FROM "Notifications" WHERE "ChannelId" = ?`).run(channelId);
  const insert = db.prepare(`
    INSERT INTO "Notifications" ("ChannelId","Subject","Body","Category","DataJson","IsRead","IsSeen","CreatedAt","TransactionId")
    VALUES (?,?,?,?,?,?,?,?,?)
  `);
  const nowIso = new Date().toISOString();
  let count = 0;
  for (const n of fixture.notifications) {
    if (!n || typeof n !== 'object') continue;
    insert.run(
      channelId,
      typeof n.subject === 'string' ? n.subject : '',
      typeof n.body === 'string' ? n.body : '',
      typeof n.category === 'string' ? n.category : 'announcements',
      n.data ? JSON.stringify(n.data) : null,
      n.isRead ? 1 : 0,
      n.isRead ? 1 : 0,
      nowIso,
      ''
    );
    count++;
  }
  return { imported: count };
}

function importSubscription(channelId) {
  subscriptions.upsert({
    channelId,
    isPro: true,
    plan: 'pro',
    active: true,
  });
  return { upserted: true };
}

router.post('/', (req, res) => {
  const apiDir = path.join(config.FRONTEND_PATH, 'api');
  if (!fs.existsSync(apiDir)) {
    return res.status(400).json({ status: 'error', message: 'downloads/api directory not found' });
  }
  const requestedId = Number(req.query.channelId) || 0;
  let targetChannelId = requestedId;
  if (!targetChannelId) {
    const def = channels.findDefault();
    if (!def) {
      return res.status(400).json({ status: 'error', message: 'No channels in DB. Register first.' });
    }
    targetChannelId = def.ChannelId;
  }
  if (!channels.findById(targetChannelId)) {
    return res.status(404).json({ status: 'error', message: `Channel ${targetChannelId} not found` });
  }

  const me = readJsonFromBundleApi('me');
  const actionsFx = readJsonFromBundleApi('rest/action');
  const modulesFx = readJsonFromBundleApi('modules');
  const notifFx = readJsonFromBundleApi('notifications/list');

  const txn = db.transaction(() => ({
    channel: importChannelData(targetChannelId, me),
    dynamicSettings: importDynamicSettings(targetChannelId, me),
    actions: importActions(targetChannelId, actionsFx),
    modules: importModules(targetChannelId, modulesFx),
    notifications: importNotifications(targetChannelId, notifFx),
    subscription: importSubscription(targetChannelId),
  }));

  let imported;
  try {
    imported = txn();
  } catch (err) {
    logger.error({ err }, '[Seed] transaction failed');
    return res.status(500).json({ status: 'error', message: err.message });
  }

  res.json({ status: 'ok', channelId: targetChannelId, imported });
});

module.exports = router;
