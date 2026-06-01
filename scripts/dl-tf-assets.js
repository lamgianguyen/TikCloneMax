// Download all graphic-overlay assets from assets.tikfinity.com to local,
// so the clone is self-contained (no runtime dependency on tikfinity.com).
// Mapping: webcam widget -> /webcam, overlay -> /overlay, talking -> /banner.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const WIDGETS = { webcam: 'webcam', overlay: 'overlay', talking: 'banner' };

function extractFiles(widgetFile) {
  const txt = fs.readFileSync(path.join(ROOT, 'downloads', 'widget', widgetFile), 'utf8');
  const set = new Set();
  const re = /\$\{assetsUrl\}\/([A-Za-z0-9._-]+\.(?:webm|png))/g;
  let m;
  while ((m = re.exec(txt))) set.add(m[1]);
  return [...set];
}

(async () => {
  let ok = 0, skip = 0, fail = 0;
  const fails = [];
  for (const [widget, base] of Object.entries(WIDGETS)) {
    const files = extractFiles(widget);
    const dir = path.join(ROOT, 'downloads', 'tf-assets', base);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`[${base}] ${files.length} files -> ${dir}`);
    for (let i = 0; i < files.length; i += 10) {
      const batch = files.slice(i, i + 10);
      await Promise.all(batch.map(async (f) => {
        const out = path.join(dir, f);
        if (fs.existsSync(out) && fs.statSync(out).size > 0) { skip++; return; }
        try {
          const r = await fetch(`https://assets.tikfinity.com/${base}/${f}`);
          if (!r.ok) { fail++; fails.push(`${base}/${f} HTTP ${r.status}`); return; }
          fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
          ok++;
        } catch (e) { fail++; fails.push(`${base}/${f} ${e.message}`); }
      }));
    }
  }
  console.log(`\nDONE ok=${ok} skip=${skip} fail=${fail}`);
  if (fails.length) console.log('FAILS (first 40):\n' + fails.slice(0, 40).join('\n'));
})();
