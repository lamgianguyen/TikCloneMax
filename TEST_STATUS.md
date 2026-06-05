# TEST_STATUS — Sổ kiểm thử (SUCCESS registry)

> **Cặp đôi:** file này = ✅ **SUCCESS** (cái nào ĐÃ verify chạy + cách verify). [FIXLOG.md](FIXLOG.md) = ⚠️ **LOG** (lỗi + dead-end + fix). Đọc CẢ HAI trước khi test/fix.
>
> **Luật ghi:** test xong 1 mục → cập nhật hàng dưới. **PASS chỉ ghi khi có BẰNG CHỨNG** (log dòng nào / DB query / nhìn thấy), không ghi PASS theo cảm tính. Mục OPEN = đã fix nhưng CHƯA verify → link FIXLOG.
>
> ⚠️ **Trước khi tin 1 PASS cũ:** đọc §"Tại sao OK rồi chạy lại lỗi" trong [.codex/skills/tikmax/SKILL.md](.codex/skills/tikmax/SKILL.md) §TEST — PASS có thể **thoái hoá** do cache/restart/state/race.

| # | Mục kiểm thử | Status | Ngày | Bằng chứng verify | Ghi chú |
|---|---|---|---|---|---|
| 1 | **Render Overlay Library nhanh** (stretchIframes non-block) | ✅ PASS | 2026-06-05 | log `[STRETCH-DIAG] non-blocking stretch done in 42/88/58/45ms for 22 iframes` | override rAF, không còn freeze |
| 2 | **Console hết spam** (widgetSettings/fontLetterSpacing) | ✅ PASS | 2026-06-04/05 | `[Broadcast] widgetSettings` count=0 idle; grep fontLetterSpacing=0 | gỡ ~345 dòng log tổng |
| 3 | **Save Ball Size vào DB** | ✅ PASS | 2026-06-04 | DB `widget_cannon_ballsize`=11 (đúng giá trị kéo) | fix inModal→inPopup + restored guard |
| 4 | **onConfigEvent / play() AbortError** | ✅ PASS | 2026-06-04 | không còn lỗi đỏ trong log sau fix | null-guard + .catch |
| 5 | **Ranking crash `template.clone()` null** | ✅ PASS | 2026-06-05 | không còn `reading 'clone'` trong log | null-guard lazy-init ×2 file |
| 6 | **Null-guard settings toàn widget** (JSON.parse + isPro) | ✅ APPLIED | 2026-06-05 | grep `!settings.isPro` unguarded=0; JSON.parse `\|\|{}` ×50 | chưa stress-test cold-socket thực tế |
| 7 | **Coin-jar "Đặt lại Jar" clear jar** | ⚠️ OPEN | — | hook `coinJar.resetJar` armed (log) NHƯNG user CHƯA bấm test | [FIXLOG 2026-06-04 Reset]. Cần: bấm → xem `[RESET-DIAG] CALLED` + jar clear |
| 8 | **Save mượt (17 POST → ít)** | ⚠️ OPEN | — | fix applied (debounce1200+cancel+backend250ms) chưa đo lại | cần đổi Ball Size + đếm POST |
| 9 | **External CDN libs/fonts không hang** | ❌ DEFERRED | — | chưa fix (Google Fonts/GSAP/Matter/lottie còn external) | [FIXLOG 2026-06-05 sweep DEFERRED] |
| 10 | **wsserver shutdown null-guard** | ⚠️ APPLIED | 2026-06-05 | guard thêm; chỉ thấy khi shutdown lần sau | — |

**Legend:** ✅ PASS = verify có bằng chứng · ⚠️ OPEN = fix rồi chưa verify · ⚠️ APPLIED = sửa rồi chưa test thực · ❌ DEFERRED = chưa làm.
