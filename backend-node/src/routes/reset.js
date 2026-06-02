// /api/reset/* — clear points / goals / aggregates / everything.
//
// Direct port of `backend/Controllers/ResetController.cs`. Each reset
// broadcasts the cleared state via Socket.IO so widgets snap to the new
// values without a refresh.
//
// Phase 2 caveat: the C# version proxies aggregate/goal refresh through
// TikTokBridgeService.ResetAggregates() / RefreshGoalConfig(). Until the
// Node bridge lands in Phase 3, we broadcast the cleared events ourselves —
// widget HTML pages re-fetch their data on receiving them.

const express = require('express');
const db = require('../db/conn');
const goals = require('../db/models/goals');
const sockets = require('../services/socket-manager');
const channels = require('../db/models/channels');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

// Broadcast both at-the-channel (widget-only) and globally so test pages
// without channel context also reflect the reset.
function broadcastReset(channelId, eventName, data = {}) {
  if (channelId > 0) {
    sockets.broadcastToChannel(eventName, data, channelId, 'widget');
  }
  sockets.broadcast(eventName, data);
}

router.post('/aggregates', (req, res) => {
  const channelId = resolveChannelId(req);
  broadcastReset(channelId, 'aggregatesReset', { channelId });
  res.json({ status: 200, reset: 'aggregates' });
});

router.post('/points', (req, res) => {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.json({ status: 200, reset: 'points', count: 0 });
  const result = db
    .prepare(
      `DELETE FROM "DynamicSettings"
        WHERE "ChannelId" = ? AND ("Key" LIKE 'points_user_%' OR "Key" LIKE 'pointsmeta_%')`
    )
    .run(channelId);
  broadcastReset(channelId, 'pointsReset', { channelId, removed: result.changes });
  res.json({ status: 200, reset: 'points', count: result.changes });
});

router.post('/goals', (req, res) => {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.json({ status: 200, reset: 'goals', count: 0 });
  const result = db
    .prepare(`UPDATE "Goals" SET "Current" = 0 WHERE "ChannelId" = ?`)
    .run(channelId);
  broadcastReset(channelId, 'goalsChanged', { channelId });
  res.json({ status: 200, reset: 'goals', count: result.changes });
});

router.post('/all', (req, res) => {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.json({ status: 200, reset: 'all', points: 0, goals: 0 });

  const txn = db.transaction(() => {
    const pts = db
      .prepare(
        `DELETE FROM "DynamicSettings"
          WHERE "ChannelId" = ? AND ("Key" LIKE 'points_user_%' OR "Key" LIKE 'pointsmeta_%')`
      )
      .run(channelId);
    const gls = db
      .prepare(`UPDATE "Goals" SET "Current" = 0 WHERE "ChannelId" = ?`)
      .run(channelId);
    return { points: pts.changes, goals: gls.changes };
  });

  const out = txn();
  broadcastReset(channelId, 'pointsReset', { channelId, removed: out.points });
  broadcastReset(channelId, 'goalsChanged', { channelId });
  broadcastReset(channelId, 'aggregatesReset', { channelId });
  res.json({ status: 200, reset: 'all', ...out });
});

module.exports = router;
