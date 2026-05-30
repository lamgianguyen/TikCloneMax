# Scout-Cache-Consistency Report
## Mission M-2026-05-28-002-tiktok-cdn-intercept

---

## summary

**CONSISTENT** -- all three components produce identical cache keys for the same TikTok CDN URL, for all URLs currently present in getAllGifts.

One minor **edge-case gap** exists for query strings (see edge-cases). Currently harmless: zero URLs in the fixture carry query strings.

---

## key-construction-per-component

### Component 1: Pre-warm service

File: backend-node/src/services/tiktok-image-prewarm.js lines 44-62

Function cacheKeyFor(urlString) -- exact algorithm:

```js
function cacheKeyFor(urlString) {
  let u;
  try { u = new URL(urlString); } catch (_err) { return null; }
  const host = u.hostname;  // URL spec lowercases hostname automatically
  if (!TIKTOK_CDN_HOST_RE.test(host)) return null;
  // Strip leading slash; append query string (u.search = ?... or empty)
  // NOTE: query string IS included in cache key
  const upstreamPath = u.pathname.replace(/^\/+/, "") + (u.search || "");
  if (!upstreamPath) return null;
  return {
    cacheKey: "tiktok-img/" + host + "/" + upstreamPath,
    host,
    upstreamPath,
  };
}
```

Output format: tiktok-img/<host>/<path-no-leading-slash>[?query]

Sample: https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp
  host         = p16-webcast.tiktokcdn.com
  upstreamPath = img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp
  cacheKey     = tiktok-img/p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp

---

### Component 2: Proxy route

File: backend-node/src/index.js lines 546-554

Route: app.get(/^\/tiktok-img-cache\/([^/]+)\/(.+)$/, ...)

```js
const host = req.params[0];          // ([^/]+) capture
const upstreamPath = req.params[1];  // (.+) capture
// Express matches req.path -- query string STRIPPED before regex match
// SSRF: validate host vs /^[a-z0-9-]+\.tiktokcdn\.com$/i
cdnProxyFetch(req, res, "tiktok-img/" + host + "/" + upstreamPath, ...);
// cdnProxyFetch (lines 500-524):
//   _cdnProxyCache.get(cacheKey)   <- lookup in shared Map
//   _cdnProxyCache.set(cacheKey, { body, contentType, fetchedAt })
```

Output format: tiktok-img/<host>/<path-only, no query>

Sample: GET /tiktok-img-cache/p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp
  cacheKey = tiktok-img/p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp

Match with pre-warm (no-query case): IDENTICAL.

---

### Component 3: Electron intercept

File: electron/main.js lines 1133-1151

Constants (lines 38-39):
  BACKEND_PORT = 5285 (default; env TIKMAX_BACKEND_PORT overrides)
  BACKEND_URL  = http://localhost:5285
  TIKTOK_CACHE_BASE = BACKEND_URL + /tiktok-img-cache

```js
// Steps:
// 1. u = new URL(details.url)       -- lowercases hostname per URL spec
// 2. Validate u.hostname vs /^[a-z0-9-]+\.tiktokcdn\.com$/i
// 3. redirectURL = TIKTOK_CACHE_BASE + "/" + u.hostname + u.pathname + u.search
// 4. callback({ redirectURL })        -- Electron redirects browser
// 5. Browser GETs: GET /tiktok-img-cache/<host>/<path>[?query]
//    Express extracts host + path-only upstreamPath
//    -> cacheKey = tiktok-img/<host>/<path-only>
```

Redirect URL path: /tiktok-img-cache/<host><pathname>[?query]
Resulting cacheKey after Express routing: tiktok-img/<host>/<path-only>

Sample: https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp
  redirectURL = http://localhost:5285/tiktok-img-cache/p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp
  cacheKey    = tiktok-img/p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp

Match with pre-warm (no-query case): IDENTICAL.

---

## sample-url-trace

First 5 URLs from downloads/api/getAllGifts image.url_list[0] (sorted diamond_count ASC, confirmed via grep):

| # | Upstream URL | Pre-warm cacheKey | Proxy route cacheKey | All match? |
|---|---|---|---|---|
| 1 | https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp | tiktok-img/p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp | identical | YES |
| 2 | https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/34207c50c472435d7d582ef5c1ca8ff2.png~tplv-obj.webp | tiktok-img/p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/34207c50c472435d7d582ef5c1ca8ff2.png~tplv-obj.webp | identical | YES |
| 3 | https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/b199d028d5beb081fe16edcf77db0830.png~tplv-obj.webp | tiktok-img/p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/b199d028d5beb081fe16edcf77db0830.png~tplv-obj.webp | identical | YES |
| 4 | https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/4a68411b3e92fc2bf68d458d5f906b74.png~tplv-obj.webp | tiktok-img/p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/4a68411b3e92fc2bf68d458d5f906b74.png~tplv-obj.webp | identical | YES |
| 5 | https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/802a21ae29f9fae5abe3693de9f874bd~tplv-obj.webp | tiktok-img/p16-webcast.tiktokcdn.com/img/maliva/webcast-va/802a21ae29f9fae5abe3693de9f874bd~tplv-obj.webp | identical | YES |

