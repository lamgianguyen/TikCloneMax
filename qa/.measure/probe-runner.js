// Reusable headless probe runner — tự lái app trên localhost:5285, bắt
// console + uncaught error + unhandledrejection (lỗi "in promise") + response
// 4xx/5xx + request failed → ghi JSON log, (tùy chọn) chạy 1 probe in-page, rồi
// tự đóng. THAY cho việc paste probe vào console thủ công.
//
// Dùng:
//   node probe-runner.js [--url /] [--probe <file.js>] [--wait 12000] [--out probe-log.json]
//     --url    : path trên localhost:5285 (mặc định '/')
//     --probe  : file JS, body được eval in-page; giá trị return lưu vào result.probe
//     --wait   : ms chờ sau khi load để hứng lỗi boot (mặc định 12000)
//     --out    : tên file log trong qa/.measure/ (mặc định probe-log.json)
//
// Backend (app Electron) PHẢI đang chạy (cung cấp localhost:5285). Runner chỉ
// đọc — mở 1 tab headless, không sửa state. Tự đóng browser khi xong.

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : def;
}

(async () => {
  const url = arg('url', '/');
  const probeFile = arg('probe', null);
  const waitMs = parseInt(arg('wait', '12000'), 10);
  const outFile = arg('out', 'probe-log.json');

  const log = {
    url: BASE + url, startedAt: new Date().toISOString(),
    console: [], pageerrors: [], inPageErrors: [], badResponses: [], requestFailed: [], probe: null,
  };

  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage();

  // In-page capture is the RELIABLE path for "Uncaught (in promise)" rejections
  // (atob InvalidCharacterError etc.) which page.on('pageerror') can miss.
  await p.addInitScript(() => {
    window.__tfProbeErrors = [];
    window.addEventListener('error', (e) => {
      window.__tfProbeErrors.push({ kind: 'error', message: e.message, src: (e.filename || '') + ':' + e.lineno });
    });
    window.addEventListener('unhandledrejection', (e) => {
      const r = e.reason;
      window.__tfProbeErrors.push({
        kind: 'unhandledrejection',
        message: (r && (r.message || r.toString())) || String(r),
        stack: ((r && r.stack) || '').split('\n').slice(0, 10).join(' | '),
      });
    });
  });

  p.on('console', (m) => log.console.push({ type: m.type(), text: m.text().slice(0, 600) }));
  p.on('pageerror', (e) => log.pageerrors.push({ message: e.message, stack: (e.stack || '').split('\n').slice(0, 10).join(' | ') }));
  p.on('response', (r) => { const s = r.status(); if (s >= 400) log.badResponses.push({ status: s, url: r.url() }); });
  p.on('requestfailed', (r) => log.requestFailed.push({ url: r.url(), failure: (r.failure() || {}).errorText }));

  await p.goto(BASE + url, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch((e) => { log.gotoError = e.message; });
  await p.waitForTimeout(waitMs);

  log.inPageErrors = await p.evaluate(() => window.__tfProbeErrors || []).catch(() => []);

  if (probeFile) {
    const code = fs.readFileSync(path.resolve(probeFile), 'utf8');
    try { log.probe = await p.evaluate('(async()=>{ ' + code + ' })()'); }
    catch (e) { log.probe = { evalError: e.message }; }
  }

  await b.close();
  log.finishedAt = new Date().toISOString();
  log.summary = {
    consoleErrors: log.console.filter((c) => c.type === 'error').length,
    pageerrors: log.pageerrors.length,
    inPageErrors: log.inPageErrors.length,
    badResponses: log.badResponses.length,
    requestFailed: log.requestFailed.length,
  };
  fs.writeFileSync(path.join(__dirname, outFile), JSON.stringify(log, null, 2));

  console.log('=== probe-runner: ' + log.url + ' ===');
  console.log('summary:', JSON.stringify(log.summary));
  log.inPageErrors.forEach((e) => console.log('[' + e.kind + ']', e.message, e.src ? '@' + e.src : ''));
  log.pageerrors.forEach((e) => console.log('[PAGEERROR]', e.message));
  log.badResponses.slice(0, 20).forEach((r) => console.log('[HTTP ' + r.status + ']', r.url));
  if (log.probe) console.log('[PROBE]', JSON.stringify(log.probe).slice(0, 600));
  console.log('full log →', path.join(__dirname, outFile));
  process.exit(0);
})().catch((e) => { console.error('RUNNER ERR', e.message); process.exit(1); });
