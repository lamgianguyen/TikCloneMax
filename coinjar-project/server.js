require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { TikTokLiveConnection } = require('tiktok-live-connector');

const PORT = parseInt(process.env.PORT || '3000', 10);
const TIKTOK_USERNAME = process.env.TIKTOK_USERNAME || '';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── State ──────────────────────────────────────────────────────────────────

let tiktokConnection = null;
let connectedUsername = null;
let connectionStatus = 'disconnected'; // disconnected | connecting | connected

// CoinMatch state
let coinMatchState = 'idle'; // idle | running | results
let coinMatchEntries = new Map(); // userId -> { username, profilePictureUrl, totalCoins }
let coinMatchTimer = null;
let coinMatchCountdown = 0;
let coinMatchSettings = {};

// ─── TikTok helpers ─────────────────────────────────────────────────────────

function getPreferredPic(picUrls) {
  if (!Array.isArray(picUrls) || !picUrls.length) return '';
  return picUrls.find(x => x.includes('100x100') && x.includes('.webp'))
    || picUrls.find(x => x.includes('100x100') && x.includes('.jpeg'))
    || picUrls.find(x => x.includes('100x100'))
    || picUrls[0];
}

function getUser(data) {
  const user = data.user || data;
  let profilePictureUrl = '';
  if (user.profilePicture && Array.isArray(user.profilePicture.url)) {
    profilePictureUrl = getPreferredPic(user.profilePicture.url);
  } else if (user.profilePictureUrl) {
    profilePictureUrl = user.profilePictureUrl;
  }
  return {
    uniqueId: user.uniqueId || '',
    nickname: user.nickname || '',
    userId: (user.userId || '').toString(),
    profilePictureUrl: profilePictureUrl || ''
  };
}

// ─── TikTok Connection ─────────────────────────────────────────────────────

async function connectToTikTok(username) {
  if (!username) return { success: false, error: 'Username is required' };
  if (tiktokConnection) await disconnectFromTikTok();

  connectedUsername = username;
  connectionStatus = 'connecting';
  io.emit('status', { status: 'connecting', username });
  console.log(`[TikTok] Connecting to @${username}...`);

  const connection = new TikTokLiveConnection(username, {
    processInitialData: true,
    enableExtendedGiftInfo: true,
    fetchRoomInfoOnConnect: true,
    enableRequestPolling: true,
    requestPollingIntervalMs: 2000,
    ...(process.env.SIGN_API_KEY ? { signApiKey: process.env.SIGN_API_KEY } : {})
  });

  // Gift event → CoinJar + CoinMatch
  connection.on('gift', (data) => {
    const u = getUser(data);
    let giftPicUrl = data.giftPictureUrl || '';
    if (!giftPicUrl && data.giftDetails?.giftImage?.url?.length) {
      giftPicUrl = data.giftDetails.giftImage.url[0];
    }
    const diamondCount = data.diamondCount || data.giftDetails?.diamondCount || 0;
    const giftName = data.giftName || data.giftDetails?.describe || '';
    const repeatCount = data.repeatCount || 1;

    const giftPayload = {
      giftPictureUrl: giftPicUrl,
      value: diamondCount,
      repeatCount,
      giftName,
      username: u.uniqueId,
      nickname: u.nickname,
      profilePictureUrl: u.profilePictureUrl,
      userId: u.userId
    };

    // CoinJar: broadcast every gift
    io.emit('coin-jar:gift', giftPayload);

    // CoinMatch: aggregate if running
    if (coinMatchState === 'running') {
      const totalValue = diamondCount * repeatCount;
      if (totalValue >= (coinMatchSettings.minBid || 1)) {
        const maxP = coinMatchSettings.maxParticipants || 100;
        if (coinMatchEntries.has(u.userId || u.uniqueId) || coinMatchEntries.size < maxP) {
          addCoinMatchEntry(u, totalValue);
        }
      }
    }
  });

  connection.on('chat', (data) => {
    const u = getUser(data);
    io.emit('chat', { ...u, comment: data.comment });
  });

  connection.on('like', (data) => {
    const u = getUser(data);
    io.emit('like', { ...u, likeCount: data.likeCount || 1 });
  });

  connection.on('follow', (data) => {
    const u = getUser(data);
    io.emit('follow', u);
  });

  connection.on('member', (data) => {
    const u = getUser(data);
    io.emit('member', u);
  });

  connection.on('roomUser', (data) => {
    io.emit('roomUser', { viewerCount: data.viewerCount || 0 });
  });

  connection.on('connected', (state) => {
    connectionStatus = 'connected';
    console.log(`[TikTok] Connected to @${username} (room: ${state.roomId})`);
    io.emit('status', { status: 'connected', username, roomId: state.roomId });
  });

  connection.on('disconnected', () => {
    connectionStatus = 'disconnected';
    tiktokConnection = null;
    connectedUsername = null;
    console.log(`[TikTok] Disconnected`);
    io.emit('status', { status: 'disconnected' });
  });

  connection.on('error', (err) => {
    console.error(`[TikTok] Error:`, err?.message || err);
  });

  connection.on('streamEnd', () => {
    connectionStatus = 'disconnected';
    tiktokConnection = null;
    connectedUsername = null;
    console.log(`[TikTok] Stream ended`);
    io.emit('status', { status: 'streamEnd' });
  });

  try {
    const state = await connection.connect();
    tiktokConnection = connection;
    console.log(`[TikTok] Room: ${state.roomId}, Viewers: ${state.viewerCount || 0}`);
    return { success: true, roomId: state.roomId };
  } catch (err) {
    connectionStatus = 'disconnected';
    tiktokConnection = null;
    connectedUsername = null;
    const msg = err?.message || String(err);
    console.error(`[TikTok] Connection failed:`, msg);
    io.emit('status', { status: 'error', message: msg });
    return { success: false, error: msg };
  }
}

