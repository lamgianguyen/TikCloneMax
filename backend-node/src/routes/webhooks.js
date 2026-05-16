// /api/webhooks — CRUD + test fire.
//
// Direct port of `backend/Controllers/WebhooksController.cs`. Validates URL
// scheme (http/https only), normalises method to uppercase, refreshes the
// dispatcher cache after every write.

const express = require('express');
const webhookModel = require('../db/models/webhooks');
const webhookSvc = require('../services/webhooks');
const channels = require('../db/models/channels');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

function isDiscordUrl(url) {
  return /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\//i.test(url || '');
}

function mapHook(h) {
  return {
    id: h.Id,
    channelId: h.ChannelId,
    name: h.Name,
    url: h.Url,
    method: h.Method,
    eventTypes: (h.EventTypesCsv || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    headersJson: h.HeadersJson,
    templateJson: h.TemplateJson,
    enabled: !!h.Enabled,
    retryCount: h.RetryCount,
    timeoutSeconds: h.TimeoutSeconds,
    isDiscord: isDiscordUrl(h.Url),
    createdAt: h.CreatedAt,
  };
}

function isHttpUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

router.get('/', (req, res) => {
  const channelId = resolveChannelId(req);
  const list = channelId > 0
    ? webhookModel.listByChannel(channelId).reverse().map(mapHook) // DESC by Id like C#
    : [];
  res.json({ status: 200, webhooks: list });
});

router.post('/', (req, res) => {
  const channelId = resolveChannelId(req);
  const dto = req.body || {};
  const url = (dto.Url ?? dto.url ?? '').toString().trim();
  if (!url) return res.status(400).json({ error: 'url required' });
  if (!isHttpUrl(url)) return res.status(400).json({ error: 'url phải là http(s)' });

  const id = Number(dto.Id ?? dto.id) || 0;
  const name = (dto.Name ?? dto.name ?? '').toString();
  const method = ((dto.Method ?? dto.method) || 'POST').toString().toUpperCase();
  const eventTypesCsv = (dto.EventTypesCsv ?? dto.eventTypesCsv ?? 'gift,follow,share,subscribe').toString();
  const headersJson = dto.HeadersJson ?? dto.headersJson ?? null;
  const templateJson = dto.TemplateJson ?? dto.templateJson ?? null;
  const enabled = dto.Enabled ?? dto.enabled ?? true;
  const retryCount = Math.max(0, Number(dto.RetryCount ?? dto.retryCount ?? 2) | 0);
  const timeoutSeconds = Math.max(2, Number(dto.TimeoutSeconds ?? dto.timeoutSeconds ?? 10) | 0);

  let resultId;
  if (id > 0) {
    const existing = webhookModel.findById(id);
    if (!existing || existing.ChannelId !== channelId) {
      return res.status(404).json({ status: 404, error: 'webhook not found' });
    }
    webhookModel.patch(id, {
      Name: name,
      Url: url,
      Method: method,
      EventTypesCsv: eventTypesCsv,
      HeadersJson: headersJson,
      TemplateJson: templateJson,
      Enabled: !!enabled,
      RetryCount: retryCount,
      TimeoutSeconds: timeoutSeconds,
    });
    resultId = id;
  } else {
    resultId = webhookModel.create({
      ChannelId: channelId,
      Name: name,
      Url: url,
      Method: method,
      EventTypesCsv: eventTypesCsv,
      HeadersJson: headersJson,
      TemplateJson: templateJson,
      Enabled: !!enabled,
      RetryCount: retryCount,
      TimeoutSeconds: timeoutSeconds,
    });
  }

  webhookSvc.refresh(channelId);
  res.json({ status: 200, id: resultId });
});

router.delete('/:id', (req, res) => {
  const channelId = resolveChannelId(req);
  const id = parseInt(req.params.id, 10);
  if (Number.isFinite(id) && id > 0) {
    const existing = webhookModel.findById(id);
    if (existing && existing.ChannelId === channelId) {
      webhookModel.remove(id);
      webhookSvc.refresh(channelId);
    }
  }
  res.json({ status: 200 });
});

router.post('/test/:id', async (req, res) => {
  const channelId = resolveChannelId(req);
  const id = parseInt(req.params.id, 10);
  const hook = id > 0 ? webhookModel.findById(id) : null;
  if (!hook || hook.ChannelId !== channelId) return res.status(404).json({ status: 404 });

  webhookSvc.refresh(channelId);
  // Synthetic payload matching the C# test shape.
  await webhookSvc.dispatch(channelId, 'gift', {
    uniqueId: 'tikfinity_test',
    nickname: 'TikFinity Test',
    profilePictureUrl: 'https://tikfinity.zerody.one/favicon.ico',
    giftName: 'Rose',
    diamondCount: 5,
    repeatCount: 1,
    comment: 'Đây là tin nhắn test webhook',
  });
  res.json({ status: 200, sent: true });
});

module.exports = router;
