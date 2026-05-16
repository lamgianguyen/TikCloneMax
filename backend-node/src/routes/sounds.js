// /api/sounds, /api/rest/sound, /api/rest/sounds, /api/sounds/save,
// /api/sounds/delete + /api/rest/sound/* aliases.
//
// Direct port of `backend/Controllers/SoundsController.cs`. Two URL families
// exist because the bundle's settings UI and the widget-side fetcher
// disagree on convention (plural `/sounds` vs REST-style `/rest/sound`).
// Both aliases share the same handler so DB writes and reads stay consistent.

const express = require('express');
const sounds = require('../db/models/sounds');
const channels = require('../db/models/channels');

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

// Bundle expects camelCase (ASP.NET Core 9 default for Web JsonSerializerOptions).
function mapSound(s) {
  return {
    id: s.Id,
    name: s.Name,
    fileName: s.FileName,
    url: s.Url,
    volume: s.Volume,
    enabled: !!s.Enabled,
    sort: s.Sort,
    category: s.Category,
  };
}

function handleList(req, res) {
  const channelId = resolveChannelId(req);
  const profileId = resolveProfileId(channelId);
  const list = channelId > 0
    ? sounds.listByChannelProfile(channelId, profileId).map(mapSound)
    : [];
  res.json({
    status: 200,
    message: 'OK',
    arrayKey: 'sounds',
    sounds: list,
    data: list,
    pageSize: Math.max(list.length, 1),
    page: 0,
    hasNext: false,
  });
}

function handleSave(req, res) {
  const channelId = resolveChannelId(req);
  const dto = req.body || {};
  const id = Number(dto.Id ?? dto.id) || 0;
  const name = dto.Name ?? dto.name ?? '';
  const url = dto.Url ?? dto.url ?? null;
  const volume = Number(dto.Volume ?? dto.volume ?? 100) | 0;
  const enabled = dto.Enabled ?? dto.enabled ?? true;
  const sort = Number(dto.Sort ?? dto.sort ?? 0) | 0;
  const category = dto.Category ?? dto.category ?? null;

  if (id > 0) {
    const existing = sounds.findById(id);
    if (!existing || existing.ChannelId !== channelId) {
      return res.status(404).json({ status: 404 });
    }
    sounds.patch(id, {
      Name: name,
      Url: url,
      Volume: volume,
      Enabled: !!enabled,
      Sort: sort,
      Category: category,
    });
    return res.json({ status: 200, message: 'OK', id });
  }

  const newId = sounds.create({
    ChannelId: channelId,
    ProfileId: resolveProfileId(channelId),
    Name: name,
    Url: url,
    Volume: volume,
    Enabled: !!enabled,
    Sort: sort,
    Category: category,
  });
  res.json({ status: 200, message: 'OK', id: newId });
}

function handleDelete(req, res) {
  const channelId = resolveChannelId(req);
  const id = Number(req.body?.Id ?? req.body?.id) || 0;
  if (id > 0) {
    const existing = sounds.findById(id);
    if (existing && existing.ChannelId === channelId) sounds.remove(id);
  }
  res.json({ status: 200, message: 'OK' });
}

router.get('/sounds', handleList);
router.post('/sounds', handleList);
router.get('/rest/sound', handleList);
router.post('/rest/sound', handleList);
router.get('/rest/sounds', handleList);

router.post('/sounds/save', handleSave);
router.post('/rest/sound/save', handleSave);

router.post('/sounds/delete', handleDelete);
router.post('/rest/sound/delete', handleDelete);

module.exports = router;
