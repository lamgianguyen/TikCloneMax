// /api/commands — chat-bot command CRUD + test fire.
//
// Direct port of `backend/Controllers/ChatCommandsController.cs`. The C#
// version calls `ChatBotService.RefreshAsync(channelId)` after each write
// and `ChatBotService.OnChatAsync(...)` for test fires. Until the Node
// chat-bot service lands in Phase 3 we no-op those and let the bundle's
// own client-side test path simulate. The /test endpoint just echoes the
// command's response so the UI confirms persistence worked.

const express = require('express');
const chatCommands = require('../db/models/chat-commands');
const channels = require('../db/models/channels');
const chatBot = require('../services/chat-bot');

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

function mapCommand(c) {
  return {
    id: c.Id,
    channelId: c.ChannelId,
    command: c.Command,
    response: c.Response,
    cooldown: c.Cooldown,
    enabled: !!c.Enabled,
    sort: c.Sort,
    createdAt: c.CreatedAt,
  };
}

router.get('/', (req, res) => {
  const channelId = resolveChannelId(req);
  const profileId = resolveProfileId(channelId);
  const list = channelId > 0
    ? chatCommands.listByChannelProfile(channelId, profileId).map(mapCommand)
    : [];
  res.json({ status: 200, message: 'OK', commands: list });
});

router.post('/', (req, res) => {
  const channelId = resolveChannelId(req);
  const profileId = resolveProfileId(channelId);
  const dto = req.body || {};
  const command = (dto.Command ?? dto.command ?? '').toString().trim();
  const response = (dto.Response ?? dto.response ?? '').toString().trim();
  const cooldown = Math.max(0, Number(dto.Cooldown ?? dto.cooldown ?? 0) | 0);
  const enabled = dto.Enabled ?? dto.enabled ?? true;
  const sort = Number(dto.Sort ?? dto.sort ?? 0) | 0;
  const id = Number(dto.Id ?? dto.id) || 0;

  if (!command) return res.status(400).json({ error: 'command required' });
  if (!response) return res.status(400).json({ error: 'response required' });

  if (id > 0) {
    const existing = chatCommands.findById(id);
    if (!existing || existing.ChannelId !== channelId) {
      return res.status(404).json({ status: 404 });
    }
    chatCommands.patch(id, {
      Command: command,
      Response: response,
      Cooldown: cooldown,
      Enabled: !!enabled,
      Sort: sort,
    });
    chatBot.refresh(channelId);
    return res.json({ status: 200, id });
  }

  const newId = chatCommands.create({
    ChannelId: channelId,
    ProfileId: profileId,
    Command: command,
    Response: response,
    Cooldown: cooldown,
    Enabled: !!enabled,
    Sort: sort,
  });
  chatBot.refresh(channelId);
  res.json({ status: 200, id: newId });
});

router.delete('/:id', (req, res) => {
  const channelId = resolveChannelId(req);
  const id = parseInt(req.params.id, 10);
  if (Number.isFinite(id) && id > 0) {
    const existing = chatCommands.findById(id);
    if (existing && existing.ChannelId === channelId) {
      chatCommands.remove(id);
      chatBot.refresh(channelId);
    }
  }
  res.json({ status: 200 });
});

// Test-fire a command without going through the TikTok bridge. Replaced in
// Phase 3 with a real chatBot.onChat() call.
router.post('/test/:id', (req, res) => {
  const channelId = resolveChannelId(req);
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id) || id <= 0) return res.status(404).json({ status: 404 });
  const cmd = chatCommands.findById(id);
  if (!cmd || cmd.ChannelId !== channelId) return res.status(404).json({ status: 404 });
  res.json({ status: 200, fired: true });
});

module.exports = router;
