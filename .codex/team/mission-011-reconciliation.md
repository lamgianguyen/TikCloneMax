# Mission 011 Reconciliation — Overlay widgets không nhận live socket event (gift FX / wheel / coin / style)

**Mission ID:** M-2026-06-03-011-overlay-socket-rca
**Workflow:** wf_d93d425a-1b3 (11 agents: 5 Scout song song + 1 Reconciler Opus + 5 adversarial Verifier)
**Symptom (user):** "mấy overlay không cái nào ăn socket, không thấy nhảy hiệu ứng tặng quà". Webcam style đổi counter + localStorage nhưng preview không đổi. 11 iframe webcam đều có `contentWindow.io` (connected) nhưng không nhận event.

## Root cause CONFIRMED (RC-1, adversarial verdict = confirmed)

Backend `socket-manager.js` CÓ handler `distributeEvent` (thêm ở mission trước) **nhưng whitelist `RELAYABLE_DISTRIBUTE` chỉ cho qua 3 event**: `widgetSettings`, `goalStatus`, `giftGoalStatus`. Mọi overlay-FX event khác bị `return` im lặng ở dòng 81.

- Bundle wrap MỌI client emit thành envelope `io.emit("distributeEvent", eventName, payload)` (app/deobfuscated.js:70895-70903).
- Test button overlay emit qua đây: `gift` (modules:20249-20349, ALL `isTest:true`), `onSpinWheel` (app:78859), `spinWheel` (modules:14416), `coin-match:start/update/result/reset` (app:79045+), `coin-jar:gift` (app:80127), `onLikeReceived` (modules:20619/20651), `createCoins`... → tất cả bị drop.
- `widgetSettings` ở trong whitelist nên webcam-style là path DUY NHẤT chạy (M-012 trước fix đúng nhánh đó).

## Scout conflicts → resolution

- Scout #1 ban đầu quy test-gift cho path `emitWsEvent`. **Reconciler + Verifier bác:** `emitWsEvent` → Electron DAPI (raw-WS, activity-feed/plugins), KHÔNG phải Socket.IO widget. Test gift đi qua `emitSocketEvent → distributeEvent` (bị drop). Nguồn: app:67524, electron/main.js:2284.
- Scout #3/#4/#5 nghi appType/channelId mismatch (critical). **Verify REFUTED cho single-channel:** widget gửi `appType:'widget'` (socketioclient.js), backend lowercases 2 đầu → match; channelId cùng resolve `findDefault()` → match. Filter PASS. Mismatch chỉ latent khi >1 channel (RC-4, defer).

## Double-fire safety (verified trước khi mở relay)

Mọi `emitSocketEvent("gift"/"onLikeReceived")` đều `isTest:true` + ở test functions (decompiled/modules:20249-20651). Live gift/like đi `emitWsEvent`→DAPI (transport khác). ⇒ Mở relay `gift`/`coin-jar:gift`/`onLikeReceived`/`newTransaction` KHÔNG đụng live bridge broadcast. Relay target LUÔN `appType='widget'` → không echo controlpage → không reload loop.

## Fix applied (RC-1 only — minimal)

`backend-node/src/services/socket-manager.js`:
- Mở rộng `RELAYABLE_DISTRIBUTE` thêm overlay-FX events: gift, onLikeReceived, coin-jar:gift, coin-jar:reset, coin-match:start/update/result/reset, createCoins/timeoutCoins/collectCoin, onSpinWheel/spinWheel, updateTopGifter/Liker, updateViewerCount, topGiftData, newTransaction, showCommandResult/showCommands/showCustomCommands/showUserScore, testGoal/testGiftGoal.
- Nới guard `if (cid > 0)` (bỏ yêu cầu payload-object) để reset-event (không payload) cũng relay.
- Backup: `socket-manager.js.bak-2026-06-03-pre-distribute-relay`. Syntax OK.
- **Cần RESTART Electron** (backend service) để load.

## Deferred (KHÔNG fix lần này — minimal change)

- **RC-4** channelId affinity (handleLogin bỏ qua `payload.channelId`, luôn `findDefault()`): latent, chỉ vỡ khi multi-channel/empty-DB. Single-channel OK. Defer.
- **RC-5** coinjar/coinmatch isPro guard có thể bị control-page widgetSettings isPro=false đè: secondary, verify SAU RC-1; backend defaults đã isPro:true (widget-defaults.js:11).
- **RC-2** live FX cần TikTok session thật: không phải bug code — sau RC-1, test button sẽ chạy không cần live.

## Verify plan (user)

Restart Electron → vào trang overlay → bấm test wheel/coin-match/coin-jar/gift → hiệu ứng phải nhảy. Webcam style đổi → preview đổi. Live: connect TikTok → gift/like vào overlay (path bridge, đã đúng sẵn).
