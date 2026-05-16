// /api/import/tikfinity, /api/import/tikfinity/test — one-shot importer
// pulling a user's existing Tikfinity Pro configuration from
// tikfinity.zerody.one into our local DB.
//
// Direct port of `backend/Controllers/TikfinityImportController.cs`. The
// upstream auth scheme is three replay headers from the user's browser:
//   - x-authorization-token (their session JWT)
//   - x-channel-id          (numeric)
//   - x-channel-signature   (Channels.ChannelSignature from /api/me — static)
// We don't validate them client-side; we just call /api/me upstream and
// trust the response.

const express = require('express');
const db = require('../db/conn');
const channels = require('../db/models/channels');
const sockets = require('../services/socket-manager');
const widgetSettings = require('../services/widget-settings-cache');
const logger = require('../logger');

const router = express.Router();

const TIKFINITY_BASE = 'https://tikfinity.zerody.one';
const REQUEST_TIMEOUT_MS = 30_000;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36';

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

function validateCredentials(creds) {
  if (!creds || typeof creds !== 'object') return 'invalid body';
  if (!creds.token || typeof creds.token !== 'string') return 'Missing token (x-authorization-token).';
  if (!Number.isFinite(creds.channelId) || creds.channelId <= 0) return 'Missing or invalid channelId (x-channel-id).';
  if (!creds.signature || typeof creds.signature !== 'string') return 'Missing signature (x-channel-signature).';
  return null;
}

function buildHeaders(creds) {
  return {
    'x-authorization-token': creds.token,
    'x-channel-id': String(creds.channelId),
    'x-channel-signature': creds.signature,
    'x-requested-with': 'XMLHttpRequest',
    'User-Agent': USER_AGENT,
    Accept: 'application/json',
    Referer: `${TIKFINITY_BASE}/`,
  };
}

async function tikfinityFetch(creds, method, path, body) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const init = {
      method,
      headers: buildHeaders(creds),
      signal: ctrl.signal,
    };
    if (body !== undefined) {
      init.headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }
    const resp = await fetch(TIKFINITY_BASE + path, init);
    const text = await resp.text();
    return { status: resp.status, body: text };
  } catch (err) {
    if (err.name === 'AbortError') return { status: 0, body: `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s` };
    return { status: 0, body: 'HTTP error: ' + (err.message || err) };
  } finally {
    clearTimeout(t);
  }
}

function callMeUpstream(creds, profileId) {
  const body = profileId
    ? { profileId }
    : { channelName: '', ownerUserId: '', monthlyEarnings: 0, streamGifter: 0 };
  return tikfinityFetch(creds, 'POST', '/api/me', body);
}

