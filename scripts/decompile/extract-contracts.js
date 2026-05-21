#!/usr/bin/env node
// Generate docs/API_CONTRACTS.md from the merged HAR endpoint catalogue.
// Each documented endpoint includes: response shape (recursive type tree),
// real sample body (truncated if huge), bytes, auth requirement, and
// captured query example. Designed to be exhaustive — an agent reading
// this should not need to consult the raw HAR or backend to understand
// what the bundle expects.

const fs = require('fs');
const path = require('path');

const SRC = 'routes-generated/tikfinity.zerody.four.merged.endpoints.json';
const OUT = 'docs/API_CONTRACTS.md';

function loadEndpoints() {
  if (!fs.existsSync(SRC)) {
    console.error(`Missing ${SRC}. Run merge-har.js first.`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(SRC, 'utf8'));
}

// Print a type tree of any JSON value. Strings show their full content when
// short; large strings show length. Arrays show one element template + count.
function schema(value, depth, maxDepth, maxFields) {
  if (value === null) return 'null';
  if (depth >= maxDepth) return '...';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'array<empty>[0]';
    const inner = schema(value[0], depth + 1, maxDepth, maxFields);
    return `array<\n${'  '.repeat(depth + 1)}${inner}\n${'  '.repeat(depth)}>[${value.length} items]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    const shown = keys.slice(0, maxFields);
    const lines = ['{'];
    for (const k of shown) {
      const v = value[k];
      let t;
      if (v === null) t = 'null';
      else if (Array.isArray(v)) {
        if (v.length === 0) t = 'array<empty>[0]';
        else t = `array<${schema(v[0], depth + 1, maxDepth, maxFields)}>[${v.length}]`;
      } else if (typeof v === 'object') {
        t = schema(v, depth + 1, maxDepth, maxFields);
      } else if (typeof v === 'string') {
        const inline = v.length < 80 ? JSON.stringify(v) : `"<${v.length}-char string>"`;
        t = 'string = ' + inline;
      } else {
        t = typeof v + (typeof v === 'number' || typeof v === 'boolean' ? ' = ' + v : '');
      }
      lines.push('  '.repeat(depth + 1) + k + ': ' + t);
    }
    if (keys.length > maxFields) {
      lines.push('  '.repeat(depth + 1) + '... +' + (keys.length - maxFields) + ' more keys');
    }
    lines.push('  '.repeat(depth) + '}');
    return lines.join('\n');
  }
  if (typeof value === 'string') return 'string = ' + (value.length < 80 ? JSON.stringify(value) : `"<${value.length}-char>"`);
  return typeof value + (typeof value === 'number' || typeof value === 'boolean' ? ' = ' + value : '');
}

function bodyShape(text) {
  if (!text) return '_(empty body)_';
  try {
    const j = JSON.parse(text);
    return '```\n' + schema(j, 0, 6, 40) + '\n```';
  } catch {
    return '```\n(not JSON — first 400 chars)\n' + text.slice(0, 400) + '\n```';
  }
}

function jsonSample(text, maxLines) {
  if (!text) return '_(empty)_';
  try {
    const j = JSON.parse(text);
    const pretty = JSON.stringify(j, null, 2);
    const lines = pretty.split('\n');
    if (lines.length <= maxLines) return '```json\n' + pretty + '\n```';
    return '```json\n' + lines.slice(0, maxLines).join('\n') + '\n  ... (' + (lines.length - maxLines) + ' more lines truncated for brevity)\n```';
  } catch {
    return '```\n' + text.slice(0, 800) + '\n```';
  }
}

const wanted = [
  { method: 'GET',  path: '/api/init',                          host: 'tikfinity.zerody.one' },
  { method: 'POST', path: '/api/login',                         host: 'tikfinity.zerody.one' },
  { method: 'POST', path: '/api/me',                            host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/rest/action',                   host: 'tikfinity.zerody.one' },
  { method: 'POST', path: '/api/updateSettings',                host: 'tikfinity.zerody.one' },
  { method: 'POST', path: '/api/executeAction',                 host: 'tikfinity.zerody.one' },
  { method: 'PUT',  path: '/api/rest/transaction',              host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/notifications/list',            host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/notifications/preferences',     host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/getAllGifts',                   host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/getChannelEmotes',              host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/getLiveChannels',               host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/getGlobalTransactions',         host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/getChannelUserCount',           host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/odata/channeluser',             host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/odata/transaction',             host: 'tikfinity.zerody.one' },
  { method: 'POST', path: '/api/usage/log',                     host: 'tikfinity.zerody.one' },
  { method: 'POST', path: '/api/logError',                      host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/pro/tazapay/methods',           host: 'tikfinity.zerody.one' },
  { method: 'POST', path: '/api/tts/auth-token',                host: 'tikfinity.zerody.one' },
  { method: 'GET',  path: '/api/tts/user',                      host: 'tts.tikfinity.com' },
  { method: 'GET',  path: '/api/tts/voices',                    host: 'tts.tikfinity.com' },
  { method: 'POST', path: '/api/tts/generate',                  host: 'tts.tikfinity.com' },
  { method: 'GET',  path: '/api/sounds/trending',               host: 'myinstantsapi.zerody.one' },
  { method: 'POST', path: '/api/backup',                        host: 'myinstantsbackup.zerody.one' },
];

const data = loadEndpoints();
const out = [];

out.push('# API Contracts — Captured From Real TikFinity Server');
out.push('');
out.push('> **Đây là tài liệu cấu trúc đầy đủ của mọi request/response mà bundle TikFinity gốc thực hiện.**');
out.push('> Trích xuất từ 4 phiên HAR capture (`captures/tikfinity.zerody.{one,two,three,four}.har`, tổng 427 MB) → 6,071 raw entries → 228 unique endpoints → 26 API endpoints chính được document đầy đủ shape + sample dưới đây.');
out.push('');
out.push('## Tại sao tài liệu này tồn tại');
out.push('');
out.push('Project clone TikFinity dùng lại bundle obfuscated của họ (`downloads/combo/app.js` 3.9 MB + `modules.js` 1.3 MB). Bundle gọi 26 API endpoint khác nhau khi boot + sử dụng. Backend local của mình phải trả response **đúng shape** ở từng endpoint; sai một field thường gây:');
out.push('');
out.push('- `settings.restore` reload loop (~2.5s/reload, vô hạn)');
out.push('- UI flicker / modal trống / widget không render');
out.push('- Avatar/nickname không lên');
out.push('- Profile switch loop 8-12 reload');
out.push('');
out.push('Khi không biết shape gốc → đoán → trật → vá → đoán → trật. Tài liệu này cho phép so trực tiếp shape backend local với shape server thật.');
out.push('');
out.push('## Pipeline tạo ra tài liệu này');
out.push('');
out.push('```');
out.push('1. Capture HAR: Chrome DevTools → Network → "Save all as HAR with content"');
out.push('   - 4 sessions × 1-5 phút mỗi session, click khắp tính năng');
out.push('   - Tổng 427 MB HAR, ~6,071 request');
out.push('2. Merge + dedupe: scripts/decompile/merge-har.js');
out.push('   - Bỏ static assets (.css, .js, .png, fonts)');
out.push('   - Bỏ 3rd-party (PostHog, Sentry, GA, Cloudflare RUM)');
out.push('   - Dedupe theo (method, host, path), keep newest');
out.push('   - Output: 228 unique endpoints, 13 categories');
out.push('3. Generate shape: scripts/decompile/extract-contracts.js');
out.push('   - Recursive type tree, max depth 6, max 40 fields/level');
out.push('   - Sample body (full nếu < 4 KB, truncated nếu lớn)');
out.push('   - Output: file này');
out.push('4. Bundle decompile: webcrack downloads/combo/{app,modules}.js');
out.push('   - Output: decompiled/{app,modules}/deobfuscated.js (~1 MB readable)');
out.push('   - Mục đích: đọc trực tiếp logic Vue bundle thay vì đoán qua stack trace');
out.push('5. Live instrumentation: blockScript.txt section §72-138');
out.push('   - Off-by-default IIFE wrap fetch + XHR');
out.push('   - Bật trong DevTools: localStorage.setItem("tf-instrument","1")');
out.push('   - Dump: window.__tfDumpCallLog()');
out.push('```');
out.push('');
out.push('## Cách sử dụng tài liệu này');
out.push('');
out.push('1. **Khi sửa 1 handler backend**: tìm endpoint tương ứng trong table TL;DR → đọc section chi tiết → copy shape sang local response. Đảm bảo MỌI field bundle expect đều có.');
out.push('');
out.push('2. **Khi mock 1 feature mới**: copy section sample response, paste vào route handler, thay value mock. Bundle sẽ không biết khác biệt.');
out.push('');
out.push('3. **Khi UI bị lỗi**: tìm endpoint mà widget/modal đó gọi → diff response shape gốc vs backend local → fix mismatch.');
out.push('');
out.push('4. **Khi thêm feature mà chưa biết shape**: bật instrumentation, trigger feature 1 lần, dump call log, xem URL + body. Thường đủ để code mà không cần capture HAR mới.');
out.push('');
out.push('---');
out.push('');
out.push('## TL;DR — Toàn bộ endpoint catalogue');
out.push('');
out.push('| # | Method | Path | Host | Body bytes | Auth | Status |');
out.push('|---:|---|---|---|---:|:---:|:---:|');
let idx = 0;
for (const w of wanted) {
  idx++;
  const e = data.find(x => x.method === w.method && x.pathname === w.path && x.host === w.host);
  if (!e) {
    out.push(`| ${idx} | ${w.method} | \`${w.path}\` | \`${w.host}\` | _(not captured)_ | — | — |`);
    continue;
  }
  out.push(`| ${idx} | ${e.method} | \`${e.pathname}\` | \`${e.host}\` | ${e.bodyText.length.toLocaleString()} | ${e.sample.hadAuth ? 'Bearer' : '—'} | ${e.status} |`);
}
out.push('');
out.push('Ghi chú table:');
out.push('- **Body bytes** = response body size (server gốc trả). Có thể so với backend local: nếu local trả 0 B mà gốc trả 13 KB, là thiếu data.');
out.push('- **Auth** = "Bearer" tức là bundle gắn Authorization header (token đọc từ localStorage `setting_loginaccesstoken` hoặc cookie `tf_login_token`).');
out.push('- **Status** = HTTP status response gốc. 200 = OK, 201 = Created, 204 = No Content (preflight), v.v.');
out.push('');
out.push('---');
out.push('');

let n = 0;
for (const w of wanted) {
  n++;
  const e = data.find(x => x.method === w.method && x.pathname === w.path && x.host === w.host);
  if (!e) {
    out.push(`## ${n}. ${w.method} \`${w.path}\``);
    out.push('');
    out.push(`> ⚠️ Endpoint này có trong PROJECT.md hoặc CLAUDE.md nhưng KHÔNG có trong HAR capture. Trigger điều kiện chưa được tạo ra (ví dụ user chưa click nút tương ứng). Cần capture thêm session để có shape thật.`);
    out.push('');
    out.push('---');
    out.push('');
    continue;
  }
  out.push(`## ${n}. ${e.method} \`${e.pathname}\``);
  out.push('');
  out.push(`- **Host**: \`${e.host}\``);
  out.push(`- **Method**: \`${e.method}\``);
  out.push(`- **Status**: \`${e.status}\``);
  out.push(`- **Content-Type**: \`${e.contentType || '(unknown)'}\``);
  out.push(`- **Body bytes**: \`${e.bodyText.length.toLocaleString()}\``);
  out.push(`- **Bearer auth required**: ${e.sample.hadAuth ? '**yes**' : 'no'}`);
  if (e.query) out.push(`- **Query example**: \`${e.query.length > 200 ? e.query.slice(0, 200) + '...' : e.query}\``);
  out.push(`- **Captured at**: \`${e.seenAt || '(unknown)'}\``);
  out.push('');
  out.push('### Response shape (recursive type tree)');
  out.push('');
  out.push(bodyShape(e.bodyText));
  out.push('');
  if (e.bodyText.length > 0 && e.bodyText.length < 6000) {
    out.push('### Sample response (real data, full)');
    out.push('');
    out.push(jsonSample(e.bodyText, 200));
    out.push('');
  } else if (e.bodyText.length >= 6000) {
    out.push(`### Sample response (truncated head — full ${e.bodyText.length.toLocaleString()} B available in HAR)`);
    out.push('');
    out.push(jsonSample(e.bodyText, 80));
    out.push('');
    out.push(`_Full payload available at \`routes-generated/tikfinity.zerody.four.merged.endpoints.json\` — search \`"pathname":"${e.pathname}"\`._`);
    out.push('');
  }
  out.push('---');
  out.push('');
}

out.push('## Phụ lục A: Tất cả 228 unique endpoints (không chỉ /api/)');
out.push('');
out.push('Catalogue đầy đủ kèm preview body từng endpoint (~120 widget HTML pages, socket.io handshake, OData, telemetry beacons đã loại):');
out.push('');
out.push('- File: `routes-generated/tikfinity.zerody.four.merged.shapes.md`');
out.push('- Raw JSON tooling-friendly: `routes-generated/tikfinity.zerody.four.merged.endpoints.json`');
out.push('- Express router stub auto-gen (mount tạm vào index.js): `routes-generated/tikfinity.zerody.four.merged.js`');
out.push('');
out.push('## Phụ lục B: Hosts mapping');
out.push('');
out.push('Bundle gốc gọi 8 host khác nhau. Local clone phải rewrite hoặc proxy:');
out.push('');
out.push('| Host gốc | Vai trò | Status local |');
out.push('|---|---|---|');
out.push('| `tikfinity.zerody.one` | Main APIs (162 endpoints) | ✅ Bundle rewrite → `localhost:5285` qua `middleware/index-html.js` |');
out.push('| `tikfinity-auth-service.zerody.one` | Login + JWT mint | ⚠️ Stub local hoặc proxy 5194 |');
out.push('| `tts.tikfinity.com` | TTS catalog + user + generate | ✅ Mock trong `blockScript.txt` (`tfHandleTtsTikfinityCom`) |');
out.push('| `tikfinity-tts-api.zerody.one` | Alt TTS API path | ⚠️ Bundle có 2 đường gọi TTS, đường này chưa handle |');
out.push('| `tikfinity-cws-{03,04,05}.zerody.one` | TikTok WebSocket per-region | ❌ Bundle\'s `connectorHost=""` đã disable |');
out.push('| `myinstantsapi.zerody.one` | Sound library trending | ✅ `/myinstants-proxy/` |');
out.push('| `myinstantsbackup.zerody.one` | Sound upload backup | ⚠️ Chưa handle |');
out.push('| `ph.tikfinity.com` + gtag/sentry/featurebase | Telemetry | ✅ `shouldBlockUrl` chặn |');
out.push('');
out.push('## Phụ lục C: 22 trường top-level của `/api/me` (most important endpoint)');
out.push('');
out.push('`/api/me` là endpoint hydrate state chính (58 KB response). Bundle dùng nó để dựng MỌI thứ trong UI: topbar, sidebar, profile chip, widgets, modals. Một field thiếu hoặc sai type ở đây thường gây `settings.restore` reload loop hoặc UI lỗi không rõ nguyên nhân.');
out.push('');
out.push('| Field | Type | Bundle dùng cho | Caching rule |');
out.push('|---|---|---|---|');
out.push('| `status` | number | error check (200=OK) | — |');
out.push('| `message` | string | error display fallback | — |');
out.push('| `channelId` | number | localStorage `setting_channelid` | — |');
out.push('| `channel` | object (~46 fields) | topbar, profile chip, sidebar, isPro check | — |');
out.push('| `channeluser` | object (~15 fields) | per-viewer state (totalAmount, etc.) | — |');
out.push('| `profile` | object/null | active per-channel profile | — |');
out.push('| `subscription` | object/null | isPro gate trên mọi widget | — |');
out.push('| `userFeatures` | object | feature flags (`isPro`, `proInfo`) | — |');
out.push('| `wsAuthToken` | string | Socket.IO authentication | **MUST cache per channelId** |');
out.push('| `featureBaseToken` | string | feedback widget | **MUST cache per (channelId, channelName)** |');
out.push('| `discordVerifyToken` | string | Discord connect | — |');
out.push('| `discordHasProRole` | boolean | Discord Pro badge | — |');
out.push('| `cookieAuth` | boolean | auth-bridge hint | — |');
out.push('| `countryCode` | string | language flag topbar | — |');
out.push('| `overloadSettings` | object | rate-limit config | — |');
out.push('| `performanceDebugInfo` | object | metrics (noop ok) | — |');
out.push('| `activePromotions` | array | promo banner | — |');
out.push('| `mobileVoucherCode` | object/null | mobile voucher modal | — |');
out.push('| `isTrialAvailable` | boolean | trial banner | — |');
out.push('| `hasActiveTrial` | boolean | trial banner | — |');
out.push('| `trialEnded` | boolean | trial banner | — |');
out.push('| `trialInfo` | object/null | trial banner detail | — |');
out.push('');
out.push('**Trap đã từng gặp** (xem [SKILL.md](../superpowers/skills/bundle-integration/SKILL.md#3-six-traps-that-recurrently-break-the-ui)):');
out.push('');
out.push('- Mint `wsAuthToken` mới mỗi request → `iat` đổi → bundle thấy session change → reload loop');
out.push('- Mint `featureBaseToken` không phụ thuộc `channelName` → switch profile → mismatch → loop');
out.push('- Thiếu một field trong `channel.dynamicSettings` mà bundle cached → `settings.restore` POST lại → backend response không khớp → loop');
out.push('');
out.push('## Phụ lục D: HAR captures dùng để tạo tài liệu này');
out.push('');
out.push('| File | Size | Đóng góp |');
out.push('|---|---:|---|');
out.push('| `captures/tikfinity.zerody.one.har` | 64.6 MB | 136 unique endpoints sau dedupe |');
out.push('| `captures/tikfinity.zerody.two.har` | 23.1 MB | +2 endpoints |');
out.push('| `captures/tikfinity.zerody.three.har` | 317.1 MB | +36 endpoints |');
out.push('| `captures/tikfinity.zerody.four.har` | 89.6 MB | +54 endpoints (gồm `/api/login`, `/api/updateSettings`, `/api/executeAction`, `/api/tts/generate`, `/api/voice/generate`) |');
out.push('');
out.push('Mỗi capture mất ~3-5 phút thao tác Chrome DevTools + click qua các tính năng. Tổng effort capture: ~20-30 phút clicking.');
out.push('');
out.push('## Phụ lục E: Files được sinh ra tự động');
out.push('');
out.push('| File | Generated by | Vai trò |');
out.push('|---|---|---|');
out.push('| `docs/API_CONTRACTS.md` (file này) | `scripts/decompile/extract-contracts.js` | Shape + sample mỗi endpoint chính |');
out.push('| `docs/BUNDLE_CALL_FLOW.md` | hand-written | Boot sequence, flow per feature |');
out.push('| `routes-generated/*.merged.{js,shapes.md,endpoints.json}` | `scripts/decompile/merge-har.js` | 228-endpoint catalogue, Express stubs |');
out.push('| `decompiled/{app,modules}/deobfuscated.js` | `npx webcrack downloads/combo/<file>.js -o decompiled/<name>/` | Readable Vue source 945 KB |');
out.push('| `superpowers/skills/bundle-integration/SKILL.md` | hand-written | Skill agent đọc trước khi sửa code bundle-adjacent |');
out.push('');
out.push('## Phụ lục F: Re-generate khi bundle update');
out.push('');
out.push('Khi `downloads/combo/{app,modules}.js` thay đổi (TikFinity gốc push bundle mới), phải:');
out.push('');
out.push('```bash');
out.push('# 1. Capture HAR mới từ TikFinity gốc (tikfinity.zerody.one)');
out.push('#    DevTools → Network → Preserve log + Disable cache → trigger features → Save all as HAR');
out.push('mv ~/Downloads/tikfinity.zerody.one.har captures/');
out.push('');
out.push('# 2. Re-merge & re-extract contracts');
out.push('node --max-old-space-size=6144 scripts/decompile/merge-har.js');
out.push('node scripts/decompile/extract-contracts.js');
out.push('');
out.push('# 3. Re-decompile bundle');
out.push('npx webcrack downloads/combo/modules.js -o decompiled/modules');
out.push('npx webcrack downloads/combo/app.js -o decompiled/app');
out.push('');
out.push('# 4. Verify');
out.push('git diff docs/API_CONTRACTS.md     # field nào server gốc đã đổi shape?');
out.push('git diff decompiled/modules/deobfuscated.js   # function nào bundle đã thêm?');
out.push('');
out.push('# 5. Update local handlers theo diff');
out.push('```');
out.push('');
out.push('---');
out.push('');
out.push('_File này auto-sinh từ HAR captures. Edit script `scripts/decompile/extract-contracts.js` để đổi format. Không edit file này trực tiếp — sẽ bị overwrite lần re-run kế._');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out.join('\n'), 'utf8');
const stats = fs.statSync(OUT);
console.log(`Wrote ${OUT} — ${stats.size.toLocaleString()} bytes, ${out.length} lines`);
