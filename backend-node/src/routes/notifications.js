// /api/notifications/* — bell-icon feed (list / mark-read / clear).
//
// Direct port of `backend/Controllers/NotificationsController.cs`. The bundle
// renders this list in the nav drawer; payload shape has both flat and
// nested fields (`payload.title`, `data.title`, etc.) because different
// parts of the UI read different keys — keep both to avoid silent
// "notification has no title" rendering.

const express = require('express');
const notifications = require('../db/models/notifications');
const channels = require('../db/models/channels');

const router = express.Router();

const DEFAULT_AVATAR_URL = '/favicon.ico';
const HIDDEN_ACTION = Object.freeze({ label: 'hidden', url: 'https://example.com/hidden', target: '_self' });

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

function parseAction(obj, key) {
  const v = obj?.[key];
  if (!v || typeof v !== 'object') return null;
  return {
    label: typeof v.label === 'string' ? v.label : HIDDEN_ACTION.label,
    url: typeof v.url === 'string' ? v.url : HIDDEN_ACTION.url,
    target: typeof v.target === 'string' ? v.target : HIDDEN_ACTION.target,
  };
}

function parsePayload(n) {
  const fallback = {
    title: n.Subject || '',
    category: n.Category && n.Category.trim() ? n.Category : 'announcements',
    message: n.Body || '',
    sender: n.Subject && n.Subject.trim() ? n.Subject : 'TikFinity Team',
    avatarUrl: DEFAULT_AVATAR_URL,
    primaryAction: { ...HIDDEN_ACTION },
    secondaryAction: { ...HIDDEN_ACTION },
    primaryTarget: HIDDEN_ACTION.target,
    secondaryTarget: HIDDEN_ACTION.target,
  };

  if (!n.DataJson || typeof n.DataJson !== 'string') return fallback;
  let root;
  try {
    root = JSON.parse(n.DataJson);
  } catch {
    return fallback;
  }
  if (!root || typeof root !== 'object') return fallback;

  const primary = parseAction(root, 'primaryAction') || fallback.primaryAction;
  const secondary = parseAction(root, 'secondaryAction') || fallback.secondaryAction;

  return {
    title: typeof root.title === 'string' ? root.title : fallback.title,
    category: typeof root.category === 'string' ? root.category : fallback.category,
    message: typeof root.message === 'string' ? root.message : fallback.message,
    sender: typeof root.sender === 'string' ? root.sender : fallback.sender,
    avatarUrl: typeof root.avatarUrl === 'string' ? root.avatarUrl : fallback.avatarUrl,
    primaryAction: primary,
    secondaryAction: secondary,
    primaryTarget: typeof root.primaryTarget === 'string' ? root.primaryTarget : primary.target,
    secondaryTarget: typeof root.secondaryTarget === 'string' ? root.secondaryTarget : secondary.target,
  };
}

function mapNotification(n) {
  const p = parsePayload(n);
  return {
    id: n.Id,
    subject: n.Subject,
    body: n.Body,
    data: {
      title: p.title,
      message: p.message,
      category: p.category,
      sender: p.sender,
      avatarUrl: p.avatarUrl,
    },
    payload: {
      title: p.title,
      category: p.category,
      message: p.message,
      sender: p.sender,
      avatarUrl: p.avatarUrl,
      primaryAction: p.primaryAction,
      secondaryAction: p.secondaryAction,
      primaryTarget: p.primaryTarget,
      secondaryTarget: p.secondaryTarget,
    },
    primaryAction: p.primaryAction,
    secondaryAction: p.secondaryAction,
    category: p.category,
    isRead: !!n.IsRead,
    isSeen: !!n.IsSeen,
    createdAt: n.CreatedAt,
    transactionId: n.TransactionId,
  };
}

router.all('/list', (req, res) => {
  const channelId = resolveChannelId(req);
  const list = channelId > 0
    ? notifications.listByChannel(channelId, { limit: 50 }).map(mapNotification)
    : [];
  res.json({ status: 200, message: 'OK', notifications: list });
});

router.all('/preferences', (req, res) => {
  // Bundle's in-app notification toggle does PUT notifications/preferences {inApp}
  // and commits only if response.success is truthy (else it snaps the checkbox
  // back — deobfuscated.js:75837-75844). Echo the requested value + report success.
  const inApp = req.body && req.body.inApp !== undefined ? !!req.body.inApp : true;
  res.json({ status: 200, message: 'OK', success: true, inApp });
});

router.post('/markRead', (req, res) => {
  const channelId = resolveChannelId(req);
  const id = Number(req.body?.Id ?? req.body?.id) || 0;
  if (channelId > 0 && id > 0) {
    const n = notifications.findByChannelAndId(channelId, id);
    if (n) notifications.markRead(id);
  }
  res.json({ status: 200 });
});

router.post('/markAllRead', (req, res) => {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.json({ status: 200, marked: 0 });
  const before = notifications.countUnread(channelId);
  notifications.markAllRead(channelId);
  res.json({ status: 200, marked: before });
});

function handleClear(req, res) {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.json({ status: 200, cleared: 0 });
  const list = notifications.listByChannel(channelId, { limit: 9999 });
  notifications.clearAllForChannel(channelId);
  res.json({ status: 200, cleared: list.length });
}
router.post('/clear', handleClear);
router.delete('/', handleClear);

module.exports = router;
