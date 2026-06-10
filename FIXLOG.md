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

## [2026-06-09] Overlay Library — card "Ghép xu" (Coin Match) chừa khoảng trống TÍM dưới — TÁI PHÁT NHIỀU LẦN — SOLVED (root xác định bằng full-team RCA)

> **Root caused TẬN GỐC** qua workflow wf_9418fde2 (5 Scout + Reconciler + 3 adversarial Verifier, **2 CONFIRMED / 0 refuted**). Bug này **đã đốt Gate 30d M-005→M-007 + nhiều mission** vì **mọi lần đều đánh NHẦM LỚP** (sửa iframe-height thay vì flex cross-axis).

**Symptom:** Trang Thư viện lớp phủ (`data-pageid=obsoverlays`), card **Coin Match** (TRỐNG, "No participants") chừa **khoảng trống TÍM** (`#2d0539` = nền card inline, KHÔNG phải xám) ở đáy; card **Coin Jar** (`#widgetCoinjarPro`) kế bên (jar+gift, cao hơn) thì không. Intermittent — lúc có lúc không tuỳ data live.

**TRUE root cause (2 LỚP — verify verbatim):**
- **LỚP A (cái PHẢI fix):** `.obsOverlayContainer` là **flex row KHÔNG set `align-items`** trong CSS gốc (`downloads/css/main.min.css` + `modules.css:1059-1064` = `display:flex;gap:16px;flex-wrap:wrap;justify-content:flex-start`, KHÔNG align-items) → browser default **`stretch`** → card Coin Match ngắn bị **kéo cao bằng** Coin Jar; iframe giữ height cố định → **nền card tím `#2d0539` lộ dưới iframe** = khoảng trống.
- **LỚP B (vì sao iframe ngắn — KHÔNG phải bug, là GỐC):** seed height khác nhau CỐ Ý — `generateWidget` seed CoinjarPro=**650px** (`deobfuscated.js:19297`) vs CoinMatch=**550px** (`:19301`). Loop `stretchIframes` gốc (`:19396-19400`) bám **clientHeight của WRAPPER `.obsOverlayOnPage`, KHÔNG bám content** → Coin Match settle ngắn hơn → `stretch` biến delta thành khoảng trống.

**Dead-ends PHẢI tránh (đã đốt 4+ mission — ĐỪNG lặp):**
- ❌ Override **iframe height bằng CSS** (`height:Xpx`/`flex-grow`/hardcode px). LỚP SAI. Gate 30d M-005→M-007 đốt 3 mission ở đây → phá gốc/bị revert/loop gốc grow đè.
- ❌ Sửa seed `deobfuscated.js:19301` (550px) — fragile bundle edit, Gate 30d cấm.
- ❌ Tưởng loop `stretchIframes` "grow theo content" (Scout-CSS sai) → bỏ qua align-items. THẬT: loop bám WRAPPER clientHeight.
- ❌ Sửa override loop `blockScript.txt:612/628/631` (SKIP guard/`||0`/step 20px) để "chống divergence" — verifier CONFIRMED **non-load-bearing** cho bug này (`||0` ở :628 là **dead code** vì seed luôn có sẵn; sau flex-start card về natural height → loop dừng sau 1 bước). FIXLOG cũ nghi SKIP-guard "kẹt ngắn" là lo của **chế độ stretch cũ**, moot sau flex-start. ĐỪNG tốn mission ở đây.
- ❌ **Verify bằng data live ngẫu nhiên** — khi Coin Match có người (populated) ≈ Coin Jar → KHÔNG lộ trống → tưởng đã fix. Bug CHỈ hiện ở **empty state**.

