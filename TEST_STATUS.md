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
| 11 | **Skill §5.1 (8 nguyên nhân pass-then-fail)** — validate bằng cách map mọi lỗi đã gặp | ✅ PASS | 2026-06-05 | mọi lỗi 🔴 flaky map được vào #1-8 | đúng cho nhóm flaky |
| 12 | **Meta-finding: bẫy CHẨN ĐOÁN tốn time nhất** (đo/đọc sai) → bổ sung **§5.2** | ✅ DONE | 2026-06-05 | 4 vụ thật: nhầm DB · log vô hình · "đúng trên giấy" · sửa nhầm copy | nhóm này hơn cả bug thật |

**Legend:** ✅ PASS = verify có bằng chứng · ⚠️ OPEN = fix rồi chưa verify · ⚠️ APPLIED = sửa rồi chưa test thực · ❌ DEFERRED = chưa làm.

<!-- QA-AUTO:BEGIN -->

## 🤖 AUTO QA RUN — 2026-06-26 08:07 (run 20260626-080748)

> Tự sinh bởi `qa/run-all.js`. PASS=251 FAIL=35 SKIP=10 · backend UP · 21908ms. Block này bị GHI ĐÈ mỗi run — đừng sửa tay.

| # | Vùng | Status | Bằng chứng |
|---|---|---|---|
| api.health | L1 API | ✅ PASS | GET /api/health → 200 ok (1ms) |
| api.tiktok.status | L1 API | ✅ PASS | GET /api/tiktok/status → 200 ok (0ms) |
| api.tiktok.account | L1 API | ✅ PASS | GET /api/tiktok/account → 200 ok (1ms) |
| api.tiktok.gifts | L1 API | ✅ PASS | GET /api/tiktok/gifts → 200 ok (12ms) |
| api.tiktok.stats | L1 API | ✅ PASS | GET /api/tiktok/stats → 200 ok (1ms) |
| api.worldcup.matches | L1 API | ❌ FAIL | GET /api/worldcup/matches → 200 but response body was not JSON |
| api.me | L1 API | ✅ PASS | GET /api/me → 200 ok (4ms) |
| api.loginChannel | L1 API | ✅ PASS | GET /api/loginChannel → 200 ok (4ms) |
| api.config.app | L1 API | ✅ PASS | GET /api/getAppConfig → 200 ok (3ms) |
| api.config.alias | L1 API | ✅ PASS | GET /api/config → 200 ok (3ms) |
| api.config.system | L1 API | ✅ PASS | GET /api/getSystemConfig → 200 ok (0ms) |
| api.config.translations | L1 API | ✅ PASS | GET /api/getTranslations → 200 ok (1ms) |
| api.config.init | L1 API | ✅ PASS | GET /api/init → 200 ok (0ms) |
| api.config.v2sync | L1 API | ✅ PASS | GET /api/v2/sync → 200 ok (1ms) |
| api.settings.overlayconfig | L1 API | ✅ PASS | GET /api/getOverlayConfig → 200 ok (0ms) |
| api.settings.modules | L1 API | ✅ PASS | GET /api/modules → 200 ok (1ms) |
| api.auth.sso | L1 API | ✅ PASS | GET /api/v1/auth/sso-bridge → 200 ok (2ms) |
| api.auth.flowstatus | L1 API | ✅ PASS | GET /api/v1/flow/status → 200 ok (0ms) |
| api.goals | L1 API | ✅ PASS | GET /api/goals → 200 ok (1ms) |
| api.actions.list | L1 API | ✅ PASS | GET /api/rest/action → 200 ok (1ms) |
| api.points.leaderboard | L1 API | ✅ PASS | GET /api/points/leaderboard → 200 ok (1ms) |
| api.points.user | L1 API | ✅ PASS | GET /api/points/user/qa_probe_user → 200 ok (1ms) |
| api.channeluser.odata | L1 API | ✅ PASS | GET /api/odata/channeluser → 200 ok (0ms) |
| api.channeluser.rest | L1 API | ✅ PASS | GET /api/rest/channeluser → 200 ok (0ms) |
| api.commands | L1 API | ✅ PASS | GET /api/commands → 200 ok (1ms) |
| api.sounds | L1 API | ✅ PASS | GET /api/sounds → 200 ok (0ms) |
| api.sounds.rest | L1 API | ✅ PASS | GET /api/rest/sound → 200 ok (1ms) |
| api.notifications.list | L1 API | ✅ PASS | GET /api/notifications/list → 200 ok (1ms) |
| api.notifications.count | L1 API | ✅ PASS | GET /api/notifications/count → 200 ok (0ms) |
| api.tts.authtoken | L1 API | ✅ PASS | POST /api/tts/auth-token → 200 ok (1ms) |
| api.odata.transaction | L1 API | ✅ PASS | GET /api/odata/transaction → 200 ok (1ms) |
| api.rest.transaction | L1 API | ✅ PASS | GET /api/rest/transaction → 200 ok (0ms) |
| api.gifts.all | L1 API | ✅ PASS | GET /api/getAllGifts → 200 ok (10ms) |
| api.animations.all | L1 API | ✅ PASS | GET /api/getAllAnimations → 200 ok (1ms) |
| api.data.emotes | L1 API | ✅ PASS | GET /api/getChannelEmotes → 200 ok (1ms) |
| api.data.usercount | L1 API | ✅ PASS | GET /api/getChannelUserCount → 200 ok (0ms) |
| api.data.livechannels | L1 API | ✅ PASS | GET /api/getLiveChannels → 200 ok (1ms) |
| api.data.globaltransactions | L1 API | ✅ PASS | GET /api/getGlobalTransactions → 200 ok (0ms) |
| api.data.myinstants | L1 API | ✅ PASS | GET /api/getMyInstants → 200 ok (1ms) |
| api.backup.export | L1 API | ✅ PASS | GET /api/backup/export → 200 ok (3ms) |
| api.pro.status | L1 API | ✅ PASS | GET /api/pro/status → 200 ok (1ms) |
| api.pro.tazapay | L1 API | ✅ PASS | GET /api/pro/tazapay/methods → 200 ok (0ms) |
| api.obs.status | L1 API | ✅ PASS | GET /api/obs/status → 200 ok (1ms) |
| api.webhooks.list | L1 API | ✅ PASS | GET /api/webhooks → 200 ok (0ms) |
| api.seed.status | L1 API | ✅ PASS | GET /api/seed/status → 200 ok (1ms) |
| api.uploads.list | L1 API | ✅ PASS | GET /api/uploads/list → 200 ok (1ms) |
| sock.handshake | L2 Socket | ✅ PASS | controlpage socket connected + login ok on channelId=1 |
| sock.relay.widgetSettings | L2 Socket | ✅ PASS | event 'widgetSettings' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.goalStatus | L2 Socket | ✅ PASS | event 'goalStatus' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.giftGoalStatus | L2 Socket | ✅ PASS | event 'giftGoalStatus' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.testGoal | L2 Socket | ✅ PASS | event 'testGoal' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.testGiftGoal | L2 Socket | ✅ PASS | event 'testGiftGoal' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.gift | L2 Socket | ✅ PASS | event 'gift' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.onLikeReceived | L2 Socket | ✅ PASS | event 'onLikeReceived' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.coinJarGift | L2 Socket | ✅ PASS | event 'coin-jar:gift' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.coinjar.reset | L2 Socket | ✅ PASS | event 'coin-jar:reset' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.coinMatchStart | L2 Socket | ✅ PASS | event 'coin-match:start' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.coinMatchUpdate | L2 Socket | ✅ PASS | event 'coin-match:update' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.coinMatchResult | L2 Socket | ✅ PASS | event 'coin-match:result' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.coinMatchReset | L2 Socket | ✅ PASS | event 'coin-match:reset' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.createCoins | L2 Socket | ✅ PASS | event 'createCoins' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.timeoutCoins | L2 Socket | ✅ PASS | event 'timeoutCoins' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.collectCoin | L2 Socket | ✅ PASS | event 'collectCoin' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.spinwheel | L2 Socket | ✅ PASS | event 'onSpinWheel' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.spinWheel | L2 Socket | ✅ PASS | event 'spinWheel' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.updateTopGifter | L2 Socket | ✅ PASS | event 'updateTopGifter' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.updateTopLiker | L2 Socket | ✅ PASS | event 'updateTopLiker' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.updateViewerCount | L2 Socket | ✅ PASS | event 'updateViewerCount' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.topGiftData | L2 Socket | ✅ PASS | event 'topGiftData' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.newTransaction | L2 Socket | ✅ PASS | event 'newTransaction' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.showCommandResult | L2 Socket | ✅ PASS | event 'showCommandResult' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.showCommands | L2 Socket | ✅ PASS | event 'showCommands' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.showCustomCommands | L2 Socket | ✅ PASS | event 'showCustomCommands' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.showUserScore | L2 Socket | ✅ PASS | event 'showUserScore' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.timerUpdate | L2 Socket | ✅ PASS | event 'timerUpdate' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.dockData | L2 Socket | ✅ PASS | event 'dockData' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.setLastX | L2 Socket | ✅ PASS | event 'setLastX' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.setPlaylistItems | L2 Socket | ✅ PASS | event 'setPlaylistItems' relayed to widget in 1ms (budget 3000ms) |
| sock.relay.giftCanonTest | L2 Socket | ✅ PASS | event 'giftCanonTest' relayed to widget in 0ms (budget 3000ms) |
| sock.relay.neg.notWhitelisted | L2 Socket | ✅ PASS | non-whitelisted event '__qa_not_whitelisted__' correctly NOT relayed within 3000ms |
| sock.relay.neg.chat | L2 Socket | ✅ PASS | non-whitelisted event 'chat' correctly NOT relayed within 3000ms |
| widget.coinjar.external-libs | L3 Widget | ✅ PASS | no CDN-host libs |
| widget.coinjar.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.coinjar.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.coinjar.serve | L3 Widget | ✅ PASS | 200 · 5750B |
| widget.coinmatch.external-libs | L3 Widget | ✅ PASS | no CDN-host libs |
| widget.coinmatch.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.coinmatch.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.coinmatch.serve | L3 Widget | ✅ PASS | 200 · 5231B |
| widget.cannon.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.cannon.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.cannon.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.cannon.serve | L3 Widget | ✅ PASS | 200 · 74697B |
| widget.wheel.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.wheel.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.wheel.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.wheel.serve | L3 Widget | ✅ PASS | 200 · 95068B |
| widget.wheelofactions.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …econnect" href="https://fonts.googleapis.com"> <link rel="preconn… |
| widget.wheelofactions.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.wheelofactions.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.wheelofactions.serve | L3 Widget | ✅ PASS | 200 · 4054B |
| widget.goal.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.goal.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.goal.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.goal.serve | L3 Widget | ✅ PASS | 200 · 89421B |
| widget.giftgoal.locate | L3 Widget | ⚠️ SKIP | no html file |
| widget.webcam.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …econnect" href="https://fonts.googleapis.com"> <link rel="preco… |
| widget.webcam.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.webcam.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.webcam.serve | L3 Widget | ✅ PASS | 200 · 28977B |
| widget.overlay.external-libs | L3 Widget | ✅ PASS | no CDN-host libs |
| widget.overlay.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.overlay.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.overlay.serve | L3 Widget | ✅ PASS | 200 · 24617B |
| widget.talking.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …econnect" href="https://fonts.googleapis.com"> <link rel="preco… |
| widget.talking.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.talking.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.talking.serve | L3 Widget | ✅ PASS | 200 · 27459B |
| widget.chat.external-libs | L3 Widget | ✅ PASS | no CDN-host libs |
| widget.chat.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.chat.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.chat.serve | L3 Widget | ✅ PASS | 200 · 21407B |
| widget.eventcarousel.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …econnect" href="https://fonts.googleapis.com"> <link rel="precon… |
| widget.eventcarousel.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.eventcarousel.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.eventcarousel.serve | L3 Widget | ✅ PASS | 200 · 5322B |
| widget.fallingsnow.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.fallingsnow.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.fallingsnow.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.fallingsnow.serve | L3 Widget | ✅ PASS | 200 · 69880B |
| widget.firework.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.firework.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.firework.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.firework.serve | L3 Widget | ✅ PASS | 200 · 76459B |
| widget.ranking.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.ranking.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.ranking.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.ranking.serve | L3 Widget | ✅ PASS | 200 · 80491B |
| widget.topgifter.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.topgifter.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.topgifter.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.topgifter.serve | L3 Widget | ✅ PASS | 200 · 84043B |
| widget.topliker.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.topliker.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.topliker.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.topliker.serve | L3 Widget | ✅ PASS | 200 · 88318B |
| widget.lastx.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.lastx.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.lastx.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.lastx.serve | L3 Widget | ✅ PASS | 200 · 75187B |
| widget.viewercount.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.viewercount.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.viewercount.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.viewercount.serve | L3 Widget | ✅ PASS | 200 · 57514B |
| widget.myactions.external-libs | L3 Widget | ✅ PASS | no CDN-host libs |
| widget.myactions.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.myactions.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.myactions.serve | L3 Widget | ✅ PASS | 200 · 25668B |
| widget.timer.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.timer.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.timer.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.timer.serve | L3 Widget | ✅ PASS | 200 · 59536B |
| widget.socialmediarotator.external-libs | L3 Widget | ✅ PASS | no CDN-host libs |
| widget.socialmediarotator.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.socialmediarotator.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.socialmediarotator.serve | L3 Widget | ✅ PASS | 200 · 916B |
| widget.commandinfo.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.commandinfo.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.commandinfo.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.commandinfo.serve | L3 Widget | ✅ PASS | 200 · 64823B |
| widget.userinfo.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.userinfo.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.userinfo.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.userinfo.serve | L3 Widget | ✅ PASS | 200 · 77502B |
| widget.transactionviewer.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.transactionviewer.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.transactionviewer.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.transactionviewer.serve | L3 Widget | ✅ PASS | 200 · 77858B |
| widget.likefountain.external-libs | L3 Widget | ❌ FAIL | CDN fonts.googleapis.com: …).attr("href", "https://fonts.googleapis.com/css2?family=" + fontTyp… |
| widget.likefountain.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.likefountain.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.likefountain.serve | L3 Widget | ✅ PASS | 200 · 58106B |
| widget.worldcupticker.external-libs | L3 Widget | ✅ PASS | no CDN-host libs |
| widget.worldcupticker.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.worldcupticker.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.worldcupticker.serve | L3 Widget | ✅ PASS | 200 · 1236B |
| widget.followercount.external-libs | L3 Widget | ✅ PASS | no CDN-host libs |
| widget.followercount.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.followercount.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.followercount.serve | L3 Widget | ✅ PASS | 200 · 3396B |
| widget.countdowngoals.external-libs | L3 Widget | ✅ PASS | no CDN-host libs |
| widget.countdowngoals.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.countdowngoals.null-guard | L3 Widget | ✅ PASS | no settings.isPro deref |
| widget.countdowngoals.serve | L3 Widget | ✅ PASS | 200 · 2909B |
| widget.penaltybattle.external-libs | L3 Widget | ✅ PASS | no CDN-host libs |
| widget.penaltybattle.debug-spam | L3 Widget | ✅ PASS | no debug spam |
| widget.penaltybattle.null-guard | L3 Widget | ✅ PASS | settings.isPro guarded |
| widget.penaltybattle.serve | L3 Widget | ✅ PASS | 200 · 2199B |
| perf.backend.ram | Perf | ✅ PASS | node.exe 524MB / 9 proc (budget 700MB) |
| perf.electron.ram | Perf | ✅ PASS | electron.exe 874MB total / 6 proc (budget 2000MB) |
| perf.cpu | Perf | ✅ PASS | 0.2% over 1500ms / 24 cores (budget 85%) |
| perf.render.stretch | Perf | ⚠️ SKIP | no STRETCH-DIAG in recent log |
| perf.log.errors | Perf | ✅ PASS | no errors in recent log |
| perf.log.reloadchurn | Perf | ✅ PASS | 0 reload signal(s) in window |
| gate.06.aivoiceprefix | L4 Gate-drift | ✅ PASS | Gate Gate 6/7 anchor 'tts_api__' present (1 hits in modules/deobfuscated.js) |
| gate.07.resolvevoicecfg | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 7 anchor 'resolveVoiceConfigFromId' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-an |
| gate.08.hasbackendctx | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 8a anchor 'getAiTtsBackendContext' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-anc |
| gate.09b.currentusagemode | L4 Gate-drift | ✅ PASS | Gate Gate 23b anchor 'currentUsageMode' present (1 hits in modules/deobfuscated.js) |
| gate.23b.subcredits | L4 Gate-drift | ✅ PASS | Gate Gate 23b anchor 'sub_credits' present (1 hits in modules/deobfuscated.js) |
| gate.09a.ttsauthtoken | L4 Gate-drift | ✅ PASS | Gate Gate 9a anchor 'ttsAuthToken' present (7 hits in modules/deobfuscated.js) |
| gate.25.loadaivoicestate | L4 Gate-drift | ✅ PASS | Gate Gate 25 anchor 'loadAiVoiceState' present (4 hits in modules/deobfuscated.js) |
| gate.25.ensureauthtoken | L4 Gate-drift | ✅ PASS | Gate Gate 25 anchor 'ensureAiAuthToken' present (4 hits in modules/deobfuscated.js) |
| gate.25.aivoicecooldown | L4 Gate-drift | ✅ PASS | Gate Gate 25 anchor 'aiVoiceStateLastLoadedAt' present (3 hits in modules/deobfuscated.js) |
| gate.23.ispro | L4 Gate-drift | ✅ PASS | Gate Gate 23 anchor 'userFeatures' present (56 hits in modules/deobfuscated.js) |
| gate.23.proinfo | L4 Gate-drift | ✅ PASS | Gate Gate 23b anchor 'proInfo' present (23 hits in modules/deobfuscated.js) |
| gate.30a.proChip | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 30a anchor 'TTSProDropdown' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-anchor thi |
| gate.30a.freeChip | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 30a anchor 'TTSFreeDropdown' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-anchor th |
| gate.30b.switchlanguage | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 30b anchor 'switchLanguage' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-anchor thi |
| gate.30c.streamprofile | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 30c anchor 'streamProfileId' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-anchor th |
| gate.30c.switchprofile | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 30c anchor 'switchProfile' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-anchor this |
| gate.30d.stretchiframe | L4 Gate-drift | ✅ PASS | Gate Gate 30d anchor 'stretchIframe' present (2 hits in modules/deobfuscated.js) |
| gate.30d.obsoverlays | L4 Gate-drift | ✅ PASS | Gate Gate 30d anchor 'lazy-frame' present (1 hits in modules/deobfuscated.js) |
| gate.34.refreshdatasource | L4 Gate-drift | ✅ PASS | Gate Gate 34 anchor 'refreshDataSource' present (2 hits in modules/deobfuscated.js) |
| gate.34.loadtriggers | L4 Gate-drift | ✅ PASS | Gate Gate 34 anchor 'loadTriggers' present (2 hits in modules/deobfuscated.js) |
| gate.34.triggerdatasource | L4 Gate-drift | ✅ PASS | Gate Gate 34 anchor 'triggerDataSource' present (6 hits in modules/deobfuscated.js) |
| gate.34.onEditorPreparing | L4 Gate-drift | ✅ PASS | Gate Gate 34 anchor 'onEditorPreparing' present (1 hits in modules/deobfuscated.js) |
| gate.35.distribute | L4 Gate-drift | ✅ PASS | Gate Gate 35 anchor 'distributeEvent' present (2 hits in modules/deobfuscated.js) |
| gate.35.coinjarreset | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 35 anchor 'coin-jar:reset' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-anchor this |
| gate.35.coinmatchstart | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 35 anchor 'coin-match:start' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-anchor th |
| gate.35.spinwheel | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 35 anchor 'onSpinWheel' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-anchor this ga |
| gate.35.widgetstate | L4 Gate-drift | ✅ PASS | Gate Gate 35 anchor 'onWidgetState' present (2 hits in modules/deobfuscated.js) |
| gate.35.emitwidgetsettings | L4 Gate-drift | ✅ PASS | Gate Gate 35 anchor 'emitWidgetSettingsToWidgets' present (14 hits in modules/deobfuscated.js) |
| gate.35.resetjar | L4 Gate-drift | ❌ FAIL | DRIFT: Gate Gate 35-MECH anchor 'resetJar' NOT FOUND in modules/deobfuscated.js → bundle changed, review/re-anchor this  |
| gate.18.chipbg | L4 Gate-drift | ✅ PASS | Gate Gate 18 anchor 'D435554D' present (4 hits in templates/earlyCss.txt) |
| gate.18.prochipbg | L4 Gate-drift | ✅ PASS | Gate Gate 18 anchor 'FFB54D14' present (3 hits in templates/earlyCss.txt) |
| gate.22e.pagessrcontent | L4 Gate-drift | ✅ PASS | Gate Gate 22 (E) anchor 'pageSSRContent' present (2 hits in templates/earlyCss.txt) |
| gate.16.livestate | L4 Gate-drift | ✅ PASS | Gate Gate 16 anchor 'data-tf-live-state' present (7 hits in templates/blockScript.txt) |
| gate.01.tfi18nprebake | L4 Gate-drift | ✅ PASS | Gate Gate 3/4 anchor 'tfI18nPreBake' present (2 hits in templates/blockScript.txt) |
| gate.17.forceprocredits | L4 Gate-drift | ✅ PASS | Gate Gate 17 anchor 'tfForceProCredits' present (4 hits in templates/blockScript.txt) |
| gate.23.activateproui | L4 Gate-drift | ✅ PASS | Gate Gate 23 anchor 'tfActivateProUI' present (3 hits in templates/blockScript.txt) |
| gate.30a.piniaprotrap | L4 Gate-drift | ✅ PASS | Gate Gate 30a anchor 'tfPiniaProTrap' present (3 hits in templates/blockScript.txt) |
| gate.30b.patchswitchlang | L4 Gate-drift | ✅ PASS | Gate Gate 30b anchor 'tfPatchSwitchLanguage' present (2 hits in templates/blockScript.txt) |
| gate.30b.langtolocale | L4 Gate-drift | ✅ PASS | Gate Gate 30b anchor 'LANG_TO_LOCALE' present (4 hits in templates/blockScript.txt) |
| gate.30d.triggeroverlays | L4 Gate-drift | ✅ PASS | Gate Gate 30d anchor 'tfTriggerOverlaysOnVisible' present (3 hits in templates/blockScript.txt) |
| gate.overlaycard.iframefill | L4 Gate-drift | ✅ PASS | Gate Overlay-Layout anchor 'iframe.lazy-frame' present (5 hits in templates/earlyCss.txt) |
| gate.34.wrappreloadtrig | L4 Gate-drift | ✅ PASS | Gate Gate 34 anchor 'tfWrapAndPreloadTriggers' present (2 hits in templates/blockScript.txt) |
| gate.06.bootstraptoken | L4 Gate-drift | ✅ PASS | Gate Gate 6 anchor 'tfBootstrapWindowToken' present (2 hits in templates/blockScript.txt) |
| gate.09b.quotapayload | L4 Gate-drift | ✅ PASS | Gate Gate 23b anchor 'tfBuildQuotaPayload' present (4 hits in templates/blockScript.txt) |
| gate.09b.ttsuserhandler | L4 Gate-drift | ✅ PASS | Gate Gate 9b anchor 'tfHandleTtsTikfinityUser' present (2 hits in templates/blockScript.txt) |
| gate.09c.ttscomhandler | L4 Gate-drift | ✅ PASS | Gate Gate 9c anchor 'tfHandleTtsTikfinityCom' present (2 hits in templates/blockScript.txt) |
| gate.16.patchlivebadge | L4 Gate-drift | ✅ PASS | Gate Gate 16 anchor 'tfPatchLiveBadge' present (2 hits in templates/blockScript.txt) |
| gate.35.overlayautosave | L4 Gate-drift | ✅ PASS | Gate Gate 35 anchor 'tfOverlaySettingsAutosave' present (1 hits in templates/blockScript.txt) |
| gate.35.coinjarreset.iife | L4 Gate-drift | ✅ PASS | Gate Gate 35-MECH anchor 'tfCoinJarResetReliable' present (2 hits in templates/blockScript.txt) |
| gate.06.normalizevoice | L4 Gate-drift | ✅ PASS | Gate Gate 7 anchor 'tfNormalizeMockVoice' present (4 hits in templates/blockScript.txt) |
| gate.07.ttsgenerate | L4 Gate-drift | ✅ PASS | Gate Gate 7 anchor 'tfHandleTtsGenerate' present (6 hits in templates/blockScript.txt) |
| gate.30c.bridgesessionme | L4 Gate-drift | ✅ PASS | Gate Gate 30c anchor 'tfBridgeSessionMe' present (5 hits in templates/blockScript.txt) |
| gate.32.giftitemtemplate | L4 Gate-drift | ✅ PASS | Gate Gate 32/33 anchor 'tfRewriteGiftImagesToCache' present (6 hits in templates/blockScript.txt) |
| live.handsome.run52 | Live | ✅ PASS | @handsome.run52 is LIVE roomId=7655481612762745621 (probed via tiktok-live-connector) |
| chain.settings.socket | Chain | ✅ PASS | widget socket connected + login ok on channelId=1 |
| chain.settings.http | Chain | ✅ PASS | POST widget_cannon_ballsize=94 → 200 {status:200, message:'OK'} (6ms) |
| chain.settings.db | Chain | ❌ FAIL | row widget_cannon_ballsize = '31' (expected '94') — POST did not persist |
| chain.settings.broadcast | Chain | ✅ PASS | widget received widgetSettings with cannon_ballSize=94 (matches posted 94) |
| chain.tts.auth-token | Chain | ✅ PASS | 200 {status:200,message:'OK',ttsAuthToken:<jwt 327ch>} (1ms) |
| chain.tts.auth-token.jwt | Chain | ✅ PASS | JWT ALL-PRO ✓ subscriptionEnabled=true subscriptionPeriodCredits=100000 |
| chain.tts.fake-chat | Chain | ✅ PASS | 200 {status:'ok',emitted:'chat'} (1ms) |
| chain.tts.chat-delivery | Chain | ✅ PASS | controlpage received chat {comment:'hello-n42um8',uniqueId:'tester-a67rpw'} in 0ms (budget 3000ms) |
| chain.tts.user | Chain | ⚠️ SKIP | tts/user is a cross-origin tts.tikfinity.com call mocked CLIENT-SIDE in blockScript (tfHandleTtsTikfinityUser) — not a b |
| chain.tts.voices | Chain | ⚠️ SKIP | tts/voices is a cross-origin tts.tikfinity.com call mocked CLIENT-SIDE in blockScript (tfHandleTtsTikfinityCom) — not a  |
| chain.tts.speak | Chain | ⚠️ SKIP | Actual TTS audio playback is client-side; /api/tts/generate needs a real TikTok sessionid (503 without it, tts.js:157-16 |
| chain.points.grant | Chain | ✅ PASS | grant 1234 → preBalanceValidationPassed, transaction.amount + channeluser.totalAmount/totalRewardAmount = 1234 |
| chain.points.db | Chain | ❌ FAIL | points_user_qa_pts_05r876=null (want 1234); pointsmeta_qa_pts_05r876.userId=null (want 991782436068181) |
| chain.points.readback.userid | Chain | ✅ PASS | userId=991782436068181 → channelusers[0]={username:qa_pts_05r876, totalAmount:1234} |
| chain.points.readback.username | Chain | ✅ PASS | username=qa_pts_05r876 → totalAmount:1234 |
| chain.points.odata | Chain | ✅ PASS | value[] contains {username:qa_pts_05r876, totalAmount:1234}, @odata.count=1 |
| chain.points.leaderboard | Chain | ✅ PASS | leaderboard[] contains {username:qa_pts_05r876, balance:1234} (1 entries) |
| chain.points.clientside | Chain | ⚠️ SKIP | The !points chat-command read + wheel-spin / transfer cost-checks are bundle-side (decompiled/modules:4205/9256/14684).  |
| chain.points.cleanup | Chain | ✅ PASS | deducted 1234 → balance 0 (leaderboard filters balance>0 so the viewer drops off) |
| chain.goals.login | Chain | ✅ PASS | widget socket connected + login emitted on channelId=1 |
| chain.goals.list | Chain | ✅ PASS | 200 OK, goals[] present (0 existing) in 1ms |
| chain.goals.validate | Chain | ✅ PASS | missing-type → 400 and target<=0 → 400 (both rejected as expected) |
| chain.goals.create | Chain | ✅ PASS | created goal id=1 (target=500) → 200 in 1ms |
| chain.goals.create.broadcast | Chain | ✅ PASS | widget received goalsChanged in 0ms (budget 3000ms) |
| chain.goals.create.db | Chain | ❌ FAIL | Goals row not found for Name='E2E goal' ChannelId=1 ProfileId=1 |
| chain.goals.update | Chain | ✅ PASS | updated goal id=1 target→999 → 200 in 1ms |
| chain.goals.update.broadcast | Chain | ✅ PASS | widget received 2nd goalsChanged in 0ms (budget 3000ms) |
| chain.goals.update.db | Chain | ❌ FAIL | expected Target=999; got no row |
| chain.goals.reset | Chain | ✅ PASS | reset goal id=1 Current→0 → 200 in 1ms |
| chain.goals.reset.broadcast | Chain | ✅ PASS | widget received goalsChanged after reset |
| chain.goals.delete | Chain | ✅ PASS | deleted goal id=1 → 200 in 1ms (cleanup) |
| chain.goals.delete.broadcast | Chain | ✅ PASS | widget received goalsChanged after delete |
| chain.goals.delete.db | Chain | ✅ PASS | no Goals row remains for Name='E2E goal' (cleanup verified) |
| chain.goals.clientside | Chain | ⚠️ SKIP | goal-widget progress render is client-side (widget HTML); bridge.refreshGoals is an optional cache drop — not headless-t |
| chain.coinjar.scope | Chain | ✅ PASS | active scope channelId=1 profileId=1 (DB C:\Users\nguyenlg\AppData\Roaming\tikfinity-desktop\tikfinity-data\tikfinity.db |
| chain.coinjar.http | Chain | ⚠️ SKIP | mutating step skipped (run with --mutating to fire the reset and assert delivery) |
| chain.coinjar.relay | Chain | ⚠️ SKIP | depends on the mutating POST — run with --mutating |
| chain.coinjar.widgetReset | Chain | ⚠️ SKIP | client-side only (downloads/widget/coinjar/index.html → coin-jar.js window.resetJar) — not headless-testable |

**Perf:** {"backendRssMb":524,"electronRssMb":874,"electronInstances":6,"cpuPct":0.2,"cores":24,"stretchMsMax":null,"stretchMsAvg":null,"logErrors":0,"logReloads":0}

<!-- QA-AUTO:END -->