function callActionsUpstream(creds, profileId) {
  const path = `/api/rest/action?channelId=${creds.channelId}&profileId=${profileId}&pageSize=5000`;
  return tikfinityFetch(creds, 'GET', path);
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

router.post('/tikfinity/test', async (req, res) => {
  const body = req.body || {};
  const creds = {
    token: body.token || body.Token,
    channelId: Number(body.channelId ?? body.ChannelId) || 0,
    signature: body.signature || body.Signature,
  };
  const err = validateCredentials(creds);
  if (err) return res.status(400).json({ error: err });

  const r = await callMeUpstream(creds, null);
  if (r.status !== 200) {
    return res.status(400).json({
      error: `Tikfinity returned ${r.status}. Token might be expired or signature wrong.`,
      status: r.status,
      body: r.body.length > 500 ? r.body.slice(0, 500) : r.body,
    });
  }
  const data = safeParse(r.body);
  if (!data) return res.status(400).json({ error: 'Could not parse Tikfinity response' });
  const ch = data.channel || {};
  res.json({
    status: 200,
    channelId: ch.channelId,
    channelName: ch.channelName,
    email: ch.email,
    profileId: ch.profileId,
    proExpireAt: ch.proExpireAt,
    settingsCount: ch.dynamicSettings ? Object.keys(ch.dynamicSettings).length : 0,
  });
});

// Atomic per-(channel, profile) wipe + reinsert. Avoids leaving orphan rows
// behind if Tikfinity renamed keys upstream.
function replaceSettings(localChannelId, profileId, dynamicSettings) {
  const delStmt = db.prepare(
    `DELETE FROM "DynamicSettings" WHERE "ChannelId" = ? AND "ProfileId" = ?`
  );
  const insStmt = db.prepare(
    `INSERT INTO "DynamicSettings" ("ChannelId","ProfileId","Key","Value") VALUES (?,?,?,?)`
  );
  let inserted = 0;
  db.transaction(() => {
    delStmt.run(localChannelId, profileId);
    if (!dynamicSettings || typeof dynamicSettings !== 'object') return;
    const seen = new Set();
    for (const [key, value] of Object.entries(dynamicSettings)) {
      if (!key || !key.trim() || seen.has(key.toLowerCase())) continue;
      seen.add(key.toLowerCase());
      const v = typeof value === 'string' ? value : value == null ? '' : JSON.stringify(value);
      insStmt.run(localChannelId, profileId, key, v);
      inserted++;
    }
  })();
  return inserted;
}

function replaceActions(localChannelId, profileId, actions) {
  const delStmt = db.prepare(
    `DELETE FROM "Actions" WHERE "ChannelId" = ? AND "ProfileId" = ?`
  );
  const insStmt = db.prepare(`
    INSERT INTO "Actions"
      ("ChannelId","ProfileId","Name","Type","TriggerValue","ConfigJson","Enabled","Sort","CreatedAt")
    VALUES (?,?,?,?,?,?,?,?,?)
  `);
  const nowIso = new Date().toISOString();
  let inserted = 0;
  db.transaction(() => {
    delStmt.run(localChannelId, profileId);
    if (!Array.isArray(actions)) return;
    let order = 0;
    for (const a of actions) {
      if (!a || typeof a !== 'object') continue;
      insStmt.run(
        localChannelId,
        profileId,
        typeof a.name === 'string' ? a.name : `Action ${order + 1}`,
        '', // bundle drives type via events.json upstream
        null,
        JSON.stringify(a),
        1,
        order++,
        nowIso
      );
      inserted++;
    }
  })();
  return inserted;
}

router.post('/tikfinity', async (req, res) => {
  const body = req.body || {};
  const creds = {
    token: body.token || body.Token,
    channelId: Number(body.channelId ?? body.ChannelId) || 0,
    signature: body.signature || body.Signature,
  };
  const err = validateCredentials(creds);
  if (err) return res.status(400).json({ error: err });

  const localChannelId = resolveChannelId(req);
  if (localChannelId <= 0) {
    return res.status(400).json({ error: 'No local channel — log in to the clone first.' });
  }

  const requested = Array.isArray(body.profileIds || body.ProfileIds)
    ? (body.profileIds || body.ProfileIds).filter((p) => Number.isFinite(p) && p > 0)
    : [1];
  const profileIds = [...new Set(requested.length > 0 ? requested : [1])];

  const summary = {};
  for (const pid of profileIds) {
    const meR = await callMeUpstream(creds, pid);
    if (meR.status !== 200) {
      return res.status(400).json({
        error: `Tikfinity /api/me for profileId=${pid} returned ${meR.status}`,
        body: meR.body.length > 500 ? meR.body.slice(0, 500) : meR.body,
      });
    }
    const meDoc = safeParse(meR.body);
    const ch = (meDoc && meDoc.channel) || {};
    const serverProfileId = Number.isFinite(ch.profileId) ? ch.profileId : pid;
    const settingsCount = replaceSettings(localChannelId, pid, ch.dynamicSettings);

    const actR = await callActionsUpstream(creds, pid);
    if (actR.status !== 200) {
      return res.status(400).json({
        error: `Tikfinity /api/rest/action for profileId=${pid} returned ${actR.status}`,
        body: actR.body.length > 500 ? actR.body.slice(0, 500) : actR.body,
      });
    }
    const actDoc = safeParse(actR.body);
    const actionsCount = replaceActions(localChannelId, pid, actDoc && actDoc.actions);

    summary[pid] = { Settings: settingsCount, Actions: actionsCount, ServerProfileId: serverProfileId };
  }

  // Reflect imported state without forcing a renderer reload.
  try {
    widgetSettings.rebuildAndBroadcast(localChannelId);
    sockets.broadcast('actionsChanged', {});
  } catch (e) {
    logger.warn({ err: e }, '[Import] post-import broadcast failed');
  }

  res.json({ status: 200, message: 'OK', imported: summary });
});

module.exports = router;