async function disconnectFromTikTok() {
  if (tiktokConnection) {
    try { tiktokConnection.disconnect(); } catch (e) {}
    tiktokConnection = null;
    connectedUsername = null;
    connectionStatus = 'disconnected';
  }
}

// ─── CoinMatch Logic ────────────────────────────────────────────────────────

function addCoinMatchEntry(user, coins) {
  const key = user.userId || user.uniqueId;
  if (!key) return;
  const existing = coinMatchEntries.get(key);
  if (existing) {
    existing.totalCoins += coins;
  } else {
    coinMatchEntries.set(key, {
      userId: user.userId,
      username: user.uniqueId || user.nickname,
      profilePictureUrl: user.profilePictureUrl,
      totalCoins: coins
    });
  }
}

function getSortedEntries() {
  return Array.from(coinMatchEntries.values())
    .sort((a, b) => b.totalCoins - a.totalCoins)
    .map((e, i) => ({ ...e, position: i + 1 }));
}

function startCoinMatch(settings = {}) {
  coinMatchState = 'running';
  coinMatchEntries.clear();
  coinMatchCountdown = parseInt(settings.countdown || process.env.COINMATCH_COUNTDOWN || '60', 10);
  coinMatchSettings = {
    showTitle: settings.showTitle !== false,
    title: settings.title || process.env.COINMATCH_TITLE || 'Coin Match',
    showParticipantsCount: settings.showParticipantsCount !== false,
    keepShowingWinners: settings.keepShowingWinners || false,
    hideAfter: parseInt(settings.hideAfter || '10', 10),
    shouldAutoScroll: settings.shouldAutoScroll !== false,
    enableSnipeMode: settings.enableSnipeMode || false,
    enableSlowCountdown: settings.enableSlowCountdown || false,
    randomizedSlowCountdown: settings.randomizedSlowCountdown || false,
    countdown: coinMatchCountdown,
    countdownStartDelay: parseInt(settings.countdownStartDelay || '3', 10),
    fontColor: settings.fontColor || '#ffffff',
    backgroundColor: settings.backgroundColor || '#1a1a2e',
    timerBackgroundColor: settings.timerBackgroundColor || '#e94560',
    minBid: parseInt(settings.minBid || '1', 10),
    maxParticipants: parseInt(settings.maxParticipants || '100', 10)
  };

  io.emit('coin-match:start', coinMatchSettings);

  // Start countdown after delay
  const delay = coinMatchSettings.countdownStartDelay * 1000;
  setTimeout(() => {
    coinMatchTimer = setInterval(() => {
      if (coinMatchState !== 'running') {
        clearInterval(coinMatchTimer);
        return;
      }
      coinMatchCountdown--;
      io.emit('coin-match:update', {
        countdown: coinMatchCountdown,
        entries: getSortedEntries()
      });

      if (coinMatchCountdown <= 0) {
        clearInterval(coinMatchTimer);
        endCoinMatch();
      }
    }, 1000);
  }, delay);
}

