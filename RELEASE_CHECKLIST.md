# RELEASE CHECKLIST — TikCloneMax (giao khách hàng)

> Tổng hợp pre-release audit 2026-06-16 (wf `pre-release-customer-audit`, 11 agent, verified runtime). **Verdict ban đầu: NO-GO** vì 2 CRITICAL blocker. Cập nhật trạng thái khi fix.

## 🚨 BLOCKERS (PHẢI xong trước khi giao khách)

### 1. `/api/me` trả ~6MB → blank page máy khách — ✅ ĐÃ FIX
- **Gốc:** `routes/me.js buildDynamicSettings` copy MỌI key gồm ~20k rows `points_user_`/`pointsmeta_` (94% payload) → bundle nhét vào localStorage → **QuotaExceeded → trang trắng**. (WRITE/settings.js + BROADCAST/cache đã strip; READ/me.js sót.)
- **Fix:** strip `points_user_`/`pointsmeta_`/`dynamicsettings` trong loop (me.js, đồng bộ settings.js). Verified DB thật: **6.0MB → 52KB** (giảm 99%).
- **TODO nợ:** tách `stripNonWidgetKeys()` dùng chung cho cả 3 đường (settings/me/cache) để hết drift (đã 3 lần sót 1 đường).
- ⚠️ **Cần REBUILD/restart backend** để fix vào hiệu lực.

### 2. License server URL không tới được ở máy khách — ⏳ CẦN BẠN SET
- **Gốc:** `AUTH_HOST` default `http://127.0.0.1:5194` (config.js:88). Máy khách KHÔNG chạy license server → Serial Key login trả UNREACHABLE → **khách không đăng nhập được**.
- **Fix:** set `TIKFINITY_AUTH_HOST` = URL license server PRODUCTION của bạn (vd `https://license.your-domain.com`) khi BUILD (env của tiến trình, hoặc bake default config.js:88). Electron spawn đã `...process.env` nên set env là forward được.
- **PHẢI:** (a) license server production đã dựng + reachable từ internet; (b) verify Serial Key login THẬT tới nó trước khi ship.

### 3. Thiếu doc env cho deploy — ✅ ĐÃ TẠO
- [`backend-node/.env.example`](backend-node/.env.example) — liệt kê env vars (TIKFINITY_AUTH_HOST bắt buộc; JWT/SIGN/PORT optional).

## ✅ Đã PASS (không block)
- **Security SẠCH** (6 scout đồng thuận): JWT random auto-persist (packaged), bind loopback 127.0.0.1 (remote không tới), CSRF/SSRF guard OK, không secret hardcode.
- **QA harness: 256 PASS** (API 46 / socket 35 / gates 53 / perf / 5 chain). 21 "fail" external-libs = Google Fonts cosmetic (OBS có net → tải bình thường) + 2 false-positive đã sửa.
- Core features (login/Pro, connect, profile, overlays, TTS, points, chat, actions) — OK.

## 📋 Chấp nhận được (fix SAU release)
- **DB bloat dài hạn:** rows points tăng vô hạn (không cap/TTL/VACUUM). Sau fix #1 áp lực giảm mạnh. → tài liệu "Reset Points định kỳ", tối ưu bản sau.
- **Query points scale tuyến tính:** findUsernameByUserId 32ms, listChannelUsers(500) 244ms N+1 — chậm dần theo viewer, KHÔNG crash. → tách bảng points có index / cache, hạ default 500.
- **Socket.IO cors origin:true:** mitigate bởi loopback-bind; chỉ inject FX (không data). → siết `io.use()` handshake sau.
- **Debug log sót:** coinjar HTML console, socket-manager `[WS-relay]` info, → gỡ trước build cho sạch (Gate §35 đã chốt bug Reset).
- **75 file `.bak`** dưới backend src ship trong installer → thêm exclude `*.bak` vào extraResources (electron/package.json).
- **Overlay preview reload-jank** (keep-loaded đã revert) — cosmetic, known-issue.
- **TTS 502 message kỹ thuật** khi upstream chết → map message thân thiện sau.
- **Eulerstream free tier** (SIGN_API_KEY rỗng) → ws chập ~4-5p tới khi TikTok sign-in; → set SIGN_API_KEY hoặc doc cho khách.

## A-Z deep audit (2026-06-16, wf full-audit-a-z-v2 + solo pass) — GO (conditional)
**0 CRITICAL/HIGH mới.** Solo pass (boot 63/63 syntax OK, secret/SQL/SSRF/XSS/leak/strip-drift) = SẠCH. 5-agent verified-real → ✅ ĐÃ FIX:
- **SVG inline-script XSS qua upload** (MED security, proof live): bỏ `.svg` khỏi whitelist ảnh ([upload.js](backend-node/src/routes/upload.js)) + nosniff+CSP-sandbox cho /uploads ([index.js](backend-node/src/index.js)).
- **i18n-patch/voice-catalog corrupt → brick boot** (MED): thêm JSON.parse-validate ([index-html.js](backend-node/src/middleware/index-html.js)).
- **aggregates.userAvatars leak** (MED memory): FIFO-cap 10k + clear trong resetAll ([aggregates.js](backend-node/src/services/aggregates.js)).
- **Follower count không seed ở soft-success connect** (LOW, code mới): seed cả 2 nhánh soft-success ([tiktok-bridge.js](backend-node/src/services/tiktok-bridge.js)).
- ✗ REFUTED (không fix): "flapping-reconnect never gives up" — watchdog path xử lý, false-positive.

**TRACKED (LOW/cần-care, fix fast-follow — đều bounded single-user loopback):** webhook/action URL có thể POST tới `127.0.0.1:5285/api/reset/all` (chặn port backend + private-range, đừng phá Streamerbot); `execPsCommand` IPC chạy PowerShell tùy ý từ renderer (allowlist); SQLite LIKE prefix chưa ESCAPE `_` (dormant); viewer nickname/thumbnailUrl re-serve raw (validate http(s)); endpoint hủy diệt (reset/backup-import/seed) chỉ loopback-CSRF không JWT (thêm requireAuth); `/api/widget/broadcast/:event` không allow-list; socket `_seenWidgets` giữ Set rỗng.

## Go-live steps
1. Áp `stripNonWidgetKeys` (me.js — DONE) → **rebuild backend**.
2. Set `TIKFINITY_AUTH_HOST` = license server production → verify Serial Key login thật.
3. (Nên) gỡ debug log + exclude `.bak` khỏi installer.
4. `npm run qa` → core 256 PASS.
5. Smoke khách: cài app sạch → login Serial Key → connect TikTok → mở 1 overlay OBS → chat/gift.
