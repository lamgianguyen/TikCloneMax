// Startup-time sync of bundle fixtures from gốc TikFinity (tikfinity.zerody.one).
//
// The bundle's "Trình duyệt đồ họa quà tặng" (Gift Browser) calls
// `/api/getAllGifts` to populate its grid. Backend [routes/data.js] serves
// this from the static file at `downloads/api/getAllGifts`. The shipped file
// is a March 2026 snapshot with ~1500 entries; gốc keeps it fresh and now
// has ~3400+ entries. To match gốc behavior we fetch the latest version on
// every backend boot and overwrite the local file.
//
// Design choices:
//   - Fire-and-forget at startup: index.js calls syncAll() but does NOT await
//     it. Backend listens immediately on its port; if gốc is slow, the sync
//     finishes in the background. Bundle's first call to /api/getAllGifts
//     in the first ~3 seconds may still see old data — but that's fine, the
//     grid refreshes after the file lands.
//   - Validation: each fixture has a minimal shape check. If gốc returns
//     HTML (because of CDN error / region block / auth wall), we DROP the
//     response and keep the local backup instead of corrupting the static
//     file.
//   - Backup: first sync of the process creates a `.bak` copy if one doesn't
//     exist. Manual `.bak-YYYY-MM-DD` backups (per CLAUDE.md §5) are not
//     overwritten.
//   - No periodic refresh: user spec — "fetch lúc mở lên thôi". Restart
//     backend to re-fetch.

const fs = require('fs');
const path = require('path');
const logger = require('../logger').child({ scope: 'fixtures-sync' });

const GOC_BASE = process.env.UPSTREAM_HOST || 'https://tikpr0.com';
const TIMEOUT_MS = 20_000;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36';

// Fixtures verified public (no auth) on gốc as of 2026-05-21:
//   /api/getAllGifts        → 885KB, 3386 gifts (vs our shipped 397KB / 1518)
//   /api/getAllAnimations   → 32KB
// Verified NOT public (skip):
//   /api/getGlobalTransactions  → 403
//   /api/getAppConfig           → 404
//   /api/getSystemConfig        → 404
const FIXTURES = [
  {
    localPath: 'api/getAllGifts',
    upstream: '/api/getAllGifts',
    validate: (text) => text.length > 1000 && text.trimStart().startsWith('[') && /"id"\s*:\s*\d+/.test(text),
  },
  {
    localPath: 'api/getAllAnimations',
    upstream: '/api/getAllAnimations',
    validate: (text) => text.length > 100 && (text.trimStart().startsWith('{') || text.trimStart().startsWith('[')),
  },
  // ── Ported overlay widgets (2026-06-16) — keep the FEATURE CODE (.js) current ──
  // We sync ONLY the .js (the HTML shells are localized: gốc loads jQuery/socket.io
  // from CDN → hangs OBS; ours use /js/lib/* — must NOT be overwritten). SEASONAL
  // safety: when gốc removes/404s a file (e.g. World Cup ends) syncOne logs
  // "keeping local file" and does NOT overwrite, so our last-good copy survives.
  {
    // World Cup 2026 ticker. Live match data is a SEPARATE proxy (/api/worldcup/matches).
    localPath: 'vue/dist/widgets/world-cup-ticker/world-cup-ticker.js',
    upstream: '/vue/dist/widgets/world-cup-ticker/world-cup-ticker.js',
    validate: (text) => text.length > 5000 && /createWorldCupTicker|world-?cup/i.test(text),
  },
  {
    // Follower Counter. Data wired via tiktok-bridge `updateFollowerCount` broadcast.
    localPath: 'vue/dist/widgets/follower-counter/follower-counter.js',
    upstream: '/vue/dist/widgets/follower-counter/follower-counter.js',
    validate: (text) => text.length > 5000 && /createFollowerCounter|follower/i.test(text),
  },
  {
    // Countdown Goals (Jun16 bundle). Data wired via socket relay `countdownGoalsStatus`
    // (control page computes client-side → distributeEvent → backend relays to widget).
    localPath: 'vue/dist/widgets/countdown-goals/countdown-goals.js',
    upstream: '/vue/dist/widgets/countdown-goals/countdown-goals.js',
    validate: (text) => text.length > 5000 && /createCountdownGoals|countdown/i.test(text),
  },
  {
    // World Cup Penalty Battle (shootout) — overlay id `penaltybattle`, render fn
    // `createWorldCupPenaltyBattle`. Added in the 2026-06-19 bundle (post-Jun16).
    // Data wired via socket relay `penaltyShot` + `penaltyBoard` (control page
    // computes goal/save → distributeEvent → backend relays to widget).
    localPath: 'vue/dist/widgets/world-cup-penalty-battle/world-cup-penalty-battle.js',
    upstream: '/vue/dist/widgets/world-cup-penalty-battle/world-cup-penalty-battle.js',
    validate: (text) => text.length > 5000 && /createWorldCupPenaltyBattle|penalty/i.test(text),
  },
];

async function fetchUpstream(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
        Referer: GOC_BASE + '/',
      },
      signal: ctrl.signal,
    });
    if (!resp.ok) return { ok: false, status: resp.status, error: `HTTP ${resp.status}` };
    const text = await resp.text();
    return { ok: true, text, status: resp.status };
  } catch (err) {
    return { ok: false, status: 0, error: err.message || String(err) };
  } finally {
    clearTimeout(t);
  }
}

function ensureBackup(target) {
  // Create a one-time .bak (not the manual .bak-YYYY-MM-DD ones).
  const bak = target + '.bak';
  if (fs.existsSync(target) && !fs.existsSync(bak)) {
    try {
      fs.copyFileSync(target, bak);
    } catch (err) {
      logger.warn({ err: err.message, target }, 'backup copy failed');
    }
  }
}

async function syncOne(fixture, downloadsDir) {
  const target = path.join(downloadsDir, fixture.localPath);
  const url = GOC_BASE + fixture.upstream;
  const result = await fetchUpstream(url);

  if (!result.ok) {
    logger.warn({ url, status: result.status, error: result.error }, 'fetch failed — keeping local file');
    return false;
  }
  if (fixture.validate && !fixture.validate(result.text)) {
    logger.warn({ url, bytes: result.text.length }, 'invalid response shape — keeping local file');
    return false;
  }

  ensureBackup(target);
  try {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, result.text, 'utf8');
    logger.info({ file: fixture.localPath, bytes: result.text.length }, 'updated');
    return true;
  } catch (err) {
    logger.error({ err: err.message, file: fixture.localPath }, 'write failed');
    return false;
  }
}

async function syncAll(downloadsDir) {
  if (!downloadsDir || !fs.existsSync(downloadsDir)) {
    logger.warn({ downloadsDir }, 'downloads dir missing — skipping sync');
    return;
  }
  logger.info({ base: GOC_BASE, count: FIXTURES.length }, 'starting startup sync');
  const started = Date.now();
  const results = await Promise.all(FIXTURES.map((f) => syncOne(f, downloadsDir)));
  const ok = results.filter(Boolean).length;
  const elapsedMs = Date.now() - started;
  logger.info({ ok, total: FIXTURES.length, elapsedMs }, 'sync complete');
}

module.exports = { syncAll, FIXTURES };
