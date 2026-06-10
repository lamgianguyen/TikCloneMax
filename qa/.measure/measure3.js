const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
(async () => {
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('http://localhost:5285/tiktok/obsoverlays', { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(()=>{});
  await p.waitForTimeout(9000);
  for (let i=0;i<6;i++){ await p.mouse.wheel(0,350); await p.waitForTimeout(700); }
  await p.waitForTimeout(4000);
  const r = await p.evaluate(() => {
    const out = { cards: [] };
    const cards = Array.from(document.querySelectorAll('.obsOverlayOnPage, .greyBackgroundSection, .graphicSection'))
      .filter(el => el.querySelector('[id^="widget"], iframe'));
    cards.slice(0,6).forEach(el => {
      const cs = getComputedStyle(el);
      const w = el.querySelector('[id^="widget"]');
      const f = el.querySelector('iframe');
      out.cards.push({
        widget: w ? w.id : (f ? (f.src.match(/widget\/([a-z-]+)/)||[])[1] : '?'),
        cardH: Math.round(el.getBoundingClientRect().height),
        alignSelf: cs.alignSelf,
        parentFlex: el.parentElement ? getComputedStyle(el.parentElement).display + '/' + getComputedStyle(el.parentElement).alignItems + ' .' + (el.parentElement.className||'').toString().slice(0,24) : '?',
        iframeH: f ? Math.round(f.getBoundingClientRect().height) : 0,
      });
    });
    return out;
  });
  console.log('\n===== VERIFY (after align-self fix) =====');
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
