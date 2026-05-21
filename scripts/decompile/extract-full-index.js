#!/usr/bin/env node
// Generate docs/COMPLETE_ENDPOINT_INDEX.md — exhaustive list of EVERY one of
// the 228 unique endpoints captured from HAR, grouped by category, with
// method, host, status, content-type, body bytes, auth, and one-line preview.
//
// This is the agent-reference catalogue. extract-contracts.js gives full shape
// for the 26 main endpoints; this script gives the full sweep.

const fs = require('fs');
const path = require('path');

const SRC = 'routes-generated/tikfinity.zerody.four.merged.endpoints.json';
const OUT = 'docs/COMPLETE_ENDPOINT_INDEX.md';

if (!fs.existsSync(SRC)) {
  console.error(`Missing ${SRC}. Run merge-har.js first.`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));

function summarize(text, limit) {
  if (!text) return '(empty)';
  const oneLine = String(text).replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|');
  return oneLine.length > limit ? oneLine.slice(0, limit) + '…' : oneLine;
}

function categorize(pathname) {
  if (pathname.startsWith('/api/me') || pathname.startsWith('/api/loginChannel') || pathname.startsWith('/api/switchProfile')) return '01-identity';
  if (pathname.startsWith('/api/login') || pathname.startsWith('/api/auth/') || pathname.startsWith('/api/v1/auth/') || pathname.startsWith('/api/v1/code/') || pathname.startsWith('/api/v1/flow/')) return '02-auth';
  if (pathname.startsWith('/api/getAppConfig') || pathname.startsWith('/api/init') || pathname.startsWith('/api/getSystemConfig') || pathname.startsWith('/api/getTranslations') || pathname.startsWith('/api/v2/sync') || pathname.startsWith('/config/')) return '03-config';
  if (pathname.startsWith('/api/updateSettings') || pathname.startsWith('/api/getOverlayConfig') || pathname.startsWith('/api/modules')) return '04-settings';
  if (pathname.startsWith('/api/rest/action') || pathname.startsWith('/api/executeAction')) return '05-actions';
  if (pathname.startsWith('/api/sounds') || pathname.startsWith('/api/rest/sound')) return '06-sounds';
  if (pathname.startsWith('/api/tts/') || pathname.startsWith('/api/voice/')) return '07-tts';
  if (pathname.startsWith('/api/goals')) return '08-goals';
  if (pathname.startsWith('/api/points')) return '09-points';
  if (pathname.startsWith('/api/commands')) return '10-commands';
  if (pathname.startsWith('/api/widget/')) return '11-widget-api';
  if (pathname.startsWith('/api/odata/') || pathname.startsWith('/api/rest/transaction') || pathname.startsWith('/api/getAllGifts') || pathname.startsWith('/api/getAllAnimations') || pathname.startsWith('/api/getChannelEmotes') || pathname.startsWith('/api/usage/log') || pathname.startsWith('/api/getGlobalTransactions') || pathname.startsWith('/api/getChannelUserCount') || pathname.startsWith('/api/getLiveChannels')) return '12-data';
  if (pathname.startsWith('/api/notifications/')) return '13-notifications';
  if (pathname.startsWith('/api/backup/') || pathname.startsWith('/api/backup')) return '14-backup';
  if (pathname.startsWith('/api/reset/')) return '15-reset';
  if (pathname.startsWith('/api/seed')) return '16-seed';
  if (pathname.startsWith('/api/pro/')) return '17-pro';
  if (pathname.startsWith('/api/uploadFile') || pathname.startsWith('/api/uploadMedia') || pathname.startsWith('/api/uploads/')) return '18-upload';
  if (pathname.startsWith('/api/webhooks')) return '19-webhooks';
  if (pathname.startsWith('/api/obs/')) return '20-obs';
  if (pathname.startsWith('/api/import/')) return '21-import';
  if (pathname.startsWith('/api/tiktok/')) return '22-tiktok';
  if (pathname.startsWith('/api/logError')) return '23-telemetry';
  if (pathname.startsWith('/widget/')) return '30-widget-html';
  if (pathname.startsWith('/socket.io/')) return '31-socket';
  if (pathname.startsWith('/img/user/')) return '32-avatar';
  if (pathname.startsWith('/tiktok/')) return '33-tiktok-page';
  if (pathname.startsWith('/docs/')) return '34-static-docs';
  if (pathname.startsWith('/cdn-cgi/')) return '35-cdn-meta';
  if (pathname.startsWith('/2l68/')) return '99-telemetry-beacon';
  if (pathname.startsWith('/api/')) return '40-other-api';
  return '90-other';
}

const byCat = new Map();
for (const e of data) {
  const cat = categorize(e.pathname);
  if (!byCat.has(cat)) byCat.set(cat, []);
  byCat.get(cat).push(e);
}

const sortedCats = [...byCat.keys()].sort();
const out = [];

