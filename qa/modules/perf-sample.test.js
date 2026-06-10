// qa/modules/perf-sample.test.js — L0 Perf snapshot. Samples whatever is running
// (node.exe backend + electron.exe GUI), measures CPU% over a short window, and
// scans the backend log tail for render-stretch / crash / reload-churn signals.
//
// Best-effort by design: this module NEVER fails the suite on a sampling glitch.
//   • A process that isn't running         → SKIP (nothing to measure)
//   • A check that THROWS (tasklist/PS hiccup, non-Windows, log unreadable) → SKIP
//   • Only a REAL exceeded budget / log error / reload loop → FAIL
//
// run-all.js reads `run.perf = allMetrics['perf-sample']`, so the `metrics` object
// returned here IS the perf snapshot rendered into TEST_STATUS (results.js:69
// JSON.stringify). It must stay flat + JSON-serializable.
//
// Dependency-free: only ctx.perf (memByImage/cpuSample/tailLog/parseLogSignals),
// ctx.config (LOG_PATH, THRESHOLDS) and node builtins.

const AREA = 'Perf';
const EVIDENCE_MAX = 120; // keep evidence terse per the module contract

// Log-tail window: how many trailing lines to scan for perf signals. Wide enough
// to catch a recent crash/reload burst, cheap enough to read in one tail.
const LOG_TAIL_LINES = 600;

// Reload-churn ceiling within the log window. Above this, the backend is likely in
// a reload loop (reload-guard / location.reload churn — see CLAUDE.md reloadGuard).
const RELOAD_CHURN_MAX = 10;

// CPU sampling window. Blocks ~1.5s (helper sleeps); called exactly once.
const CPU_WINDOW_MS = 1500;

function clip(str) {
  const s = String(str == null ? '' : str).replace(/\s+/g, ' ').trim();
  return s.length > EVIDENCE_MAX ? s.slice(0, EVIDENCE_MAX - 1) + '…' : s;
}

function result(id, status, evidence, severity, gate, fixHint) {
  return { id, area: AREA, name: id, status, evidence, severity, gate, fixHint };
}

