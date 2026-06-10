// qa/lib/config.js — resolved paths + thresholds for the TikMax QA harness.
//
// Mirrors backend-node/src/config.js DB resolution so we read the SAME db the
// running Electron backend writes to (the classic stale-172KB trap documented in
// FIXLOG / test-settings-chain.js). DO NOT hardcode .../tikfinity-desktop/tikfinity.db
// (missing the tikfinity-data/ segment) — that reads a stale file → false results.

const path = require('path');
const os = require('os');

const APPDATA = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
const DESKTOP_DATA = path.join(APPDATA, 'tikfinity-desktop');
const REPO_ROOT = path.resolve(__dirname, '..', '..'); // qa/lib -> qa -> TikCloneMax

// Resolve the real DB exactly like src/config.js: TIKMAX_DATA_DIR first, else
// %APPDATA%/tikfinity-desktop/tikfinity-data/tikfinity.db.
function resolveDbPath() {
  const envDir = process.env.TIKMAX_DATA_DIR;
  if (envDir) return path.join(envDir, 'tikfinity.db');
  return path.join(DESKTOP_DATA, 'tikfinity-data', 'tikfinity.db');
}

// Require a dependency that lives in backend-node/node_modules (ws, better-sqlite3,
// etc.) — the qa/ folder is dependency-free on purpose so it never drifts from the
// backend's installed versions.
function requireBackend(name) {
  const paths = [
    path.join(REPO_ROOT, 'backend-node', 'node_modules'),
    path.join(REPO_ROOT, 'backend-node'),
  ];
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(require.resolve(name, { paths }));
}

module.exports = {
  BASE_URL: process.env.TIKMAX_QA_BASE || 'http://localhost:5285',
  DB_PATH: resolveDbPath(),
  LOG_PATH: path.join(DESKTOP_DATA, 'backend-debug.log'),
  REPO_ROOT,
  WIDGET_DIR: path.join(REPO_ROOT, 'downloads', 'widget'),
  DECOMPILED_MODULES: path.join(REPO_ROOT, 'decompiled', 'modules', 'deobfuscated.js'),
  DECOMPILED_APP: path.join(REPO_ROOT, 'decompiled', 'app', 'deobfuscated.js'),
  TEST_STATUS: path.join(REPO_ROOT, 'TEST_STATUS.md'),
  FIXLOG: path.join(REPO_ROOT, 'FIXLOG.md'),
  RESULTS_DIR: path.join(REPO_ROOT, 'qa', 'results'),
  requireBackend,
  // Tunable budgets. A test FAILs when it exceeds its threshold.
  THRESHOLDS: {
    httpMs: 1500, // per-request budget
    socketDeliverMs: 3000, // event relay budget (controlpage/widget)
    backendRssMb: 700, // backend node RSS ceiling
    electronRssMb: 2000, // electron total (sum of electron.exe) ceiling
    cpuPct: 85, // sustained CPU ceiling per sample window
    renderStretchMs: 400, // overlay stretch budget (Gate 30d / STRETCH-DIAG)
  },
};