**Fix that worked (FINAL — chốt bằng HEADLESS MEASUREMENT qa/.measure, user xác nhận mắt):** [earlyCss.txt](backend-node/src/templates/earlyCss.txt) — KHÔNG đổi align-items (giữ gốc `stretch` → **card BẰNG chiều cao** = user yêu cầu "2 khung bằng chiều dài"). Làm **iframe FILL card** (giống ảnh gốc TikFinity user gửi): `.obsOverlayOnPage { display:flex; flex-direction:column }` + `.obsOverlayOnPage > *:has(iframe.lazy-frame) { flex:1 }` + `.obsOverlayOnPage iframe.lazy-frame { flex:1 1 auto; min-height:0 }` (KHÔNG `height:auto` — iframe height:auto co về 150px default!). **Đo qua Playwright headless (chromium cached, qa/.measure/measure4.js): MỌI card gap-dưới-iframe = 1px ✓ FILL; coinmatch+coinjar card 861=861 iframe 652=652 bằng y.** Scoped `.obsOverlayOnPage` (overlay-card riêng, không đụng .greyBackgroundSection chung). Control-page preview ONLY → OBS tải /widget trực tiếp (không có card) → KHÔNG dính.

**Hành trình ĐOÁN SAI (đã đốt nhiều vòng — bài học: ĐO, đừng đoán tĩnh):** (1) `align-items:flex-start` @.obsOverlayContainer → **trượt** vì card thật ra trong `.widgetsContainer` (gốc set flex lên CẢ HAI, main.min.css) + nó làm card SO LE (user reject). (2) `align-self:flex-start` @card → card so le, user muốn BẰNG. (3) tô iframe tối → không giải gap. (4) `[id^=widget]{flex:1}` → bắt nhầm `#widgetCoinmatchControls` (nút) → iframe không fill. → **CHỈ khi đo Playwright mới ra: card đã bằng (gốc stretch), gap là iframe không fill → `:has(iframe)` + flex:1.** Bộ đo giữ ở `qa/.measure/` để lần sau ĐO, không đoán.

**Vì sao TÁI PHÁT + enforcement chống lặp:**
1. **Cấu trúc:** gốc KHÔNG khai báo `align-items` → default `stretch` **tự âm thầm quay lại** mỗi khi 1 fix đụng container/card/page sizing mà không pin cross-axis.
2. **Đánh nhầm lớp:** mọi mission cũ tấn công **iframe-height** (lớp sai, bị revert) thay vì **flex cross-axis**.
3. **Bị che bởi data:** reference POPULATED (655≈660) tổng quát nhầm "card luôn bằng cao"; **KHÔNG có QA probe test empty state** → mọi verify thủ công miss.
4. **ENFORCEMENT (verifier coi BẮT BUỘC):** (a) thêm **gate-drift needle** `align-items: flex-start`@obsOverlayContainer vào `qa/registry.js` (gate-health bắt nếu future edit gỡ mất — ĐÃ thêm); (b) **gộp Gate 19/20/30d** thành 1 gate chỉ rõ **`align-items:flex-start` = chủ trục chiều-cao card (deviation cố ý)**, NEVER set per-widget iframe height bằng CSS (ĐÃ thêm note §Gate Overlay-Layout).

**Verify:** static = CSS hợp lệ + mọi citation đối chiếu verbatim (seeds 19297/19301, loop 19396-19400, CSS không align-items, blockScript 612/628/631). **PENDING runtime (1 probe → High):** mở Thư viện lớp phủ với Coin Match TRỐNG → hết trống tím; DevTools `$$('.lazy-frame').map(f=>f.style.height)` kỳ vọng CoinMatch ~550-570 / CoinjarPro ~650-670, card-bottom = iframe-bottom. Strike: 0.

**Optional (chưa cần):** selector earlyCss:135 chưa scope → flex-start cũng áp `goals`/`graphicoverlays` (vô hại); nếu 2 trang đó ragged → siết `.page[data-pageid=obsoverlays] .obsOverlayContainer`.

---

## [2026-06-09] Connect-fail KHÔNG báo gì (mạng chặn / không live) — FIXED (pending restart-verify)

**Symptom:** mạng chặn TikTok / kênh không live → bấm Kết nối thất bại nhưng **không hiện popup/thông báo gì** → user không biết kết nối được hay không.

**Root cause:** popup `showPopup` (modal giữa màn) **đã có sẵn** trong [blockScript.txt](backend-node/src/templates/blockScript.txt) `tfConnectErrorPopup` (~2497) nhưng kích **CHỈ bằng socket `connectFailed`** (comment 2760: "driven EXCLUSIVELY by socket event, no fallback poll") + `poll()` cố tình KHÔNG popup. → event rớt / socket chưa connect / connect treo / path không emit → im. Cộng: `connectFailed` chỉ broadcast khi `userClick:true` (routes/tiktok.js:97) mà **nút native setup primary-path** (`broadcastlistener.tryConnect`→`hookBridge.connect`→`doConnect(user)`) **thiếu userClick** → click thật vẫn im.

