const express = require('express');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { WebSocket } = require('ws') || {};

const db = require('./db');
const auth = require('./auth');

const PORT = process.env.PORT || 5285;
const FRONTEND_PATH = path.join(__dirname, '..', 'downloads');
const BRIDGE_PORT = process.env.BRIDGE_PORT || 5288;

// --- App setup ---
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*' },
  pingInterval: 25000,
  pingTimeout: 20000,
  maxHttpBufferSize: 1e6
});

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Get default channel info ---
let defaultChannelId = 1;
let defaultChannelName = 'user';
try {
  const ch = db.getFirstChannel();
  if (ch) { defaultChannelId = ch.ChannelId; defaultChannelName = ch.ChannelName; }
} catch (e) { console.warn('[BOOT] DB not ready yet:', e.message); }

// --- TikTok Bridge Connection ---
let bridgeWs = null;
let bridgeConnected = false;
let tiktokConnected = false;
let tiktokUsername = '';
let bridgePort = BRIDGE_PORT;

// Stats
let stats = { viewers: 0, likes: 0, gifts: 0, diamonds: 0, followers: 0 };

function connectToBridge() {
  try {
    bridgeWs = new (require('ws'))(`ws://127.0.0.1:${bridgePort}`);
    bridgeWs.on('open', () => {
      bridgeConnected = true;
      console.log(`[Bridge] Connected to TikTok bridge on port ${bridgePort}`);
    });
    bridgeWs.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        handleBridgeMessage(msg);
      } catch (e) {}
    });
    bridgeWs.on('close', () => {
      bridgeConnected = false;
      setTimeout(connectToBridge, 3000);
    });
    bridgeWs.on('error', () => {});
  } catch (e) {
    setTimeout(connectToBridge, 3000);
  }
}

function handleBridgeMessage(msg) {
  const { event, data } = msg;
  if (event === 'connected') {
    tiktokConnected = true;
    tiktokUsername = data?.uniqueId || data?.username || '';
    broadcastToAll('channelStatus', { connected: true, channelId: defaultChannelId, channelName: tiktokUsername || defaultChannelName, status: 'connected', tiktokUsername });
    broadcastToAll('status', { connected: true, tiktok: true, connecting: false });
  } else if (event === 'disconnected' || event === 'streamEnd') {
    tiktokConnected = false;
    broadcastToAll('channelStatus', { connected: false, channelId: defaultChannelId, channelName: defaultChannelName, status: 'disconnected', tiktokUsername: '' });
    broadcastToAll('status', { connected: false, tiktok: false, connecting: false });
  } else if (event === 'connectFailed') {
    broadcastToAll('connectFailed', data);
  } else if (event === 'connecting') {
    broadcastToAll('status', { connected: false, tiktok: false, connecting: true });
  } else if (['chat', 'gift', 'like', 'share', 'follow', 'member', 'subscribe', 'emote', 'envelope', 'questionNew', 'liveIntro'].includes(event)) {
    broadcastToAll(event, data);
    // Update stats
    if (event === 'like') stats.likes += (data?.likeCount || data?.totalLikeCount || 1);
    if (event === 'gift') { stats.gifts++; stats.diamonds += (data?.diamondCount || 0); }
    if (event === 'follow') stats.followers++;
  } else if (event === 'roomUser') {
    stats.viewers = data?.viewerCount || 0;
  } else if (event === 'bridgeStatus') {
    // bridge is alive
  }
}

function broadcastToAll(eventName, data) {
  io.emit(eventName, data);
}

function sendToBridge(msg) {
  if (bridgeWs && bridgeWs.readyState === 1) {
    bridgeWs.send(JSON.stringify(msg));
    return true;
  }
  return false;
}

