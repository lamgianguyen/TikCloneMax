// Measure ALL overlay cards, group by visual row, compare heights → find every mismatch.
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';

(async () => {
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('http://localhost:5285/tiktok/obsoverlays', { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(()=>{});
  await p.waitForTimeout(9000);
  // scroll the whole page slowly to trigger every IntersectionObserver lazy-load
  for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 500); await p.waitForTimeout(600); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(3000);

  const data = await p.evaluate(() => {
    // the flex container(s) holding cards
    const containers = Array.from(document.querySelectorAll('.obsOverlayContainer, .widgetsContainer'));
    const contInfo = containers.map(c => ({
      cls: (c.className||'').toString().slice(0,30),
      display: getComputedStyle(c).display,
      alignItems: getComputedStyle(c).alignItems,
      flexWrap: getComputedStyle(c).flexWrap,
      children: c.children.length,
    }));
    // every card = element that wraps a widget container/iframe
    const cards = Array.from(document.querySelectorAll('.obsOverlayOnPage, .greyBackgroundSection, .graphicSection'))
      .filter(el => el.querySelector('[id^="widget"], iframe'));
    const rows = {};
    cards.forEach(el => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const w = el.querySelector('[id^="widget"]');
      const f = el.querySelector('iframe');
      const name = (w ? w.id.replace('widget','').replace('Controls','') : (f ? (f.src.match(/widget\/([a-z-]+)/)||[])[1] : '')) || '?';
      const top = Math.round(r.top + window.scrollY);
      const rowKey = Math.round(top / 30) * 30; // bucket by ~row
      (rows[rowKey] = rows[rowKey] || []).push({
        name,
        cardH: Math.round(r.height),
        iframeH: f ? Math.round(f.getBoundingClientRect().height) : 0,
        iframeStyle: f ? (f.style.height||'-') : '-',
        alignSelf: cs.alignSelf,
        height: cs.height,
        isFlexChild: el.parentElement ? getComputedStyle(el.parentElement).display.includes('flex') : false,
        parent: el.parentElement ? (el.parentElement.className||'').toString().slice(0,22) : '?',
      });
    });
    return { contInfo, rows };
  });

  console.log('\n===== CONTAINERS =====');
  data.contInfo.forEach(c => console.log(JSON.stringify(c)));
  console.log('\n===== CARDS BY ROW (so chiều cao trong từng hàng) =====');
  Object.keys(data.rows).sort((a,b)=>a-b).forEach(k => {
    const row = data.rows[k];
    const hs = row.map(c => c.cardH);
    const max = Math.max(...hs), min = Math.min(...hs);
    const flag = (max - min) > 8 ? '  ⚠ LỆCH ' + (max-min) + 'px' : '  ✓ đều';
    console.log('\nROW y=' + k + flag);
    row.forEach(c => console.log('   ' + c.name.padEnd(20) + ' card=' + String(c.cardH).padStart(4) + ' iframe=' + String(c.iframeH).padStart(4) + ' alignSelf=' + c.alignSelf + ' flexChild=' + c.isFlexChild + ' parent=.' + c.parent));
  });
  await b.close();
})();