**RCA verify (workflow wf_10313884, 3 agent, 2 verifier NEEDS-TWEAK đồng thuận + reconcile):** trace decompiled — **cả 3 chỗ gọi `tryConnect` đều user-initiated** (topbar/setup/username-edit), KHÔNG có auto-reconnect ngầm → mở userClick cho path này AN TOÀN. Backend `status()` đã expose `lastError`/`lastErrorAt` (957-958); `lastErrorAt` chỉ tiến khi userClick (502) → dùng làm tín hiệu fallback an toàn (auto-reconnect userClick:false → không bao giờ trigger).

**Fix that worked (backups `.bak-2026-06-09-pre-connectpopup`):**
1. **Fallback poll** (blockScript `tfConnectErrorPopup.poll`): `lastErrorAt` tiến (> baseline chốt ở poll đầu) + `!connecting && !connected` + grace 10s + debounce 5s vs socket → gọi `showPopup`. Bắt cả khi socket lỡ. KHÔNG mis-fire bootstrap (userClick-gated + baseline).
2. **Coordination**: socket listener set + check `lastPopupShownTime` (debounce) → KHÔNG double/flicker.
3. **Message song ngữ**: broaden `isOffline` (room-id/all-sources/network) + body nêu **3 nguyên nhân**: chưa LIVE / mạng chặn TikTok (thử tiktok.com, VPN) / sai tên kênh. Login button vẫn hiện cho lỗi session-fixable (verified).
4. **User-intent flag** (tf-connect.js): click (topbar handler + native button) set `_userConnectIntentUntil`; `hookBridge.connect` đọc → `doConnect(user, true)` khi trong cửa sổ → path tryConnect cũng userClick:true. Deterministic, không double-fire, không bootstrap mis-fire.
5. **Escape username** trước innerHTML (chống self-XSS `<img onerror>`).

**Verify:** static = tf-connect node --check OK + blockScript inline #2 OK. **PENDING runtime (MANDATORY §6.1):** RESTART → mạng chặn/không-live → bấm **nút native setup** + topbar CTA → DevTools body có `userClick:true` + popup hiện + đúng 1 popup. Strike: 0.

---

## [2026-06-09] Coin-jar console error STORM (window.addGift + drawImage broken + HTTP2 + promise) — FIXED (pending restart-verify)

**Symptom:** preview coin-jar ngập lỗi (384+ console): `Uncaught TypeError: window.addGift is not a function`, loạt `ERR_HTTP2_PING_FAILED` ảnh tiktokcdn, `InvalidStateError: drawImage ... 'broken' state` (coin-jar.js:6522), ~10× `Uncaught (in promise) Event`. "cứ z hoài".

**RCA (workflow wf_806eb47d, 12 agent, 4 verifier — 4 CONFIRMED / 2 REFUTED):**
- **KEYSTONE RC-1:** [electron/main.js] đăng ký `onBeforeRequest` **3 LẦN** trên cùng `session.defaultSession` (BLOCK 1124 / tiktokcdn→cache 1145 / tf-cdn 1170). **Electron chỉ dùng listener CUỐI** (setter REPLACE, không additive) → chỉ tf-cdn sống; **redirect tiktokcdn + BLOCK telemetry CHẾT** từ 2026-06-03 (bak-2026-06-03-pre-tfcdn có 2 listener, thêm tf-cdn thành 3). → ảnh gift load thẳng tiktokcdn → fail HTTP2 → broken → coin-jar.js `drawImage` ném MỖI FRAME (~12k lần renderer-errors.log). Backend proxy `cdnProxyFetch {fallbackImage:true}` (index.js:495-539) ĐÚNG sẵn, chỉ không bao giờ được gọi vì redirect chết.
- RC-2 (drawImage storm) / RC-3 (promise) / HTTP2-spam đều là **HỆ QUẢ của RC-1**.