// Run one check in isolation. A thrown check = SKIP (not FAIL): perf sampling is
// best-effort and must never fail the suite on a sampling hiccup.
function safeCheck(id, fn, severity, gate) {
  try {
    return fn();
  } catch (e) {
    return result(id, 'SKIP', clip(`sampling error: ${e && e.message}`), severity || 'LOW', gate);
  }
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

// ── RAM checks ──────────────────────────────────────────────────────────────
// mem[image] = { rssMb, instances }. instances === 0 → not running → SKIP.
function backendRamCheck(mem, thresholds) {
  const node = mem['node.exe'];
  if (!node || !node.instances) {
    return result('perf.backend.ram', 'SKIP', 'backend node not running', 'HIGH', 'perf-sample');
  }
  const ok = node.rssMb < thresholds.backendRssMb;
  return result(
    'perf.backend.ram',
    ok ? 'PASS' : 'FAIL',
    `node.exe ${node.rssMb}MB / ${node.instances} proc (budget ${thresholds.backendRssMb}MB)`,
    'HIGH',
    'perf-sample',
    ok ? undefined : 'Backend RSS over budget — check for a leak (unbounded cache / listener churn)'
  );
}

function electronRamCheck(mem, thresholds) {
  const el = mem['electron.exe'];
  if (!el || !el.instances) {
    return result('perf.electron.ram', 'SKIP', 'electron not running', 'MEDIUM', 'perf-sample');
  }
  const ok = el.rssMb < thresholds.electronRssMb;
  return result(
    'perf.electron.ram',
    ok ? 'PASS' : 'FAIL',
    `electron.exe ${el.rssMb}MB total / ${el.instances} proc (budget ${thresholds.electronRssMb}MB)`,
    'MEDIUM',
    'perf-sample',
    ok ? undefined : 'Electron total RSS over budget — many windows/processes or a renderer leak'
  );
}

// ── CPU check ─────────────────────────────────────────────────────────────────
// cpu = { cpuPct, cores, windowMs }. cpuPct === null → could not sample → SKIP.
function cpuCheck(cpu, thresholds) {
  if (!cpu || cpu.cpuPct == null) {
    return result(
      'perf.cpu',
      'SKIP',
      clip((cpu && cpu.note) || 'cpu not sampled'),
      'MEDIUM',
      'perf-sample'
    );
  }
  const ok = cpu.cpuPct < thresholds.cpuPct;
  return result(
    'perf.cpu',
    ok ? 'PASS' : 'FAIL',
    `${cpu.cpuPct}% over ${cpu.windowMs}ms / ${cpu.cores} cores (budget ${thresholds.cpuPct}%)`,
    'MEDIUM',
    'perf-sample',
    ok ? undefined : 'Sustained high CPU — check for a hot loop / tight timer / runaway reconnect'
  );
}

// ── Log-signal checks ─────────────────────────────────────────────────────────
// sig = { stretchMs:[], errors, warns, reloads, errSamples:[] }.
function renderStretchCheck(sig, thresholds) {
  if (!sig.stretchMs.length) {
    return result(
      'perf.render.stretch',
      'SKIP',
      'no STRETCH-DIAG in recent log',
      'MEDIUM',
      'Gate 30d'
    );
  }
  const max = Math.max.apply(null, sig.stretchMs);
  const ok = max < thresholds.renderStretchMs;
  return result(
    'perf.render.stretch',
    ok ? 'PASS' : 'FAIL',
    `max ${max}ms over ${sig.stretchMs.length} samples (budget ${thresholds.renderStretchMs}ms)`,
    'MEDIUM',
    'Gate 30d',
    ok ? undefined : 'Overlay stretch over budget — stretchIframe re-eval thrash; see Gate 30d'
  );
}

// This is the crash/error detector: any ERROR/Uncaught/TypeError/ECONN/crash in
// the recent log → FAIL with the first samples as evidence.
function logErrorsCheck(sig) {
  if (sig.errors === 0) {
    return result('perf.log.errors', 'PASS', 'no errors in recent log', 'HIGH', 'perf-sample');
  }
  const evidence = sig.errSamples.slice(0, 2).join(' ⏎ ') || `${sig.errors} error line(s)`;
  return result(
    'perf.log.errors',
    'FAIL',
    clip(`${sig.errors} error(s): ${evidence}`),
    'HIGH',
    'perf-sample',
    'Backend logged error/crash — trace root cause from the sample, then re-run'
  );
}

function reloadChurnCheck(sig) {
  const ok = sig.reloads < RELOAD_CHURN_MAX;
  return result(
    'perf.log.reloadchurn',
    ok ? 'PASS' : 'FAIL',
    ok
      ? `${sig.reloads} reload signal(s) in window`
      : `reload churn ${sig.reloads} — possible reload loop`,
    'MEDIUM',
    'perf-sample',
    ok ? undefined : 'Reload loop — see reloadGuard / settings.restore chain (CLAUDE.md Gate 35)'
  );
}

// Build the flat, JSON-serializable snapshot. Empty stretch array → null (not NaN).
function buildMetrics(mem, cpu, sig) {
  const node = mem['node.exe'];
  const el = mem['electron.exe'];
  const stretch = sig && Array.isArray(sig.stretchMs) ? sig.stretchMs : [];
  const stretchMsMax = stretch.length ? Math.max.apply(null, stretch) : null;
  const stretchMsAvg = stretch.length
    ? round1(stretch.reduce((a, b) => a + b, 0) / stretch.length)
    : null;
  return {
    backendRssMb: node && node.instances ? node.rssMb : null,
    electronRssMb: el && el.instances ? el.rssMb : null,
    electronInstances: el ? el.instances : 0,
    cpuPct: cpu ? cpu.cpuPct : null,
    cores: (cpu && cpu.cores) || null,
    stretchMsMax,
    stretchMsAvg,
    logErrors: sig ? sig.errors : null,
    logReloads: sig ? sig.reloads : null,
  };
}

module.exports = {
  name: 'perf-sample',
  area: AREA,
  needsBackend: false, // sample whatever's running; individual checks self-SKIP if down

  async run(ctx) {
    const { perf, config } = ctx;
    const thresholds = config.THRESHOLDS;
    const results = [];

    // Sample once, defensively. Any sampler throwing degrades to an empty/neutral
    // value so the checks below SKIP gracefully rather than crash the module.
    let mem = {};
    try {
      mem = perf.memByImage(['node.exe', 'electron.exe']) || {};
    } catch (_) {
      mem = {};
    }

    let cpu = null;
    try {
      cpu = perf.cpuSample(CPU_WINDOW_MS); // blocks ~1.5s; called exactly once
    } catch (e) {
      cpu = { cpuPct: null, note: `cpu sample threw: ${e && e.message}` };
    }

    let sig = { stretchMs: [], errors: 0, warns: 0, reloads: 0, errSamples: [] };
    try {
      const lines = perf.tailLog(config.LOG_PATH, LOG_TAIL_LINES) || [];
      sig = perf.parseLogSignals(lines) || sig;
    } catch (_) {
      // keep the neutral default → log checks SKIP via safeCheck below
    }

    // RAM
    results.push(safeCheck('perf.backend.ram', () => backendRamCheck(mem, thresholds), 'HIGH', 'perf-sample'));
    results.push(safeCheck('perf.electron.ram', () => electronRamCheck(mem, thresholds), 'MEDIUM', 'perf-sample'));

    // CPU
    results.push(safeCheck('perf.cpu', () => cpuCheck(cpu, thresholds), 'MEDIUM', 'perf-sample'));

    // Log signals
    results.push(safeCheck('perf.render.stretch', () => renderStretchCheck(sig, thresholds), 'MEDIUM', 'Gate 30d'));
    results.push(safeCheck('perf.log.errors', () => logErrorsCheck(sig), 'HIGH', 'perf-sample'));
    results.push(safeCheck('perf.log.reloadchurn', () => reloadChurnCheck(sig), 'MEDIUM', 'perf-sample'));

    // Snapshot for TEST_STATUS. Guarded so a sampler glitch can't break it.
    let metrics;
    try {
      metrics = buildMetrics(mem, cpu, sig);
    } catch (e) {
      metrics = { error: clip(`metrics build failed: ${e && e.message}`) };
    }

    return { results, metrics };
  },
};
