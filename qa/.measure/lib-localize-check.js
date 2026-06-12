const { chromium } = require('playwright-core');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const BASE = 'http://localhost:5285';
// widget → global(s) the localized lib must define
const CHECK = {
  cannon: () => typeof window.Matter !== 'undefined',
  wheel: () => typeof window.TweenMax !== 'undefined',
  myactions: () => !!customElements.get('lottie-player'),
  songrequests: () => !!customElements.get('lottie-player'),
  streambuddies: () => typeof window.jQuery !== 'undefined' && typeof window.io !== 'undefined',
};
(async () => {
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  for (const [name, fn] of Object.entries(CHECK)) {
    const errs = [];
    const p = await b.newPage();
    p.on('pageerror', e => errs.push(e.message.slice(0,100)));
    p.on('requestfailed', r => { const u=r.url(); if(/\/js\/lib\//.test(u)) errs.push('LIB 404: '+u); });
    await p.goto(`${BASE}/widget/${name}/?cid=1&preview=1`, { waitUntil:'domcontentloaded', timeout:20000 }).catch(()=>{});
    await p.waitForTimeout(3500);
    let ok=false; try { ok = await p.evaluate(`(${fn.toString()})()`); } catch(e){ errs.push('eval: '+e.message.slice(0,60)); }
    console.log((ok && errs.length===0 ? '✓' : '✗') + ' ' + name.padEnd(16) + ' lib-global=' + ok + (errs.length?'  ERR: '+errs.slice(0,2).join(' | '):''));
    await p.close();
  }
  await b.close();
})();
