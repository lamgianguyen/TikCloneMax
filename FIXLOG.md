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

## [2026-06-12] TTS KHÔNG đọc chat — ROOT CAUSE THẬT: `setIntervalFix` driver CHẾT (queue tick không bao giờ fire) — FIX applied (chờ hard-reload verify)

**Status:** PARTIAL (fix applied [blockScript.txt](backend-node/src/templates/blockScript.txt) `tfEnsureIntervalFixDriver`, chờ user Ctrl+Shift+R + chat verify `[TTS-GEN]` chạy).

**⚠️ SUPERSEDES giả thuyết trước (seed ttsAuthToken / AI-voice wedge) — cả 2 đều SAI/không phải gốc.** Runtime probe `[CLIENT][TTSQ]` chốt hạ.

**Bằng chứng quyết định (probe):** chat feed chảy (51 `[CLIENT][TTS-CHAT]`), queue NHẬN item (`qlen=3→4→5 TĂNG`), nhưng `cur=null` + `[TTS-GEN]=0`. → queue **nhận mà KHÔNG xử lý**: `cur=null` (KHÔNG kẹt trên item nào) + qlen tăng (không shift) = **tick không bao giờ gọi `next()`**.

**Root cause (app deob:68624-68695):** TTSQueue tick = `setIntervalFix(tick, 100)` (app:69518) — chỉ ĐĂNG KÝ callback vào `_0x233e2f`. DRIVER chạy callback (`_0x18eb3b`, app:68636) = `setInterval(driver, 500)` (app:68627) **chỉ start khi `initIntervalFix(socketiowrapper.io)` chạy** — trong handler `connect` của socketiowrapper GỐC (app:70707). **Clone connect chat qua FEED SOCKET RIÊNG (tfChatFeedToModules) → socketiowrapper gốc KHÔNG connect → `initIntervalFix` không bao giờ gọi → driver 500ms không start → MỌI `setIntervalFix` loop chết, gồm tick queue TTS** → item dồn vô hạn, không phát. (`socketiowrapper` KHÔNG phải global — verified.)

**Khớp mọi triệu chứng lịch sử:** queue-exceeded 840 (queue đầy vì không drain) + 0 [TTS-GEN] (không item nào tới new Audio) + cur=null. Giả thuyết "AI-voice play hang" (workflow) SAI vì cur=null (không kẹt play); seed ttsAuthToken (Lô 6) vô hại nhưng không phải gốc.

**Fix that worked (applied 2026-06-12, [blockScript.txt](backend-node/src/templates/blockScript.txt) IIFE `tfEnsureIntervalFixDriver`, backup `.bak-2026-06-12-pre-intervalfix`):** tự gọi `window.initIntervalFix({on:noop})` sớm (retry boot-race) → start driver 500ms → mọi setIntervalFix loop (gồm tick queue) fire. Idempotent (guard `!_0x1591b4` nội bộ) nên nếu bundle có gọi sau cũng no-op. Parse OK, vào HTML serve (reload-html).

**Verify (PENDING):** Ctrl+Shift+R → chat chảy → probe phải thấy `qlen` DAO ĐỘNG (không tăng mãi) + `cur=vid=...` (đang đọc) + `[TTS-GEN]` chạy + nghe tiếng. renderer log `[TF-intervalfix] driver started`. Nếu chạy → đây là gốc; gỡ probe sau.

**Bài học:** "fix-rồi-vẫn-lỗi" nhiều vòng vì đoán tĩnh (wedge/seed). Probe runtime (`cur=null` + `qlen tăng`) phơi đúng gốc trong 1 lần. Driver setIntervalFix d:p phụ thuộc socketiowrapper-connect mà clone bypass — **lớp lỗi MỚI**: mọi feature bundle dùng `setIntervalFix` có thể dormant (cannon opacity, v.v.) — fix này bật lại HẾT.

---

## [2026-06-12] PERF audit — lag/đơ (mở Lớp phủ lag màn hình, bấm dropdown freeze) — workflow `tikmax-perf-audit` 8 agent: 4 CRITICAL / 13 HIGH / 10 MED / 9 LOW

**Full report:** task `wcp4k7oe7`. **Nguồn lag CHÍNH:** shipped bundle lazy-LOAD iframe nhưng KHÔNG unload off-screen (`about:blank` count=0; bản decompiled mới CÓ tại :20091 nhưng chưa ship) → cuộn 1 vòng Lớp phủ = ~24 iframe sống mãi (socket + 60fps loop không pause).

**4 CRITICAL:** (1) iframe off-screen không unload [overlay-library]. (2) dropdown specific-gift (Event editor :9881) + simulate-gift (:6635) bind FULL 3386 gift → freeze 8s, **Gate 34 KHÔNG phủ** (chỉ phủ sounds.loadTriggers). (3) coinjar tích body vật lý VÔ HẠN (coin-jar.js:7066 no cap) → crash stream dài. (4) widget physics không pause khi hidden (cannon dual-rAF, fallingsnow video, likefountain demo) → N loop 60fps song song.

