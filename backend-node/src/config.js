// Centralised config — every other module pulls from here.
// Ports / hosts / paths all live in one place so we can override them via env
// when the Electron parent spawns the backend with a custom PORT etc.

const path = require('path');
const fs = require('fs');

const BACKEND_PORT = Number(process.env.PORT) || Number(process.env.TIKMAX_BACKEND_PORT) || 5285;

// Bundle root. Walks up from src/ to find the sibling `downloads/` directory
// regardless of whether we're packaged or run from source.
function resolveFrontendPath() {
  const candidates = [
    path.resolve(__dirname, '..', '..', 'downloads'),  // dev: backend-node/src → ../../downloads
    path.resolve(__dirname, '..', 'downloads'),        // packaged: resources/backend-node/src → ../downloads
    path.resolve(process.resourcesPath || '', 'downloads'),
  ];
  for (const c of candidates) {
    try { if (fs.existsSync(path.join(c, 'index.html'))) return c; } catch { /* keep looking */ }
  }
  // Fall back to the dev path so error messages point somewhere sensible.
  return candidates[0];
}

// User data dir. Electron passes APPDATA via env when it spawns us; if we're
// run standalone (npm start), fall back to a local data/ folder so the
// developer doesn't pollute their real Electron profile.
function resolveDataDir() {
  if (process.env.TIKMAX_DATA_DIR) return process.env.TIKMAX_DATA_DIR;
  if (process.env.APPDATA) return path.join(process.env.APPDATA, 'tikfinity-desktop');
  return path.resolve(__dirname, '..', 'data');
}

const DATA_DIR = resolveDataDir();
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch { /* exists */ }

module.exports = {
  PORT: BACKEND_PORT,
  HOST: process.env.HOST || '127.0.0.1',
  FRONTEND_PATH: resolveFrontendPath(),
  DATA_DIR,
  DB_PATH: path.join(DATA_DIR, 'tikfinity.db'),

  // Cloud auth gate. Local-only by default; renderer overrides via env if needed.
  AUTH_HOST: process.env.TIKFINITY_AUTH_HOST || 'http://127.0.0.1:5194',

  // JWT secret used for bundle's wsAuthToken + featurebase token. Match the C#
  // backend's hardcoded dev secret so existing sessions stay valid across the
  // migration. In prod this should come from env.
  JWT_SECRET: process.env.TIKMAX_JWT_SECRET || 'tikfinity-clone-dev-secret-do-not-use-in-prod',
  JWT_ISSUER: 'tikfinity-local',
  JWT_AUDIENCE: 'tikfinity-bundle',

  // TikTok signing service API key — when present, the bridge uses Eulerstream
  // paid tier (50k req/month). Missing → free tier (rate limited).
  SIGN_API_KEY: process.env.SIGN_API_KEY || '',

  // Defaults baked into the bundle's auth bridge so /api/me has something to
  // hand back when the DB is brand new.
  DEFAULT_CHANNEL_ID: 1,
  DEFAULT_CHANNEL_NAME: 'user',

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
