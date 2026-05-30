// Background pre-warm of the `/tiktok-img-cache/*` in-memory cache.
//
// Sound Alerts trigger dropdown opens with ~50 cross-origin TikTok CDN gift
// thumbnails. The proxy at `/tiktok-img-cache/<host>/<path>` (see index.js)
// caches responses for 24h, but on a fresh backend boot the cache is empty —
// first dropdown open still pays the upstream fetch + WebP decode cost
// (~1-2s freeze in renderer).
//
// This module is fire-and-forget called from index.js right after
// `server.listen()`. It reads the `getAllGifts` fixture (already sorted by
// `diamond_count` ASC = cheap/popular gifts first), pulls the top N URLs from
// `image.url_list[0]`, and warms the cdnProxyCache via parallel `fetch()` with
// a concurrency limit. By the time the user opens the dropdown (~30-60s post
// boot), the cache is warm and the proxy route serves from memory — instant.
//
// Design choices (mirrors bundle-fixtures-sync.js Gate 21 pattern):
//   - Fire-and-forget. Backend listens immediately; warmup runs in background.
//   - One-shot. No setInterval, no retry. Restart backend to re-warm.
//   - Errors logged + swallowed per-URL. A failed fetch must NOT crash backend
//     or stop the rest of the batch.
//   - Cache key format MUST match the proxy route exactly so the proxy can
//     find the pre-warmed entry on dropdown open. See cacheKeyFor() below.
//   - SSRF guard: same host regex as the proxy route (*.tiktokcdn.com).

const fs = require('fs');
const path = require('path');

const PREWARM_COUNT = parseInt(process.env.TF_PREWARM_COUNT, 10) || 500;
const CONCURRENCY = 10;
const FETCH_TIMEOUT_MS = 10_000;
const TIKTOK_CDN_HOST_RE = /^[a-z0-9-]+\.tiktokcdn\.com$/i;
const TIKTOK_CDN_URL_RE = /^https?:\/\/[a-z0-9-]+\.tiktokcdn\.com\//i;
const USER_AGENT = 'TikMax-clone/1.0';

/**
 * Build the cache key that the `/tiktok-img-cache/*` proxy route uses.
 * Must match index.js exactly:
 *   cacheKey = 'tiktok-img/' + host + '/' + upstreamPath
 *
 * @param {string} urlString full https URL from gift.image.url_list[0]
 * @returns {{ cacheKey: string, host: string, upstreamPath: string } | null}
 *   null if URL is malformed or host is not a TikTok CDN.
 */
function cacheKeyFor(urlString) {
  let u;
  try {
    u = new URL(urlString);
  } catch (_err) {
    return null;
  }
  const host = u.hostname;
  if (!TIKTOK_CDN_HOST_RE.test(host)) return null;
  // u.pathname starts with '/'. Strip the leading slash to match how
  // express captures `(.+)` in the proxy route regex.
  const upstreamPath = u.pathname.replace(/^\/+/, '') + (u.search || '');
  if (!upstreamPath) return null;
  return {
    cacheKey: 'tiktok-img/' + host + '/' + upstreamPath,
    host,
    upstreamPath,
  };
}

/**
 * Minimal worker-pool concurrency limiter. No external deps.
 */
async function runWithConcurrency(items, concurrency, worker) {
  let idx = 0;
  async function next() {
    while (idx < items.length) {
      const i = idx++;
      await worker(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.max(1, concurrency) }, next);
  await Promise.all(workers);
}

async function fetchWithTimeout(url, timeoutMs) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(t);
  }
}

/**
 * Pre-warm the cdnProxyCache for the top N popular TikTok gift images.
 *
 * @param {string} frontendPath  config.FRONTEND_PATH — where downloads/api lives.
 * @param {Map<string, { body: Buffer, contentType: string, fetchedAt: number }>} cdnProxyCache
 *   The module-level Map from index.js. Passed in (DI) so we don't have to
 *   export internals.
 * @param {object} parentLogger  pino logger from index.js.
 */