All 5 traces are fully consistent. The Electron intercept redirect URL for each sample resolves to the same cacheKey as the pre-warm entry.

---

## edge-cases

| Scenario | Pre-warm | Proxy route | Intercept | Aligned? | Notes |
|---|---|---|---|---|---|
| **Query string present** (e.g. host/foo.webp?v=2) | Appends u.search; key = tiktok-img/host/foo.webp?v=2 | Express strips query before regex; req.params[1] = foo.webp; key = tiktok-img/host/foo.webp | Appends u.search to redirectURL; Express strips on arrival; proxy key = tiktok-img/host/foo.webp | **MISALIGNED** | Pre-warm key includes query; proxy key excludes it. Pre-warmed entry unreachable. Zero-impact today: no query-string URLs in fixture. |
| **Tilde ~ literal** (e.g. ~tplv-obj.webp) | new URL() preserves ~ (RFC 3986 unreserved, never percent-encoded by browsers) | Chromium does not encode ~; Express receives literal | new URL() preserves ~ | ALIGNED | No encode/decode discrepancy. |
| **Trailing slash** (e.g. host/img/) | u.pathname=/img/; strip leading / -> img/; key ends / | req.params[1] captures img/ | u.pathname=/img/; redirect ends /img/ | ALIGNED | Trailing slash preserved consistently. |
| **Host uppercase** (hypothetical) | new URL() lowercases per URL spec | Path segment lowercase (Chromium normalizes before redirect) | new URL() lowercases u.hostname | ALIGNED | All three normalize to lowercase. |
| **Multiple subdomains** (p16-webcast vs p19-common) | Different host -> distinct key prefix | Different req.params[0] -> distinct prefix | Different u.hostname -> distinct path segment | ALIGNED | No collision. |
| **No query string** (universal current case) | u.search empty; path-only key | path-only key | u.search empty; path-only redirect | ALIGNED | All 3386+ gift URLs match this. |
| **Empty path** (https://host.tiktokcdn.com) | upstreamPath empty after strip; returns null; skipped | regex (.+) needs >=1 char; no match; 404 | pathname = /; redirect = base/host/; route 404 | ALIGNED (all reject) | Consistent rejection; no cache pollution. |

---

## inconsistencies

### Inconsistency 1 -- Query strings cause key divergence between pre-warm and proxy route

**Severity:** LOW
**Current real-world impact:** NONE.

Confirmed via grep of downloads/api/getAllGifts: zero URLs carry query strings.
Every image.url_list[0] is a path-only URL with no query parameters.

Divergence mechanics:
- tiktok-image-prewarm.js line 55: upstreamPath appends (u.search or empty) -- query IS part of key.
- index.js line 548: req.params[1] from Express path regex -- query NOT included (matches req.path).
- electron/main.js line 1143: u.pathname + u.search in redirectURL -- query passes to browser,
  but Express strips before route matching -- proxy key is path-only.

Failure scenario: if TikTok CDN begins serving gift images at signed/parameterized URLs
(e.g. foo.webp?x-expires=1234&x-signature=abc), pre-warm entries would be stored under
a key the proxy route can never reconstruct. Every request would miss cache.

---

## recommendations

### Recommendation 1 -- Fix query-string key alignment (LOW priority, precautionary)

One-line change in backend-node/src/services/tiktok-image-prewarm.js, function cacheKeyFor, line 55:

```js
// BEFORE (line 55):
const upstreamPath = u.pathname.replace(/^\/+/, "") + (u.search || "");

// AFTER:
const upstreamPath = u.pathname.replace(/^\/+/, "");
// Query string removed from cache key -- matches what Express extracts.
// prewarmTikTokImages uses item.url (full URL) for the actual CDN fetch,
// so the upstream request remains correct; only the key changes.
```

No other files need modification.

If query params are ever load-bearing for CDN content variants, a separate follow-up should also
update index.js line 553 to append req.query to the upstream fetch URL. That is a separate concern.

### Recommendation 2 -- No action needed for other edge cases

Tilde character, trailing slash, host case normalization, multiple subdomains, and
empty path rejection are all handled consistently across all three components.
No changes required.

