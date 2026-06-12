# Widget / Overlay Health — error classes + preventive checklist

> Mục đích: mỗi lần 1 overlay lỗi, đừng vá lẻ rồi quên — **ghi lớp lỗi vào đây** + chạy
> [`qa/.measure/widget-audit.js`](../qa/.measure/widget-audit.js) (load 26 widget headless,
> bắt crash/404/console-error/CDN) để widget KHÁC không tái phạm cùng lỗi. Tổng duyệt:
> `node qa/.measure/widget-audit.js` (cần backend chạy).

## Cách chạy tổng duyệt
```bash
node qa/.measure/widget-audit.js      # render audit: BROKEN (crash/404) / EMPTY? / OK
```
Phân biệt **lỗi thật** (console-error / asset-404 / crash) vs **rỗng hợp lệ** (widget
event-driven blank khi không có live data / chưa cấu hình — KHÔNG phải bug).

---

## Các LỚP lỗi đã gặp (2026-06-11 full audit) + cách phòng

### C1 — Deref property của config/asset lookup undefined → CRASH → blank
**Triệu chứng:** `const cfg = ASSET_MAP[version]; if (cfg.pro)…` khi `version`/`variation`
chưa set (OBS/browser TRƯỚC khi settings tới) → `cfg` undefined → `cfg.pro` throw → widget trắng.
**Gặp:** webcam / overlay / talking (`cfg.pro`).
**Fix/Prevent:** guard ngay sau lookup: `if (!cfg) return;`. Bất kỳ `MAP[key].prop` nào phải
chắc `MAP[key]` tồn tại. fallingsnow dùng `ASSET_MAP[variation]` nhưng chỉ gán `.src` (không
deref `.prop`) → không crash — pattern an toàn.

### C2 — Thư mục `<name>.html` che file thật → serve 404
**Triệu chứng:** `/widget/eventcarousel/` → 404 vì `downloads/widget/eventcarousel.html` là 1
**DIRECTORY** (artifact tải bundle) → `res.sendFile(dir)` → EISDIR → 404, không thử
`eventcarousel/index.html`.
**Fix (đã vào [index.js](../backend-node/src/index.js) widget-serve — cover MỌI widget tương lai):**
serve `<name>.html` chỉ khi `isFile()`, rồi fallback `<name>/index.html`.

### C3 — Asset/iframe path tương đối → 404 trong context dir-served
**Triệu chứng:** `<iframe src="./vite/src/heart-fountain/index.html">` từ `/widget/likefountain/`
→ resolve thành `/widget/likefountain/vite/…` → 404 (vite thật ở `/widget/vite/…`).
**Gặp:** likefountain.
**Fix/Prevent:** shared asset dùng **absolute** `/widget/vite/…`, KHÔNG `./` hay `../`.

### C4 — External CDN libs (blocking) → hang OBS/plain browser + ORB block
**Triệu chứng:** `<script src="https://code.jquery.com/…">` / cdnjs socket.io / matter-js / gsap /
jsdelivr lottie blocking trong `<head>` → treo nếu CDN chậm/bị chặn (OBS source, offline).
**Gặp + ĐÃ localize → `/js/lib/`:** webcam, overlay, talking, streambuddies (jquery+socket.io);
cannon (matter.min.js 0.19.0); wheel (TweenMax 1.18.0 — đúng bản cdnjs "latest" pin);
myactions, songrequests (lottie-player 1.6.3).
**Còn (thấp, non-blocking):** external **fonts** `fonts.googleapis.com` ở nhiều widget (font
fallback nếu bị chặn, không crash); gift-data lottie `ynassets.younow.com` (dữ liệu remote, không
phải lib). **Prevent:** widget MỚI phải nạp lib từ `/js/lib/`, KHÔNG CDN. Audit grep CDN để bắt.

### C5 — Setting key thiếu trong widget-defaults → save xong reload REVERT
**Triệu chứng:** đổi setting, lưu OK, nhưng reload/OBS về giá trị cũ.
**2 nguồn (đã fix):**
1. **Legacy `widget_`-prefixed row đè direct row** trong `buildMerged` — fix precedence:
   direct key thắng legacy `widget_` key (xem FIXLOG 2026-06-11 persistence).
2. **Key widget đọc mà KHÔNG có trong [widget-defaults.js](../backend-node/src/services/widget-defaults.js)**
   → `normalizeKey` không map được lowercased-DB-key → camelCase → widget đọc `undefined`.
**Prevent:** MỌI key widget đọc (`settings.X`) phải có default trong widget-defaults.js (camelCase).

### C6 — `settings.X` truy cập không null-guard → crash khi settings null
**Triệu chứng:** `if (settings.isPro === false)` khi `settings` null/chưa nạp → TypeError giết handler.
**Gặp:** topg/tops (đã fix). **Prevent:** `settings && settings.X`.

### C7 — Setting bị toggle khác ĐÈ (KHÔNG phải bug — UX confusion)
**Triệu chứng:** user đổi "Username Color" đỏ nhưng không thấy đỏ. THẬT RA: toggle
**"Random username colors"** (`chat_usernameRgb`, default ON) gán màu random mỗi user → đè màu solid
(chat.html:291-297 đè :271). Đã verify Playwright: tắt RGB → username ra đỏ đúng.
**Prevent (khi debug):** trước khi nghi persistence/render hỏng, kiểm "có toggle nào override
setting này không" (RGB, effect, mini, hideAfter…). Persistence đã verify đúng — đừng đào lại lớp đó.

---

## Checklist khi THÊM / SỬA 1 widget
- [ ] Lib nạp từ `/js/lib/` (không CDN). Nếu lib mới chưa có → tải về `/js/lib/` (bản EXACT) rồi ref local.
- [ ] Mọi `MAP[key].prop` có guard `if (!MAP[key]) return`.
- [ ] Asset/iframe shared dùng absolute `/widget/…`, không `./`/`../`.
- [ ] Mọi `settings.X` widget đọc → có default camelCase trong widget-defaults.js.
- [ ] `settings.X` có `settings && …` guard.
- [ ] Serve qua `/widget/<name>/` ra 200 (không phải dir-shadow 404).
- [ ] Chạy `node qa/.measure/widget-audit.js` → không BROKEN mới cho merge.
