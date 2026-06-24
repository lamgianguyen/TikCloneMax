const { chromium } = require('playwright-core');
const fs = require('fs');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';

(async () => {
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });

  // Mock SEASON-OVER: endpoint returns {matches:[]}
  await p.route('**/api/worldcup/matches', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ status: 200, matches: [] }) }));

  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type()+': '+m.text()); });

  // Load the standalone widget page (cid=1, no preview override → real poll path)
  await p.goto('http://localhost:5285/widget/worldcupticker.html?cid=1', {
    waitUntil: 'domcontentloaded', timeout: 25000 }).catch((e)=>errs.push('goto:'+e.message));

  // Wait for mount + first poll tick + transition (450ms)
  await p.waitForTimeout(6000);

  const r = await p.evaluate(() => {
    const out = { bodyBg: null, app: null, stage: null, cluster: null, ticker: null, visibleElements: [], anyText: null };
    const bcs = getComputedStyle(document.body);
    out.bodyBg = bcs.backgroundColor;

    const app = document.getElementById('app');
    if (app) {
      const r = app.getBoundingClientRect(), cs = getComputedStyle(app);
      out.app = { w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, textLen: (app.textContent||'').trim().length };
    }
    const grab = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      return {
        w: Math.round(r.width), h: Math.round(r.height),
        opacity: cs.opacity, display: cs.display, visibility: cs.visibility,
        bg: cs.backgroundColor, bgImage: cs.backgroundImage,
        border: cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor,
        boxShadow: cs.boxShadow.slice(0, 40),
        backdrop: cs.backdropFilter || cs.webkitBackdropFilter,
        classes: el.className,
      };
    };
    out.stage = grab('.stage');
    out.cluster = grab('.cluster');
    out.ticker = grab('.ticker');

    // Find ANY element that actually paints something visible (non-transparent bg, border, or text)
    const all = document.querySelectorAll('#app *');
    all.forEach((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const opEff = (function(node){ let o=1, n=node; while(n && n!==document.body){ o*=parseFloat(getComputedStyle(n).opacity||'1'); n=n.parentElement;} return o; })(el);
      const bg = cs.backgroundColor;
      const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
      const hasBorder = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none';
      const txt = (el.childNodes.length && Array.from(el.childNodes).some(n=>n.nodeType===3 && n.textContent.trim())) ? Array.from(el.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join('') : '';
      if (opEff > 0.01 && (hasBg || hasBorder || txt)) {
        out.visibleElements.push({
          tag: el.tagName, cls: (el.className||'').toString().slice(0,30),
          effOpacity: +opEff.toFixed(3), bg: hasBg ? bg : '-', border: hasBorder ? cs.borderTopWidth+' '+cs.borderTopColor : '-',
          text: txt.slice(0, 30), w: Math.round(r.width), h: Math.round(r.height),
        });
      }
    });
    out.anyText = (app && app.textContent || '').trim().slice(0, 80);
    return out;
  });

  // Screenshot over an opaque magenta backdrop to detect ANY non-transparent paint
  await p.addStyleTag({ content: 'html{background:#ff00ff !important}' });
  await p.waitForTimeout(300);
  const shotPath = 'c:/Users/nguyenlg/Documents/TikMax/TikCloneMax/qa/.measure/worldcup-empty.png';
  await p.screenshot({ path: shotPath });

  // Analyze screenshot: count non-magenta pixels (any real widget paint)
  const png = fs.readFileSync(shotPath);
  // crude: report file size; pixel analysis via canvas in-page over transparent bg
  const pixelScan = await p.evaluate(async () => {
    // Re-render onto a canvas is not trivial; instead report if any .ticker is painted
    const t = document.querySelector('.ticker');
    if (!t) return { ticker: 'none' };
    const cs = getComputedStyle(t);
    return { tickerOpacity: cs.opacity, tickerClass: t.className, tickerVisible: cs.opacity !== '0' && cs.visibility !== 'hidden' && cs.display !== 'none' };
  });

  console.log(JSON.stringify({ mocked: 'matches:[]', result: r, pixelScan, consoleErrs: errs.slice(0,15), shot: shotPath }, null, 1));
  await b.close();
})();
