# Apothecary Static Verify — M-2026-05-28-002-tiktok-cdn-intercept

**Agent:** Apothecary (build-error-resolver)
**Mission:** Static verification of 32-line TikTok CDN intercept block added to `electron/main.js`
**Date:** 2026-05-28
**Method:** Read-tool static analysis (Electron not running; Bash classifier blocked all shell invocations in this env)

---

## summary

PASS — The 32-line intercept block is syntactically correct, purely additive (+32 lines matching Engineer report), uses no new dependencies, does not overlap with the existing BLOCK_URLS handler, and all in-scope variables (`sess`, `BACKEND_URL`) are confirmed in-scope.

---

## checks

| # | Check | Command/Method | Result | Pass/Fail |
|---|-------|---------------|--------|-----------|
| 1 | Syntax check | `node -c electron/main.js` | **BLOCKED** — Bash classifier denied all shell invocations. Static read performed instead: all braces/parens manually traced in the new block (lines 1121–1151). The block opens `sess.webRequest.onBeforeRequest(` at 1135, opens callback `(details, callback) => {` at 1137, opens `try {` at 1138, closes `try` at 1145, opens `catch (err) {` at 1145, closes catch at 1148, closes callback at 1149, closes `onBeforeRequest(` at 1150, adds `console.log(...)` at 1151. No unmatched delimiters found. | PASS (manual) |
| 2 | File line delta | Read both files to EOF | main.js = **2355 lines**, backup = **2323 lines**, delta = **+32 lines** — exact match to Engineer report | PASS |
| 3 | Byte delta | Could not run `Get-Item` (PowerShell blocked). Line delta +32 confirmed; byte delta presumed consistent with +32 lines of ~52 chars avg. Engineer-reported +1683 bytes not directly measurable in this env. | N/A (unblockable) |
| 4 | Diff additive-only | Compared backup lines 1120–1121 (blank + `// Bundle's overlay-gallery`) with main.js lines 1120–1153: backup has nothing between 1119 and the `will-download` comment. Main.js inserts exactly 32 lines (1121–1152). All content after 1120 shifts +32 with identical text. Zero deletions. | PASS |
| 5 | No orphan handlers — `tiktokcdn` grep | `Grep tiktokcdn main.js` | 4 hits, ALL within the single new block (lines 1121, 1131, 1133, 1136). Zero hits in backup. No duplicate handler. | PASS |
| 6 | `webRequest.onBeforeRequest` count | `Grep webRequest.onBeforeRequest main.js` | Exactly 2 registrations: line 1114 (BLOCK_URLS) and line 1135 (new TikTok CDN handler). Backup had only line 1114. | PASS |
| 7 | Electron tests | `electron/test/` and `electron/__tests__/` — `Glob test*` under `electron/` returned only `node_modules` test files. No project-level test suite. | SKIP (none exists) |
| 8 | Handler ordering / URL overlap | See `## handler-ordering` section below | PASS — no overlap |
| 9 | `sess` variable in scope | `configureSession()` at line 1088 opens with `const sess = session.defaultSession;`. New block at lines 1135–1150 is inside the same function body. `sess` is in scope. | PASS |
| 10 | `BACKEND_URL` in scope | Defined at line 39: `const BACKEND_URL = \`http://localhost:\${BACKEND_PORT}\``. Top-level module scope. Referenced at line 1134 in new block. | PASS |
| 11 | `new URL()` usage | Node built-in (`url` module via global `URL`). No new `require()` or import needed. | PASS |
| 12 | `package.json` new deps | `electron/package.json` has no new dependencies. New block uses only `session` (Electron built-in, already used), `URL` (Node global), and `BACKEND_URL` (existing constant). | PASS |

---

## diff-summary

The change is a pure insertion between line 1120 (blank line after BLOCK_URLS handler close) and what was previously line 1121 (now line 1153: `// Bundle's overlay-gallery UI links...`).

**Lines added in main.js (1121–1152) — not present in backup:**

