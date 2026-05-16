// Chat command matcher. Subscribed to the bridge's chat events, looks up
// the message against the user's ChatCommands list, applies per-(command,user)
// cooldown, and emits the response back to widgets + via webhooks.
//
// Templates support {user}, {username}, {nickname}, {message} placeholders.
//
// Cooldown bookkeeping is in-memory (Map of `cmdId|userId` → lastFireMs).
// Persisting it would be more code than it's worth — a process restart
// re-allows commands, which matches the C# version's behavior.

const chatCommandsModel = require('../db/models/chat-commands');
const sockets = require('./socket-manager');
const channels = require('../db/models/channels');
const logger = require('../logger');

/** @type {Map<number, Array<{Id:number,Command:string,Response:string,Cooldown:number,Enabled:number}>>} */
const _commandsCache = new Map();
/** @type {Map<string, number>} key: `${commandId}|${userId}` */
const _cooldowns = new Map();

function refresh(channelId) {
  if (channelId <= 0) return;
  const ch = channels.findById(channelId);
  const profileId = ch && ch.ProfileId > 0 ? ch.ProfileId : 1;
  const list = chatCommandsModel.listByChannelProfile(channelId, profileId);
  _commandsCache.set(channelId, list.filter((c) => c.Enabled));
}

function applyTemplate(template, ctx) {
  if (!template) return '';
  return String(template).replace(/\{(\w+)\}/g, (_, key) => {
    const v = ctx[key];
    return v === undefined || v === null ? '' : String(v);
  });
}

function findMatch(channelId, comment) {
  const list = _commandsCache.get(channelId);
  if (!list || list.length === 0 || !comment) return null;
  const lc = comment.trim().toLowerCase();
  for (const c of list) {
    const cmd = (c.Command || '').trim().toLowerCase();
    if (!cmd) continue;
    if (lc === cmd || lc.startsWith(cmd + ' ')) return c;
  }
  return null;
}

function isOnCooldown(cmd, userId) {
  if (!cmd.Cooldown || cmd.Cooldown <= 0) return false;
  const key = `${cmd.Id}|${userId || ''}`;
  const last = _cooldowns.get(key) || 0;
  return Date.now() - last < cmd.Cooldown * 1000;
}

function noteFire(cmd, userId) {
  if (!cmd.Cooldown || cmd.Cooldown <= 0) return;
  _cooldowns.set(`${cmd.Id}|${userId || ''}`, Date.now());
}

/**
 * Public entry — called by the bridge on every chat event.
 * Returns the fired response (or null) so callers can fan out via webhooks.
 */
function onChat({ channelId, username, nickname, userId, comment }) {
  if (channelId <= 0 || !comment) return null;
  if (!_commandsCache.has(channelId)) refresh(channelId);
  const cmd = findMatch(channelId, comment);
  if (!cmd) return null;
  if (isOnCooldown(cmd, userId)) return null;

  const response = applyTemplate(cmd.Response, {
    user: nickname || username,
    username: username || '',
    nickname: nickname || username || '',
    message: comment,
  });
  noteFire(cmd, userId);

  // Push to widgets so chat-bot overlay shows the response.
  try {
    sockets.broadcastToChannel(
      'chatCommandFired',
      { commandId: cmd.Id, command: cmd.Command, response, username, nickname },
      channelId,
      'widget'
    );
  } catch (err) {
    logger.warn({ err }, '[ChatBot] broadcast failed');
  }
  return { command: cmd, response };
}

module.exports = { refresh, onChat };
