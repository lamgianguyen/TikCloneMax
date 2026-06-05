# FIXLOG — Lịch sử fix (3-strike log)

> **Mục đích:** chống "fix đi fix lại cùng 1 lỗi". Ghi lại các bug **đã từng tốn nhiều vòng** — đặc biệt **dead-ends ĐÃ THỬ MÀ SAI** — để session/agent sau KHÔNG lặp lại con đường cụt.

## Luật 3-STRIKE (bắt buộc — CLAUDE.md §6)

1. **TRƯỚC khi sửa bất kỳ bug nào:** đọc FIXLOG này. Nếu bug (hoặc lớp/triệu chứng tương tự) đã có entry → **bắt đầu từ "Fix that worked", BỎ QUA mọi "Dead-end".**
2. **Đếm strike:** mỗi lần fix-rồi-user-báo-"vẫn lỗi" / mỗi lần claim-fixed-mà-sai = **1 strike**.
3. **Đủ 3 strike trên cùng 1 lỗi → DỪNG patch mù.** Bắt buộc: (a) ghi/cập nhật entry FIXLOG (symptom + mọi dead-end đã thử + trạng thái), (b) đổi chiến lược — **thu runtime evidence** (log/probe/DB), KHÔNG đoán tĩnh tiếp.
4. **Khi giải xong** (hoặc partial): cập nhật entry — điền "Root cause" + "Fix that worked" + "Verify".

**Team có vai Lỗi-Historian (CLAUDE.md §2.1):** trước mission đọc FIXLOG báo Commander "vùng này từng cụt ở X"; sau mission cập nhật entry. Đây là người gác cổng chống lặp.

**Format entry:** mỗi `## [YYYY-MM-DD]` 1 bug. Status: `SOLVED` / `PARTIAL` / `OPEN`.

---

## [2026-06-04] Settings save "không ăn liền" (cannon Ball Size) — SOLVED

**Symptom:** đổi Ball Size ở Customize → bấm "ĐƯỢC RỒI" → giá trị KHÔNG vào DB; widget giữ size cũ. Tốn ~5+ vòng.

