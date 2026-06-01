# Mission M-2026-06-01-010 — Reconciliation

## Objective
Webcam Frames carousel: counter/title đổi nhưng PREVIEW không swap. Sau fix#1 + restart vẫn frozen + toast "API Error (-1) HTTP Communication Error".

## Team (Workflow wf_3bd20cab-e5a, 5 agents)
Scout-APIError [S] + Scout-WidgetRender [S] + Scout-DeliveryProbe [S] → Reconciler [O] → Critic [O].

## Verdict: Fix#1 = necessary-and-keep (KHÔNG sufficient một mình)
`widget-settings-cache.js::aliasGraphicOverlayKeys` thêm alias non-prefixed `webcam_pure_variation`
vào broadcast bag — đúng, đã verify (unit 6/6 + integration getForChannel(1) trên DB Electron thật).
Shipped bundle (combo/modules.js) chỉ ghi key PREFIXED `widget_webcam_pure_variation` (khác decompiled
21777); widget gốc đọc NON-prefixed `webcam_pure_variation` → alias là cầu nối đúng.

## CURRENT BLOCKER (mới phát hiện, > fix#1): POST /updateSettings KHÔNG persist
Bằng chứng quyết định: sau khi user click nhiều style, DB vẫn = DEFAULT
`widget_webcam_pure_variation="greenscreen 2 panels"` (P1-4). Click KHÔNG được persist →
POST /api/updateSettings (settings.save) đang FAIL (khớp toast "API Error (-1)" = XHR no-status
= network/timeout/abort). Không POST → không persist → không broadcast → preview frozen.
→ Phải fix POST trước; alias chỉ có tác dụng KHI POST chạy.

## Critic catches (quan trọng)
- Channel-mismatch (cause B) REFUTED: chỉ 1 channel (=1), findDefault đối xứng. Bỏ.
- TWO-DB trap: Electron dùng `%APPDATA%/tikfinity-desktop/tikfinity-data/tikfinity.db` (populated,
  ProfileId=2). Standalone `npm start` dùng `%APPDATA%/tikfinity-desktop/tikfinity.db` (EMPTY). Probe
  phải nhằm đúng DB Electron (các probe đã chạy đều đúng DB này).
- Value là STRING ('greenscreen 2 panels') không phải index → version `pure_greenscreen_2_panels`
  hợp lệ trong ASSET_MAP. render() KHÔNG có guard → variation undefined ⇒ cfg undefined ⇒
  TypeError tại webcam:572 (hard freeze, dễ nhầm "broadcast không tới").
- Preview-cache override (socketioclient.js:138-147) self-poison nhưng KHÔNG starve listener riêng
  của webcam (SharedIO dispatch đưa eventData tươi cho mọi listener).

## Open (runtime — cần probe)
1. POST /api/updateSettings khi click: status? URL? payload có chứa variation key + giá trị MỚI?
2. window.appConfig.apiBasePath = ? (nếu sai/cloud → -1).
3. Toast "API Error -1" từ updateSettings hay endpoint khác (refreshPublicSettings / cross-origin)?

## Decisive probe (giao user)
DevTools Console (main window): in apiBasePath + fetch POST updateSettings thử → status/fail.
Map: 200 → backend OK, lỗi ở chỗ khác / hoặc bundle URL sai; FAILED → POST path gãy = root cause.

## Fixes ranked (sau probe)
1. [gate] restart + probe — phân biệt A/B/D.
2. nếu POST fail → fix URL/appConfig/host (config, KHÔNG patch bundle).
3. nếu POST ok nhưng frozen → render() guard (fallback DEFAULT_MAP) ở downloads/widget/webcam
   (HIGH-RISK gốc file, backup trước) + xử preview-cache self-poison.
KEEP fix#1.

## Backups
widget-settings-cache.js.bak-2026-06-01-pre-overlay-variation-alias;
socket-manager.js.bak-2026-06-01-pre-m010-diag.
M-010 TEMP instrumentation đang bật (cần gỡ sau khi verify).
