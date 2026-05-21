#!/usr/bin/env node
// One-shot reverse-engineering pipeline.
//
//   node scripts/decompile/run-all.js
//
// Does everything from zero:
//   1. Decompile downloads/combo/{app,modules}.js with webcrack
//   2. Merge captures/*.har into routes-generated/tikfinity.zerody.four.merged.*
//   3. Re-generate docs/API_CONTRACTS.md + docs/COMPLETE_ENDPOINT_INDEX.md
//
// Idempotent — re-run after bundle update or new HAR captures.
//
// Flags:
//   --skip-decompile   Skip webcrack step (saves ~60s if bundle unchanged)
//   --skip-merge       Skip HAR merge step (saves seconds if HAR set unchanged)
//   --skip-docs        Skip doc regeneration
//
// Pre-requisites:
//   - Node 20+
//   - downloads/combo/{app,modules}.js present (the bundle)
//   - captures/*.har (one or more HAR captures from Chrome DevTools)

const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');

const args = new Set(process.argv.slice(2));

function step(title, fn) {
  console.log(`\n▶ ${title}`);
  console.log('  ' + '─'.repeat(60));
  const start = Date.now();
  try {
    fn();
    console.log(`  ✓ done in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  } catch (err) {
    console.error(`  ✗ FAILED: ${err.message}`);
    process.exitCode = 1;
  }
}

function run(cmd, opts = {}) {
  const env = { ...process.env, ...(opts.env || {}) };
  const result = spawnSync(cmd[0], cmd.slice(1), {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });
  if (result.status !== 0) throw new Error(`exit ${result.status}`);
}

function ensure(file, hint) {
  if (!fs.existsSync(file)) {
    throw new Error(`missing ${file} — ${hint}`);
  }
}

console.log('TikFinity bundle reverse-engineering pipeline');
console.log('═'.repeat(64));

// Step 1: webcrack decompile
if (!args.has('--skip-decompile')) {
  step('Step 1/3: webcrack decompile (≈60s)', () => {
    ensure('downloads/combo/modules.js', 'put the obfuscated Vue bundle here');
    ensure('downloads/combo/app.js', 'put the obfuscated TikTok bridge here');
    fs.mkdirSync('decompiled', { recursive: true });

    console.log('  decompiling modules.js (Vue 3 app, ~1.3 MB)…');
    run(['npx', '--yes', 'webcrack', 'downloads/combo/modules.js', '-o', 'decompiled/modules']);

    console.log('  decompiling app.js (TikTok bridge, ~3.9 MB)…');
    run(['npx', '--yes', 'webcrack', 'downloads/combo/app.js', '-o', 'decompiled/app']);

    const modSize = fs.statSync('decompiled/modules/deobfuscated.js').size;
    console.log(`  → decompiled/modules/deobfuscated.js ${(modSize / 1024).toFixed(0)} KB readable`);
  });
} else {
  console.log('\n▶ Step 1/3: webcrack decompile (SKIPPED via --skip-decompile)');
}

// Step 2: merge HAR
if (!args.has('--skip-merge')) {
  step('Step 2/3: merge HAR captures (≈30s for ~500 MB)', () => {
    const harFiles = fs.existsSync('captures') ?
      fs.readdirSync('captures').filter(f => f.endsWith('.har')) : [];
    if (harFiles.length === 0) {
      throw new Error('no *.har files under captures/ — capture HAR from Chrome DevTools first');
    }
    console.log(`  reading ${harFiles.length} HAR file(s)…`);
    run(['node', '--max-old-space-size=8192',
         'scripts/decompile/merge-har.js',
         '--out', 'routes-generated/tikfinity.zerody.four.merged']);
  });
} else {
  console.log('\n▶ Step 2/3: merge HAR (SKIPPED via --skip-merge)');
}

// Step 3: regenerate docs
if (!args.has('--skip-docs')) {
  step('Step 3/3: regenerate docs (≈3s)', () => {
    ensure('routes-generated/tikfinity.zerody.four.merged.endpoints.json',
           'run step 2 first');
    run(['node', 'scripts/decompile/extract-contracts.js']);
    run(['node', 'scripts/decompile/extract-full-index.js']);
  });
} else {
  console.log('\n▶ Step 3/3: regenerate docs (SKIPPED via --skip-docs)');
}

console.log('\n═'.repeat(64));
console.log('Pipeline complete.');
console.log('');
console.log('Outputs:');
console.log('  decompiled/modules/deobfuscated.js     — Vue source readable');
console.log('  decompiled/app/node_modules/           — bridge modules split');
console.log('  routes-generated/*.merged.{js,md,json} — 276 endpoint catalogue');
console.log('  docs/API_CONTRACTS.md                  — 26 main endpoint shapes');
console.log('  docs/COMPLETE_ENDPOINT_INDEX.md        — all 276 endpoints index');
console.log('');
console.log('Next: open docs/README.md to navigate.');