**Dead-ends (ĐỪNG thử lại):**
- ❌ Query nhầm DB file `tikfinity-desktop/tikfinity.db` (172KB stale). **DB thật = `%APPDATA%/tikfinity-desktop/tikfinity-data/tikfinity.db`** (2.8MB).
- ❌ Giả định modal Customize bắt được bằng `#widgetSettingsModal.contains(btn)`. **SAI** — modal là **dxPopup**, nút "ĐƯỢC RỒI" bị **portal RA NGOÀI** `#widgetSettingsModal` → `inModal=false`. Phải dùng `inPopup` (`btn.closest('.dx-popup, .dx-overlay-content')`).
- ❌ Tin "0 log = save không chạy". **SAI** — [electron/main.js:1720](electron/main.js#L1720) `console-message` chỉ forward **level≥2 (warn/error)**, **DROP `console.log`**. Mọi diagnostic renderer phải dùng **`console.warn`** mới thấy trong backend log.
- ❌ autosave wrapper chỉ trigger key `widget_` — OK, nhưng `settings.save()` vẫn im vì guard.

**Root cause (3 lớp):**
1. Nút "ĐƯỢC RỒI" `inModal=false inPopup=true` → force-save cũ (đòi `modal.contains`) trượt.
2. `settings.save()` (app deob:68323) mở đầu `if(!settings.restored) return;` → khi `restored=false` thì autosave gọi save() **return im, không POST**. Chỉ force-save (set `restored=true`) mới lưu.
3. console.log không forward → tưởng không chạy.

**Fix that worked:** `blockScript.txt` — (a) `tfForceSaveOnCustomizeClose` nới `inModal`→`inPopup`; (b) `tfOverlaySettingsAutosave.doSave()` tự set `window.settings.restored=true` + guard `>30 setting_ key` trước `save()`. **Verify: DB profile 1 `widget_cannon_ballsize` = "11"** (đúng giá trị user kéo).

---

## [2026-06-04] Console spam / lag toàn overlay — SOLVED

**Symptom:** DevTools widget ngập `widget settings received` / `<id> default size` (từ `cannon...:209`) → lag.

**Dead-end (ĐỪNG thử lại):** ❌ Gỡ log ở `downloads/widget/socketioclient.js` (file chung) → **VÔ DỤNG**. Mỗi widget HTML **NHÚNG INLINE** bản copy socketioclient → log nằm **line ~209/291 của TỪNG file HTML**. Phải strip per-file (script Node đệ quy; nhớ `eventcarousel.html` là THƯ MỤC → guard `statSync().isFile()`).

**Fix that worked:** gỡ 51 dòng debug log inline khắp `downloads/widget/**` + probe `[CANNON SETTINGS]`. Verify: `[Broadcast] widgetSettings` count=0 lúc idle.

---

## [2026-06-04] Save LAG (17 POST /api/updateSettings cho 1 lần kéo) — PARTIAL (chờ user verify)

**Symptom:** kéo Ball Size + 2 "ĐƯỢC RỒI" → 17 POST → mỗi POST rebuild index.html + broadcast widgetSettings tới mọi widget → lag.

**Root cause:** (1) autosave debounce 700ms quá ngắn + bắn mỗi nấc slider; (2) force-save KHÔNG hủy autosave pending → double-POST; (3) backend `rebuildAndBroadcast` broadcast mỗi POST không debounce.

**Fix applied (chờ verify):** debounce 700→1200ms (A) + force-save gọi `window.__tfCancelAutosave()` (B) + backend `rebuildAndBroadcast` debounce 250ms/channel (D). Files: `blockScript.txt`, `widget-settings-cache.js`.

---

## [2026-06-04] Coin Jar "Đặt lại Jar" (Reset) click không clear — OPEN (fix applied, chờ verify)

**Symptom:** bấm "Đặt lại Jar" → jar không clear. Click NHẬN (dx-button), nhưng `coin-jar:reset` count=0 ở backend (emit không tới).

**Dead-end (ĐỪNG lặp):** ❌ Workflow 5-lớp kết luận "đúng trên giấy" (control emit/relay/widget/physics đều OK) → **static analysis KHÔNG đủ**, phải runtime. Relay path OK (gift `delivered=3 to widget,widget`), nên đứt ở **emit phía control** (queue/không-wire), KHÔNG phải relay.

**Hypothesis còn mở:** `coinJar.setupControls()` chỉ chạy trong `obsoverlays.init()` có guard `if(navigation.currentPage!=="obsoverlays") return` (modules:19293) → ngoài trang overlay thì nút không được wire onClick=resetJar. NHƯNG runtime cho thấy dx-button "Đặt lại Jar" ĐÃ click + `coinJar.resetJar hooked` armed OK → mâu thuẫn, chưa chốt.

**Fix applied (belt-and-braces, chờ verify):** hook `coinJar.resetJar` → gọi thêm `POST /api/widget/coinjar/reset` (route HTTP broadcast `coin-jar:reset`, đã proven). Diag `[RESET-DIAG] coinJar.resetJar CALLED` để biết nút có gọi resetJar không. **Nếu click mà KHÔNG thấy CALLED → nút chưa wire → vá `setupControls`.**

---

## [2026-06-04] Cơ chế RESET coin-jar (gốc) — REFERENCE (xem CLAUDE.md §35-MECH)
Reset = FE/widget-only, ephemeral, backend stateless. Lag do jar KHÔNG cap tổng coin (gốc chỉ throttle spawn + sleeping bodies). Chi tiết: CLAUDE.md §35-MECH.

---

## [2026-06-05] Trang Overlay Library "chạy lâu xong mới render" — SOLVED (log-verified)

**Symptom:** mở trang Overlay Library → freeze vài giây rồi mới render UI. Console: lỗi ranking `null.clone` + spam `fontLetterSpacing` + audio external myinstants.com.

**Root cause (chính):** `obsoverlays.stretchIframes()` (decompiled modules:19360-19422) chạy **while-loop ĐỒNG BỘ** mỗi iframe: `while(cont.clientHeight===initial && h<700){ h+=5; iframe.style.height=h }` — đọc `clientHeight` mỗi vòng = **FORCED REFLOW × ~140 vòng × ~22-28 iframe** → block main thread vài giây TRƯỚC first paint.

**Dead-end (cảnh báo Gate 30d):** ĐỪNG đổi GIÁ TRỊ height iframe bằng CSS / flex (v1-v4 đã thử, phá gốc). Fix ĐÚNG = giữ NGUYÊN logic height, chỉ đổi CÁCH áp (sync→async).

**Fix that worked:** `blockScript.txt` IIFE `tfStretchIframesNonBlocking` override `obsoverlays.stretchIframes` → cùng logic grow-tới-threshold-hoặc-700 nhưng qua `requestAnimationFrame` (yield mỗi frame) + song song container + step 20px. **Verify (log):** `[STRETCH-DIAG] non-blocking stretch done in 42/88/58/45ms for 22 iframes` — KHÔNG còn block; reversible qua `__tfStretchPatched`.

**Phụ (cùng session):** ranking `template.clone()` null (race ajax-trước-init) → null-guard lazy-init cả 2 file ranking. · Gỡ 128 dòng debug spam (`fontLetterSpacing`/fade/volume/step/rockets) khắp 31 widget file. · Audio external myinstants: **BỎ** (verifier: Audio constructor không block render; proxy `myinstantsapi.zerody.one` host khác `myinstants.com/media/sounds` → mapping chưa chắc; lazy-mediawrapper phá fadeOut). · `electron/wsserver.js:33` `wss.clients` null lúc shutdown → null-guard.

---

## [2026-06-05] Rà chủ động TOÀN BỘ widget (1 lượt thay vì test-sửa từng trang) — SOLVED (bulk)

**Trigger:** user "rà lại code... mỗi lần mỗi pass... có nhiều trang sửa hoài tốn thời gian" → audit trước thay vì reactive.

**Team:** 8-agent sweep 33 widget → 106 finding → critic dedupe 43 → commander áp ~70 fix theo wave (an toàn trước, verify từng wave).

**Applied (bulk-safe):**
- `JSON.parse(localStorage.getItem("cachedSettings"))` → `+ || "{}"` **×50 (25 file)** — chống `settings=null` crash downstream MỌI widget.
- Gỡ **~217 dòng** debug spam tổng (`fontLetterSpacing`/`[SharedIO] Connected`/`[SOCKET] Using`/`created/destroyed id`/`winSegment`/`Previewing`/fade/volume...) — chỉ `console.log/info` chứa marker, GIỮ console.error + instrument.
- null-guard `!settings.isPro` **×8**: coinmatch + wheelofactions (flat+dir) + goal + webcam/talking/overlay → `settings && settings.isPro === false` (all-pro khi settings null).
- `lastx` getSetting (flat+dir) → `(settings || {})[...]`.

**False-positives bắt được (ĐỌC trước khi sửa — đúng kỷ luật):** gcounter:125, viewercount:50, myactions:310, timer/index:59 — **đã có guard sẵn** → bỏ. (Bài học: KHÔNG áp mù audit finding, verify file thật.)

**DEFERRED (chưa làm — cần batch riêng / review):**
- **External CDN libs/fonts (~34):** Google Fonts dynamic load (`fonts.googleapis.com` line ~261 ×11 widget), GSAP+CircleType (wheel:15-16), Matter.js (cannon:428), lottie (myactions/songrequests:13). → cần tải lib về local + rewrite URL (như reference_widget_external_libs đã làm cho jQuery/socket.io). KHÔNG crash, chỉ latency font-switch + load lib.
- **transactionviewer** blocking loop (index:182-207, 100×30ms sync DOM) — risky, cần rAF.
- **chat / activity-feed / socialmediarotator** null-crash needs-review (template clone / iframe race / module-fail).

**Mechanism map:** [docs/WIDGET_MECHANISMS.md](docs/WIDGET_MECHANISMS.md) — render-entry + data-source mọi widget (đọc trước khi RE 1 widget).
