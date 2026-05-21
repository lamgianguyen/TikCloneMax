#!/usr/bin/env node
// Merge multiple HAR captures → de-duplicated, filtered endpoint catalogue.
//
// What it does:
//   1. Reads every .har file passed as an arg (or every *.har in captures/).
//   2. Drops static asset requests (.css, .js, .png, etc.) — we want API
//      contracts, not bundle downloads.
//   3. Drops 3rd-party hosts (analytics, ads, fonts). Keeps tikfinity.* and
//      any host whose path looks like /api/.
//   4. Dedupes by (method, hostname, pathname). When a (method, path) repeats
//      in different HARs, we keep the LAST one (newest server state).
//   5. Groups remaining endpoints by category (api/, widget/, static, …).
//   6. Writes:
//      - routes-generated/<base>.js              Express router stubs
//      - routes-generated/<base>.shapes.md       human-readable index
//      - routes-generated/<base>.endpoints.json  raw entries for downstream tooling
//
// Run with extra heap if HARs are huge:
//   node --max-old-space-size=4096 scripts/decompile/merge-har.js
//
// Custom args:
//   node scripts/decompile/merge-har.js captures/a.har captures/b.har --out routes-generated/foo

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { _: [], out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') args.out = argv[++i];
    else if (a.startsWith('--out=')) args.out = a.slice(6);
    else args._.push(a);
  }
  return args;
}

const STATIC_EXT = new Set([
  '.css', '.js', '.mjs', '.map', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
  '.woff', '.woff2', '.ttf', '.otf', '.eot', '.wasm', '.mp3', '.mp4', '.webm', '.ogg', '.wav',
  '.pdf', '.zip', '.tar', '.gz',
]);

const ALLOWED_HOSTS = /(tikfinity|zerody|tikfinityserver)/i;
const DROP_HOSTS = /(google-analytics|doubleclick|googletagmanager|posthog|sentry|contentsquare|featurebase|cloudflareinsights|recaptcha|gstatic|fonts\.googleapis)/i;

function isStaticAsset(pathname) {
  const ext = path.extname(pathname).toLowerCase();
  return STATIC_EXT.has(ext);
}

function shouldKeep(url) {
  let parsed;
  try { parsed = new URL(url); } catch { return false; }
  if (DROP_HOSTS.test(parsed.hostname)) return false;
  if (isStaticAsset(parsed.pathname)) return false;
  // Keep API-ish: explicit /api/, /v1/, /v2/, /rest/, /odata/, /widget/<x>?cid=… or any allowed host
  if (parsed.pathname.includes('/api/')) return true;
  if (parsed.pathname.includes('/v1/') || parsed.pathname.includes('/v2/')) return true;
  if (parsed.pathname.includes('/rest/') || parsed.pathname.includes('/odata/')) return true;
  if (parsed.pathname.includes('/hub')) return true;
  if (parsed.pathname.includes('/socket.io/')) return true;
  if (parsed.pathname.includes('/widget/') && parsed.search) return true;
  return ALLOWED_HOSTS.test(parsed.hostname);
}

function safeJsonParse(text) {
  try { return JSON.parse(text); } catch { return null; }
}

function summarize(text, limit = 240) {
  if (!text) return '(empty)';
  const oneLine = String(text).replace(/\s+/g, ' ').trim();
  return oneLine.length > limit ? oneLine.slice(0, limit) + '...' : oneLine;
}

