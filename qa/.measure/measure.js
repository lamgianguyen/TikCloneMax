// Headless measurement of the overlay-card height bug — REAL numbers, not static guess.
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const log = [];
  // ── Part 1: each widget's NATURAL content height (at gốc iframe width 867) ──
  for (const name of ['coinmatch', 'coinjar']) {
    const page = await browser.newPage({ viewport: { width: 867, height: 1200 } });
    try {
      await page.goto(`${BASE}/widget/${name}?cid=1&preview=1`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(3500); // let Vue mount + socket settle
      const m = await page.evaluate(() => {
        const b = document.body, h = document.documentElement;
        // tallest visible element bottom = real content extent
        let maxBottom = 0, tallest = '';
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (r.height < 1 || cs.visibility === 'hidden' || cs.display === 'none') return;
          if (r.bottom > maxBottom) { maxBottom = r.bottom; tallest = el.tagName + '.' + (el.className || '').toString().slice(0, 30); }
        });
        return {
          bodyClientH: b.clientHeight, bodyScrollH: b.scrollHeight,
          htmlScrollH: h.scrollHeight,
          bodyMinH: getComputedStyle(b).minHeight,
          firstChildClass: (b.firstElementChild && b.firstElementChild.className || '').toString().slice(0, 60),
          firstChildH: b.firstElementChild ? Math.round(b.firstElementChild.getBoundingClientRect().height) : 0,
          firstChildMinH: b.firstElementChild ? getComputedStyle(b.firstElementChild).minHeight : '',
          contentExtent: Math.round(maxBottom), tallestEl: tallest,
        };
      });
      log.push(`WIDGET ${name} @867w/1200h: ` + JSON.stringify(m));
    } catch (e) { log.push(`WIDGET ${name}: ERR ${e.message}`); }
    await page.close();
  }
  // ── Part 2: try the full obsoverlays page → card vs iframe heights ──
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(6000); // bundle boot
    // try to reach obsoverlays: click sidebar "Lớp phủ" then "Thư viện lớp phủ"
    const clicked = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('a,button,div,span'));
      const lib = all.find((e) => (e.textContent || '').trim() === 'Thư viện lớp phủ' || /obsoverlays/i.test(e.getAttribute && e.getAttribute('href') || ''));
      if (lib) { lib.click(); return true; }
      const lp = all.find((e) => (e.textContent || '').trim() === 'Lớp phủ');
      if (lp) { lp.click(); return 'clicked-lopphu-only'; }
      return false;
    });
    await page.waitForTimeout(5000);
    const cards = await page.evaluate(() => {
      const out = {};
      ['coinmatch', 'coinjar'].forEach((n) => {
        const f = document.querySelector('iframe[src*="/widget/' + n + '"]');
        if (!f) { out[n] = 'iframe NOT FOUND'; return; }
        const card = f.closest('.greyBackgroundSection,.graphicSection,.obsOverlayOnPage');
        let innerContent = null;
        try { const d = f.contentDocument; if (d && d.body) innerContent = d.body.scrollHeight; } catch (e) {}
        out[n] = {
          iframeStyleH: f.style.height || '(none)',
          iframeRectH: Math.round(f.getBoundingClientRect().height),
          innerContentScrollH: innerContent,
          cardClass: card ? (card.className || '').toString().slice(0, 40) : '(no card)',
          cardRectH: card ? Math.round(card.getBoundingClientRect().height) : 0,
          gapCardMinusIframe: card ? Math.round(card.getBoundingClientRect().height - f.getBoundingClientRect().height) : 0,
        };
      });
      const cont = document.querySelector('.obsOverlayContainer');
      out._container = cont ? { alignItems: getComputedStyle(cont).alignItems } : 'NO .obsOverlayContainer (page not reached)';
      out._clicked = window.__nav || undefined;
      return out;
    });
    log.push('FULLPAGE clicked=' + clicked + ' → ' + JSON.stringify(cards));
    await page.close();
  } catch (e) { log.push('FULLPAGE: ERR ' + e.message); }

  console.log('\n===== MEASUREMENT RESULTS =====');
  console.log(log.join('\n'));
  await browser.close();
})();