**Dead-ends / REFUTED (đừng làm):**
- ❌ addGift-queue toàn bộ + coinmatch: RC-4 `addGift is not a function` = **0 lần trong renderer-errors.log** (race load-gated, module `type=module` defer luôn thắng 'load'). coinmatch preview ĐÃ guard sẵn (line 68). → KHÔNG cần queue rộng. *(NHƯNG user CÓ thấy 1 lần trên màn hình → vẫn thêm stub-queue nhẹ.)*
- ❌ Sửa `.catch` trong coin-jar.js (obfuscated bundle): fragile, mất khi rebuild, không cứu OBS. REFUTED.

**Fix that worked (backups `.bak-2026-06-09-*`):**
1. **FIX-A keystone** [electron/main.js]: **gộp 3 `onBeforeRequest` → 1** listener, filter = UNION, dispatch theo host strict if/else (BLOCK→cancel, tiktokcdn→/tiktok-img-cache, tf-cdn→/tf-cdn, else fail-open). Host-matcher BLOCK derive từ BLOCK_URLS (no drift). **Unit-test dispatch 13/13** (gồm SSRF `evil-tiktokcdn.com.attacker.net`→PASS). → ảnh qua proxy → transparent-PNG 200 kể cả khi mạng fail → hết broken → tắt cả storm, MỌI widget trong Electron.
2. **FIX-B** [coinjar/index.html + coinjar.html]: shim patch `HTMLImageElement.prototype.src` rewrite `*.tiktokcdn.com`→`/tiktok-img-cache/` (CHỈ tiktokcdn; chừa assets.tikfinity.com/local/data/blob — jar-skin assets.tikfinity.com KHÔNG được rewrite). Cứu **off-DOM new Image() + OBS/standalone** (không có Electron intercept) + bền qua rebuild.
3. **FIX-C-lite** (2 coinjar HTML): stub `window.addGift` queue trước mount + drain sau `CoinJar.mount` (coin-jar.js gán addGift **vô điều kiện** → overwrite stub an toàn). Giết TypeError user thấy, không mất gift sớm.
4. **FIX-D′** (2 coinjar HTML): `unhandledrejection` guard scope `e.reason instanceof Event` (mute noise ảnh, Error thật vẫn nổi).

**Verify:** static = main.js node --check OK + dispatch 13/13 + 2 coinjar inline scripts parse 2/2 mỗi file. **PENDING runtime:** RESTART Electron → mở coinjar preview → backend log BÙNG `[REQ] GET /tiktok-img-cache/...` (trước ~0-1), console hết `ERR_HTTP2_PING_FAILED` + hết `drawImage broken` + hết `addGift not a function`. Strike: 0.

**Còn OPEN (riêng, đừng gộp):** RC-6 — 12 widget vẫn ship CDN lib ngoài (jquery/gsap/matter/lottie/font-awesome) hang OBS. Re-surface: `node qa/run-all.js` (KHÔNG --only). Lưu ý: run-20260609-073930 "52/52 PASS" là **--only gate (0 widget)** — đừng tin là đã sạch widget.

---

## [2026-06-09] Pill "LIVE"/nút "Disconnect" vs "Disconnected" dưới avatar — LỆCH (desync) — FIXED (pending restart-verify)

**Symptom:** topbar hiện pill "LIVE" đỏ + nút "Disconnect" (tưởng đã kết nối) NHƯNG dưới avatar ghi "Disconnected". Không đồng bộ.

**Đo runtime (curl /api/tiktok/status):** `connected:FALSE, isLive:FALSE`. → **"Disconnected" dưới avatar mới ĐÚNG**; pill+button là **STALE**.

