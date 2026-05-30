# Current Mission

## Mission ID
M-2026-05-30-008-lastx-overlays-fix

## Objective
Fix trang **Last X Overlays** (`data-pageid=lastx`, breadcrumb "Overlays / Last X Overlays"): preview iframe của các card (Last Follower, Last Gifter, Last Subscribe/Super Fan, Last Share, Last Like, Last Chatter) đang **TRỐNG**, và "tính năng" (nút Copy URL / Test / Customize) cần verify hoạt động. User: "fix cái giao diện và tính năng của trang này luôn".

## Root-cause hypothesis (Commander recon, pre-team)
- `lastx` page = `type:"nav.gallery"` với sections `type:"Widget"` (giống obsoverlays/Gift Overlays) — gốc def `decompiled/app/deobfuscated.js:34311-34349`.
- Clone IIFE `tfTriggerOverlaysOnVisible` (blockScript.txt:595) PAGES list **KHÔNG có `lastx`** → page-mount không fire build/stretch iframe.
- NHƯNG grep cho thấy `window.lastx` không có `.onVisible` (chỉ `emitStatus`) → cơ chế render preview của `nav.gallery` Widget-card CẦN scout xác minh (Vue/jQuery shared renderer? iframe src-only? cần stretch? cần data?).
- Widget HTML tồn tại: `downloads/widget/lastx.html` (76KB). Route `/widget/lastx?cid=1&x=follower` qua index.js rewrite + static serve.

## Active agents (Workflow M-008 understand-phase)
1. **Scout-Bundle-Render** [Sonnet, max-think] → gốc render path `nav.gallery`/`Widget` preview iframe + Copy/Test/Customize handlers (deobfuscated app.js).
2. **Scout-Backend-Widget** [Sonnet, max-think] → `/widget/lastx` route resolve + lastx.html runtime deps (socket/data) + Test/Customize backend.
3. **Scout-Clone-Wiring** [Sonnet, max-think] → gap clone vs obsoverlays (blockScript onVisible/template-inject + earlyCss iframe height).
4. **Reconciler** [Opus] → unified root cause + minimal fix spec + regression list.
5. **Critic-Demolition** [Opus] → adversarial refute fix spec (READ-GỐC-FIRST enforcement, replicate-before-invent).

## Then
Commander reconcile → backup blockScript.txt (+ earlyCss.txt nếu touch) → apply minimal fix → `node backend-node/scripts/check-script-syntax.js` → user restart Electron để runtime-verify.

## Note
- Previous mission M-007 (gift itemTemplate replicate) PARKED — chưa reconcile chính thức; state ở git + current_state.json session summary. KHÔNG revert M-007 work.
