# Gate 32 + Gate 33 — DRAFTS for CLAUDE.md

> Draft prepared by Librarian (2026-05-28). Commander reviews + commits to CLAUDE.md after Apothecary/Demolition-Sec approval. Pattern principle applies cross-Gate (see §end).

---

### Gate 32: Pre-warm cross-origin CDN cache on backend boot (M-001, 2026-05-28)

**Symptom:** Gift dropdown (Sound Alerts trigger) appears slow on first open post-boot (~1-2s freeze, WebP decode + network fetch). Subsequent opens instant. User: "tại sao cái quà gì đó chậm lần đầu?"

**Root cause:** Bundle's obfuscated `itemTemplate` (native render function) fires direct cross-origin `https://<N>.tiktokcdn.com/image/<path>.webp` fetches for ~50 gift thumbnails. When backend boots, `/tiktok-img-cache/*` proxy route has empty in-memory Map (`_cdnProxyCache`) — first dropdown open pays upstream network cost. Subsequent opens hit cache hit (24h TTL) → instant.

**Fix:** 
- **Module:** [`backend-node/src/services/tiktok-image-prewarm.js`](backend-node/src/services/tiktok-image-prewarm.js) (201 lines)
  - On startup, read `downloads/api/getAllGifts` fixture (3386 gifts, already sorted by `diamond_count` ASC = cheap/popular first)
  - Extract top 200 TikTok CDN URLs from `gift.image.url_list[0]`
  - Validate SSRF: must match `*.tiktokcdn.com` hostname regex
  - Fire 200 parallel fetches with concurrency limiter (10 workers) + 10s timeout per fetch
  - For each successful fetch: store in `_cdnProxyCache` with key `tiktok-img/<host>/<path>` (MUST match proxy route format exactly)
  - Fire-and-forget after `server.listen()` — does NOT block backend boot
  - Cache key format must match [`index.js:500`](backend-node/src/index.js#L500) proxy route `'tiktok-img/' + host + '/' + upstreamPath` exactly

- **Wired in:** [`backend-node/src/index.js:673-677`](backend-node/src/index.js#L673)
  ```js
  // Async pre-warm: fire-and-forget after server.listen()
  const { prewarmTikTokImages } = require('./services/tiktok-image-prewarm');
  prewarmTikTokImages(config.FRONTEND_PATH, _cdnProxyCache, logger).catch((err) => {
    logger.error({ err }, '[BOOT] prewarmTikTokImages uncaught');
  });
  ```

**Design decisions (mirror Gate 21 pattern — bundle-fixtures-sync):**
- Fire-and-forget: backend listen immediately, warmup parallel
- One-shot: no setInterval, no retry. User restart backend to re-warm
- Per-URL error handling: failed fetch logged but does NOT crash backend or stop batch
- Cache key format MUST match proxy route exactly (verified via unit test `cacheKeyFor()`)
- SSRF guard: same host regex `^[a-z0-9-]+\.tiktokcdn\.com$/i` as proxy route

**Verification:** 
```bash
# 1. Backend boot — watch logs:
npm --prefix backend-node start
# Look for: "[BOOT] tiktok-image-prewarm: starting { requested: 200, candidates: 186, concurrency: 10 }"
# End log: "[BOOT] tiktok-image-prewarm: warmed 186/186 imgs in 2340ms"

# 2. Verify cache keys format:
node -e "
const m = require('./backend-node/src/services/tiktok-image-prewarm.js');
const url = 'https://p19-sign.tiktokcdn.com/img/musically-malawi-go-live-gift@320x320.webp?x-expires=1719572400&x-signature=abc';
console.log(m.cacheKeyFor(url));
// → { cacheKey: 'tiktok-img/p19-sign.tiktokcdn.com/img/musically-malawi-go-live-gift@320x320.webp?x-expires=...', host: 'p19-sign.tiktokcdn.com', upstreamPath: 'img/musically-malawi-go-live-gift@320x320.webp?x-expires=...' }
"

# 3. DevTools Network tab — open Gift Browser dropdown:
# First time: CDN request has 'X-Cache: MISS' (fallthrough to upstream)
# Second time within 24h: 'X-Cache: HIT' from _cdnProxyCache (instant)
```

**Pattern principle:** 
> Tính năng obfuscated/native-render bypass our JS-layer patches (timing race, instance rebuild, template re-eval). Pre-populate in-memory caches at boot to eliminate first-hit latency. Cache key format MUST be exact — regex match bằng cách nào đó sẽ lệch giá trị key.

**Related:**
- Gate 33 — network-layer interception for same CDN (Electron main process)
- Gate 21 — bundle-fixtures-sync (similar fire-and-forget pattern for getAllGifts)

---

### Gate 33: Electron webRequest intercept for bundle-bypass CDN URLs (M-002, 2026-05-28)

**Symptom:** Even with Gate 32 pre-warm + blockScript URL-rewrite patches, gift image (itemTemplate) sometimes load từ upstream CDN trực tiếp (cross-origin request không bypass local proxy). User click Sound Alert → dropdown open but some images slow (không hit pre-warm cache). Console: `failed to fetch image blob from https://p19-sign.tiktokcdn.com/...` (cross-origin CORS or bypass).

**Root cause:** Bundle's obfuscated `itemTemplate` native render function fires `fetch()` directly to TikTok CDN (hardcoded URL string, không qua window.fetch — direct native code or separate fetch reference snapshot). Our blockScript patches window.fetch nhưng bundle đã capture fetch trong closure TRƯỚC patch load → patches không có hiệu lực. Timing race: Vue grid rebuild triggers template re-eval, obfuscated function snapshot lại fetch → bypass patches.

**Fix:**
- **Layer:** Electron main process [`electron/main.js:1121-1151`](electron/main.js#L1121)
  - Install `session.defaultSession.webRequest.onBeforeRequest` handler
  - Match URLs: `https://*.tiktokcdn.com/*` + `http://*.tiktokcdn.com/*`
  - For each matching request:
    - Validate hostname matches `^[a-z0-9-]+\.tiktokcdn\.com$/i` (SSRF guard)
    - Redirect to local proxy: `callback({ redirectURL: BACKEND_URL + '/tiktok-img-cache/<host><path><search>' })`
  - URL parse error → let request through (fail-open)

- **Code block** ([`electron/main.js:1133-1150`](electron/main.js#L1133)):
  ```javascript
  const TIKTOK_HOST_RE = /^[a-z0-9-]+\.tiktokcdn\.com$/i;
  const TIKTOK_CACHE_BASE = `${BACKEND_URL}/tiktok-img-cache`;
  sess.webRequest.onBeforeRequest(
      { urls: ['https://*.tiktokcdn.com/*', 'http://*.tiktokcdn.com/*'] },
      (details, callback) => {
          try {
              const u = new URL(details.url);
              if (!TIKTOK_HOST_RE.test(u.hostname)) {
                  return callback({});  // not a TikTok CDN host — let it through
              }
              const redirectURL = `${TIKTOK_CACHE_BASE}/${u.hostname}${u.pathname}${u.search}`;
              return callback({ redirectURL });
          } catch (err) {
              // URL parse failed — let request through unchanged.
              return callback({});
          }
      }
  );
  console.log('[Electron] TikTok CDN intercept installed → ' + TIKTOK_CACHE_BASE + '/*');
  ```

**Design:**
- Hook runs BEFORE renderer sees request — intercept at browser protocol layer (lower than blockScript patches)
- 307 redirect to local proxy → browser cache (Chromium HTTP disk cache) + backend Map cache
- Cache-Control header từ backend (24h TTL) → Electron persist cache across restarts
- Fail-open: URL parse error → let request through unchanged (graceful degradation)
- SSRF-safe: hostname regex exact match `*.tiktokcdn.com` — cannot be redirected to internal IPs

**Verification:**
```bash
# 1. Check webRequest handler installed at Electron boot:
# Terminal console: "[Electron] TikTok CDN intercept installed → http://localhost:5285/tiktok-img-cache/*"

# 2. DevTools Network tab (when app running):
# Filter by "tiktokcdn"
# Expected: ALL *.tiktokcdn.com requests → 307 Temporary Redirect
# Location: http://localhost:5285/tiktok-img-cache/p19-sign.tiktokcdn.com/img/...
# Response status: 307 (from Electron main process layer)

# 3. Restart Electron, re-open Gift dropdown:
# Images should instant-load from disk cache (Chromium HTTP cache):
# DevTools Network → Response Headers: "cache-control: max-age=86400, public"
# "X-Cache: HIT" (from backend _cdnProxyCache if post-recent restart, else from disk cache)

# 4. Verify SSRF guard:
# Test malformed URL: DevTools Console in Electron → fetch('https://127.0.0.1:5285/...') 
# If request happens to have tiktokcdn-like URL, verify it still redirects to proxy, NOT to localhost
# (In practice, bundle only fires tiktokcdn.com domains so this is low-risk, but regex provides defense-in-depth)
```

**Related to blockScript patches:**
- Complements (not replaces) [`blockScript.txt::tfHandleTtsTikfinityUser`](backend-node/src/templates/blockScript.txt) + `tfMockFetch` patches for HTTP-layer interception
- webRequest intercepts at NETWORK layer → catches ALL client requests (native code, fetch snapshot, direct XHR)
- blockScript patches HTTP layer → fallback if webRequest not available or request already in-flight

**Anti-pattern avoided:**
- ❌ Patch Electron's fetch API globally — invasive, incompatible with preload script
- ❌ Install handler in renderer context — Electron webRequest is main-process-only by design
- ❌ Wildcard redirect without hostname validation — SSRF vector (could redirect to localhost, internal IPs)

**Pattern principle:**
> Khi bundle obfuscation làm JS-level patches fragile (timing race, snapshot closure, native code), di-chuyển patch DOWN the stack:
> - blockScript patches HTML-time (DOM render, Vue init)
> - middleware patches response-time (HTTP headers, body transform)
> - **Electron webRequest patches network-time (before Chromium socket layer)**
>
> Lower layers catch bypass attempts từ obfuscated code. webRequest ở Electron main process là **hard boundary** — không có cách bypass nó từ renderer.

---

## Pattern principle (cross-Gate 32 + 33)

### Problem: Bundle obfuscation defeats JS-level patches

Khi bundle's native render function (itemTemplate) hoặc native SDK code fire network requests TRỰC TIẾP (không qua window.fetch, không via event system), các patch ở blockScript level không có hiệu lực:

1. **Timing race:** Bundle capture fresh fetch reference TRƯỚC blockScript IIFE load → closure cache ref → bypass patches
2. **Instance rebuild:** Vue grid rebuild trigger native template re-eval → function re-snapshot → đè lên old patched state
3. **Native code path:** Obfuscated string concatenation build URL → fire native fetch không qua monkey-patch boundary

### Solution: Stack layering (from high to low trust boundary)

| Layer | Patch point | Effectiveness | Blast radius |
|---|---|---|---|
| **blockScript (HTML-time)** | DOM/Vue init, window.* monkey-patch | **NONE** for native code bypass | Low (JS-only) |
| **middleware (response-time)** | HTTP headers, response body | **Partial** (late rewrite if body cached) | Medium (affects all responses) |
| **webRequest (network-time)** | Before socket, catch ALL requests | **COMPLETE** (hard boundary) | High (main process level) |

### Implementation order for robust coverage

1. **START:** blockScript patches (`tfHandleTtsTikfinityUser`, `tfMockFetch`, URL-rewrite IIFE)
   - Handles 95% of cases (bundle uses window.fetch + events)
   - Fire-and-forget, no boot latency

2. **LAYER 2:** Pre-cache heavy assets (Gate 32 prewarm)
   - Don't wait for network on first hit
   - Boot-time cost justified by UX (dropdown instant-open)

3. **LAYER 3:** Electron webRequest intercept (Gate 33)
   - Catch native render function bypass
   - Network-layer enforcement, renderer cannot workaround

### When to apply multi-layer fix

Apply this pattern khi:
- ✅ Asset bypass confirmed (Network tab hiện cross-origin request to upstream CDN)
- ✅ blockScript patch verified working in isolation (test via Console `fetch()` mock)
- ✅ But bundle still fire upstream request (obfuscated code path)
- ✅ UX cost dari first-hit latency significant (user-visible freeze, not just speed)

**NOT** for:
- ❌ Speculative pre-caching (user may never open feature)
- ❌ Tiny assets (<10KB) where network+decode negligible
- ❌ Frequently-changing data (e.g., live leaderboard) — cache staleness breaks UX

---

Generated: 2026-05-28
Last reviewed: (pending Apothecary + Demolition-Sec)
