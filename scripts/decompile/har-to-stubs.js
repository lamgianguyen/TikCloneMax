#!/usr/bin/env node
// Convert a HAR capture (DevTools → Network → Save all as HAR) into Express
// route stubs. The captured response bodies become the stub payloads — the
// bundle will see the exact shape the real backend returned, so we don't have
// to reverse-engineer field names one by one.
//
// Usage:
//   node scripts/decompile/har-to-stubs.js <capture.har> [--out routes-generated/<name>.js]
//
// Output:
//   - routes-generated/<name>.js : Express router with one handler per unique
//     (method, path) pair seen in the HAR. Repeated calls collapse to the
//     last response (most recent state wins).
//   - routes-generated/<name>.shapes.md : Per-endpoint summary (method, path,
//     status, content-type, body size, first ~200 chars) for human review.

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') args.out = argv[++i];
    else if (a.startsWith('--out=')) args.out = a.slice(6);
    else args._.push(a);
  }
  return args;
}

function safeJsonParse(text) {
  try { return JSON.parse(text); } catch { return null; }
}

function toIdent(s) {
  return String(s || 'unnamed').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'unnamed';
}

function summarize(text, limit = 200) {
  if (!text) return '(empty)';
  const oneLine = String(text).replace(/\s+/g, ' ').trim();
  return oneLine.length > limit ? oneLine.slice(0, limit) + '...' : oneLine;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const harPath = args._[0];
  if (!harPath) {
    console.error('usage: node scripts/decompile/har-to-stubs.js <capture.har> [--out routes-generated/<name>.js]');
    process.exit(1);
  }

  const harRaw = fs.readFileSync(harPath, 'utf8');
  const har = JSON.parse(harRaw);
  const entries = har.log?.entries || [];

  // Dedupe by (method, path) — most recent wins.
  const map = new Map();
  for (const e of entries) {
    const req = e.request || {};
    const res = e.response || {};
    const url = new URL(req.url, 'http://placeholder');
    const key = `${req.method} ${url.pathname}`;
    map.set(key, {
      method: req.method,
      pathname: url.pathname,
      query: url.search,
      status: res.status,
      contentType: (res.content?.mimeType || '').split(';')[0],
      bodyText: res.content?.text || '',
    });
  }

  // Generate Express router file.
  const lines = [
    '// AUTO-GENERATED from HAR — do not edit by hand. Re-run',
    '// `node scripts/decompile/har-to-stubs.js <capture.har>` after recapturing.',
    "const express = require('express');",
    'const router = express.Router();',
    '',
  ];
  const shapes = ['# HAR-derived endpoint shapes', ''];

  const sorted = [...map.values()].sort((a, b) => a.pathname.localeCompare(b.pathname));
  for (const entry of sorted) {
    const { method, pathname, status, contentType, bodyText } = entry;
    const exprMethod = method.toLowerCase();
    if (!['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(exprMethod)) continue;

    const parsed = safeJsonParse(bodyText);
    if (parsed !== null) {
      lines.push(`router.${exprMethod}(${JSON.stringify(pathname)}, (req, res) => {`);
      lines.push(`  res.status(${status}).json(${JSON.stringify(parsed, null, 2)});`);
      lines.push('});');
    } else if (contentType?.startsWith('text/') || contentType === 'application/javascript') {
      lines.push(`router.${exprMethod}(${JSON.stringify(pathname)}, (req, res) => {`);
      lines.push(`  res.status(${status}).type(${JSON.stringify(contentType || 'text/plain')}).send(${JSON.stringify(bodyText)});`);
      lines.push('});');
    } else {
      lines.push(`// SKIPPED (binary/empty) ${method} ${pathname} status=${status} ct=${contentType}`);
    }
    lines.push('');

    shapes.push(`## ${method} ${pathname}`);
    shapes.push(`- status: ${status}`);
    shapes.push(`- content-type: ${contentType}`);
    shapes.push(`- body bytes: ${bodyText.length}`);
    shapes.push(`- preview: \`${summarize(bodyText)}\``);
    shapes.push('');
  }

  lines.push('module.exports = router;');

  const baseName = path.basename(harPath, path.extname(harPath));
  const outPath = args.out || path.join('routes-generated', `${toIdent(baseName)}.js`);
  const shapesPath = outPath.replace(/\.js$/, '.shapes.md');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  fs.writeFileSync(shapesPath, shapes.join('\n'), 'utf8');

  console.log(`[har-to-stubs] wrote ${sorted.length} routes → ${outPath}`);
  console.log(`[har-to-stubs] wrote shape summary → ${shapesPath}`);
}

main();