// --- Socket.IO ---
io.on('connection', (socket) => {
  const cookieHeader = socket.handshake.headers.cookie || '';
  const tokenMatch = cookieHeader.match(/tf_login_token=([^;]+)/);
  const loginToken = tokenMatch ? decodeURIComponent(tokenMatch[1]) : '';
  const isAuth = loginToken.length >= 10;

  const cid = isAuth ? defaultChannelId : 0;
  const cname = isAuth ? defaultChannelName : '';
  const isPro = isAuth;
  const widgetSettings = db.buildWidgetSettings(cid || defaultChannelId);

  const channelData = {
    channelId: cid, channelName: cname, isPro, challengeRunning: false,
    challengeName: null, challengeStartAt: null, isChatbotApproved: false,
    catchApplied: false, catchEnabled: false, catchEnabledInGrid: true,
    subscription: { isPro, plan: isPro ? 'pro' : '', active: isPro },
    userFeatures: { isPro, proInfo: { plan: isPro ? 'pro' : '', active: isPro } }
  };
  const userFeatures = { isPro, proInfo: { plan: isPro ? 'pro' : '', active: isPro } };
  const subscription = { isPro, plan: isPro ? 'pro' : '', active: isPro };

  // Send init events
  socket.emit('loginResult', { status: 'ok', channelId: cid, channelName: cname, isPro, authenticated: isAuth, channel: channelData, userFeatures, subscription });
  socket.emit('connected', { status: 'ok', channelId: cid, channelName: cname, isPro, authenticated: isAuth, channel: channelData, userFeatures, subscription });
  socket.emit('ready', { status: 'ok', channelId: cid });
  socket.emit('init', { status: 'ok', channelId: cid, isPro, userFeatures, subscription });
  socket.emit('welcome', { status: 'ok', channelId: cid, channelName: cname });
  socket.emit('channelStatus', { connected: tiktokConnected, channelId: cid, channelName: tiktokConnected ? tiktokUsername : cname, status: tiktokConnected ? 'connected' : 'disconnected', tiktokUsername: tiktokConnected ? tiktokUsername : '' });
  socket.emit('status', { connected: tiktokConnected, tiktok: tiktokConnected, connecting: false });
  socket.emit('stats', stats);
  socket.emit('globalStats', { viewers: 0, channels: 0 });
  socket.emit('config', { debug: false, channelId: cid });
  socket.emit('widgetSettings', widgetSettings);

  // Handle client events
  socket.on('login', (data) => {
    // Re-send widget settings for widget clients
    if (data?.appType === 'widget') {
      socket.emit('widgetSettings', widgetSettings);
    }
  });

  // TikTok connect/disconnect via socket
  socket.on('connectTikTok', (data) => {
    const username = data?.username || data?.uniqueId || '';
    if (username) {
      sendToBridge({ action: 'connect', username });
    }
  });

  socket.on('disconnectTikTok', () => {
    sendToBridge({ action: 'disconnect' });
  });
});

// Broadcast stats every 10s
setInterval(() => {
  io.emit('stats', stats);
}, 10000);

// ==================== API ROUTES ====================

// --- Health ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TikFinity Node Backend', version: '2.0.0' });
});

// --- Boot endpoints ---
app.get('/appconfig', (req, res) => {
  res.json({ modules: [], languages: [] });
});

app.get('/appinit', (req, res) => {
  res.json({ locale: 'en' });
});

app.get('/api/modules', (req, res) => {
  res.json([
    { id: 'actions', name: 'Actions & Events', sort: 1, enabled: true },
    { id: 'tts', name: 'Text to Speech', sort: 2, enabled: true },
    { id: 'sounds', name: 'Sound Alerts', sort: 3, enabled: true },
    { id: 'media', name: 'Media Share', sort: 4, enabled: true },
    { id: 'timers', name: 'Timers', sort: 5, enabled: true },
    { id: 'commands', name: 'Chat Commands', sort: 6, enabled: true },
    { id: 'spotify', name: 'Spotify Integration', sort: 7, enabled: true },
    { id: 'webhooks', name: 'Webhooks', sort: 8, enabled: true },
    { id: 'overlays', name: 'Overlays', sort: 9, enabled: true }
  ]);
});

// --- Auth ---
app.use('/api', auth.authMiddleware);

app.post('/api/auth/register', (req, res) => { return registerHandler(req, res); });
app.post('/api/v1/auth/register', (req, res) => { return registerHandler(req, res); });