```
1121    // Redirect *.tiktokcdn.com → local cache proxy. Catches every gift image,
1122    // animation, thumbnail used by bundle's obfuscated itemTemplate (native
1123    // template fires direct CDN fetch, bypassing our blockScript patch). With
1124    // this intercept, every request hits backend /tiktok-img-cache/* route
1125    // which serves from _cdnProxyCache Map (pre-warmed 200 popular gifts on
1126    // boot via tiktok-image-prewarm service) or falls through to upstream.
1127    //
1128    // Cache-Control: 86400 from backend → Electron's Chromium HTTP disk cache
1129    // persists across restarts. First-time slow, subsequent instant.
1130    //
1131    // SSRF-safe: regex restricts host to exactly *.tiktokcdn.com (matching
1132    // backend proxy's allow-list).
1133        const TIKTOK_HOST_RE = /^[a-z0-9-]+\.tiktokcdn\.com$/i;
1134        const TIKTOK_CACHE_BASE = `${BACKEND_URL}/tiktok-img-cache`;
1135        sess.webRequest.onBeforeRequest(
1136            { urls: ['https://*.tiktokcdn.com/*', 'http://*.tiktokcdn.com/*'] },
1137            (details, callback) => {
1138                try {
1139                    const u = new URL(details.url);
1140                    if (!TIKTOK_HOST_RE.test(u.hostname)) {
1141                        return callback({});  // not a TikTok CDN host — let it through
1142                    }
1143                    const redirectURL = `${TIKTOK_CACHE_BASE}/${u.hostname}${u.pathname}${u.search}`;
1144                    return callback({ redirectURL });
1145                } catch (err) {
1146                    // URL parse failed — let request through unchanged.
1147                    return callback({});
1148                }
1149            }
1150        );
1151        console.log('[Electron] TikTok CDN intercept installed → ' + TIKTOK_CACHE_BASE + '/*');
1152    (blank line)
```

All content after line 1120 in backup matches identically at +32 offset in main.js. **Zero deletions. Zero modifications to existing lines.**

---

## handler-ordering

Electron processes `webRequest.onBeforeRequest` listeners in registration order. The two handlers registered within `configureSession()` are:

**Handler 1 — BLOCK_URLS (line 1114, existing):**
```
URL filter: [
  '*://*.featurebase.app/*',
  '*://*.sentry.io/*',
  '*://*.contentsquare.net/*',
  '*://pagead2.googlesyndication.com/*',
  '*://*.googletagmanager.com/*',
  '*://*.google-analytics.com/*',
  '*://ph.tikfinity.com/*'
]
Action: cancel: true
```

**Handler 2 — TikTok CDN redirect (line 1135, new):**
```
URL filter: [
  'https://*.tiktokcdn.com/*',
  'http://*.tiktokcdn.com/*'
]
Action: redirectURL → localhost:5285/tiktok-img-cache/*
```

**Overlap analysis:**

- `*.featurebase.app`, `*.sentry.io`, `*.contentsquare.net`, `pagead2.googlesyndication.com`, `*.googletagmanager.com`, `*.google-analytics.com`, `ph.tikfinity.com` — none of these match `*.tiktokcdn.com`. No domain in BLOCK_URLS can match the new filter pattern.
- `*.tiktokcdn.com` does not match any of the BLOCK_URLS patterns.

**Conclusion: zero URL filter overlap.** A request to `*.tiktokcdn.com` will not be evaluated by Handler 1 (its filter does not match). Handler 2 will be the sole evaluator. A request to any BLOCK_URLS domain will be cancelled by Handler 1 and never reach Handler 2 (Electron stops at first `cancel: true`).

Registration order is correct: blocking telemetry (Handler 1) runs before CDN redirect (Handler 2). This is safe — no tiktokcdn URL would ever be in BLOCK_URLS anyway.

---

## blockers-for-runtime-test

No blockers identified.

1. **Syntax:** Block is syntactically clean (manual trace). No unmatched braces.
2. **Scope:** `sess` and `BACKEND_URL` confirmed in-scope at point of insertion.
3. **Dependencies:** No new npm packages needed. `URL` is a Node.js global. `session` is Electron built-in already used in `configureSession()`.
4. **Route dependency:** The new handler redirects to `${BACKEND_URL}/tiktok-img-cache/*`. This route must exist in the backend Node.js server (`backend-node/src/index.js` or a router). If that route is NOT implemented yet, all `*.tiktokcdn.com` requests will receive whatever the backend responds to unknown paths (likely 404). This is a graceful degradation (images fail to load, no crash). If the prewarm mission (M-2026-05-28-001) has wired the route, this will work on first restart.
5. **No test suite to fail.**
6. **`pending_electron_restart_to_load` in `current_state.json`** lists several items from a prior session that also need Electron restart. This new change piggybacks on the same restart. No conflict.

---

## final-verdict

**READY FOR USER RESTART**

The 32-line block is additive-only, syntactically correct per manual analysis, uses no new dependencies, is properly scoped, and creates no URL filter overlap with the existing BLOCK_URLS handler.

Restart command (from CLAUDE.md §12):
```
taskkill /F /IM electron.exe && start_desktop.bat
```

After restart, verify by opening Gift Browser or any page that loads TikTok CDN assets — browser DevTools Network tab should show requests to `localhost:5285/tiktok-img-cache/*` instead of `p16-*.tiktokcdn.com/*`.

**One runtime caveat to confirm:** The `/tiktok-img-cache/*` backend route must be live in `backend-node`. If M-2026-05-28-001 successfully wired that route, this will work immediately. If not, CDN images will 404 but no crash will occur.