async function prewarmTikTokImages(frontendPath, cdnProxyCache, parentLogger) {
  const logger = parentLogger && parentLogger.child
    ? parentLogger.child({ scope: 'tiktok-image-prewarm' })
    : parentLogger;

  if (!frontendPath) {
    logger.warn('[BOOT] tiktok-image-prewarm: no frontendPath — skipping');
    return;
  }
  if (!cdnProxyCache || typeof cdnProxyCache.set !== 'function') {
    logger.warn('[BOOT] tiktok-image-prewarm: invalid cdnProxyCache — skipping');
    return;
  }

  const giftsPath = path.join(frontendPath, 'api', 'getAllGifts');
  if (!fs.existsSync(giftsPath)) {
    logger.warn({ giftsPath }, '[BOOT] tiktok-image-prewarm: getAllGifts missing — skipping');
    return;
  }

  let gifts;
  try {
    const raw = fs.readFileSync(giftsPath, 'utf8');
    gifts = JSON.parse(raw);
  } catch (err) {
    logger.warn({ err: err.message, giftsPath },
      '[BOOT] tiktok-image-prewarm: failed to read/parse getAllGifts — skipping');
    return;
  }
  if (!Array.isArray(gifts) || gifts.length === 0) {
    logger.warn({ count: Array.isArray(gifts) ? gifts.length : 'not-array' },
      '[BOOT] tiktok-image-prewarm: getAllGifts empty or wrong shape — skipping');
    return;
  }

  // gifts are sorted by diamond_count ASC — cheap/popular first. Take top N.
  const slice = gifts.slice(0, PREWARM_COUNT);

  // Extract + validate URLs into descriptors. Skip already-cached + non-TikTok.
  const targets = [];
  for (const g of slice) {
    const url = g && g.image && Array.isArray(g.image.url_list) ? g.image.url_list[0] : null;
    if (!url || typeof url !== 'string') continue;
    if (!TIKTOK_CDN_URL_RE.test(url)) continue;
    const k = cacheKeyFor(url);
    if (!k) continue;
    if (cdnProxyCache.has(k.cacheKey)) continue; // already warm
    targets.push({ url, cacheKey: k.cacheKey });
  }

  const started = Date.now();
  logger.info(
    { requested: PREWARM_COUNT, candidates: targets.length, concurrency: CONCURRENCY },
    '[BOOT] tiktok-image-prewarm: starting',
  );

  let warmed = 0;
  let failed = 0;
  let processed = 0;

  await runWithConcurrency(targets, CONCURRENCY, async (item) => {
    try {
      const r = await fetchWithTimeout(item.url, FETCH_TIMEOUT_MS);
      if (!r.ok) {
        failed++;
        logger.warn({ url: item.url, status: r.status }, 'prewarm fetch non-2xx');
        return;
      }
      const body = Buffer.from(await r.arrayBuffer());
      const contentType = r.headers.get('content-type') || 'image/webp';
      cdnProxyCache.set(item.cacheKey, {
        body,
        contentType,
        fetchedAt: Date.now(),
      });
      warmed++;
    } catch (err) {
      failed++;
      logger.warn({ url: item.url, err: err && err.message ? err.message : String(err) },
        'prewarm fetch failed');
    } finally {
      processed++;
      if (processed % 50 === 0) {
        logger.info({ processed, warmed, failed, total: targets.length },
          '[BOOT] tiktok-image-prewarm: progress');
      }
    }
  });

  const elapsedMs = Date.now() - started;
  logger.info(
    { warmed, failed, total: targets.length, requested: PREWARM_COUNT, elapsedMs },
    `[BOOT] tiktok-image-prewarm: warmed ${warmed}/${targets.length} imgs in ${elapsedMs}ms`,
  );
}

module.exports = {
  prewarmTikTokImages,
  // exported for unit tests / future callers
  cacheKeyFor,
  runWithConcurrency,
};