function registerHandler(req, res) {
  const { username, email, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const existing = db.getChannelByName(username);
  if (existing) return res.status(409).json({ error: 'Username already exists' });
  const hash = auth.hashPassword(password);
  const ch = db.createChannel(username, email || `${username}@local`, hash);
  const token = auth.generateToken(ch.ChannelId, ch.ChannelName, ch.Email, true);
  defaultChannelId = ch.ChannelId;
  defaultChannelName = ch.ChannelName;
  res.json({ status: 200, accessToken: token, channelId: ch.ChannelId, channelName: ch.ChannelName, email: ch.Email, isPro: true });
}

app.post('/api/auth/login', (req, res) => { return loginHandler(req, res); });
app.post('/api/v1/auth/login', (req, res) => { return loginHandler(req, res); });

function loginHandler(req, res) {
  const { username, email, password } = req.body;
  const lookup = username || email;
  if (!lookup || !password) return res.status(400).json({ error: 'Credentials required' });
  const ch = db.getChannelByName(lookup) || db.getChannelByEmail(lookup);
  if (!ch) return res.status(401).json({ error: 'Invalid credentials' });
  const hash = auth.hashPassword(password);
  if (ch.PasswordHash && ch.PasswordHash !== hash) return res.status(401).json({ error: 'Invalid credentials' });
  const token = auth.generateToken(ch.ChannelId, ch.ChannelName, ch.Email, true);
  res.json({ status: 200, accessToken: token, channelId: ch.ChannelId, channelName: ch.ChannelName, email: ch.Email, isPro: true });
}

app.post('/api/auth/logout', (req, res) => res.json({ status: 'ok' }));
app.post('/api/v1/auth/logout', (req, res) => res.json({ status: 'ok' }));

// OAuth flow stubs
app.all('/api/v1/flow/start', (req, res) => res.json({ flowId: 'local-flow-001', status: 'ok', appId: 'local' }));
app.all('/api/v1/flow/end', (req, res) => res.redirect('/logout'));
app.all('/api/v1/flow/logout', (req, res) => res.redirect('/logout'));
app.all('/api/v1/flow/callback', (req, res) => {
  const ch = db.getFirstChannel();
  if (!ch) return res.json({ error: 'No channel' });
  const token = auth.generateToken(ch.ChannelId, ch.ChannelName, ch.Email, true);
  res.json({ status: 200, accessToken: token, channelId: ch.ChannelId });
});
app.all('/api/v1/flow/status', (req, res) => res.json({ status: 'ok', completed: true }));
app.all('/api/v1/code/send', (req, res) => res.json({ flowId: 'local-flow-001', status: 'ok' }));
app.all('/api/v1/code/validate', (req, res) => {
  const ch = db.getFirstChannel();
  if (!ch) return res.json({ error: 'No channel' });
  const token = auth.generateToken(ch.ChannelId, ch.ChannelName, ch.Email, true);
  res.json({ status: 200, accessToken: token });
});

// --- /api/me ---
app.get('/api/me', meHandler);
app.post('/api/me', meHandler);
app.get('/api/loginChannel', meHandler);
app.post('/api/loginChannel', meHandler);

function meHandler(req, res) {
  if (!req.channelId || req.channelId === 0) {
    return res.json({
      status: 200, message: 'OK', channelId: 0, channelName: '', isPro: false,
      accountChannelName: '', tiktokUsername: '',
      channel: { channelId: 0, channelName: '', challengeRunning: false, dynamicSettings: {}, profiles: [] },
      userFeatures: { isPro: false }, subscription: { isPro: false, plan: '', active: false },
      wsAuthToken: '', cookieAuth: false, countryCode: 'VN',
      overloadSettings: { enabled: false }, activePromotions: [],
      isTrialAvailable: false, hasActiveTrial: false, trialEnded: false, featureBaseToken: ''
    });
  }

  const ch = db.getChannel(req.channelId) || db.getFirstChannel();
  if (!ch) return res.json({ status: 200, channelId: 0, channelName: 'guest', isPro: true });

  const ds = {};
  for (const s of (ch.DynamicSettings || [])) ds[s.Key] = s.Value;
  const tiktokName = (ds.setting_tiktokname || '').trim().replace(/^@/, '') || '';
  const frontendName = tiktokName || ch.ChannelName;
  const pro = ch.Subscription?.IsPro ?? true;
  const wsToken = auth.generateToken(ch.ChannelId, ch.ChannelName, ch.Email, pro);
  const fbToken = auth.generateFeaturebaseToken(frontendName, ch.Email, ch.ChannelId);

  res.json({
    status: 200, message: 'OK',
    channelName: frontendName,
    accountChannelName: ch.ChannelName,
    tiktokUsername: tiktokName,
    channel: {
      ChannelId: ch.ChannelId, channelId: ch.ChannelId,
      ChannelName: frontendName, channelName: frontendName,
      AccountChannelName: ch.ChannelName, accountChannelName: ch.ChannelName,
      TiktokUsername: tiktokName, tiktokUsername: tiktokName,
      OwnerUserId: ch.OwnerUserId || '', Email: ch.Email,
      isPro: pro, ChallengeRunning: ch.ChallengeRunning || false,
      challengeRunning: ch.ChallengeRunning || false,
      dynamicSettings: ds, profiles: ch.Profiles || [],
      subscription: { isPro: pro, plan: ch.Subscription?.Plan || 'pro', active: true },
      userFeatures: { isPro: pro, proInfo: { plan: ch.Subscription?.Plan || 'pro', active: true } }
    },
    userFeatures: { isPro: pro, proInfo: { plan: ch.Subscription?.Plan || 'pro', active: true } },
    subscription: { isPro: pro, plan: ch.Subscription?.Plan || 'pro', active: true },
    channelId: ch.ChannelId,
    countryCode: ch.Locale || 'VN',
    cookieAuth: true, wsAuthToken: wsToken, featureBaseToken: fbToken,
    isPro: pro,
    overloadSettings: { enabled: false },
    activePromotions: [],
    isTrialAvailable: false, hasActiveTrial: false, trialEnded: false
  });
}

// --- Settings ---
app.post('/api/updateSettings', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  const body = req.body;
  if (Array.isArray(body)) {
    for (const item of body) db.upsertDynamicSetting(channelId, item.key, item.value);
  } else if (typeof body === 'object') {
    for (const [key, value] of Object.entries(body)) {
      if (key !== 'channelId') db.upsertDynamicSetting(channelId, key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  }
  // Broadcast updated widget settings
  const ws = db.buildWidgetSettings(channelId);
  io.emit('widgetSettings', ws);
  res.json({ status: 200, message: 'OK' });
});

app.all('/api/getOverlayConfig', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  res.json({ overlays: db.getOverlays(channelId) });
});

// --- Config ---
app.all('/api/getAppConfig', configHandler);
app.all('/api/config', configHandler);
function configHandler(req, res) {
  res.json({
    modules: [
      { id: 'actions', name: 'Actions & Events', sort: 1, enabled: true },
      { id: 'tts', name: 'Text to Speech', sort: 2, enabled: true },
      { id: 'sounds', name: 'Sound Alerts', sort: 3, enabled: true },
      { id: 'overlays', name: 'Overlays', sort: 9, enabled: true }
    ],
    subscription: { isPro: true, plan: 'pro', active: true }
  });
}

app.all('/api/getSystemConfig', (req, res) => res.json({ modules: [], systemModules: [] }));
app.all('/api/getTranslations', (req, res) => res.json({}));
app.all('/api/init', (req, res) => res.json({ countryCode: 'VN' }));
app.all('/api/v2/sync', (req, res) => res.json({ dynamicSettings: {}, actions: [], sounds: [], overlays: [] }));

// --- Actions ---
app.get('/api/rest/action', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  res.json(db.getActions(channelId));
});
app.post('/api/rest/action', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  const id = db.saveAction(channelId, req.body);
  res.json({ status: 200, id });
});
app.delete('/api/rest/action/:id', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  db.deleteAction(channelId, parseInt(req.params.id));
  res.json({ status: 200 });
});

