# Current Mission

## Mission ID
M-2026-06-01-011-overlay-switch-fullteam

## Objective
PURE IN-APP PREVIEW bug (KHÔNG liên quan live/OBS): trang Webcam Frames, bấm ‹ › đổi style →
counter + title ĐỔI nhưng **preview frame KHÔNG nhảy** (giữ frame cũ). User đã test nhiều vòng,
qua nhiều fix + restart, VẪN chưa switch được. User yêu cầu full team.

## Đã thử (mà CHƯA giải quyết được — nghi điểm mù / cache)
- Fix #1: widget-settings-cache.js aliasGraphicOverlayKeys → broadcast mang `webcam_pure_variation`
  (non-prefixed). VERIFIED: probe cho thấy iframe window.settings['webcam_pure_variation'] = giá trị đúng.
- Fix #2a: socketioclient.js override (139) → `(data==null)` fallback (ưu tiên broadcast tươi).
- Fix #2b (ĐÃ REVERT): framePreviewPing re-feed — sai vì framePreviewPing TẮT khi isLive (modules:19269).
- Fix #2c: socketioclient.js generic widgetSettings handler (line ~155-164) thêm
  `if(preview && io.fakeEmit) io.fakeEmit('widgetSettings', data)` → ép updateWidgetSettings(fresh) mỗi broadcast.
- Cache bump: downloads/widget/{webcam,overlay,talking} socketioclient.js?v=10 → ?v=11.

## PROVEN facts (đừng phủ nhận, hãy build lên)
- `io.fakeEmit('widgetSettings', w.settings)` chạy tay trong iframe → preview RE-RENDER đúng (before
  pure-greenscreen-blank → after pure-greenscreen-2panels). Tức render + bag ĐÚNG; chỉ thiếu trigger.
- Probe #slot: bag = giá trị HIỆN TẠI đúng, nhưng <video><source src> = giá trị CŨ (stale). 0 errors.
- broadcastlistener.isLive=false, navStore.isLive=false (lúc probe). Backend /api/tiktok/status đúng.
- backend POST /updateSettings = 200, persist OK (P2 widget_webcam_pure_variation đổi theo probe).
- SharedIO (sharedio.js:18-22) dispatch eventData cho MỌI listener; webcam đăng ký
  io.on('widgetSettings', updateWidgetSettings) ở webcam:657 (qua wrapper preview 264-272).
- Widget = gőc (M-009 fetch). render() webcam:566; updateWidgetSettings webcam:618; ASSET_MAP đủ.

## NGHI VẤN HÀNG ĐẦU (team phải làm rõ)
1. **CODE MỚI CÓ ĐƯỢC NẠP KHÔNG?** /widget/* + socketioclient.js cache rất lì trong Electron; v=11
   chỉ ăn nếu HTML widget tự reload. Có thể user toàn chạy code CŨ → mọi fix "không ăn". Cần cách
   FORCE-LOAD chắc chắn + probe xác minh version đang chạy.
2. Switch style có THỰC SỰ phát broadcast tới iframe không, hay bag update qua đường khác?
3. updateWidgetSettings có ĐƯỢC GỌI trên broadcast switch không? (probe trước: render stale ⇒ nghi KHÔNG).
4. fakeEmit→callbacks['widgetSettings'] có trỏ đúng updateWidgetSettings không (đăng ký nhiều lần?).
5. Nguyên nhân HOÀN TOÀN MỚI chưa xét: iframe bị recreate khi switch? nhiều iframe? hasChanges bug?
   replaceWithVideo <source> không reload? carousel KHÔNG save khi state===0?

## Team (Workflow full — Large tier)
Strategist[O] + Scout-CacheLoad[S] + Scout-ChainTrace[S] + Scout-AltCause[S] + Scout-Instrument[S]
→ Reconciler[O] → Critic[O].

## Deliverable bắt buộc
(a) Cách FORCE-LOAD code mới chắc chắn 100% + probe xác minh version đang chạy.
(b) Bản webcam widget CÓ INSTRUMENT (log updateWidgetSettings + render + generic handler) để 1 lần
    switch lộ ra toàn bộ chain — HOẶC fix bulletproof nếu root cause chắc.
(c) Adversarial review các fix đã apply (đúng/thừa/hại?).

## Backups
widget-settings-cache.js.bak-2026-06-01-pre-overlay-variation-alias;
socket-manager.js.bak-2026-06-01-pre-m010-diag;
socketioclient.js.bak-2026-06-01-pre-preview-refeed.