out.push('# Complete Endpoint Index — Tất cả 228 endpoint unique');
out.push('');
out.push('> Catalogue đầy đủ MỌI endpoint bundle TikFinity gốc đã gọi trong 4 HAR session capture.');
out.push('> Không lọc — bao gồm cả widget HTML, avatar URLs, telemetry beacons, socket.io handshake.');
out.push('> Auto-generated từ `routes-generated/tikfinity.zerody.four.merged.endpoints.json`.');
out.push('');
out.push(`Tổng: **${data.length} unique endpoints** chia thành ${sortedCats.length} categories.`);
out.push('');
out.push('## Mục lục categories');
out.push('');
out.push('| # | Category | Endpoints | Mục đích |');
out.push('|---:|---|---:|---|');

const catDescriptions = {
  '01-identity': 'User/channel/profile state — /api/me, /api/loginChannel, /api/switchProfile',
  '02-auth': 'Login + JWT — /api/login, /api/auth/*, /api/v1/auth/*',
  '03-config': 'Boot config — /api/init, /api/getAppConfig, /api/getTranslations',
  '04-settings': 'Settings save — /api/updateSettings, /api/modules',
  '05-actions': 'User-defined actions — /api/rest/action CRUD, /api/executeAction',
  '06-sounds': 'Sound library — /api/sounds, /api/rest/sound',
  '07-tts': 'Text-to-speech — /api/tts/* + /api/voice/generate',
  '08-goals': 'Goals tracking — /api/goals CRUD',
  '09-points': 'Per-viewer balance — /api/points/*',
  '10-commands': 'Chat commands — /api/commands CRUD',
  '11-widget-api': 'Widget control — /api/widget/timer, /api/widget/coinjar, ...',
  '12-data': 'Data fetch — gifts, emotes, transactions, OData',
  '13-notifications': 'Bell-icon notifications — /api/notifications/*',
  '14-backup': 'Backup/restore — /api/backup/*',
  '15-reset': 'Reset stats — /api/reset/*',
  '16-seed': 'Seed data — /api/seed',
  '17-pro': 'Pro subscription — /api/pro/*',
  '18-upload': 'File upload — /api/uploadFile, /api/uploadMedia',
  '19-webhooks': 'Outbound webhooks — /api/webhooks CRUD',
  '20-obs': 'OBS websocket — /api/obs/*',
  '21-import': 'Config import — /api/import/tikfinity',
  '22-tiktok': 'TikTok bridge — /api/tiktok/status, /connect, /disconnect',
  '23-telemetry': 'Error reporting — /api/logError',
  '30-widget-html': 'Widget HTML pages — /widget/<name>',
  '31-socket': 'Socket.IO handshake — /socket.io/',
  '32-avatar': 'Avatar URLs — /img/user/<channelId>/<userId>',
  '33-tiktok-page': 'TikTok docs page — /tiktok/<page>',
  '34-static-docs': 'Static documentation — /docs/*',
  '35-cdn-meta': 'Cloudflare metadata — /cdn-cgi/*',
  '40-other-api': 'Other /api/* paths chưa categorize',
  '90-other': 'Other endpoints chưa categorize',
  '99-telemetry-beacon': 'Cloudflare RUM beacon — /2l68/* (đã skip, ignore)',
};

let catIdx = 0;
for (const cat of sortedCats) {
  catIdx++;
  out.push(`| ${catIdx} | [${cat}](#${cat.replace(/-/g, '')}) | ${byCat.get(cat).length} | ${catDescriptions[cat] || '(uncategorized)'} |`);
}
out.push('');

let n = 0;
for (const cat of sortedCats) {
  out.push(`## ${cat}`);
  out.push('');
  if (catDescriptions[cat]) out.push(`> ${catDescriptions[cat]}`);
  out.push('');
  out.push('| # | Method | Path | Host | Status | Bytes | Content-Type | Preview |');
  out.push('|---:|---|---|---|---:|---:|---|---|');
  const list = byCat.get(cat).sort((a, b) => a.pathname.localeCompare(b.pathname));
  for (const e of list) {
    n++;
    out.push(`| ${n} | ${e.method} | \`${e.pathname.length > 60 ? e.pathname.slice(0, 60) + '…' : e.pathname}\` | \`${e.host}\` | ${e.status} | ${e.bodyText.length.toLocaleString()} | ${e.contentType || '-'} | ${summarize(e.bodyText, 80)} |`);
  }
  out.push('');
}

out.push('---');
out.push('');
out.push('## Cách dùng');
out.push('');
out.push('1. Tìm endpoint theo category (mục lục table đầu)');
out.push('2. Đọc dòng tương ứng — có method, host, status, bytes, preview body');
out.push('3. Nếu cần shape đầy đủ → đến `docs/API_CONTRACTS.md`');
out.push('4. Nếu cần response body raw → search `pathname` trong `routes-generated/tikfinity.zerody.four.merged.endpoints.json`');
out.push('5. Nếu cần Express stub copy-paste → `routes-generated/tikfinity.zerody.four.merged.js`');
out.push('');
out.push('## Re-generate');
out.push('');
out.push('```bash');
out.push('# After adding new HAR captures to captures/');
out.push('node --max-old-space-size=6144 scripts/decompile/merge-har.js');
out.push('node scripts/decompile/extract-full-index.js');
out.push('```');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out.join('\n'), 'utf8');
const stats = fs.statSync(OUT);
console.log(`Wrote ${OUT} — ${stats.size.toLocaleString()} bytes, ${out.length} lines`);
console.log(`Categories: ${sortedCats.length}, Total endpoints: ${n}`);