// --- Sounds ---
app.all('/api/sounds', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  res.json(db.getSounds(channelId));
});
app.post('/api/sounds/save', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  const id = db.saveSound(channelId, req.body);
  res.json({ status: 200, id });
});
app.post('/api/sounds/delete', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  db.deleteSound(channelId, req.body.id);
  res.json({ status: 200 });
});

// --- Data ---
app.all('/api/odata/transaction', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  res.json({ value: db.getTransactions(channelId) });
});
app.all('/api/odata/channeluser', (req, res) => res.json({ value: [] }));
app.all('/api/rest/channeluser', (req, res) => res.json([]));
app.all('/api/getChannelUserCount', (req, res) => res.json({ count: 0 }));
app.all('/api/getChannelEmotes', (req, res) => res.json([]));
app.all('/api/getLiveChannels', (req, res) => res.json([]));
app.all('/api/getGlobalTransactions', (req, res) => res.json({ value: [] }));
app.all('/api/getMyInstants', (req, res) => res.json([]));
app.get('/api/rest/transaction', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  res.json(db.getTransactions(channelId));
});

// getAllGifts / getAllAnimations - serve from downloaded files
app.all('/api/getAllGifts', (req, res) => serveApiFile(res, 'getAllGifts'));
app.all('/api/getAllGiftsCached', (req, res) => serveApiFile(res, 'getAllGifts'));
app.all('/api/getAllAnimations', (req, res) => serveApiFile(res, 'getAllAnimations'));

