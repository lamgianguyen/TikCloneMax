// Full overlay render-audit: load every widget headless, capture console errors,
// failed asset loads, JS crashes, and whether it renders any DOM. Distinguishes a
// real fault (error/crash/404) from a legitimately-idle widget (no live data).
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';

// widget name → extra query params some widgets require
const PARAMS = { lastx: 'x=10', goal: 'metric=followers', gcounter: 'c=1' };
const WIDGETS = [
  'coinjar', 'coinmatch', 'cannon', 'wheel', 'wheelofactions', 'goal', 'giftgoal',
  'webcam', 'overlay', 'talking', 'chat', 'eventcarousel', 'fallingsnow', 'firework',
  'ranking', 'topgifter', 'topliker', 'lastx', 'viewercount', 'myactions', 'timer',
  'socialmediarotator', 'commandinfo', 'userinfo', 'transactionviewer', 'likefountain',
];

(async () => {
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const out = [];
  for (const name of WIDGETS) {
    const extra = PARAMS[name] ? '&' + PARAMS[name] : '';
    const url = `${BASE}/widget/${name}/?cid=1&preview=1${extra}`;
    const errors = [];
    const failed = [];
    const page = await b.newPage({ viewport: { width: 800, height: 600 } });
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
    page.on('pageerror', (e) => errors.push('PAGEERROR: ' + (e.message || e).toString().slice(0, 160)));
    page.on('requestfailed', (r) => { const u = r.url(); if (!u.startsWith('data:')) failed.push(r.method() + ' ' + u.replace(BASE, '') + ' (' + (r.failure() && r.failure().errorText) + ')'); });
    page.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url().replace(BASE, '')); });
    let nav = 'ok';
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch (e) { nav = 'NAV_FAIL: ' + e.message.slice(0, 80); }
    await page.waitForTimeout(4500); // let modules load + socket connect + render
    let dom = {};
    try {
      dom = await page.evaluate(() => {
        // External CDN/lib refs (C4) — should be localized to /js/lib/. Flag any
        // script/link pointing off-origin so future audits catch CDN regressions.
        const ext = [];
        document.querySelectorAll('script[src], link[href]').forEach((el) => {
          const u = el.src || el.href || '';
          if (/^https?:\/\//.test(u) && !u.includes(location.host)) {
            const host = (u.match(/^https?:\/\/([^/]+)/) || [])[1] || u;
            if (!ext.includes(host)) ext.push(host);
          }
        });
        window.__ext = ext;
        const app = document.querySelector('#app');
        const body = document.body;
        const vis = Array.from(body.querySelectorAll('*')).filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 2 && r.height > 2 && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none';
        }).length;
        return {
          bodyChildren: body.childElementCount,
          appChildren: app ? app.childElementCount : -1, // -1 = no #app element (non-Vue widget)
          visibleEls: vis,
          innerTextLen: (body.innerText || '').trim().length,
          htmlLen: body.innerHTML.length,
          ext: window.__ext || [],
        };
      });
    } catch (e) { dom = { evalErr: e.message.slice(0, 80) }; }
    await page.close();
    out.push({ name, nav, errors, failed, dom });
  }
  await b.close();

  // ---- report ----
  console.log('\n================ FULL OVERLAY AUDIT ================');
  const broken = [], suspect = [], ok = [];
  for (const r of out) {
    const hardFail = r.nav !== 'ok' || r.errors.length > 0 || r.failed.length > 0;
    // "rendered" heuristic: has visible elements OR app/body children + some html
    const rendered = (r.dom.visibleEls > 0) || (r.dom.bodyChildren > 0 && r.dom.htmlLen > 60);
    const tag = hardFail ? 'BROKEN' : (!rendered ? 'EMPTY?' : 'OK');
    const line = `[${tag}] ${name(r)} nav=${r.nav} vis=${r.dom.visibleEls} appCh=${r.dom.appChildren} htmlLen=${r.dom.htmlLen} err=${r.errors.length} 4xx=${r.failed.length}`;
    if (hardFail) broken.push(r); else if (!rendered) suspect.push(r); else ok.push(r);
    console.log(line);
  }
  function name(r) { return r.name.padEnd(20); }
  console.log('\n---- BROKEN (error / 404 / crash) ----');
  if (!broken.length) console.log('  (none)');
  broken.forEach((r) => {
    console.log('• ' + r.name);
    r.errors.slice(0, 4).forEach((e) => console.log('    ERR: ' + e));
    r.failed.slice(0, 6).forEach((f) => console.log('    NET: ' + f));
  });
  console.log('\n---- EMPTY? (loaded clean but no visible render — may be idle/no-config) ----');
  console.log('  ' + (suspect.map((r) => r.name).join(', ') || '(none)'));
  console.log('\n---- OK (' + ok.length + ') ----');
  console.log('  ' + ok.map((r) => r.name).join(', '));
  // C4 — external CDN/lib refs (should be localized to /js/lib/; fonts are lower-risk)
  console.log('\n---- CDN/EXTERNAL refs (C4 — localize libs to /js/lib/) ----');
  const cdn = out.filter((r) => (r.dom.ext || []).some((h) => !/fonts\.g(oogleapis|static)/.test(h)));
  const fontsOnly = out.filter((r) => (r.dom.ext || []).length && !cdn.includes(r));
  if (!cdn.length) console.log('  ✓ no external LIBS (jquery/socket.io/matter/gsap/lottie) — all localized');
  cdn.forEach((r) => console.log('  ⚠ ' + r.name.padEnd(18) + (r.dom.ext || []).join(', ')));
  if (fontsOnly.length) console.log('  (fonts-only, low risk: ' + fontsOnly.map((r) => r.name).join(', ') + ')');
  console.log('\nsummary: ' + ok.length + ' OK / ' + suspect.length + ' empty? / ' + broken.length + ' broken  (of ' + out.length + ')');
})();
