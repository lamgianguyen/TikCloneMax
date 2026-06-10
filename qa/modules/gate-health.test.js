// qa/modules/gate-health.test.js — L4 bundle-drift gate-health.
//
// PURPOSE (the durability differentiator):
//   When the user drops a NEW obfuscated bundle, this module re-checks that each
//   Gate's bundle-side ASSUMPTION (a string/symbol the gate's fix depends on)
//   STILL EXISTS. If a needle vanished → the bundle DRIFTED → that Gate's fix may
//   be broken → flag LOUDLY for review. A drift is a FAIL here (so it surfaces in
//   the failures list + FIXLOG), BUT the evidence makes clear this is DRIFT — the
//   app may still run, the fix just needs re-anchoring — NOT "app crashed".
//
// For every spec in ctx.registry.gates (each { id, gate, kind, needle, severity }):
//   kind = 'needleInDecompiled' → search DECOMPILED_MODULES, then DECOMPILED_APP
//          (some symbols live in app.js, some in modules.js — streamProfileId is
//          ONLY in app.js, so the modules-first/app-fallback order is load-bearing).
//   kind = 'needleInTemplates'  → search ALL backend-node/src/templates/*.txt.
//
//   Search = plain substring `indexOf(needle)` (NOT regex — needles like
//   `tts_api__`, `D435554D`, `distributeEvent` are literals).
//
//   needle FOUND  → PASS.
//   needle ABSENT (file(s) exist but no match) → FAIL with spec.severity → DRIFT.
//   target file(s) MISSING on disk → SKIP (run the RE pipeline, Gate 22).
//
// Dependency-free (fs + ctx.config + node builtins only). Reads files ONCE via a
// Map cache (each big ≤4MB file read a single time, then GC'd). Never throws out of
// run(): each spec is wrapped in try/catch so a thrown spec = one SKIP + continue.

const fs = require('fs');
const path = require('path');

const AREA = 'L4 Gate-drift';
const EVIDENCE_MAX = 200; // drift evidence carries a file path + symbol — give it room

const FIX_HINT_DRIFT =
  'open BUNDLE_UPDATE.md → re-grep decompiled for the new symbol, update the gate fix + this needle';

function clip(str) {
  const s = String(str == null ? '' : str).replace(/\s+/g, ' ').trim();
  return s.length > EVIDENCE_MAX ? s.slice(0, EVIDENCE_MAX - 1) + '…' : s;
}

function result(id, status, evidence, severity, gate, fixHint) {
  // Matches the harness result shape: { id, area, name, status, evidence, severity, gate, fixHint }.
  return { id, area: AREA, name: id, status, evidence, severity, gate, fixHint };
}

// Read a file ONCE and cache it. Map values: a string (contents) or null (missing
// on disk). Keeps memory sane — at most a handful of files are ever cached, each
// read a single time regardless of how many specs target it.
function readCached(cache, absPath) {
  if (cache.has(absPath)) return cache.get(absPath);
  let contents;
  try {
    contents = fs.readFileSync(absPath, 'utf8');
  } catch (_) {
    contents = null; // missing / unreadable — treat as "not present on disk"
  }
  cache.set(absPath, contents);
  return contents;
}

function countHits(haystack, needle) {
  // Plain substring counting (no regex — needles are literals). One linear pass.
  let count = 0;
  let from = 0;
  for (;;) {
    const idx = haystack.indexOf(needle, from);
    if (idx === -1) break;
    count += 1;
    from = idx + needle.length;
  }
  return count;
}

// List backend-node/src/templates/*.txt as absolute paths. Returns [] if the
// directory is missing (→ specs targeting templates will SKIP as artifact-missing).
function listTemplateFiles(repoRoot) {
  const dir = path.join(repoRoot, 'backend-node', 'src', 'templates');
  let entries;
  try {
    entries = fs.readdirSync(dir);
  } catch (_) {
    return [];
  }
  return entries
    .filter((f) => f.toLowerCase().endsWith('.txt'))
    .map((f) => path.join(dir, f));
}

const ARTIFACT_MISSING_EVIDENCE = 'decompiled artifact not present — run RE pipeline (Gate 22)';

// Resolve, for one spec, the ordered list of candidate files to search. The ORDER
// is load-bearing for needleInDecompiled: modules.js first, then app.js, because
// some symbols (e.g. streamProfileId) live ONLY in app.js.
function candidatePathsFor(spec, config) {
  if (spec.kind === 'needleInDecompiled') {
    return [config.DECOMPILED_MODULES, config.DECOMPILED_APP];
  }
  if (spec.kind === 'needleInTemplates') {
    return listTemplateFiles(config.REPO_ROOT);
  }
  return []; // unknown kind → handled by caller as a SKIP
}