function serveApiFile(res, name) {
  const filePath = path.join(FRONTEND_PATH, 'api', name);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(content);
    if (Array.isArray(data)) data = { value: data };
    res.json(data);
  } catch { res.json({ value: [] }); }
}

// Stubs
app.post('/api/usage/log', (req, res) => res.json({ status: 200 }));
app.post('/api/logError', (req, res) => res.json({ status: 200 }));
app.post('/api/backup', (req, res) => res.json({ status: 200 }));
app.post('/api/switchProfile', (req, res) => res.json({ status: 200, message: 'OK' }));
app.post('/api/setAffiliate', (req, res) => res.json({ status: 200, message: 'OK' }));
app.post('/api/setAff', (req, res) => res.json({ status: 200, message: 'OK' }));

// --- TikTok ---
app.post('/api/tiktok/connect', (req, res) => {
  const username = (req.body.username || req.body.tiktokname || '').trim().replace(/^@/, '');
  if (!username) return res.status(400).json({ error: 'Username required' });
  // Save to DB
  const channelId = req.channelId || defaultChannelId;
  db.upsertDynamicSetting(channelId, 'setting_tiktokname', username);
  // Connect via bridge
  const sent = sendToBridge({ action: 'connect', username });
  res.json({ status: 200, message: sent ? 'Connecting...' : 'Bridge not available', username });
});

app.post('/api/tiktok/disconnect', (req, res) => {
  sendToBridge({ action: 'disconnect' });
  tiktokConnected = false;
  tiktokUsername = '';
  broadcastToAll('channelStatus', { connected: false, channelId: defaultChannelId, channelName: defaultChannelName, status: 'disconnected', tiktokUsername: '' });
  broadcastToAll('status', { connected: false, tiktok: false, connecting: false });
  res.json({ status: 200, message: 'Disconnected' });
});

app.get('/api/tiktok/status', (req, res) => {
  res.json({ connected: tiktokConnected, username: tiktokUsername, bridgeConnected, clients: io.engine.clientsCount });
});

// --- Widget ---
app.post('/api/widget/coinjar/reset', (req, res) => { io.emit('coin-jar:reset'); res.json({ status: 200 }); });
app.post('/api/widget/coinmatch/:action', (req, res) => {
  io.emit(`coin-match:${req.params.action}`, req.body);
  res.json({ status: 200 });
});
app.post('/api/widget/timer/:action', (req, res) => { io.emit(`timer:${req.params.action}`, req.body); res.json({ status: 200 }); });
app.post('/api/widget/wheel/spin', (req, res) => { io.emit('spinWheel', req.body); res.json({ status: 200 }); });
app.post('/api/widget/wheelofactions/spin', (req, res) => { io.emit('onSpinWheel', req.body); res.json({ status: 200 }); });
app.post('/api/widget/coindrop/create', (req, res) => { io.emit('createCoins', req.body); res.json({ status: 200 }); });
app.post('/api/widget/coindrop/timeout', (req, res) => { io.emit('timeoutCoins', req.body); res.json({ status: 200 }); });
app.post('/api/widget/coindrop/collect', (req, res) => { io.emit('collectCoin', req.body); res.json({ status: 200 }); });
app.post('/api/widget/commands/show', (req, res) => { io.emit('showCommands', req.body); res.json({ status: 200 }); });
app.post('/api/widget/commands/custom', (req, res) => { io.emit('showCustomCommands', req.body); res.json({ status: 200 }); });
app.post('/api/widget/commands/result', (req, res) => { io.emit('showCommandResult', req.body); res.json({ status: 200 }); });
app.post('/api/widget/actions/execute', (req, res) => { io.emit('executeAction', req.body); res.json({ status: 200 }); });
app.post('/api/widget/actions/changed', (req, res) => { io.emit('actionsChanged', req.body); res.json({ status: 200 }); });
app.post('/api/widget/songrequests/playlist', (req, res) => { io.emit('setPlaylistItems', req.body); res.json({ status: 200 }); });
app.post('/api/widget/userinfo/show', (req, res) => { io.emit('showUserScore', req.body); res.json({ status: 200 }); });
app.post('/api/widget/broadcast/:eventName', (req, res) => { io.emit(req.params.eventName, req.body); res.json({ status: 200 }); });

