# Current Mission

## Mission ID
M-2026-05-31-009-overlay-preview-system

## Objective
User: "overlays không có hiệu ứng gì hết". Vấn đề RỘNG hơn lastx — toàn bộ widget-preview system:
- **graphicoverlays (Webcam Frames):** `/widget/webcam?cid=1&type=pure` → 404 "Cannot GET /widget/webcam" (no file in downloads/widget/).
- **obsoverlays (Overlay Gallery):** 25 widgets GET 200 (cannon/coinjar/coinmatch/... fresh log 04:24) nhưng preview trống/no-effect (purple box).
- **lastx:** v2 fix applied (aggregates all-keys + framePreviewPing) — status post-restart chưa confirm.
- **⚠️ Self-introduced regression suspect:** M-008 Fix B calls `obsoverlays.init()` from lastx/graphicoverlays guarded by `__tfPageInits['obsoverlays']` → if those pages visited BEFORE Overlay Gallery, real obsoverlays init skipped (init early-returns on currentPage!=='obsoverlays' but flag set) → empty gallery.

## Evidence (runtime)
- Backend restart 2026-05-31T04:23:34Z (fresh, has M-008 v2 fixes).
- `/widget/webcam` 404; no webcam/frame/talking file in downloads/widget/. Some widgets are vite: `/widget/vite/src/<name>/index.html`.
- framePreviewPing at deobfuscated.js:19266-19291, condition `broadcastlistener.isLive` (line 19269) — does it throw if broadcastlistener undefined in clone? → would kill ALL preview effects.

## Active agents (Workflow M-009)
1. Scout-Missing-Widgets [S] → webcam 404 + full graphicoverlays widget list + gốc /widget/webcam shape + vite mapping.
2. Scout-Effects-Mechanism [S] → why obsoverlays widgets load but no effect; is framePreviewPing firing / throwing; broadcastlistener defined?
3. Scout-FixB-Regression [S] → did M-008 Fix B break real obsoverlays init via __tfPageInits hijack; lastx current status.
4. Reconciler [O] → concrete prioritized fix plan (files + exact changes, minimal, gốc-faithful).
5. Critic [O] → adversarial.

## Then
Commander reconcile → apply fixes (likely: fix Fix B guard to separate flag; add/fetch webcam widget; fix framePreviewPing if broadcastlistener issue) → user restart + verify.

## Backups already held
blockScript.txt.bak-2026-05-31-pre-lastx, aggregates.js.bak-2026-05-31-pre-lastx-keys, lastx.html.bak-2026-05-31-pre-guard, CLAUDE.md.bak-2026-05-31-pre-karpathy.
