// Measure 2 — pin the coinmatch content box vs iframe height (Layer B confirm).
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const log = [];

  // ── widget content box (deepest visible content), longer wait ──
  for (const name of ['coinmatch', 'coinjar']) {
    const page = await browser.newPage({ viewport: { width: 867, height: 660 } });
    try {
      await page.goto(`${BASE}/widget/${name}/?cid=1&preview=1`, { waitUntil: 'load', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(6000);
      const m = await page.evaluate(() => {
        function visibleExtent() {
          let top = 1e9, bottom = 0, n = 0;
          document.querySelectorAll('body *').forEach((el) => {
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            if (r.width < 2 || r.height < 2 || cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return;
            // skip the full-screen wrapper itself (min-h-screen) — we want the CONTENT
            if (r.height >= window.innerHeight - 2) return;
            if (r.top < top) top = r.top;
            if (r.bottom > bottom) bottom = r.bottom;
            n++;
          });
          return { top: Math.round(top), bottom: Math.round(bottom), boxH: Math.round(bottom - top), n };
        }
        const body = document.body;
        const wrap = body.firstElementChild;
        return {
          innerTextLen: (body.innerText || '').trim().length,
          bodyScrollH: body.scrollHeight,
          wrapMinH: wrap ? getComputedStyle(wrap).minHeight : '',
          wrapH: wrap ? Math.round(wrap.getBoundingClientRect().height) : 0,
          contentBox: visibleExtent(),
        };
      });
      log.push(`WIDGET ${name} @867x660: ` + JSON.stringify(m));
    } catch (e) { log.push(`WIDGET ${name}: ERR ${e.message}`); }
    await page.close();
  }

  // ── full obsoverlays page: scroll cards into view → measure iframe/card/gap ──
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(6000);
    await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('a,button,div,span'));
      const lib = all.find((e) => (e.textContent || '').trim() === 'Thư viện lớp phủ');
      if (lib) lib.click();
      else { const lp = all.find((e) => (e.textContent || '').trim() === 'Lớp phủ'); if (lp) lp.click(); }
    });
    await page.waitForTimeout(3000);
    // click sub-menu again in case first click only opened the section
    await page.evaluate(() => {
      const lib = Array.from(document.querySelectorAll('a,button,div,span')).find((e) => (e.textContent || '').trim() === 'Thư viện lớp phủ');
      if (lib) lib.click();
    });
    await page.waitForTimeout(4000);
    // scroll the page/container to trigger IntersectionObserver lazy-load
    for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(800); }
    await page.waitForSelector('iframe[src*="/widget/"]', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(4000);
    const cards = await page.evaluate(() => {
      const out = {};
      const frames = Array.from(document.querySelectorAll('iframe[src*="/widget/"]'));
      out._iframeCount = frames.length;
      out._srcs = frames.map((f) => (f.src.match(/widget\/([a-z-]+)/) || [])[1]).filter(Boolean).slice(0, 12);
      ['coinmatch', 'coinjar'].forEach((n) => {
        const f = document.querySelector('iframe[src*="/widget/' + n + '"]');
        if (!f) { out[n] = 'NOT FOUND'; return; }
        const card = f.closest('.greyBackgroundSection,.graphicSection,.obsOverlayOnPage');
        let inner = null, innerExtent = null;
        try {
          const d = f.contentDocument;
          if (d && d.body) {
            inner = d.body.scrollHeight;
            let b = 0; d.querySelectorAll('body *').forEach((el) => { const r = el.getBoundingClientRect(); const cs = d.defaultView.getComputedStyle(el); if (r.height < 2 || cs.display === 'none' || cs.visibility === 'hidden') return; if (r.height >= d.defaultView.innerHeight - 2) return; if (r.bottom > b) b = r.bottom; });
            innerExtent = Math.round(b);
          }
        } catch (e) { inner = 'cross-origin'; }
        out[n] = {
          iframeStyleH: f.style.height || '(none)',
          iframeRectH: Math.round(f.getBoundingClientRect().height),
          innerBodyScrollH: inner,
          innerContentExtent: innerExtent,
          cardRectH: card ? Math.round(card.getBoundingClientRect().height) : 0,
          GAP_card_minus_iframe: card ? Math.round(card.getBoundingClientRect().height - f.getBoundingClientRect().height) : '?',
          GAP_iframe_minus_content: (typeof inner === 'number') ? f.getBoundingClientRect().height - inner : '?',
        };
      });
      const cont = document.querySelector('.obsOverlayContainer');
      out._alignItems = cont ? getComputedStyle(cont).alignItems : 'no container';
      return out;
    });
    log.push('FULLPAGE → ' + JSON.stringify(cards, null, 1));
    await page.close();
  } catch (e) { log.push('FULLPAGE ERR: ' + e.message); }

  console.log('\n===== MEASUREMENT 2 =====\n' + log.join('\n'));
  await browser.close();
})();
