// Idempotent seed run at backend boot. Mirrors the C# Program.cs startup
// scope that:
//   - creates a default channel (id=1, "user") if Channels is empty
//   - normalizes Channels.ProfileId when invalid
//   - ensures at least one Profile per channel
//   - seeds welcome notifications once per channel
//   - ensures the default ChannelModules list per channel
//
// Idempotent: safe to call on every boot.

const models = require('./models');
const logger = require('../logger');
const { DEFAULT_CHANNEL_ID, DEFAULT_CHANNEL_NAME } = require('../config');

function nowIso() {
  return new Date().toISOString();
}

function ensureDefaultChannel() {
  let ch = models.channels.findDefault();
  if (!ch) {
    const created = models.channels.create({
      ChannelName: DEFAULT_CHANNEL_NAME,
      ChannelSignature: '',
      Email: '',
      ProfileId: 1,
      Locale: 'VN',
      SignupAuthProvider: 'local',
      CreatedAt: nowIso(),
      UpdatedAt: nowIso(),
    });
    ch = models.channels.findById(created);
    logger.info(`[SEED] created default channel id=${ch.ChannelId} name="${ch.ChannelName}"`);
  } else if (ch.ProfileId <= 0) {
    models.channels.updateProfileId(ch.ChannelId, 1);
    logger.warn(`[SEED] normalized Channels.ProfileId ${ch.ProfileId} -> 1`);
    ch = models.channels.findById(ch.ChannelId);
  }
  return ch;
}

function ensureDefaultSubscription(channelId) {
  if (!models.subscriptions.findByChannel(channelId)) {
    models.subscriptions.upsert({
      channelId,
      isPro: false,
      plan: 'free',
      active: false,
    });
    logger.info(`[SEED] created Subscription stub for channel ${channelId}`);
  }
}

function ensureWelcomeNotifications(channelId) {
  const existing = models.notifications.listByChannel(channelId, { limit: 1 });
  if (existing.length > 0) return;

  const t0 = nowIso();
  const t1 = new Date(Date.now() - 60_000).toISOString();
  const t2 = new Date(Date.now() - 120_000).toISOString();

  const items = [
    {
      ChannelId: channelId,
      Subject: 'TikFinity Team',
      Category: 'announcements',
      Body:
        'Chào mừng đến với TikFinity Local! Mọi tính năng Pro đã được mở khoá ' +
        'nhờ Serial Key của bạn. Hãy kết nối tài khoản TikTok LIVE và thử các widget overlay trong OBS.',
      DataJson: JSON.stringify({
        title: '✨ Chào mừng đến với TikFinity Local',
        category: 'announcements',
        sender: 'TikFinity Team',
        avatarUrl: '/favicon.ico',
      }),
      CreatedAt: t0,
    },
    {
      ChannelId: channelId,
      Subject: 'Hướng dẫn nhanh',
      Category: 'tips',
      Body:
        'Mở OBS → thêm Browser source → URL: http://localhost:5285/widget/chat?cid=1 ' +
        '(hoặc cannon, gifts, firework, wheel...). Tất cả widget chạy real-time qua Socket.IO khi bạn LIVE.',
      DataJson: JSON.stringify({
        title: '📺 Cách thêm widget vào OBS',
        category: 'tips',
        sender: 'TikFinity Team',
        avatarUrl: '/favicon.ico',
      }),
      CreatedAt: t1,
    },
    {
      ChannelId: channelId,
      Subject: 'Streamer.bot ready',
      Category: 'announcements',
      Body:
        'Plugin Desktop API đang lắng nghe ở 127.0.0.1:21213. Cấu hình Streamer.bot trỏ ' +
        'tới đó là sub được mọi event TikTok (gift, follow, like, share...).',
      DataJson: JSON.stringify({
        title: '🔌 Streamer.bot plugin sẵn sàng',
        category: 'announcements',
        sender: 'TikFinity Team',
        avatarUrl: '/favicon.ico',
      }),
      CreatedAt: t2,
    },
  ];
  for (const n of items) models.notifications.create(n);
  logger.info(`[SEED] seeded ${items.length} welcome notifications for channel ${channelId}`);
}

function ensureProProfiles(channelId) {
  // TikClone is ALL-PRO (CLAUDE.md §1.0). Pro tier supports up to 10
  // stream profiles. Seed 10 profiles on first boot so switch profile
  // dropdown shows all 10 (matches gốc Pro behavior).
  const existing = models.profiles.listByChannel(channelId);
  if (existing.length >= 10) return;
  const startCount = existing.length;
  for (let i = startCount; i < 10; i++) {
    models.profiles.create({
      channelId,
      name: `Stream Profile ${i + 1}`,
      sort: i,
    });
  }
  logger.info(`[SEED] seeded ${10 - startCount} additional profiles for Pro tier (channel ${channelId})`);
}

function run() {
  const ch = ensureDefaultChannel();
  ensureDefaultSubscription(ch.ChannelId);
  models.profiles.ensureDefault(ch.ChannelId);
  ensureProProfiles(ch.ChannelId);
  models.channelModules.ensureDefaults(ch.ChannelId);
  ensureWelcomeNotifications(ch.ChannelId);
  return ch;
}

module.exports = { run };
