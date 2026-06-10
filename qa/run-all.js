#!/usr/bin/env node
// qa/run-all.js — orchestrator for the TikMax self-maintaining QA harness.
//
//   node qa/run-all.js            # full sweep (non-destructive)
//   node qa/run-all.js --mutating # also run state-changing checks (coinjar reset…)
//   node qa/run-all.js --only api,socket   # subset of modules
//   node qa/run-all.js --json     # machine output only
//
// Exit code: 0 = no FAIL · 1 = ≥1 FAIL · 2 = harness error (backend down counts as
// graceful SKIP, NOT exit 2 — modules self-skip when backend is down).
//
// ── MODULE CONTRACT (every qa/modules/*.js implements this) ──────────────────
//   module.exports = {
//     name: 'api-contract',
//     area: 'L1 API',
//     needsBackend: true,            // if true and backend down → all SKIP
//     async run(ctx) {               // ctx = { config, http, connectSocket, perf, registry, log, backendUp, mutating }
//       return {
//         results: [ { id, area, name, status:'PASS'|'FAIL'|'SKIP', evidence, severity, gate, fixHint } ],
//         metrics: { ...optional },
//       };
//     },
//   };
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
const fs = require('fs');

const config = require('./lib/config');
const makeHttp = require('./lib/http');
const socket = require('./lib/socket');
const perf = require('./lib/perf');
const results = require('./lib/results');
const registry = require('./registry');

// Module load order. Missing files degrade to SKIP (so the harness runs even
// before the team finishes a module).
const MODULES = [
  'api-contract.test.js',
  'socket-relay.test.js',
  'widget-smoke.test.js',
  'perf-sample.test.js',
  'gate-health.test.js',
  'live-id-finder.js',
  // Functional end-to-end chains (need backend up → SKIP whole module when down).
  'chain-settings.test.js',
  'chain-tts.test.js',
  'chain-points.test.js',
  'chain-goals.test.js',
  'chain-coinjar.test.js',
];

function parseArgs(argv) {
  const a = { mutating: false, json: false, only: null };
  for (const arg of argv.slice(2)) {
    if (arg === '--mutating') a.mutating = true;
    else if (arg === '--json') a.json = true;
    else if (arg.startsWith('--only')) {
      const v = arg.includes('=') ? arg.split('=')[1] : argv[argv.indexOf(arg) + 1];
      a.only = (v || '').split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return a;
}

function runId() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(
    d.getMinutes()
  )}${p(d.getSeconds())}`;
}

function logFactory(json) {
  return (...args) => {
    if (!json) console.log(...args);
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const log = logFactory(args.json);
  const started = Date.now();
  const startedAt = results.ymd(new Date());

  const http = makeHttp(config.BASE_URL);
  const backendUp = await http.up();

  log(`\n🤖 TikMax QA sweep — ${startedAt}`);
  log(`   base=${config.BASE_URL}  backend=${backendUp ? 'UP ✅' : 'DOWN ⚠️ (live checks SKIP)'}`);
  log(`   db=${config.DB_PATH}`);
  log(`   mode=${args.mutating ? 'MUTATING' : 'read-only'}${args.only ? `  only=${args.only}` : ''}\n`);

  const ctx = {
    config,
    http,
    connectSocket: socket.connect,
    perf,
    registry,
    log,
    backendUp,
    mutating: args.mutating,
  };

  const allResults = [];
  const allMetrics = {};

  for (const file of MODULES) {
    const short = file.replace(/\.(test\.)?js$/, '');
    if (args.only && !args.only.some((o) => short.includes(o))) continue;

    const modPath = path.join(__dirname, 'modules', file);
    if (!fs.existsSync(modPath)) {
      allResults.push({ id: `mod.${short}`, area: short, status: 'SKIP', evidence: 'module file not built yet', severity: 'LOW' });
      log(`   ⏭️  ${short}: (not built yet)`);
      continue;
    }

    let mod;
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      mod = require(modPath);
    } catch (e) {
      allResults.push({ id: `mod.${short}`, area: short, status: 'SKIP', evidence: `load error: ${e.message}`, severity: 'HIGH' });
      log(`   ⏭️  ${short}: load error — ${e.message}`);
      continue;
    }

    if (mod.needsBackend && !backendUp) {
      allResults.push({ id: `mod.${short}`, area: mod.area || short, status: 'SKIP', evidence: 'backend down', severity: 'LOW' });
      log(`   ⏭️  ${mod.name || short}: backend down → SKIP`);
      continue;
    }

    const t0 = Date.now();
    try {
      const out = await mod.run(ctx);
      const rs = (out && out.results) || [];
      rs.forEach((r) => allResults.push(r));
      if (out && out.metrics) allMetrics[mod.name || short] = out.metrics;
      const pass = rs.filter((r) => r.status === 'PASS').length;
      const fail = rs.filter((r) => r.status === 'FAIL').length;
      const skip = rs.filter((r) => r.status === 'SKIP').length;
      log(`   ${fail ? '❌' : '✅'} ${mod.name || short}: ${pass} pass / ${fail} fail / ${skip} skip  (${Date.now() - t0}ms)`);
    } catch (e) {
      allResults.push({ id: `mod.${short}.crash`, area: mod.area || short, status: 'FAIL', evidence: `module threw: ${e.message}`, severity: 'HIGH' });
      log(`   ❌ ${mod.name || short}: THREW — ${e.message}`);
    }
  }

  const summary = {
    pass: allResults.filter((r) => r.status === 'PASS').length,
    fail: allResults.filter((r) => r.status === 'FAIL').length,
    skip: allResults.filter((r) => r.status === 'SKIP').length,
    total: allResults.length,
  };

  const run = {
    runId: runId(),
    startedAt,
    backendUp,
    durationMs: Date.now() - started,
    mode: args.mutating ? 'mutating' : 'read-only',
    results: allResults,
    perf: allMetrics['perf-sample'] || null,
    metrics: allMetrics,
    summary,
  };

  const persisted = results.persist(config, run);

  if (args.json) {
    process.stdout.write(JSON.stringify(run, null, 2) + '\n');
  } else {
    log(`\n── Summary ──────────────────────────────`);
    log(`   PASS ${summary.pass}   FAIL ${summary.fail}   SKIP ${summary.skip}   (${run.durationMs}ms)`);
    if (summary.fail) {
      log(`\n   Failures:`);
      allResults.filter((r) => r.status === 'FAIL').forEach((r) => log(`   ❌ [${r.severity || '?'}] ${r.id} — ${(r.evidence || '').slice(0, 140)}`));
    }
    log(`\n   📝 TEST_STATUS.md ${persisted.testStatus ? 'updated' : 'FAILED'} · FIXLOG.md ${persisted.fixlog ? 'updated' : 'FAILED'} · json=${path.basename(persisted.jsonFile || '?')}`);
    if (persisted.errors.length) log(`   ⚠️ persist errors: ${persisted.errors.join('; ')}`);
    log('');
  }

  process.exit(summary.fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('[qa] HARNESS ERROR:', e && e.stack ? e.stack : e);
  process.exit(2);
});