**Quick-wins ĐÃ LÀM (2026-06-12, batch an toàn):**
- **TRUNCATE_LIMIT 500→200** ([blockScript.txt](backend-node/src/templates/blockScript.txt):1221) — trigger dropdown nhẹ hơn (user bấm trúng vụ này).
- **likefountain typo** ([likefountain.html](downloads/widget/likefountain.html):409) `typeof settings !== undefined` (tautology, post 10Hz hoài) → `!== 'undefined'` + dirty-check.
- **heart-fountain demo loop** ([heartFountain-BnZsuEF4.js](downloads/widget/vite/assets/heartFountain-BnZsuEF4.js)) gate `localhost`→`?demo=1` (15 tim/5s chạy hoài trên mọi card vì lib serve từ localhost). backup `.bak-2026-06-12-pre-demoloop`.
- **circletype localize** ([wheel.html](downloads/widget/wheel.html):16 + wheel/index.html:14) → `/js/lib/circletype.min.js` (15KB tải về) — chữ cong wheel hết hang OBS/offline.
- **⭐ iframe off-screen UNLOAD (fix lag #1)** ([blockScript.txt](backend-node/src/templates/blockScript.txt) IIFE `tfUnloadOffscreenOverlayIframes`) — IntersectionObserver riêng observe `iframe[data-src]`: off-screen (rootMargin 600px hysteresis) → save src vào `data-tf-src` + `src='about:blank'`; vào lại → restore. Port logic từ decompiled :20091-20096 (bản mới có, shipped chưa). Không fight loader gốc (cả 2 đều muốn data-src lúc enter). → cuộn Lớp phủ chỉ giữ iframe đang nhìn sống, phần còn lại blank → giải phóng socket + 60fps loop. Parse OK.

**CHƯA LÀM (cần care, theo thứ tự):** (B) gift dropdown truncate — **KHÔNG đụng getAllGifts** (Gift Browser cần 3386, Gate 21); wrap getGiftDataSource HOẶC paginate. (C) coinjar FIFO cap (deviate gốc → cần user OK / expose setting). (D) widget visibility-pause. (E) backend: rooms thay full-scan broadcast + debounce aggregates + cap userAvatars Map. (F) gỡ tfProbeTtsQueue (giữ tới khi verify TTS xong) + drop chat khỏi [Broadcast] log + gộp 2 status-poll.

---

## [2026-06-12] "Chat lúc có lúc không / tự ngắt sau ~4-5 phút" — ROOT CAUSE: `authenticateWs` KHÔNG bao giờ bật → session hợp lệ vẫn chạy free Eulerstream — FIX applied (chờ verify live)

**Status:** PARTIAL (fix applied tiktok-bridge.js, chờ user restart + connect verify chat ổn định qua mốc 5 phút).

**Phát hiện qua full-app audit (workflow `tikmax-full-audit`, 8 agent static). Đây là CRITICAL duy nhất — và là gốc của intermittent chat + TTS đứng theo.**

**Root cause:** `tiktok-bridge.js` set `ctorOpts.sessionId` + `ctorOpts.ttTargetIdc` NHƯNG KHÔNG set `ctorOpts.authenticateWs`. Connector (`tiktok-live-connector/dist/lib/client.js:199-200`) **chỉ forward sessionId/ttTargetIdc vào signed-WS fetch khi `authenticateWs` truthy** — không thì cả 2 bị truyền `undefined`. → session hợp lệ bị **bỏ phí**, live WS vẫn dùng **free Eulerstream** → đúng vòng "connect → vài event lọt → WS chết ~4-5 phút → watchdog giết → reconnect → chat chập chờn". Log cũ `sessionId=YES (authenticated)` là **BÁO LÁO** (chỉ check ctorOpts.sessionId, không phải authenticateWs).

**Liên đới:** vụ FIXLOG [2026-06-11] "chat lúc có lúc không = Eulerstream free flaky" — đúng triệu chứng nhưng **chưa tới gốc**: tưởng phải mua signing key, thật ra chỉ thiếu 1 cờ. `authenticateWs` làm TikTok coi WS như viewer-đã-login (ổn định) — KHÔNG cần signing key trả phí.

**Fix that worked (applied 2026-06-12, [tiktok-bridge.js](backend-node/src/services/tiktok-bridge.js):284, backup `.bak-2026-06-12-pre-authws`):** thêm `ctorOpts.authenticateWs = true` trong block `if (sessionId && ttTargetIdc)`; + warn riêng khi sessionId có mà ttTargetIdc thiếu (silent downgrade, HIGH finding); + sửa log `auth mode: ws=AUTHENTICATED/free signHost=...`. node -c PASS.

**Lỗi nối tiếp (đã xử):** bật authenticateWs → connector ném `AuthenticatedWebSocketConnectionError: no whitelist host defined. Set WHITELIST_AUTHENTICATED_SESSION_ID_HOST`. Đây là **chốt bảo mật**: với authenticateWs, connector forward sessionid TikTok cho **sign server (Eulerstream) để ký WS** → bắt user opt-in host. Check (`tiktok-live-connector/dist/lib/web/routes/fetch-signed-websocket-euler.js:26-33`): `envHost === URL(signBasePath).host`, basePath mặc định `https://tiktok.eulerstream.com`. FIX: bridge tự set `process.env.WHITELIST_AUTHENTICATED_SESSION_ID_HOST = new URL(SIGN_API_URL || 'https://tiktok.eulerstream.com').host` → khớp. ⚠️ ĐÁNH ĐỔI: session cookie gửi cho Eulerstream (bên thứ 3). ⚠️ authenticated WS có thể là **premium** Eulerstream → nếu test ra 402 PremiumFeatureError thì revert giữ free.

**Verify (PENDING):** restart Electron + connect → chat phải chảy LIÊN TỤC qua mốc 5 phút (hết "tự ngắt"); backend log `auth mode: ws=AUTHENTICATED (sessionId)`; watchdog `no events 255s` thưa hẳn/biến mất. Nếu authenticated WS bị TikTok từ chối (1 số account) → revert + giữ free + chấp nhận flaky.

**⚑ Backlog audit 2026-06-12 (9 lô, xem report đầy đủ ở task wgp4uj3lx):** 56 OK / 1 CRITICAL (đã fix Lô 1) / 8 HIGH / 11 MEDIUM. Lô 2: route thiếu (setProfileName/importActions/startChallenge/endChallenge → 404 toast). Lô 3: points routes (executeHalving/transferAmountToUser) + pro alias (setPaymentMethod//stripe/activate). Lô 4: alias de-prefix goal*/gcounter* (settings revert reload/OBS — class chung, generic-alias `widget_<group>_<field>`). Lô 5: localize CDN (circletype@wheel HIGH, streambuddies Vite, fallingsnow .webm, google fonts). Lô 6: TTS AI voice (tfHandleTtsPreview trả 201 thay 503; Random Voice loại giọng AI khỏi pool HOẶC seed window.ttsAuthToken — audit SỬA premise: AI stall ≤15s KHÔNG vô hạn, chat đứng thật ra do connection drop = CRITICAL trên). Lô 7-9: security hardening (Socket.IO cors origin:true, ACAO:* + credentials, execPsCommand/handleFetchUrl) / christmas-event relay / verify better-sqlite3 ABI packaged.

---

## [2026-06-12] TTS NHẬN chat nhưng KHÔNG ra tiếng — ROOT CAUSE: bundle TTSItem play non-AI voice tới endpoint CHẾT (Google key revoked / zerody proxy) — FIX: Electron redirect → /api/tts/generate (chờ user restart verify)

**Status:** PARTIAL. Redirect fix CHẠY cho giọng thường (Voice Tester ra tiếng + `[TTS-GEN]` log). NHƯNG chat thật vẫn câm → **lỗi THỨ 2** (xem update dưới).

**UPDATE 2026-06-12 — lỗi thứ 2: QUEUE KẸT do Random Voice bốc giọng AI (workflow `tts-queue-freeze-rca`, 4 agent, confidence MEDIUM):**

Sau khi redirect chạy: Voice Tester (click) ra tiếng + sinh `[TTS-GEN]`, NHƯNG chat thật **0 `[TTS-GEN]`** + renderer log spam `"TTS queue size exceeded"` ×187 (queue đầy không rút).

- **Bằng chứng quyết định:** 8 dòng `[TTS-GEN]` đều là `Testuser` (Voice Tester). Chat thật vào #ttsLogs (đã queue) nhưng KHÔNG câu nào sinh `[TTS-GEN]` → queue nhận item mà **không gọi `play()` tới `new Audio`**.
- **Root cause:** bật **"Random Voice"** (`checkboxTtsRandomVoiceV2`) → `generateTtsItem` (modules:6143-6145) BỎ QUA "default", bốc giọng ngẫu nhiên từ `tts.getVoices()` — pool **chứa giọng AI** (`tts_api__…`, modules:5991-6013). Câu trúng giọng AI → TTSItem ctor set `requestMode="post"` (app:69252-69264) → `play()` case 15→18 `await requestAiTtsAudio()` **TRƯỚC khi tạo Audio + trước khi arm timeout** (timeout ở case 34, app:69408-69413 = SAU await). Await này treo → `play()` đứng mãi → TTSQueue `currentItem` (app:69498/69501) không clear → tick 100ms (app:69493 `if !currentItem`) không gọi `next()` → **1 item AI kẹt = chặn TOÀN BỘ queue** (head-of-line) kể cả câu giọng-thường → 0 `[TTS-GEN]` + queue đầy mãi.
- **Vì sao Voice Tester chạy:** `testTtsItem.play()` gọi THẲNG (không qua queue → không bị chặn dây chuyền) + dùng giọng đã chọn (không random) → đường Google → case 26 `new Audio` → redirect → `[TTS-GEN]`.
- **Đã loại trừ (3 scout):** queue-pause (`running` luôn true, không chỗ nào `tts.queue.pause()`); autoplay (Electron mặc định `no-user-gesture-required`, KHÔNG set policy; mà autoplay-block vẫn fetch → vẫn `[TTS-GEN]`); google/zerody path (nếu chạy đã sinh `[TTS-GEN]`); AI-reject (nếu reject thì queue rút). Còn lại đúng = case-18 await treo trên item AI.
- **Confirm 1-click (chờ user):** TẮT Random Voice → chat dùng default → google case-26 redirect → CHẠY. Nếu tắt-mà-chạy = chốt thủ phạm.
- **Fix robust = Lô 6 (APPLIED 2026-06-12, [blockScript.txt](backend-node/src/templates/blockScript.txt):1812 IIFE `tfSeedAiTtsAuthToken`, backup `.bak-2026-06-12-pre-ttsauthseed`):** ROOT XÁC NHẬN từ code: `getAiTtsBackendContext` (app deob:69019-69029) check `window.appConfig.ttsHost` **AND `window.ttsAuthToken`**. Clone chỉ set `window.token` (`tfBootstrapWindowToken` blockScript:1775) — **SAI FIELD** → ctx null → `requestAiTtsAudio` (app:69080) `await ensureAiAuthToken()` **TREO VĨNH VIỄN** (audit đoán ≤15s là SAI — thực tế 0 [TTS-GEN] + 392 queue-exceeded sau nhiều phút). FIX: seed `window.ttsAuthToken` (JWT shape Pro hợp lệ, btoa) + `appConfig.ttsHost` → ctx non-null → AI path SKIP ensureAiAuthToken → resolve ngay qua `tfHandleTtsGenerate` mock → `new Audio('/api/tts/generate?voice=en_us_002…')` → `[TTS-GEN]` → queue rút + giọng AI phát (en_us_002). Token KHÔNG bị verify local (tfHandleTtsGenerate bỏ qua Bearer); JWT decode ra subscriptionEnabled=true nên chip Pro không vỡ. Parse OK (strip `{{placeholder}}` + node -c). **Cần user reopen app (load blockScript + queue mới) verify: `[TTS-GEN]` chạy đều + nghe tiếng + Random Voice bật vẫn OK.**
- **Instrument đang bật (gỡ sau khi xong):** `[TTS-GEN]` log ở [routes/tts.js](backend-node/src/routes/tts.js) (entry + OK bytes).

**Status redirect fix (lỗi 1):** PARTIAL (fix applied, chờ user restart Electron + nghe tiếng).

**Symptom (user):** Sau khi fix feed (entry dưới) chạy — TTS Logs ĐẦY chat thật của viewer (`t.ng.tin61`, `Avang: mô phật`...), backend log `[CLIENT][TTS-CHAT]` 13 dòng → **TTS NHẬN chat OK**. Nhưng **"không nghe gì hết"**. Voice Tester (Play "This is a test!") cũng không/khó nghe.

**TRUE root cause (decompiled/app/deobfuscated.js:69214 `var TTSItem`):** engine TTS thật nằm TRONG bundle (app.js), constructor chọn đường audio theo voiceId (@69230-69273), `play()` = `new Audio(apiBaseUrl + params)` GET thẳng cross-origin:
- `voiceId === "default"` / `google_*` → **`https://www.google.com/speech-api/v2/synthesize?key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&...`** — **Google API key ĐÃ BỊ REVOKE** → 403 → **CÂM**.
- standard TikTok voice (else, voiceConfig null) → **`https://tikfinity-tts-api.zerody.one/api/voice/generate`** — proxy TikFinity gốc, clone KHÔNG control → câm.
- CHỈ **AI voice** (voiceConfig != null) → `POST /api/tts/generate` → blockScript `tfHandleTtsGenerate` → audioUrl=`/api/tts/generate?voice=en_us_002` → CHẠY (đường duy nhất sống).
- User để **Default Voice + Random Voice** → trúng 2 đường chết → câm.

**Trả lời "máy có voice model nào không":** KHÔNG dùng giọng máy (speechSynthesis). Đường sống duy nhất = `/api/tts/generate` (proxy TikTok TTS, đã ĐO ra audio thật: en_us_002=34KB, en_female_f08_salut_damour=118KB, en_male_m03_lobby=100KB — status 200 audio/mpeg).

**Dead-ends (ĐỪNG LẶP):**
- ❌ **Suýt sửa [downloads/js/tts.js](downloads/js/tts.js)** (file có `speechSynthesis` + class TTSItem/TTSQueue). **ĐÓ LÀ DEAD CODE** — KHÔNG ref trong index.html, backend log KHÔNG có request `/js/tts.js`, app.js+modules.js KHÔNG load nó. READ-GỐC-FIRST cứu: engine THẬT = app.js `var TTSItem=(function(){...})()` (obfuscated), KHÔNG phải file js/tts.js. Sửa js/tts.js = vô tác dụng.
- ❌ speechSynthesis là RED HERRING — shipped bundle (app.js+modules.js) `grep speechSynthesis = 0`. Bundle dùng `new Audio(url)`, KHÔNG dùng Web Speech.
- ⚠️ **TTS Logs hiện chat ≠ audio chạy** — `tts.log()` (populate #ttsLogs) ở modules.js:6167 chạy TRƯỚC khi tạo TTSItem (6185) + trước quota gate. Logs đầy chỉ chứng minh `generateTtsItem` chạy, KHÔNG chứng minh play ra tiếng.

**Fix that worked (applied 2026-06-12, [electron/main.js](electron/main.js) merged onBeforeRequest, backup `.bak-2026-06-12-pre-tts-redirect`):** thêm nhánh (c2) + 2 host vào filter → redirect `www.google.com/speech-api/*` + `tikfinity-tts-api.zerody.one/*` → `${BACKEND}/api/tts/generate?voice=<map>&text=<text>` (`buildTtsRedirect`: zerody truyền thẳng ?voice=, Google default→en_us_002, gender=male→en_us_006). Bắt request `new Audio()` ở tầng network (chỗ DUY NHẤT intercept được native Audio GET) — mirror Gate 33 (tiktokcdn). node -c PASS; unit-test redirect PASS (text tiếng Việt + voiceId preserve).

**Verify (PENDING):** main.js đổi → **PHẢI restart Electron** (§11). Sau restart: connect stream + chờ chat → nghe tiếng đọc? DevTools Network: request google/zerody → 307 → localhost/api/tts/generate (audio/mpeg). Nếu vẫn câm → check autoplay policy Electron / TikTok session expired (503 generate).

**Note đường gốc khác:** OBS/standalone widget KHÔNG có Electron intercept — nhưng TTS là feature control-page (chạy trong Electron) nên OK. Nếu sau này cần TTS chạy ngoài Electron → phải wrap `window.Audio` trong blockScript thay vì webRequest.

---

## [2026-06-11] TTS Chat + in-app Chat page TRỐNG dù chat chảy — ROOT CAUSE: clone bypass connector bundle → broadcastlistener.onChat không được feed — FIX ATTEMPTED (chờ user verify)

**FIX (best-effort, 2026-06-11, reversible):** [blockScript.txt](backend-node/src/templates/blockScript.txt) IIFE `tfChatFeedToModules` — mở 1 feed socket (load `/js/lib/socket.io.min.js` set window.io nếu cần) nghe 'chat' rồi gọi `window.broadcastlistener.onChat(d)` (entry-point đã expose, drives Chat page + TTS). **CHAT-ONLY**: onChat chỉ `distributeEvent("chat")` (backend DROP vì chat ngoài whitelist) + `emitTiktokEventToModules("Chat")`, KHÔNG `emitWsEvent` → KHÔNG double widget/DAPI. Gift/like KHÔNG feed (onGift re-emit DAPI = double overlay). Guard `__tfChatFeedStarted` chống double-start. check-script-syntax: blockScript PASS (2 fail là JSON-LD pre-existing). **CONFIDENCE TRUNG BÌNH** — shape `TikTokObjToYouNowObj` không confirm 100% từ decompiled obfuscated; nếu shape lệch TTS đọc sai/không đọc. **Cần user reopen app (nạp blockScript) + báo:** TTS có đọc chat? Chat page có hiện? Overlay có double không? Nếu hỏng → revert `.bak-2026-06-11-pre-ttschatfeed`.

**Root cause (decompiled):** tf-connect.js (line 1 "Button→API→Bridge") connect qua REST, bypass connector native (app/deob @2830287 `socket.once("tiktokConnected")` — clone KHÔNG emit). Bundle dùng io NỘI BỘ (socketiowrapper), window.io không sẵn → fix load socket.io.min.js local. Event entry = `broadcastlistener.on{Chat,Gift,...}` (window.broadcastlistener EXPOSED), route qua emitTiktokEventToModules. Chat WIDGET (downloads/widget/chat.html io.on đơn giản) chạy độc lập → không ảnh hưởng.

**Symptom (user):** TTS Logs "No Entries" + Chat page (sidebar) trống, dù đang LIVE `@new.world.019`. Voice Tester (Play) CÓ tiếng + log được ("Testuser: This is a test!") → SpeechSynthesis + TTS module OK.

**Đã loại trừ (ĐO thật):** chat THẬT đang chảy (nghe socket 10s → **12 chat** từ stream: bebymeo/adfhjjkl2…); control page login channelId=1 nhận chat; DAPI 21213 đẩy chat tới (inject fake-chat → frame `event=chat` đúng); relay channelId 0→1 fallback OK (socket-manager:60). → MỌI transport đưa chat tới; SpeechSynthesis OK. KHÔNG phải connection-drop (lúc này đang chảy).

**TRUE root cause (decompiled):** bundle MAIN APP dùng 1 **connector** (app/deobfuscated.js @2830287) `connect()` → `socket.once("tiktokConnected", resolve)` + `.on("chat")` (@2829332) route qua `broadcastlistener.emitTiktokEventToModules`. **Clone KHÔNG emit `tiktokConnected` Ở ĐÂU** (grep backend + downloads/js/tf-connect.js + templates = RỖNG). → connector của bundle main-app không được kích hoạt đúng → Chat page + TTS module (đọc qua connector/modules) KHÔNG consume chat. Chat WIDGET (downloads/widget/chat.html `io.on("chat")` đơn giản, KHÔNG qua connector) → CHẠY. Topbar LIVE đến từ /api/tiktok/status poll (tf-connect.js), đường khác.

**Cần fix (deep, risky — chưa làm):** emit `tiktokConnected` (+ payload roomInfo) từ clone tới socket bundle khi bridge connect, HOẶC feed chat thẳng vào `emitTiktokEventToModules`. RỦI RO: phải biết chính xác connector.connect() có được gọi trong luồng clone không (tf-connect.js có thể bypass), payload tiktokConnected cần gì, và không xung đột với connect-flow hiện tại (topbar LIVE + widget đang chạy ổn). Verify khó (phải drive bundle Chat page). → cần session riêng + đo cẩn thận, KHÔNG blind-patch realtime+bundle.

**Lưu ý ưu tiên:** chat OVERLAY (widget cho OBS) CHẠY → stream không ảnh hưởng. Chỉ TTS + in-app Chat page (feature app) bị. Connection "lúc có lúc không" là vấn đề RIÊNG (watchdog-reconnect + session, đã xử ở entry trên).

---

## [2026-06-11] Chat "kết nối lâu / lúc có lúc không" — ROOT CAUSE = bridge↔TikTok (Eulerstream free flaky), KHÔNG phải widget — DIAGNOSED (fix = config sessionId)

**Triệu chứng (user):** Mở `/widget/chat/?cid=1` ở browser thường, chat lúc hiện lúc không, "kết nối lâu". Stream test: `@new.world.019` LIVE 8.3K viewer, chat đang chạy.

**Loại trừ widget (ĐO Playwright):** chat widget + socket-manager + broadcast hoàn toàn ổn — reliability test inject 6 fake-chat trong 30s → **6/6 render, 0 drop, 0 warning**; fake-chat→render 12-25ms; connect SharedIO/direct đều nhanh. → widget KHÔNG phải nguồn chập chờn.

**TRUE root cause (backend-debug.log):** bridge↔TikTok rớt theo chu kỳ:
```
soft success (connect() rejected nhưng vài event lọt, roomId=...)
→ watchdog: no events for 269s @new.world.019 — marking disconnected   (im ~4.5 phút)
→ re-hook: connected @new.world.019 (reconnect)  → lặp
```
Free **Eulerstream** signing (không SIGN_API_KEY/sessionId) → connect() reject (empty AggregateError) nhưng vài event đầu lọt → bridge nhận "soft success" → WS KHÔNG ổn định → event ngừng sau vài phút → watchdog (EVENT_SILENCE_TIMEOUT 4min) giết → reconnect → **chat lúc có lúc không**. TikTok chủ động chặn kết nối unofficial → free tier vốn flaky.

**Fix (CONFIG, không phải code bug):** signing ổn định:
- **`TIKTOK_SESSIONID` + `TIKTOK_TT_TARGET_IDC`** (cookie TikTok đã login) → kết nối authenticated, ổn định nhất. Bridge đã support (tiktok-bridge.js ctorOpts).
- HOẶC **`SIGN_API_KEY`** (Eulerstream trả phí 50k req/tháng).
Không set → free tier → chấp nhận gián đoạn (reconnect tự lo nhưng có gap).

**Dead-ends (đừng lặp):** ❌ widen EVENT_SILENCE_TIMEOUT / đổ lỗi watchdog 4-phút (FIXLOG cũ ghi). ❌ nghĩ là widget/socket — đã ĐO 6/6 reliable, không phải.

**UPDATE — user ĐÃ login TikTok rồi:** session store `<userData>/tiktok-session.json` HỢP LỆ — sessionId (32 chars) + ttTargetIdc=`alisg` + savedAt 06-10 + expiresAt 07-10 (CÒN HẠN). [auth-flow.js](electron/auth-flow.js) `hydrateEnv()` set `TIKTOK_SESSIONID`+`TIKTOK_TT_TARGET_IDC` TRƯỚC `startBackend()`. Bridge ([tiktok-bridge.js](backend-node/src/services/tiktok-bridge.js):284) dùng nếu CẢ 2 env có. NHƯNG bridge vẫn chạy free-Eulerstream-style → **backend đang chạy có thể KHÔNG inherit env** (bị start trong trạng thái lỗi giữa đợt restart-spam hôm nay). **Thêm log chẩn đoán** tại :289 (`[TikTokBridge] auth mode: sessionId=YES/no …`). **Action: ĐÓNG + MỞ LẠI TOÀN APP** (không chỉ restart backend — restart-backend qua main.js cũ còn spam) → bootstrap chạy lại hydrateEnv → backend mới inherit session → authenticated → ổn định. Log mới sẽ xác nhận `sessionId=YES`. Nếu YES mà vẫn rớt → session stale server-side → re-login.

**Cải tiến code ĐÃ ÁP (2026-06-11, user xác nhận "idle một hồi tự ngắt + nằm im"):** watchdog silence-kill trước đây `clearReconnectTimer()` + KHÔNG reconnect → kết nối chết nằm im tới khi bundle re-hook. **Fix:** watchdog giờ gọi `scheduleReconnect(channelId, username)` sau teardown (im event trên stream ACTIVE = Eulerstream/WS stall, không phải end thật — end thật đi qua streamEnd handler đã tách, teardown-không-reconnect). Bỏ broadcast 'streamEnd' tới widget trong watchdog (đổi sang connecting:true) để widget không clear khi chỉ stall tạm. scheduleReconnect có guard (username unchanged + cap 6 + backoff) → không hammer stream đã end. Cần restart backend để áp. **TTS/Chat-page trống = HỆ QUẢ của drop này:** đã verify delivery chain OK (relay→DAPI relay 'chat' main.js:439→Chat page→TTS; control page login channelId=1 nhận chat; SpeechSynthesis Voice-Tester CÓ tiếng). Khi connected → chat chảy → Chat page hiện → TTS đọc. `/api/tts/user` 404 là bình thường (bundle gọi host external, blockScript chặn client-side).

---

## [2026-06-11] Tổng duyệt FULL overlay (Playwright render audit) — 4 widget fix + 1 hiểu nhầm chat-RGB — SOLVED

> Công cụ: [qa/.measure/widget-audit.js](qa/.measure/widget-audit.js) — load 26 widget headless (chromium cached), bắt console-error + asset-404 + crash + có render DOM không. Tái dùng được cho lần sau ("mỗi lần sai 1 overlay → tổng duyệt full"). Kết quả: 18→**22 OK** sau fix.

**Fix 1 — webcam/overlay/talking CRASH `Cannot read properties of undefined (reading 'pro')`:** render() làm `const cfg = ASSET_MAP[version]` rồi `cfg.pro` — khi `state.variation` chưa set (OBS/browser trước khi settings tới) → version không có trong ASSET_MAP → cfg undefined → crash → blank. **Fix:** thêm `if (!cfg) return;` (3 file phẳng). Render lại bình thường khi variation hợp lệ. Backup `.bak-2026-06-11-pre-cfgguard-cdn`.

**Fix 2 — CDN blocking libs (RC-6) ĐÓNG HẾT (8 widget):** localize mọi lib JS sang `/js/lib/`:
- webcam/overlay/talking/streambuddies: jQuery + socket.io (local có sẵn).
- cannon: matter.min.js 0.19.0 (tải về exact). wheel: TweenMax 1.18.0 (tải đúng bản cdnjs "latest" pin — byte-identical, zero compat risk). myactions/songrequests: lottie-player 1.6.3 (tải exact). Sửa cả flat + dir versions.
- Verify Playwright: window.Matter/TweenMax/jQuery/io + customElements lottie-player đều load, 0 error. Audit tool báo "✓ no external LIBS". Backup `.bak-2026-06-11-pre-cdn-localize` / `-pre-cfgguard-cdn`.
- **Còn (thấp, KHÔNG phải lib):** external fonts googleapis (~11 widget, non-blocking, font-fallback); external DATA assets — wheel younow demo img, fallingsnow `assets.tikfinity.com` snow.webm, myactions younow gift-lotties (remote animation data). Localize được nhưng là asset data → để sau.

**Doc phòng ngừa (theo yêu cầu user "ghi lại lỗi gì để lần sau không bị"):** [docs/WIDGET_HEALTH.md](docs/WIDGET_HEALTH.md) — 7 lớp lỗi (C1 undefined-deref / C2 dir-shadow-serve / C3 relative-path / C4 CDN-lib / C5 missing-default / C6 unguarded-settings / C7 toggle-override-UX) + checklist thêm/sửa widget. [qa/.measure/widget-audit.js](qa/.measure/widget-audit.js) nâng cấp tự flag CDN → "tổng duyệt" 1 lệnh bắt cả crash/404/CDN.

**Fix 3 — likefountain iframe 404:** `<iframe src="./vite/src/heart-fountain/index.html">` từ `/widget/likefountain/` → 404. Vite thật ở `/widget/vite/src/heart-fountain/index.html` (200). Sửa src thành absolute path.

**Fix 4 — eventcarousel serve 404:** `eventcarousel.html` là 1 DIRECTORY (artifact tải bundle) → [index.js](backend-node/src/index.js) widget-serve làm `res.sendFile(eventcarousel.html)` → EISDIR → 404, không thử `eventcarousel/index.html`. **Fix:** guard `candidateHtml` phải `isFile()` + fallback `<name>/index.html`. **Cần restart backend để áp.**

**KHÔNG phải bug (note):** `giftgoal` = không có file + không có trong decompiled → không phải widget độc lập (gift goal = `goal`/`gcounter`); 404 là artifact qa/registry. `wheel` external img younow.com = placeholder demo (ERR_BLOCKED_BY_ORB), minor. `transactionviewer` empty = idle (no transactions). `socialmediarotator` serve+render OK — blank do chưa cấu hình social link.

**Chat "chưa ăn setting" = HIỂU NHẦM (không phải bug):** persistence ĐÃ fix + verified (màu lưu/broadcast/persist đúng, round-trip ✓). chat.html:291-297 `if (settings.chat_usernameRgb)` gán màu RANDOM mỗi user → đè màu solid `chat_usernameColorNormal` (:271). Toggle gốc tên **"Random username colors"** (decompiled:15022 `usernameRgb` default=true) nằm TRÊN mục "Normal Users". **Playwright proof:** RGB OFF + red → username render `rgb(247,20,20)`=#f71414 ✓ ĂN SETTING. → User chỉ cần tắt "Random username colors" để thấy màu solid.

**Pending user:** restart backend (áp eventcarousel serve fix). webcam/overlay/talking/likefountain = file tĩnh đã live ngay (chỉ reload widget). Persistence fix đã loaded.

---

## [2026-06-11] "Khởi động lại backend" (tray) spam dialog "Backend đã thoát bất ngờ" — SOLVED (electron/main.js, pre-existing bug)

**Symptom (user):** Mỗi lần chuột phải tray → "Khởi động lại backend" → lỗi + spam dialog "Backend đã thoát bất ngờ (code: …)" liên tục.

**Root cause (2 lỗi cộng dồn trong [electron/main.js](electron/main.js)):**
1. `backendProcess.on('exit')` báo dialog error MỖI lần process exit (chỉ skip khi `isQuitting`). Nhưng restart = `stopBackend()` (SIGTERM → trigger exit) `+ startBackend()`. Restart cố ý cũng bị coi là "thoát bất ngờ" → dialog.
2. Exit handler set `backendProcess = null` VÔ ĐIỀU KIỆN → khi old child exit (sau khi startBackend đã spawn child mới), nó **clobber** ref child mới → click "Khởi động lại" trên dialog → spawn process thứ 2 → port 5285 đã bị child mới giữ → EADDRINUSE → crash → exit → dialog → **spam loop**. (`freeOurPorts()` chỉ chạy lúc bootstrap, KHÔNG khi restart.)

**Fix that worked:**
- Spawn: capture `const child = spawn(...)`; bind stdout/stderr/exit/error trên `child`. Exit handler: `wasCurrent = backendProcess === child` — chỉ clear ref + báo dialog khi `wasCurrent && !isQuitting` (crash THẬT của process hiện hành). Restart/superseded (`!wasCurrent`) hoặc quit → return, KHÔNG dialog, KHÔNG clobber.
- `stopBackend()`: capture `proc` up-front + `backendProcess=null` ngay → SIGKILL timeout target đúng child + exit handler thấy superseded.
- Thêm `restartBackend()`: `stopBackend()` → `setTimeout(600ms)` → `freeOurPorts()` → `startBackend()` (cho OS release port, force-free straggler trước khi spawn → hết EADDRINUSE). Tray wire sang `restartBackend()`. Dialog "Khởi động lại" cũng gọi `freeOurPorts()` trước startBackend.

**Verify:** `node --check electron/main.js` OK + trace 3 path (restart-tay=no dialog, crash-thật=có dialog, quit=no dialog). Backup `.bak-2026-06-11-pre-restart-fix`. **Pending user: đóng + mở LẠI TOÀN BỘ app Electron** để áp (electron/main.js chạy trong main process, cần restart cả app — §11; restart-backend-tay không đủ).

---

## [2026-06-11] Overlay settings LƯU XONG RELOAD/OBS REVERT VỀ CŨ (mọi widget, không riêng chat) — SOLVED (root xác định bằng instrumented single-process repro)

**Symptom (user):** Mở "Tùy chỉnh" overlay (chat/cannon/…), đổi màu/font/size → bấm ĐƯỢC RỒI lưu (POST /api/updateSettings → 200), NHƯNG reload trang / mở OBS thì widget hiện **giá trị CŨ**. User báo ở chat trước, nhưng repro cho thấy áp **MỌI** overlay.

**TRUE root cause (verify verbatim bằng instrumented probe):** [widget-settings-cache.js](backend-node/src/services/widget-settings-cache.js) `buildMerged` — nhiều row DB cùng `normalizeKey` về 1 canonical key:
- `cannon_ballsize`=42 (DIRECT, lowercase — **save MỚI của user**, bundle lowercase key khi save)
- `cannon_ballSize`=55 (direct, case-variant cũ)
- `widget_cannon_ballsize`=**69** + `widget_cannon_ballSize`=69 (LEGACY `widget_`-prefixed, STALE từ version cũ — `normalizeKey` de-prefix về cùng `cannon_ballSize`)

Logic collision cũ (`canonSetByLower`) chỉ phân biệt lowercase-vs-camelCase, **KHÔNG phân biệt direct-vs-`widget_`-legacy**. Cả `cannon_ballsize`(42) lẫn `widget_cannon_ballsize`(69) đều isLower=true → row legacy **đè** save thật của user theo thứ tự lặp Object.entries. → buildMerged trả 69 (legacy) thay vì 42 (user). Y hệt chat: `widget_chat_fontsize`=90 đè `chat_fontsize`=63.

**Bằng chứng quyết định (single-process, DB copy, no WAL contention):** `readAllAsMap(1,2)` trả ĐÚNG `cannon_ballsize=42 chat_fontsize=63` (write LANDS) nhưng `getForChannel(1,true)` trả `cannon_ballSize=69 chat_fontSize=90`. → lỗi TRONG merge, không phải đọc DB. Dump 4 row cùng-canonical xác nhận `widget_*`=69/90 clobber.

**Dead-ends ĐÃ TRÁNH (bài học multi-process):** ❌ probe DB live từ ngoài khi app chạy → đọc WAL nhiễu cho 77 lúc này 69 lúc khác (memory "DB thật ở tikfinity-data" cảnh báo đúng). ❌ curl updateSettings không-auth — vẫn resolve channelId=1 qua findDefault nên write LANDS, đừng nghĩ là channelId=0. ❌ đoán "thiếu widget-defaults key" — audit cho thấy mọi chat key ĐÃ có default (chỉ thiếu chat_rightToLeft, đã thêm); không phải nguyên nhân. **Repro SẠCH = copy DB (db+wal+shm) ra path TUYỆT ĐỐI (KHÔNG /tmp → node thành C:\\tmp rỗng), chạy backend riêng TIKMAX_DATA_DIR=copy.**

**Fix that worked:** `buildMerged` thay `canonSetByLower` bằng `canonTier` 4 mức ưu tiên (thấp thắng): 0=direct+lowercase, 1=direct+case-variant, 2=`widget_`+lowercase, 3=`widget_`+case-variant. **Direct LUÔN thắng legacy `widget_`.** `isLegacyPrefixed = lc.startsWith('widget_') && canon!==rawKey` (chỉ tính khi normalizeKey thực sự de-prefix) → graphic-overlay `widget_webcam_*` (normalizeKey KHÔNG đổi → canon===rawKey → direct) vẫn qua aliasGraphicOverlayKeys như cũ.

**Verify (fresh copy data thật):** save cannon=42/chat_fontSize=63/chat_backgroundNormal=#abcdef/chat_usernameColorNormal=#112233 → read-back **4/4 ĐÚNG ✓**; re-save cannon=7→read=7 ✓. Regression: graphic-overlay alias OK (variation=3, saturationFilter=120 aliased), legacy-only widget_ key vẫn pass-through, bag 1436 keys không crash. Backup `.bak-2026-06-11-pre-persist-fix`.

**Pending user:** RESTART Electron để áp (widget-settings-cache là service → cần restart). Row `widget_*` stale còn trong DB nhưng giờ VÔ HẠI (direct thắng); có thể dọn sau bằng migration xoá `widget_X` khi có `X` direct (optional, không cần). Lưu ý: Commander có ghi test cannon_ballsize=77/chat_fontSize vào DB LIVE lúc chẩn đoán — save lại 2 setting đó là sạch.

---

## [2026-06-11] Audit toàn flow clone (M-REVIEW-FLOW) — 18 finding fix (1 CRITICAL + 8 HIGH + 9 MEDIUM) — SOLVED (verified backend boot + full QA sweep)

> Workflow review `wf_16f80415-bf9` (29 agent: 8 Scout + Reconciler + adversarial Verifier) → 18 confirmed / 2 refuted. User cấp full quyền sửa thẳng. Verify: 18/18 file `node --check` OK + 13/13 module require sạch + serializeConfigJson logic-test 11/11 + backend boot code-mới + **full QA sweep: api-contract 45/0, socket-relay 35/0, gate-health 53/0**.

**CRITICAL — `rest/action` mất sạch config (data loss):** [routes/actions.js](backend-node/src/routes/actions.js) `buildActionFields`+POST chỉ passthrough `ConfigJson` mà bundle KHÔNG bao giờ gửi (grep `configJson` decompiled=0) → native create lưu `'{}'`, edit revert blob cũ. **Fix:** thêm `serializeConfigJson(dto, existing)` — parse existing blob làm base, overlay mọi flattened key (imageUrl/duration/amountToAdd/dynamicConfig/customGoalConfig…) trừ 6 cột DB. Round-trip test 11/11. Backup `.bak-2026-06-11-pre-configjson`.

**HIGH:**
- **Double-fire điểm/chat:** [tiktok-bridge.js](backend-node/src/services/tiktok-bridge.js) `:645 queuePointsDelta(+1/chat)` cộng điểm server-side trong khi bundle award client-side (gated) → lạm phát balance + cộng cả khi feature OFF. **Fix:** gỡ call + gỡ machinery points-batching orphan (`_pendingPoints`/`flushPendingPoints`/setInterval + require `db` thành orphan). GIỮ `recordIdentity`. (chatBot.onChat `chatCommandFired` zero-consumer = dead-code, GIỮ NGUYÊN — gỡ có rủi ro feature chat-command, chỉ note.)
- **disconnect() không abort retry loop:** user bấm Disconnect trong cửa sổ connecting → attempt kế hồi sinh CONNECTED. **Fix:** `disconnect({abortInFlight})` mirror pre-emption path; route `/disconnect` truyền `{abortInFlight:true}`. (param-gated để `_connectImpl`'s internal `disconnect()` không deadlock.)
- **streamEnd → reconnect storm:** handler chỉ set connected=false → follow-up 'disconnected' kích scheduleReconnect vào host offline. **Fix:** teardown (removeAllListeners+disconnect+null+clearReconnectTimer) như watchdog.
- **RELAYABLE_DISTRIBUTE thiếu event:** [socket-manager.js](backend-node/src/services/socket-manager.js) thêm `timerUpdate`(staged Countdown Goal), `dockData`(activity-feed), `setLastX`, `setPlaylistItems`, `giftCanonTest` (listener đã verify). Cố tình BỎ `chat`/`actionsChanged`/`christmas-event:*` (đã có đường khác / cần prefix-match). Sync 5 needle vào [registry.js](qa/registry.js) + sửa comment sai (actionsChanged/chat thực ra emittable).
- **transaction grant username=null split balance:** [data.js](backend-node/src/routes/data.js) Points-page grant gửi userId numeric, username=null → key sai row. **Fix:** `findUsernameByUserId` trước khi fallback raw userId.
- **notifications 3 lỗ contract:** [routes/notifications.js](backend-node/src/routes/notifications.js) thêm `/markAll` (404 toast mỗi lần mở chuông), parse `notificationId` ở /read//seen (markRead/seen không chạy), persist `/preferences` qua DynamicSettings (toggle revert mỗi reload). + model `markSeenById`.
- **QA ledger mask FAIL:** [qa/run-all.js](qa/run-all.js)+[results.js](qa/lib/results.js) `--only` run ghi đè FIXLOG "FAIL=0" che 42 FAIL. **Fix:** persist `partial`/`only`, PARTIAL banner ở TEST_STATUS, KHÔNG ghi đè FIXLOG block khi partial, sửa mâu thuẫn perf-line.
- **QA http không follow redirect:** [qa/lib/http.js](qa/lib/http.js) → 21 false-positive serve-FAIL (dir widget 301/302). **Fix:** follow same-origin redirect (max 3). **Verified: coinjar/coinmatch/wheel 301/184 → 200/5590.**
- **Destructive endpoint không auth + CORS mở:** [index.js](backend-node/src/index.js) `cors origin:true` + `/api/_dev/*` + fs.watch vô điều kiện. **Fix:** CORS loopback-only, CSRF/Origin-guard cho state-changing methods, gate dev-endpoint+fs.watch sau `NODE_ENV!=='production'`. Backup `.bak-2026-06-11-pre-security-harden`. + [config.js](backend-node/src/config.js) packaged build (NODE_ENV=production thiếu TIKMAX_JWT_SECRET) CRASH → tự sinh+persist secret per-install thay vì throw.

**MEDIUM:** points.js channeluser `id:0`→hash unique + `lastUpsertAt` (recordIdentity stamp updatedAt) · pro.js `/status` read-only (bỏ expiry-deactivate, giữ ALL-PRO) · 4 widget `settings.isPro` null-guard (topg/tops flat+dir, backup `.bak-2026-06-11-pre-ispro-guard`) · widget-defaults thêm `chat_usernameWaveSpeed{Normal,Mod,Sub}` · spa-fallback dùng chung `detectLang` (12 lang, hết drift) + Cache-Control no-store · CLAUDE.md Pro-shape canonical + credits wording · qa/README + BUNDLE_UPDATE doc refresh.

**25 FAIL trong sweep 2026-06-11 = KHÔNG phải regression (đừng re-litigate):**
- **21 × `widget.*.external-libs`** = RC-6 CDN libs known-OPEN (xem entry RC-6 dưới). Chưa fix (High-risk localize, DEFERRED).
- **3 × `chain.*.db`** = **DB-path drift**: backend standalone ghi `APPDATA/tikfinity-desktop/tikfinity.db`, harness đọc `…/tikfinity-data/tikfinity.db` → đọc rỗng. Đã verify file backend ghi CÓ row (+ `updatedAt` của fix lastUpsertAt). HTTP-level (api-contract 45/0) pass. Chạy dưới Electron (data-dir có `tikfinity-data`) sẽ khớp.
- **1 × `widget.eventcarousel.serve` 404** = `eventcarousel.html` là 1 DIRECTORY (artifact tải bundle); chỉ `/widget/eventcarousel/index.html` ra 200. Đây là finding EISDIR đã bị **REFUTE harmless** (user không load qua path đó). Pre-existing, redirect-fix không gây.

**Cần user verify runtime (restart Electron để áp code mới):** double-fire điểm (bật points-per-chat → không nhân đôi), disconnect giữa lúc connecting, overlay timer/countdown/activity-feed test buttons, notifications chuông (không toast 404), tạo/sửa action qua form (config round-trip).

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

### 🤖 AUTO-DETECTED FAILURES — 2026-06-11 08:26 (run 20260611-082628)

> Tự sinh bởi `qa/run-all.js`. Mỗi FAIL = 1 strike (§6.1). Sau khi fix, ghi root-cause vào
> entry FIXLOG thường (ngoài block này) rồi re-run để xác nhận PASS.

- **[HIGH] widget.cannon.external-libs** (L3 Widget) — widget.cannon.external-libs
  - Symptom: CDN cdnjs.cloudflare.com: … <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.1…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.wheel.external-libs** (L3 Widget) — widget.wheel.external-libs
  - Symptom: CDN cdnjs.cloudflare.com: … <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/T…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.wheelofactions.external-libs** (L3 Widget) — widget.wheelofactions.external-libs
  - Symptom: CDN fonts.googleapis.com: …econnect" href="https://fonts.googleapis.com"> <link rel="preconne…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.goal.external-libs** (L3 Widget) — widget.goal.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.webcam.external-libs** (L3 Widget) — widget.webcam.external-libs
  - Symptom: CDN code.jquery.com: … <script src="https://code.jquery.com/jquery-3.5.1.min.js" cr…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.overlay.external-libs** (L3 Widget) — widget.overlay.external-libs
  - Symptom: CDN code.jquery.com: … <script src="https://code.jquery.com/jquery-3.5.1.min.js" cr…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.talking.external-libs** (L3 Widget) — widget.talking.external-libs
  - Symptom: CDN code.jquery.com: … <script src="https://code.jquery.com/jquery-3.5.1.min.js" cr…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.eventcarousel.external-libs** (L3 Widget) — widget.eventcarousel.external-libs
  - Symptom: CDN fonts.googleapis.com: …econnect" href="https://fonts.googleapis.com"> <link rel="precon…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.eventcarousel.serve** (L3 Widget) — widget.eventcarousel.serve
  - Symptom: status=404 bytes=160
  - Gate ref: Gate 35
  - Fix hint: GET /widget/eventcarousel?cid=1&preview=1 must return 2xx HTML — check route + file serving
- **[HIGH] widget.fallingsnow.external-libs** (L3 Widget) — widget.fallingsnow.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.firework.external-libs** (L3 Widget) — widget.firework.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.ranking.external-libs** (L3 Widget) — widget.ranking.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.topgifter.external-libs** (L3 Widget) — widget.topgifter.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.topliker.external-libs** (L3 Widget) — widget.topliker.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.lastx.external-libs** (L3 Widget) — widget.lastx.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.viewercount.external-libs** (L3 Widget) — widget.viewercount.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.myactions.external-libs** (L3 Widget) — widget.myactions.external-libs
  - Symptom: CDN cdn.jsdelivr.net: … <script src="https://cdn.jsdelivr.net/npm/@lottiefiles/lottie…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.timer.external-libs** (L3 Widget) — widget.timer.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.commandinfo.external-libs** (L3 Widget) — widget.commandinfo.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.userinfo.external-libs** (L3 Widget) — widget.userinfo.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.transactionviewer.external-libs** (L3 Widget) — widget.transactionviewer.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[HIGH] widget.likefountain.external-libs** (L3 Widget) — widget.likefountain.external-libs
  - Symptom: CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp…
  - Gate ref: widget-external-libs
  - Fix hint: Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers
- **[MEDIUM] chain.points.db** (Chain) — DB persist (balance + identity)
  - Symptom: points_user_qa_pts_2c70lx=null (want 1234); pointsmeta_qa_pts_2c70lx.userId=null (want 991781141187997)
  - Gate ref: Chain3
  - Fix hint: services/points.js setBalance writes points_user_<username>@ProfileId=1; recordIdentity writes pointsmeta_<username> JSON.userId.
- **[HIGH] chain.goals.create.db** (Chain) — Goals row after create
  - Symptom: Goals row not found for Name='E2E goal' ChannelId=1 ProfileId=2
  - Gate ref: Chain 4
  - Fix hint: Verify DB_PATH resolves to the live DB (config.js) and ProfileId scope matches the route.
- **[HIGH] chain.goals.update.db** (Chain) — Goals row after update
  - Symptom: expected Target=999; got no row
  - Gate ref: Chain 4
  - Fix hint: Check goals model patch() updates Target.

<!-- QA-AUTO-FAILURES:END -->
