// Extract every <script>...</script> body from the served HTML and try to
// parse it with new Function() — anything that throws SyntaxError signals
// a broken injection. We skip <script src="..."> tags since those are
// remote files we don't bake into HTML.

const http = require('http');

http.get('http://localhost:5285/', (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
    let idx = 0;
    let m;
    let bad = 0;
    while ((m = re.exec(html)) !== null) {
      idx++;
      const body = m[1];
      const line = html.substring(0, m.index).split('\n').length;
      try {
        new Function(body);
        console.log(`#${idx} line ${line}: OK (${body.length} bytes)`);
      } catch (e) {
        bad++;
        console.error(`#${idx} line ${line}: FAIL → ${e.message}`);
        // Print last 200 chars to spot the bad tail
        console.error('  tail:', JSON.stringify(body.slice(-200)));
      }
    }
    console.log(`\nTotal: ${idx} inline scripts, ${bad} failed`);
    process.exit(bad ? 1 : 0);
  });
}).on('error', e => { console.error('fetch failed:', e.message); process.exit(2); });
