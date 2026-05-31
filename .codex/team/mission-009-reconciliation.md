# Mission 009 Reconciliation — Overlay preview system

**Mission ID:** M-2026-05-31-009-overlay-preview-system
**Workflow:** wf_dbf3a1c1-e71 (5 agents: Scout-Missing-Widgets, Scout-Effects-Mechanism, Scout-FixB-Regression, Reconciler, Critic). Critic verdict: plan-needs-revision → **GO-with-runtime-probe** (caught 2 scout errors).

## Root causes (critic-corrected)
1. **[fixB-regression — SELF-INTRODUCED in M-008]** blockScript ping-branch set `__tfPageInits['obsoverlays']=true` while `navigation.currentPage` was 'lastx'/'graphicoverlays'. `obsoverlays.init()` early-returns at deobfuscated.js:19293 (`currentPage!=='obsoverlays'`) BEFORE building the 28 gallery widgets → flag set anyway → real Overlay Library page then SKIPS its own init() → **empty gallery**. Triggers when lastx/graphicoverlays visited before Overlay Library.
2. **[webcam-404]** `downloads/widget/{webcam,overlay,talking}` + `splash.js` absent (never fetched). graphicoverlays builds `/widget/{webcam,overlay,talking}?cid&type` → 404. Gốc serves all (200).
3. **[coinjar/coinmatch blank purple]** `/vue/dist/widgets/coin-match/coin-match.js` + `coin-jar.js` absent → `<script type=module>` import fails → `window.createCoinMatch/createCoinJar` undefined → Vue never mounts → blank iframe (purple = border showing through).
4. **[firework] — REFUTED by critic.** Scout claimed firework `preview()` is closure-local (window.preview undefined). Critic verified FALSE: load closure CLOSES at firework/index.html:441, `preview()` at :450 is top-level in a classic script → `window.preview` IS defined. **No firework fix** (would patch a non-existent bug — violates surgical doctrine).
5. **[lastx]** No remaining server bug — buildLastXPayload emits all 6 keys (M-008 v2). No change.

## Fixes applied
| # | File | Change | Apply |
|---|---|---|---|
| 1 | blockScript.txt ping-branch | `__tfPageInits['obsoverlays']` → **separate flag `__tfFramePingStarted`** (guard + set). Real Overlay Gallery init no longer skipped. | reload-html ✓ |
| 2 | downloads/widget/{webcam,overlay,talking,splash.js} | fetched from gốc (additive, new files) | static, live ✓ |
| 3 | downloads/vue/dist/widgets/{coin-match,coin-jar}/*.js | fetched from gốc (self-contained IIFE — critic confirmed no chunk graph) | static, live ✓ |

## Verified (static + backend)
- blockScript syntax OK (2 fails = pre-existing ld+json). `__tfFramePingStarted` unique; `__tfPageInits['obsoverlays']` only in comments now.
- Backend serves: webcam/overlay/talking → 302→200 (25861/21858/24652B real widget), splash 200 (2921B), coin-match 200 (219262B), coin-jar 200 (358276B).

## Pending runtime (GO-with-runtime-probe — cannot self-confirm)
- Ctrl+R app → Overlay Gallery shows ALL widgets even when Last X / Webcam Frames visited first (regression gone).
- coinjar/coinmatch iframes mount + render coins (Vue mount needs runtime confirm).
- Webcam Frames load (no "Cannot GET"). NOTE: frame images from assets.tikfinity.com CDN are NOT proxied → frame thumbnails may be slow/blank cross-origin (cosmetic, separate from the load error).

## Side effect documented
Fix means obsoverlays.init() can run twice (ping-branch + real page) → unguarded `setInterval(fetchTopGifter,15000)` (deobfuscated.js:19263) double-polls. Benign (exists in gốc). Do NOT revert to __tfPageInits flag to avoid it (reintroduces empty-gallery bug).

## Doc correction (critic): gallery widget count is 28, not 27.
## Backups: blockScript.txt.bak-2026-05-31-pre-fixb-guard (+ earlier bak files retained).