function endCoinMatch() {
  coinMatchState = 'results';
  const winners = getSortedEntries().slice(0, 3);
  io.emit('coin-match:result', { winners });
}

function resetCoinMatch() {
  coinMatchState = 'idle';
  coinMatchEntries.clear();
  if (coinMatchTimer) clearInterval(coinMatchTimer);
  io.emit('coin-match:reset');
}

// ─── API Routes ─────────────────────────────────────────────────────────────

app.post('/api/connect', async (req, res) => {
  const username = req.body.username || TIKTOK_USERNAME;
  if (!username) return res.json({ success: false, error: 'Set TIKTOK_USERNAME in .env or send {username}' });
  const result = await connectToTikTok(username);
  res.json(result);
});

app.post('/api/disconnect', async (req, res) => {
  await disconnectFromTikTok();
  res.json({ success: true });
});

app.get('/api/status', (req, res) => {
  res.json({ status: connectionStatus, username: connectedUsername });
});

// CoinMatch API
app.post('/api/coinmatch/start', (req, res) => {
  if (coinMatchState === 'running') return res.json({ success: false, error: 'Match already running' });
  startCoinMatch(req.body);
  res.json({ success: true });
});

app.post('/api/coinmatch/stop', (req, res) => {
  if (coinMatchState === 'running') {
    clearInterval(coinMatchTimer);
    endCoinMatch();
  }
  res.json({ success: true });
});

app.post('/api/coinmatch/reset', (req, res) => {
  resetCoinMatch();
  res.json({ success: true });
});

app.get('/api/coinmatch/status', (req, res) => {
  res.json({
    state: coinMatchState,
    countdown: coinMatchCountdown,
    entries: getSortedEntries(),
    settings: coinMatchSettings
  });
});

// CoinJar reset
app.post('/api/coinjar/reset', (req, res) => {
  io.emit('coin-jar:reset');
  res.json({ success: true });
});

// ─── Socket.IO ──────────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  socket.emit('status', { status: connectionStatus, username: connectedUsername });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// ─── Auto-connect on startup ────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║       CoinJar & CoinMatch Server        ║
╠══════════════════════════════════════════╣
║  Dashboard:  http://localhost:${PORT}        ║
║  CoinJar:    http://localhost:${PORT}/coinjar ║
║  CoinMatch:  http://localhost:${PORT}/coinmatch║
╚══════════════════════════════════════════╝
  `);

  if (TIKTOK_USERNAME) {
    console.log(`[Auto] Connecting to @${TIKTOK_USERNAME}...`);
    connectToTikTok(TIKTOK_USERNAME);
  } else {
    console.log('[Info] Set TIKTOK_USERNAME in .env to auto-connect');
  }
});

process.on('SIGINT', () => { disconnectFromTikTok(); process.exit(0); });
process.on('SIGTERM', () => { disconnectFromTikTok(); process.exit(0); });