// --- Notifications ---
app.all('/api/notifications/list', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  res.json(db.getNotifications(channelId));
});
app.all('/api/notifications/preferences', (req, res) => res.json({ inApp: true }));
app.post('/api/notifications/markRead', (req, res) => {
  const channelId = req.channelId || defaultChannelId;
  if (req.body.id) db.markNotificationRead(channelId, req.body.id);
  res.json({ status: 200 });
});

// --- Pro (stubs) ---
app.post('/api/pro/setUpgradeIntent', (req, res) => res.json({ status: 200 }));
app.all('/api/pro/tazapay/methods', (req, res) => res.json({ methods: [] }));
app.post('/api/pro/upgrade', (req, res) => res.json({ status: 200, isPro: true }));
app.post('/api/pro/deactivate', (req, res) => res.json({ status: 200 }));
app.post('/api/pro/reactivate', (req, res) => res.json({ status: 200 }));
app.post('/api/pro/setPayment', (req, res) => res.json({ status: 200 }));
app.all('/api/pro/stripe', (req, res) => res.json({ status: 200 }));
app.all('/api/pro/xsolla', (req, res) => res.json({ status: 200 }));
app.all('/api/pro/lemonsqueezy', (req, res) => res.json({ status: 200 }));
app.get('/api/pro/status', (req, res) => res.json({ isPro: true, plan: 'pro', active: true }));

// --- MyInstants proxy ---
app.all('/myinstants-proxy/*', async (req, res) => {
  try {
    const targetUrl = 'https://myinstantsapi.zerody.one/' + req.params[0];
    const resp = await fetch(targetUrl);
    const data = await resp.text();
    res.set('Content-Type', resp.headers.get('content-type') || 'application/json');
    res.send(data);
  } catch { res.json([]); }
});

// --- Logout ---
app.get('/logout', (req, res) => {
  res.send(`<html><head><script>
    localStorage.clear(); sessionStorage.clear();
    ['tf_login_token','tf_channelid','tf_channelname','tf_ispro'].forEach(n => {
      document.cookie = n + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
    window.location.href = '/';
  </script></head><body>Logging out...</body></html>`);
});

// --- API catch-all fallback ---
app.all('/api/*', (req, res) => {
  console.warn(`[API] Unhandled: ${req.method} ${req.path}`);
  res.json({ status: 200, message: 'OK', value: [], data: null });
});

// ==================== STATIC FILES ====================
const { buildIndexHtml } = require('./html-builder');

// Generate real JWT for auto-login
const ch = db.getChannel(defaultChannelId) || db.getFirstChannel();
const autoLoginJwt = auth.generateToken(
  ch?.ChannelId || defaultChannelId,
  ch?.ChannelName || defaultChannelName,
  ch?.Email || 'local@tikfinity.local',
  true
);
console.log(`[BOOT] Auto-login JWT for channel ${ch?.ChannelName || defaultChannelName} (id=${ch?.ChannelId || defaultChannelId})`);

// Build index.html with patches + real JWT
let indexHtml;
try {
  indexHtml = buildIndexHtml(FRONTEND_PATH, defaultChannelId, defaultChannelName, autoLoginJwt);
} catch (e) {
  console.error('[BOOT] Failed to build index.html:', e.message);
  indexHtml = '<html><body><h1>Error building index.html</h1></body></html>';
}

// Serve root
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Cache-Control', 'no-cache');
  res.send(indexHtml);
});

// Static files from downloads/
app.use('/combo', express.static(path.join(FRONTEND_PATH, 'combo'), {
  setHeaders: (res, filePath) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
}));
app.use(express.static(FRONTEND_PATH, {
  extensions: ['html'],
  index: false
}));

// SPA fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/socket.io') || req.path.startsWith('/widget/')) return res.status(404).end();
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(indexHtml);
});

// ==================== START ====================
server.listen(PORT, '0.0.0.0', () => {
  console.log('==============================================');
  console.log(`  TikFinity Node.js Backend v2.0`);
  console.log(`  Server:   http://localhost:${PORT}/`);
  console.log(`  API:      http://localhost:${PORT}/api/*`);
  console.log(`  Frontend: http://localhost:${PORT}/`);
  console.log('==============================================');

  // Connect to TikTok bridge
  connectToBridge();
});
