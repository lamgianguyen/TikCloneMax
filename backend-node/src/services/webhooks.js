// Outbound webhook dispatcher. Used by ChatBotService / TikTokBridgeService
// (Phase 3) and by the /api/webhooks/test/:id endpoint.
//
// Discord URLs get the Discord-flavoured embed shape; everything else gets a
// generic JSON envelope with a templated body if `templateJson` is set.
//
// Per-channel cache so dispatch doesn't hit the DB on every TikTok event.
// `refresh(channelId)` is called by /api/webhooks (save/delete) after writes.

const webhookModel = require('../db/models/webhooks');
const logger = require('../logger');

/** @type {Map<number, any[]>} */
const _cache = new Map();

function refresh(channelId) {
  if (channelId <= 0) return;
  _cache.set(channelId, webhookModel.listByChannel(channelId));
}

function getEnabledForEvent(channelId, eventType) {
  let cached = _cache.get(channelId);
  if (!cached) {
    refresh(channelId);
    cached = _cache.get(channelId) || [];
  }
  return cached.filter(
    (w) => w.Enabled && eventType && (',' + (w.EventTypesCsv || '') + ',').includes(`,${eventType},`)
  );
}

function isDiscordUrl(url) {
  return /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\//i.test(url || '');
}

function buildDiscordPayload(eventType, payload) {
  // Compact Discord embed mirroring the C# WebhookService shape.
  const fields = [];
  const add = (name, value) => {
    if (value === undefined || value === null || value === '') return;
    fields.push({ name, value: String(value).slice(0, 1024), inline: true });
  };
  add('User', payload.uniqueId || payload.nickname);
  add('Event', eventType);
  if (eventType === 'gift') {
    add('Gift', payload.giftName);
    add('Diamonds', payload.diamondCount);
    add('Repeat', payload.repeatCount);
  }
  if (eventType === 'comment' || payload.comment) {
    add('Comment', payload.comment);
  }
  return {
    username: 'TikFinity',
    embeds: [
      {
        title: `TikFinity • ${eventType}`,
        color: 0xff0050,
        timestamp: new Date().toISOString(),
        fields,
      },
    ],
  };
}

function buildGenericPayload(template, eventType, payload) {
  if (template && typeof template === 'string') {
    try {
      const parsed = JSON.parse(template);
      // Shallow placeholder substitution: replace "{key}" anywhere in string
      // values with payload[key].
      const subst = (v) => {
        if (typeof v !== 'string') return v;
        return v.replace(/\{(\w+)\}/g, (_, k) => {
          const x = payload[k];
          return x === undefined || x === null ? '' : String(x);
        });
      };
      const walk = (v) => {
        if (Array.isArray(v)) return v.map(walk);
        if (v && typeof v === 'object') {
          const o = {};
          for (const k of Object.keys(v)) o[k] = walk(v[k]);
          return o;
        }
        return subst(v);
      };
      return walk(parsed);
    } catch {
      /* fall through */
    }
  }
  return { event: eventType, payload };
}

async function fireOne(hook, eventType, payload) {
  const url = hook.Url;
  if (!url) return false;
  const body = isDiscordUrl(url)
    ? buildDiscordPayload(eventType, payload)
    : buildGenericPayload(hook.TemplateJson, eventType, payload);

  let headers = { 'Content-Type': 'application/json', 'User-Agent': 'TikFinity-Local/1.0' };
  if (hook.HeadersJson) {
    try {
      Object.assign(headers, JSON.parse(hook.HeadersJson));
    } catch {
      /* malformed headers — keep defaults */
    }
  }

  const retries = Math.max(0, hook.RetryCount || 0);
  const timeoutMs = Math.max(2, hook.TimeoutSeconds || 10) * 1000;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const resp = await fetch(url, {
        method: hook.Method || 'POST',
        headers,
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      if (resp.ok) {
        clearTimeout(t);
        return true;
      }
      logger.warn(`[Webhook] ${hook.Id} ${url} returned ${resp.status} (attempt ${attempt + 1}/${retries + 1})`);
    } catch (err) {
      logger.warn({ err: err.message }, `[Webhook] ${hook.Id} failed (attempt ${attempt + 1}/${retries + 1})`);
    } finally {
      clearTimeout(t);
    }
  }
  return false;
}

async function dispatch(channelId, eventType, payload) {
  const hooks = getEnabledForEvent(channelId, eventType);
  await Promise.all(hooks.map((h) => fireOne(h, eventType, payload || {}).catch(() => false)));
}

/**
 * Fire a one-shot webhook to a specific URL (used by `/api/widget/actions/test`
 * for per-action `webhookUrl`/`streamerbotActionId`/`keystrokes` plumbing in
 * Phase 3).
 */
async function fireOneShot(url, payload, { timeoutMs = 10_000 } = {}) {
  if (!url) return false;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'TikFinity-Local/1.0' },
      body: JSON.stringify(payload || {}),
      signal: ctrl.signal,
    });
    return resp.ok;
  } catch (err) {
    logger.warn({ err: err.message, url }, '[Webhook] one-shot failed');
    return false;
  } finally {
    clearTimeout(t);
  }
}

module.exports = { refresh, getEnabledForEvent, dispatch, fireOneShot };
