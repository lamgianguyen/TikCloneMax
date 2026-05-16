// /api/points — leaderboard, per-user balance read/write.
//
// Port of `backend/Controllers/PointsController.cs`. Configuration values
// (per-chat-minute, multipliers) still live in DynamicSettings under the
// `points.*` namespace and are edited via the regular /api/updateSettings
// flow. This controller only exposes the leaderboard + admin override path.

const express = require('express');
const points = require('../services/points');
const channels = require('../db/models/channels');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

router.get('/leaderboard', (req, res) => {
  const channelId = resolveChannelId(req);
  const limit = Math.max(1, Math.min(500, Number(req.query.limit) || 50));
  const list = channelId > 0 ? points.listLeaderboard(channelId, limit) : [];
  res.json({ status: 200, total: list.length, leaderboard: list });
});

router.get('/user/:username', (req, res) => {
  const channelId = resolveChannelId(req);
  const username = req.params.username;
  const balance = channelId > 0 ? points.getBalance(channelId, username) : 0;
  res.json({ status: 200, username, balance });
});

router.post('/user/:username', (req, res) => {
  const channelId = resolveChannelId(req);
  const username = req.params.username;
  const balance = Number(req.body?.Balance ?? req.body?.balance ?? 0);
  if (channelId > 0) points.setBalance(channelId, username, balance);
  res.json({ status: 200, username, balance });
});

module.exports = router;
