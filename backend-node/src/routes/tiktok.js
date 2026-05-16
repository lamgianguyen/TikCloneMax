// /api/tiktok/* — TikTok LIVE connection control surface.
//
// Replaces the C# `TikTokController` + parts of `WidgetController` that talked
// to the bridge subprocess. With `tiktok-live-connector` running in-process,
// these endpoints are just thin wrappers over `services/tiktok-bridge`.

const express = require('express');
const bridge = require('../services/tiktok-bridge');
const aggregates = require('../services/aggregates');
const channels = require('../db/models/channels');
const sockets = require('../services/socket-manager');
const logger = require('../logger');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

router.get('/status', (_req, res) => {
  res.json({ status: 200, ...bridge.status() });
});

// Profile chip / connection-detail panel reads this to render the connected
// TikTok account (avatar + nickname + follower count + room title). Returns
// an empty/idle shape when not connected so the UI can still render the
// "not connected" empty state instead of staying blank waiting on data.
router.get(['/account', '/profile', '/connected'], (_req, res) => {
  res.json({ status: 200, account: bridge.accountSnapshot() });
});

router.post('/connect', (req, res) => {
  const username = (req.body?.username || req.body?.Username || '').toString().trim();
  if (!username) return res.status(400).json({ error: 'username required' });
  const channelId = resolveChannelId(req);

  // FIRE-AND-FORGET: respond 200 immediately, run the connect async.
  // The C# bridge service did the same — `connect()` returned right after
  // queuing the work, and the renderer learned the actual outcome via
  // Socket.IO `connected`/`error` events + status polling. Awaiting here
  // would block 5-15s while tiktok-live-connector tries 3 different
  // room-id sources, and the bundle's fetch hits its own ~5s timeout
  // then retries, causing the "connect kỳ kỳ" double-fire loop.

  // Broadcast a `channelStatus` event right away so the topbar pivots to
  // "Connecting..." instead of staying on "Disconnected" for ~5-15s.
  try {
    sockets.broadcast('channelStatus', {
      channelId,
      connected: false,
      connecting: true,
      tiktok: username,
      isConnectedToTikTok: false,
      isConnecting: true,
    });
  } catch { /* socket may not be bound */ }

  bridge.connect(username, channelId).then((result) => {
    // Echo the outcome so the bundle's tf-connect.js + topbar refresh from
    // a single event rather than waiting on the next status poll.
    try {
      const s = bridge.status();
      sockets.broadcast('channelStatus', {
        channelId,
        connected: s.connected,
        connecting: false,
        tiktok: s.username,
        roomId: s.roomId,
        isConnectedToTikTok: s.connected,
        isConnecting: false,
      });
    } catch { /* ignore */ }
  }).catch((err) => {
    logger.warn({ err: err?.message || err, username }, '[TikTok] background connect failed');
    try {
      sockets.broadcast('channelStatus', {
        channelId,
        connected: false,
        connecting: false,
        tiktok: username,
        isConnectedToTikTok: false,
        isConnecting: false,
        error: err?.message || String(err),
      });
    } catch { /* ignore */ }
  });
  // Bundle's tf-connect.js (downloads/js/tf-connect.js:242) checks
  // `data.status === 'ok'` to decide if the POST succeeded — a numeric
  // 200 falls through and pivots the topbar to "failed". Return the
  // string `'ok'` (same shape the C# bridge used).
  res.json({ status: 'ok', message: 'OK', queued: true, username });
});

router.post('/disconnect', async (_req, res) => {
  await bridge.disconnect();
  res.json({ status: 200, disconnected: true });
});

// Snapshot of current stream aggregates — useful for the dashboard.
router.get('/stats', (_req, res) => {
  res.json({ status: 200, stats: aggregates.snapshot() });
});

router.post('/stats/reset', (req, res) => {
  aggregates.resetAll(resolveChannelId(req));
  res.json({ status: 200, reset: true });
});

module.exports = router;