// Run one spec. Returns a single result object (PASS / FAIL / SKIP). Never throws.
function checkSpec(spec, config, cache) {
  const gate = spec.gate;
  const sev = spec.severity || 'MEDIUM';

  if (spec.kind !== 'needleInDecompiled' && spec.kind !== 'needleInTemplates') {
    return result(
      spec.id,
      'SKIP',
      clip(`unknown spec.kind '${spec.kind}' — cannot resolve target`),
      sev,
      gate,
      'fix the registry entry: kind must be needleInDecompiled or needleInTemplates'
    );
  }

  const candidates = candidatePathsFor(spec, config);
  if (!candidates.length) {
    // No target files exist at all (e.g. templates dir absent, or empty).
    return result(spec.id, 'SKIP', ARTIFACT_MISSING_EVIDENCE, sev, gate, FIX_HINT_DRIFT);
  }

  // Walk candidates in order. Track which existed on disk so we can distinguish
  // "absent (drift)" from "artifact missing (skip)".
  let anyFileExisted = false;
  let totalHits = 0;
  let foundInFile = null;
  let lastExistingFile = null;

  for (const absPath of candidates) {
    const contents = readCached(cache, absPath);
    if (contents == null) continue; // file not on disk → not a drift signal
    anyFileExisted = true;
    lastExistingFile = absPath;
    const hits = countHits(contents, spec.needle);
    if (hits > 0) {
      totalHits += hits;
      if (foundInFile == null) foundInFile = absPath;
    }
  }

  if (!anyFileExisted) {
    // Every candidate is missing from disk → the RE artifact hasn't been produced.
    return result(spec.id, 'SKIP', ARTIFACT_MISSING_EVIDENCE, sev, gate, FIX_HINT_DRIFT);
  }

  if (totalHits > 0) {
    const where = path.basename(path.dirname(foundInFile)) + '/' + path.basename(foundInFile);
    return result(
      spec.id,
      'PASS',
      clip(`Gate ${gate} anchor '${spec.needle}' present (${totalHits} hits in ${where})`),
      sev,
      gate
    );
  }

  // File(s) exist but the needle is gone → the bundle changed. DRIFT, not a crash.
  const searched =
    spec.kind === 'needleInTemplates'
      ? 'templates/*.txt'
      : path.basename(path.dirname(lastExistingFile)) + '/' + path.basename(lastExistingFile);
  return result(
    spec.id,
    'FAIL',
    clip(
      `DRIFT: Gate ${gate} anchor '${spec.needle}' NOT FOUND in ${searched} → ` +
        'bundle changed, review/re-anchor this gate (app may still run)'
    ),
    sev,
    gate,
    FIX_HINT_DRIFT
  );
}

module.exports = {
  name: 'gate-health',
  area: AREA,
  needsBackend: false, // reads files only — runs even when the backend is down

  async run(ctx) {
    const config = ctx.config;
    const specs = (ctx.registry && ctx.registry.gates) || [];
    const cache = new Map(); // absPath → contents | null (each file read once)

    const results = [];
    const metrics = {
      gatesChecked: 0,
      drifted: [], // ids that FAILed (bundle assumption vanished)
      present: 0, // ids that PASSed
      missingArtifacts: 0, // ids SKIPped because the target file is absent
    };

    for (const spec of specs) {
      metrics.gatesChecked += 1;
      let r;
      try {
        r = checkSpec(spec, config, cache);
      } catch (e) {
        // A thrown spec = one SKIP (evidence = error) + continue. Never bubble out.
        r = result(
          (spec && spec.id) || 'gate.unknown',
          'SKIP',
          clip(`spec check threw: ${e && e.message ? e.message : e}`),
          (spec && spec.severity) || 'LOW',
          spec && spec.gate,
          'investigate gate-health spec — see qa/modules/gate-health.test.js'
        );
      }

      results.push(r);
      if (r.status === 'FAIL') metrics.drifted.push(r.id);
      else if (r.status === 'PASS') metrics.present += 1;
      else if (r.status === 'SKIP' && r.evidence === ARTIFACT_MISSING_EVIDENCE) {
        metrics.missingArtifacts += 1;
      }
    }

    return { results, metrics };
  },
};
