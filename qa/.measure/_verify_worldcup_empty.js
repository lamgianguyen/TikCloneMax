// Adversarial re-verification of the WorldCup season-over hide claim.
// Mocks {matches:[]}, loads widget, inspects DOM + does REAL pixel decode of
// the magenta-backed screenshot using sharp/canvas in-page.
const { chromium } = require('playwright-core');
const fs = require('fs');
const EXE = 'C:/Users/nguyenlg/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';
const W = 1280, H = 720;

(async () => {
  const b = await chromium.launch({ executablePath: EXE, headless: true });
  const p = await b.newPage({ viewport: { width: W, height: H } });

  let mockHits = 0;
  await p.route('**/api/worldcup/matches', (r) => {
    mockHits++;
    return r.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ status: 200, matches: [] }) });
  });

  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  p.on('pageerror', (e) => errs.push('PAGEERR: ' + (e.message || '').slice(0, 120)));

  await p.goto('http://localhost:5285/widget/worldcupticker.html?cid=1',
    { waitUntil: 'networkidle', timeout: 25000 }).catch((e) => errs.push('goto:' + e.message));
  await p.waitForTimeout(6500); // mount + poll + 450ms transition margin

  const dom = await p.evaluate(() => {
    const out = { visibleElements: [], ticker: null, app: null, bodyBg: getComputedStyle(document.body).backgroundColor };
    const app = document.getElementById('app');
    if (app) { const r = app.getBoundingClientRect(), cs = getComputedStyle(app);
      out.app = { w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, textLen: (app.textContent || '').trim().length }; }
    const t = document.querySelector('.ticker');
    if (t) { const cs = getComputedStyle(t);
      out.ticker = { opacity: cs.opacity, visibility: cs.visibility, display: cs.display, classes: t.className,
        rect: (() => { const r = t.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; })() }; }
    // Any element that effectively paints (eff opacity>0.01 AND has opaque bg/border/text)
    document.querySelectorAll('#app *').forEach((el) => {
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      let o = 1, n = el; while (n && n !== document.body) { o *= parseFloat(getComputedStyle(n).opacity || '1'); n = n.parentElement; }
      if (o <= 0.01) return;
      const bg = cs.backgroundColor;
      const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
      const hasBorder = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none';
      const hasImg = cs.backgroundImage && cs.backgroundImage !== 'none';
      const txt = Array.from(el.childNodes).filter(x => x.nodeType === 3).map(x => x.textContent.trim()).join('');
      if (hasBg || hasBorder || hasImg || txt) out.visibleElements.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 24), effOp: +o.toFixed(3), bg: hasBg ? bg : '-', img: hasImg ? cs.backgroundImage.slice(0, 30) : '-', txt: txt.slice(0, 20) });
    });
    return out;
  });

  // Put an OPAQUE magenta backdrop behind everything, screenshot, then decode pixels.
  await p.addStyleTag({ content: 'html{background:#ff00ff !important}' });
  await p.waitForTimeout(250);
  const shot = 'c:/Users/nguyenlg/Documents/TikMax/TikCloneMax/qa/.measure/_worldcup-empty-verify.png';
  await p.screenshot({ path: shot, clip: { x: 0, y: 0, width: W, height: H } });

  // REAL pixel decode: load the PNG into a canvas inside the page, read ImageData,
  // count pixels that are NOT magenta (tolerance for AA/jpeg-like rounding).
  const buf = fs.readFileSync(shot);
  const b64 = buf.toString('base64');
  const pix = await p.evaluate(async ({ b64, W, H }) => {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = 'data:image/png;base64,' + b64; });
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, W, H).data;
    let total = d.length / 4, nonMagenta = 0; const samples = [];
    for (let i = 0; i < d.length; i += 4) {
      const R = d[i], G = d[i + 1], B = d[i + 2];
      // magenta = (255,0,255); tolerance 8 per channel
      if (Math.abs(R - 255) > 8 || G > 8 || Math.abs(B - 255) > 8) {
        nonMagenta++;
        if (samples.length < 8) { const px = (i / 4) % W, py = Math.floor((i / 4) / W); samples.push({ x: px, y: py, rgb: [R, G, B] }); }
      }
    }
    return { total, nonMagenta, samples, imgDecodedW: img.naturalWidth, imgDecodedH: img.naturalHeight };
  }, { b64, W, H });

  console.log(JSON.stringify({
    mockHits, errs,
    domTickerOpacity: dom.ticker && dom.ticker.opacity,
    domTickerClass: dom.ticker && dom.ticker.classes,
    domAppTextLen: dom.app && dom.app.textLen,
    domAppBg: dom.app && dom.app.bg,
    visibleElementsCount: dom.visibleElements.length,
    visibleElements: dom.visibleElements,
    pixelTotal: pix.total, pixelNonMagenta: pix.nonMagenta, pixelSamples: pix.samples,
    shotFileBytes: buf.length, png: shot,
  }, null, 1));
  await b.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
