// /api/goals — CRUD for stream goals (subscriber/like/follow/gift/custom).
//
// Direct port of `backend/Controllers/GoalsController.cs`. The C# version
// also calls `TikTokBridgeService.RefreshGoalConfig(channelId)` after every
// write to push the new config to the bridge's in-memory state — until the
// Node tikTokBridge service lands in Phase 3 we no-op that call and rely on
// the bundle re-fetching the list when the user opens the goal widget.

const express = require('express');
const goals = require('../db/models/goals');
const channels = require('../db/models/channels');
const sockets = require('../services/socket-manager');
const tiktokBridge = require('../services/tiktok-bridge');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}
function resolveProfileId(channelId) {
  if (channelId <= 0) return 1;
  const ch = channels.findById(channelId);
  return ch && ch.ProfileId > 0 ? ch.ProfileId : 1;
}

function mapGoal(g) {
  const pct = g.Target > 0 ? Math.round((1000 * g.Current) / g.Target) / 10 : 0;
  return {
    id: g.Id,
    channelId: g.ChannelId,
    name: g.Name,
    type: g.Type,
    target: g.Target,
    current: g.Current,
    enabled: !!g.Enabled,
    percent: pct,
    createdAt: g.CreatedAt,
  };
}

// Tell every connected widget the goal config changed. Cheap pulse — widgets
// re-fetch /api/goals when they receive it.
function broadcastGoalsChanged(channelId) {
  try {
    sockets.broadcastToChannel('goalsChanged', { channelId }, channelId, 'widget');
  } catch {
    /* socket manager may not be bound during tests — safe to ignore */
  }
  // Drop the bridge's cached goal list so the next live event re-loads with
  // the new config (fresh target, new goal added, deleted goal gone).
  try {
    tiktokBridge.refreshGoals(channelId);
  } catch {
    /* bridge is optional — okay if not loaded */
  }
}

router.get('/', (req, res) => {
  const channelId = resolveChannelId(req);
  const profileId = resolveProfileId(channelId);
  const list = channelId > 0
    ? goals.listByChannelProfile(channelId, profileId).map(mapGoal)
    : [];
  res.json({ status: 200, message: 'OK', goals: list });
});

router.post('/', (req, res) => {
  const channelId = resolveChannelId(req);
  const profileId = resolveProfileId(channelId);
  const dto = req.body || {};
  const type = (dto.Type ?? dto.type ?? '').toString().trim();
  const target = Number(dto.Target ?? dto.target ?? 0) | 0;
  const name = dto.Name ?? dto.name ?? '';
  const enabled = dto.Enabled ?? dto.enabled ?? true;
  const id = Number(dto.Id ?? dto.id) || 0;

  if (!type) return res.status(400).json({ error: 'type required' });
  if (target <= 0) return res.status(400).json({ error: 'target must be > 0' });

  if (id > 0) {
    const existing = goals.findById(id);
    if (!existing || existing.ChannelId !== channelId) {
      return res.status(404).json({ status: 404 });
    }
    goals.patch(id, {
      Name: name,
      Type: type,
      Target: target,
      Enabled: !!enabled,
    });
    broadcastGoalsChanged(channelId);
    return res.json({ status: 200, id });
  }

  const newId = goals.create({
    ChannelId: channelId,
    ProfileId: profileId,
    Name: name,
    Type: type,
    Target: target,
    Current: 0,
    Enabled: !!enabled,
  });
  broadcastGoalsChanged(channelId);
  res.json({ status: 200, id: newId });
});

router.delete('/:id', (req, res) => {
  const channelId = resolveChannelId(req);
  const id = parseInt(req.params.id, 10);
  if (Number.isFinite(id) && id > 0) {
    const existing = goals.findById(id);
    if (existing && existing.ChannelId === channelId) {
      goals.remove(id);
      broadcastGoalsChanged(channelId);
    }
  }
  res.json({ status: 200 });
});

router.post('/:id/reset', (req, res) => {
  const channelId = resolveChannelId(req);
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id) || id <= 0) return res.status(404).json({ status: 404 });
  const existing = goals.findById(id);
  if (!existing || existing.ChannelId !== channelId) {
    return res.status(404).json({ status: 404 });
  }
  goals.patch(id, { Current: 0 });
  broadcastGoalsChanged(channelId);
  res.json({ status: 200 });
});

module.exports = router;