**Root cause:** [tf-connect.js](downloads/js/tf-connect.js) `startPolling` **dừng poll ngay khi `connected`** (line ~202 `stopPolling()`); `checkBackendStatus` chỉ chạy 1 lần lúc load. → sau khi backend rớt giữa chừng (WS-drop 15'), frontend (`_connected` + Pinia nav store `isLive`) **không cập nhật** → button/pill kẹt LIVE. Under-avatar (`tfPatchLiveBadge`/`setStatusPill` poll mỗi 1s) thì honest → lệch. (3 chỉ báo từng đọc nguồn khác nhau: button+pill=`_connected` stale, under-avatar=`account.isLive` strict.)

**Fix that worked (3 file, backups `.bak-2026-06-09-*`):**
1. [tf-connect.js] `monitorBackendStatus()` setInterval 3s — frontend **BÁM** `/api/tiktok/status` liên tục, reconcile `_connected`/`_connecting` qua `updateUI` khi lệch (chỉ khi đổi state → không flicker). → button + nav pill theo backend thật.
2. **Adversarial review (code-reviewer, SHIP-WITH-TWEAK) → 3 hardening:**
   - `_uiBusyUntil` guard: monitor nhường khi user đang click connect/disconnect (chống giẫm hành động đang bay).
   - [tiktok-bridge.js] `scheduleReconnect` set `_state.connecting=true` suốt cửa sổ reconnect → UI hiện "Connecting..." liền mạch (hết nháy "Connect" idle); give-up → `connecting=false`.
   - [blockScript.txt] `tfPatchLiveBadge` đổi từ `account.isLive` → **`d.connected`** → **cả 3 chỉ báo cùng 1 nguồn `connected`** = hội tụ.

**Tradeoff (ghi rõ):** under-avatar giờ bám `connected` (revert phần strict của Gate 16). "LIVE sau khi stream tắt ngầm" bị chặn bởi watchdog 4' + streamEnd (clear `connected`) → cửa sổ sai ≤4 phút, chấp nhận được để đổi lấy đồng bộ.

**Verify:** static = node --check OK ×2 + blockScript validator #2 OK + bridge load OK. **PENDING runtime:** RESTART app (tf-connect cache clear on boot; bridge=service) → rớt 1 lần: button/pill/under-avatar PHẢI cùng đổi Disconnected→Connecting→LIVE. Strike: 0.

**Còn OPEN (riêng):** connect-fail KHÔNG báo gì (mạng chặn TikTok) — đã chẩn (popup chỉ phụ thuộc 1 socket `connectFailed`, gỡ mất fallback poll lastErrorAt + watchdog timeout) — CHƯA fix.

---

## [2026-06-08] Kết nối TikTok "chạy 15-20 phút rồi dừng" (mid-stream WS drop, no reconnect) — FIXED (pending runtime verify)

**Symptom:** user live bình thường, sau ~15-20 phút app báo Disconnected dù vẫn đang live; phải bấm Connect lại tay.

**RCA (workflow wf_91e6c62e, 8 agent, 3/3 verifier CONFIRMED — KHÔNG đoán, đo log thật):**
- Đo: connect 01:15:20 → `[Broadcast] disconnected` 01:30:00 (~14m41s). Event cuối (coin-jar:gift) 01:27:57 → im lặng tại lúc drop = **123.6s < 240s** `EVENT_SILENCE_TIMEOUT_MS`.
- Toàn log (12,736 dòng): **0** dòng `watchdog`, **0** `streamEnd`, **0** reconnect/`POST /api/tiktok/connect` sau drop (42 phút chỉ poll status).

**Loại trừ (ĐỪNG nghi lại):**
- ❌ Watchdog 4 phút — toán học loại: drop ở 2 phút im lặng < 4 phút → watchdog KHÔNG thể bắn. Đừng nới `EVENT_SILENCE_TIMEOUT_MS` (sai lớp).
- ❌ Stream-end thật — nếu host tắt sẽ có `streamEnd` event; log 0 dòng → là **WS transport drop khi VẪN live**.

**Root cause:** `tiktok-live-connector` (dist/lib/client.js:424-426) bắn 1 `disconnected` khi TikTok đóng/xoay WS rồi DỪNG (không tự reconnect). Bridge handler (`tiktok-bridge.js` cũ 510-516) chỉ `_state.connected=false` + broadcast — **KHÔNG reconnect, không log code/reason**. `bridge.connect()` chỉ có 1 caller (POST /api/tiktok/connect thủ công) → session chết, ở yên.

**Fix that worked (tiktok-bridge.js, backup `.bak-2026-06-08-pre-reconnect`):**
1. **Observability:** `conn.on('disconnected', (info) => …)` log `code`/`reason` (trước bị vứt) → drop kế tiếp tự chẩn được.
2. **Auto-reconnect có guard (§8):** `scheduleReconnect(channelId, username)` — backoff 4→8→16→32→60→60s, cap 6 lần; chỉ kích từ handler `disconnected` LIVE (user-disconnect/profile-switch/watchdog đều `removeAllListeners` TRƯỚC `disconnect` → không bao giờ tới handler). Guard staleness bằng **`_state.username`** (user đổi/ngắt account → reconnect cũ tự skip), KHÔNG cần generation-token. `clearReconnectTimer()` ở disconnect()/connect(userClick)/watchdog. Reset attempts ở handler `connected` (success).
- **Không double-fire:** reconnect đi qua connect()→disconnect()→wireEvents, conn cũ đã removeAllListeners → không 2 conn sống. Points là delta per-event, không replay.

**Verify:** static = `node --check` PASS + module load OK (exports nguyên). **PENDING runtime:** bật app, để rớt 1 lần (hoặc force-drop) → log phải có `disconnected … code= reason=` → `scheduling auto-reconnect 1/6` → `auto-reconnect succeeded`; chat sau đó +1 (không +2). Strike: 0 (fix lần đầu, RCA-backed).

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

## [2026-06-06] TTS Logs trống / TTS không đọc chat / control-page không nhận live event — FIX applied (chờ user verify)

**Symptom:** trang TTS "TTS Logs: No Entries" dù đang LIVE + chat chảy. (Cùng gốc: gift FX live trên control page cũng chết.)

**Dead-end (ĐỪNG lặp):** ❌ Workflow 4-finder đầu đổ lỗi `broadcastToChannel` line 356 (appType filter) — **verifier BÁC** (appType='' falsy → không lọc). ❌ Đổ lỗi field-mismatch `payload.auth` vs `payload.token` — sai, vì handleLogin có findDefault fallback nên token-fail vẫn ra channelId=1.

**Root cause (runtime log — SMOKING GUN, không đoán):** `grep "login ok"` trong backend-debug.log → **25 login TẤT CẢ `appType=widget`, ZERO `appType=controlpage`**. Control-page socket (bundle main, `this.socket=socketiowrapper.io`) **CONNECT** (emit distributeEvent OK) nhưng **KHÔNG BAO GIỜ login** → `socket.data.channelId` ở **0** (init) → `broadcastToChannel` line 355 `if(channelId!==1) continue` **lọc nó ra** → chat/gift `delivered=1 to=[relay]` (chỉ relay, relay có exception line 344) → `broadcastlistener.onChat` (app:71822) không fire → `tts.onChat` (modules:6192) không chạy → `tts.log` (6167) không gọi → Logs trống. `setContext` (socket-manager:38) cũng `Number(payload.channelId)||0` KHÔNG fallback (clone single-channel gửi channelId=0).

**Fix that worked (chờ verify):** `socket-manager.js` — (a) helper `defaultChannelId()`=findDefault; (b) connect: `socket.data.channelId = defaultChannelId()` thay vì 0; (c) setContext: fallback findDefault khi channelId<=0 (mirror handleLogin) + log. **Verify (log):** `Client connected ... defaultChannel=1` ✓. An toàn: widgetSettings vẫn appType='widget'-scoped → KHÔNG lọt control page → không reload-loop.

**⚠ CHỜ VERIFY:** control-page socket chỉ connect khi vào MAIN app (sau connect TikTok); app sau restart ở `/tiktok/setup`. User phải reconnect TikTok → chat → xem TTS Logs có entry + backend `chat delivered=2 to=[relay,controlpage]` + `/api/tts/generate` fire. **⚠ WATCH double-fire:** control page giờ xử lý live event — nếu điểm/action nhân đôi → backend đang act trùng (xem [[reference_points_actions_clientside]]).

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

<!-- QA-AUTO-FAILURES:BEGIN -->

### 🤖 AUTO-DETECTED FAILURES — 2026-06-10 15:05

_Không có FAIL ở run 20260610-150511. ✅_

<!-- QA-AUTO-FAILURES:END -->