function categorize(pathname) {
  if (pathname.startsWith('/api/me') || pathname.startsWith('/api/loginChannel') || pathname.startsWith('/api/switchProfile')) return '01-identity';
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/v1/auth/') || pathname.startsWith('/api/v1/code/') || pathname.startsWith('/api/v1/flow/')) return '02-auth';
  if (pathname.startsWith('/api/getAppConfig') || pathname.startsWith('/api/init') || pathname.startsWith('/api/getSystemConfig') || pathname.startsWith('/api/getTranslations') || pathname.startsWith('/api/v2/sync')) return '03-config';
  if (pathname.startsWith('/api/updateSettings') || pathname.startsWith('/api/getOverlayConfig') || pathname.startsWith('/api/modules')) return '04-settings';
  if (pathname.startsWith('/api/rest/action')) return '05-actions';
  if (pathname.startsWith('/api/sounds') || pathname.startsWith('/api/rest/sound')) return '06-sounds';
  if (pathname.startsWith('/api/tts/')) return '07-tts';
  if (pathname.startsWith('/api/goals')) return '08-goals';
  if (pathname.startsWith('/api/points')) return '09-points';
  if (pathname.startsWith('/api/commands')) return '10-commands';
  if (pathname.startsWith('/api/widget/')) return '11-widget';
  if (pathname.startsWith('/api/odata/') || pathname.startsWith('/api/rest/transaction') || pathname.startsWith('/api/getAllGifts') || pathname.startsWith('/api/getAllAnimations') || pathname.startsWith('/api/getChannelEmotes') || pathname.startsWith('/api/usage/log')) return '12-data';
  if (pathname.startsWith('/api/notifications/')) return '13-notifications';
  if (pathname.startsWith('/api/backup/')) return '14-backup';
  if (pathname.startsWith('/api/reset/')) return '15-reset';
  if (pathname.startsWith('/api/seed')) return '16-seed';
  if (pathname.startsWith('/api/pro/')) return '17-pro';
  if (pathname.startsWith('/api/uploadFile') || pathname.startsWith('/api/uploadMedia') || pathname.startsWith('/api/uploads/')) return '18-upload';
  if (pathname.startsWith('/api/webhooks')) return '19-webhooks';
  if (pathname.startsWith('/api/obs/')) return '20-obs';
  if (pathname.startsWith('/api/import/')) return '21-import';
  if (pathname.startsWith('/api/tiktok/')) return '22-tiktok';
  if (pathname.startsWith('/widget/')) return '23-widget-html';
  if (pathname.startsWith('/socket.io/')) return '24-socket';
  if (pathname.startsWith('/api/')) return '99-other-api';
  return '99-other';
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  let harPaths = args._.filter(p => p.endsWith('.har'));
  if (harPaths.length === 0) {
    const capturesDir = 'captures';
    if (fs.existsSync(capturesDir)) {
      harPaths = fs.readdirSync(capturesDir)
        .filter(f => f.endsWith('.har'))
        .map(f => path.join(capturesDir, f));
    }
  }
  if (harPaths.length === 0) {
    console.error('No HAR files. Pass paths as args or drop *.har into captures/.');
    process.exit(1);
  }

  const seen = new Map();
  let totalEntries = 0;
  let kept = 0;

  for (const harPath of harPaths) {
    const sizeMb = (fs.statSync(harPath).size / 1024 / 1024).toFixed(1);
    process.stderr.write(`[merge-har] reading ${harPath} (${sizeMb} MB)…\n`);
    const har = JSON.parse(fs.readFileSync(harPath, 'utf8'));
    const entries = har.log?.entries || [];
    totalEntries += entries.length;
    for (const e of entries) {
      const url = e.request?.url || '';
      if (!shouldKeep(url)) continue;
      let parsed;
      try { parsed = new URL(url); } catch { continue; }
      const key = `${e.request.method} ${parsed.hostname}${parsed.pathname}`;
      seen.set(key, {
        method: e.request.method,
        host: parsed.hostname,
        pathname: parsed.pathname,
        query: parsed.search,
        status: e.response?.status,
        contentType: (e.response?.content?.mimeType || '').split(';')[0],
        bodyText: e.response?.content?.text || '',
        sample: { hadAuth: !!(e.request.headers || []).find(h => h.name.toLowerCase() === 'authorization') },
        seenAt: e.startedDateTime,
      });
    }
    kept = seen.size;
    process.stderr.write(`[merge-har]   running unique total = ${kept}\n`);
  }

  const outBase = args.out || `routes-generated/${path.basename(harPaths[0], '.har')}.merged`;
  fs.mkdirSync(path.dirname(outBase), { recursive: true });

  // Group by category
  const byCat = new Map();
  for (const entry of seen.values()) {
    const cat = categorize(entry.pathname);
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(entry);
  }
  const sortedCats = [...byCat.keys()].sort();

  // Write Express router file
  const routerLines = [
    '// AUTO-GENERATED from HAR — do not edit by hand.',
    '// Re-run: node scripts/decompile/merge-har.js',
    `// Source HARs: ${harPaths.map(p => path.basename(p)).join(', ')}`,
    `// Total raw entries: ${totalEntries}, unique kept: ${kept}`,
    '',
    "const express = require('express');",
    'const router = express.Router();',
    '',
  ];

  // Write shapes markdown
  const shapeLines = [
    '# HAR-derived endpoint catalogue',
    '',
    `Sources: ${harPaths.map(p => path.basename(p)).join(', ')}`,
    `Raw entries: ${totalEntries.toLocaleString()} → unique endpoints: ${kept}`,
    '',
    '## TL;DR',
    '',
    'Number | Category | Endpoints',
    ':---:|:---|---:',
  ];
  let i = 0;
  for (const cat of sortedCats) {
    shapeLines.push(`${++i} | ${cat} | ${byCat.get(cat).length}`);
  }
  shapeLines.push('');

  let routeNumber = 0;
  for (const cat of sortedCats) {
    const list = byCat.get(cat).sort((a, b) => a.pathname.localeCompare(b.pathname));
    shapeLines.push(`## ${cat} (${list.length} endpoint${list.length === 1 ? '' : 's'})`);
    shapeLines.push('');
    routerLines.push(`// ── ${cat} ─────────────────────────────────────────────────────`);

    for (const entry of list) {
      routeNumber++;
      const { method, host, pathname, status, contentType, bodyText, sample } = entry;
      const exprMethod = method.toLowerCase();

      shapeLines.push(`### ${routeNumber}. ${method} ${pathname}`);
      shapeLines.push(`- host: \`${host}\``);
      shapeLines.push(`- status: ${status} · content-type: ${contentType || '?'} · body bytes: ${bodyText.length}`);
      if (sample.hadAuth) shapeLines.push('- requires auth: yes (Bearer)');
      shapeLines.push(`- preview: \`${summarize(bodyText)}\``);
      shapeLines.push('');

      if (!['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(exprMethod)) continue;

      const parsed = safeJsonParse(bodyText);
      if (parsed !== null) {
        routerLines.push(`// #${routeNumber}  status=${status}  ct=${contentType}  bytes=${bodyText.length}`);
        routerLines.push(`router.${exprMethod}(${JSON.stringify(pathname)}, (req, res) => {`);
        routerLines.push(`  res.status(${status}).json(${JSON.stringify(parsed, null, 2)});`);
        routerLines.push('});');
        routerLines.push('');
      } else if (contentType?.startsWith('text/') || contentType === 'application/javascript' || contentType === '' || contentType === 'application/xml') {
        routerLines.push(`// #${routeNumber}  status=${status}  ct=${contentType}  bytes=${bodyText.length}`);
        routerLines.push(`router.${exprMethod}(${JSON.stringify(pathname)}, (req, res) => {`);
        routerLines.push(`  res.status(${status}).type(${JSON.stringify(contentType || 'text/plain')}).send(${JSON.stringify(bodyText)});`);
        routerLines.push('});');
        routerLines.push('');
      } else {
        routerLines.push(`// #${routeNumber}  SKIPPED (binary/empty) ${method} ${pathname} status=${status} ct=${contentType}`);
        routerLines.push('');
      }
    }
  }

  routerLines.push('module.exports = router;');

  const routerOut = `${outBase}.js`;
  const shapeOut = `${outBase}.shapes.md`;
  const jsonOut = `${outBase}.endpoints.json`;

  fs.writeFileSync(routerOut, routerLines.join('\n'), 'utf8');
  fs.writeFileSync(shapeOut, shapeLines.join('\n'), 'utf8');
  fs.writeFileSync(jsonOut, JSON.stringify([...seen.values()], null, 2), 'utf8');

  console.log(`[merge-har] ${harPaths.length} HAR files → ${totalEntries.toLocaleString()} entries → ${kept} unique endpoints across ${sortedCats.length} categories.`);
  console.log(`[merge-har] wrote ${routerOut}`);
  console.log(`[merge-har] wrote ${shapeOut}`);
  console.log(`[merge-har] wrote ${jsonOut}`);
}

main();
