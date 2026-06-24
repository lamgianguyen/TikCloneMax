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

## 🤖 AUTO QA RUN — 2026-06-19 22:10 (run 20260619-221007)

> Tự sinh bởi `qa/run-all.js`. PASS=53 FAIL=0 SKIP=0 · backend UP · 58ms · PARTIAL. Block này bị GHI ĐÈ mỗi run — đừng sửa tay.

> ⚠️ **PARTIAL RUN** (only=`gate-health`) — KHÔNG phủ hết module. FAIL count chỉ tính trong subset; FIXLOG failures block phản ánh lần FULL run gần nhất. Chạy `node qa/run-all.js` (không `--only`) để có ledger đầy đủ.

| # | Vùng | Status | Bằng chứng |
|---|---|---|---|
| gate.06.aivoiceprefix | L4 Gate-drift | ✅ PASS | Gate Gate 6/7 anchor 'tts_api__' present (3 hits in modules/deobfuscated.js) |
| gate.07.resolvevoicecfg | L4 Gate-drift | ✅ PASS | Gate Gate 7 anchor 'resolveVoiceConfigFromId' present (1 hits in app/deobfuscated.js) |
| gate.08.hasbackendctx | L4 Gate-drift | ✅ PASS | Gate Gate 8a anchor 'getAiTtsBackendContext' present (4 hits in app/deobfuscated.js) |
| gate.09b.currentusagemode | L4 Gate-drift | ✅ PASS | Gate Gate 23b anchor 'currentUsageMode' present (1 hits in modules/deobfuscated.js) |
| gate.23b.subcredits | L4 Gate-drift | ✅ PASS | Gate Gate 23b anchor 'sub_credits' present (1 hits in modules/deobfuscated.js) |
| gate.09a.ttsauthtoken | L4 Gate-drift | ✅ PASS | Gate Gate 9a anchor 'ttsAuthToken' present (9 hits in modules/deobfuscated.js) |
| gate.25.loadaivoicestate | L4 Gate-drift | ✅ PASS | Gate Gate 25 anchor 'loadAiVoiceState' present (5 hits in modules/deobfuscated.js) |
| gate.25.ensureauthtoken | L4 Gate-drift | ✅ PASS | Gate Gate 25 anchor 'ensureAiAuthToken' present (6 hits in modules/deobfuscated.js) |
| gate.25.aivoicecooldown | L4 Gate-drift | ✅ PASS | Gate Gate 25 anchor 'aiVoiceStateLastLoadedAt' present (3 hits in modules/deobfuscated.js) |
| gate.23.ispro | L4 Gate-drift | ✅ PASS | Gate Gate 23 anchor 'userFeatures' present (123 hits in modules/deobfuscated.js) |
| gate.23.proinfo | L4 Gate-drift | ✅ PASS | Gate Gate 23b anchor 'proInfo' present (52 hits in modules/deobfuscated.js) |
| gate.30a.proChip | L4 Gate-drift | ✅ PASS | Gate Gate 30a anchor 'TTSProDropdown' present (5 hits in app/deobfuscated.js) |
| gate.30a.freeChip | L4 Gate-drift | ✅ PASS | Gate Gate 30a anchor 'TTSFreeDropdown' present (1 hits in app/deobfuscated.js) |
| gate.30b.switchlanguage | L4 Gate-drift | ✅ PASS | Gate Gate 30b anchor 'switchLanguage' present (4 hits in app/deobfuscated.js) |
| gate.30c.streamprofile | L4 Gate-drift | ✅ PASS | Gate Gate 30c anchor 'streamProfileId' present (5 hits in app/deobfuscated.js) |
| gate.30c.switchprofile | L4 Gate-drift | ✅ PASS | Gate Gate 30c anchor 'switchProfile' present (4 hits in app/deobfuscated.js) |
| gate.30d.stretchiframe | L4 Gate-drift | ✅ PASS | Gate Gate 30d anchor 'stretchIframe' present (3 hits in modules/deobfuscated.js) |
| gate.30d.obsoverlays | L4 Gate-drift | ✅ PASS | Gate Gate 30d anchor 'lazy-frame' present (1 hits in modules/deobfuscated.js) |
| gate.34.refreshdatasource | L4 Gate-drift | ✅ PASS | Gate Gate 34 anchor 'refreshDataSource' present (4 hits in modules/deobfuscated.js) |
| gate.34.loadtriggers | L4 Gate-drift | ✅ PASS | Gate Gate 34 anchor 'loadTriggers' present (4 hits in modules/deobfuscated.js) |
| gate.34.triggerdatasource | L4 Gate-drift | ✅ PASS | Gate Gate 34 anchor 'triggerDataSource' present (9 hits in modules/deobfuscated.js) |
| gate.34.onEditorPreparing | L4 Gate-drift | ✅ PASS | Gate Gate 34 anchor 'onEditorPreparing' present (1 hits in modules/deobfuscated.js) |
| gate.35.distribute | L4 Gate-drift | ✅ PASS | Gate Gate 35 anchor 'distributeEvent' present (11 hits in modules/deobfuscated.js) |
| gate.35.coinjarreset | L4 Gate-drift | ✅ PASS | Gate Gate 35 anchor 'coin-jar:reset' present (1 hits in app/deobfuscated.js) |
| gate.35.coinmatchstart | L4 Gate-drift | ✅ PASS | Gate Gate 35 anchor 'coin-match:start' present (1 hits in app/deobfuscated.js) |
| gate.35.spinwheel | L4 Gate-drift | ✅ PASS | Gate Gate 35 anchor 'onSpinWheel' present (1 hits in app/deobfuscated.js) |
| gate.35.widgetstate | L4 Gate-drift | ✅ PASS | Gate Gate 35 anchor 'onWidgetState' present (6 hits in modules/deobfuscated.js) |
| gate.35.emitwidgetsettings | L4 Gate-drift | ✅ PASS | Gate Gate 35 anchor 'emitWidgetSettingsToWidgets' present (16 hits in modules/deobfuscated.js) |
| gate.35.resetjar | L4 Gate-drift | ✅ PASS | Gate Gate 35-MECH anchor 'resetJar' present (4 hits in app/deobfuscated.js) |
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
| gate.overlaycard.iframefill | L4 Gate-drift | ✅ PASS | Gate Overlay-Layout anchor 'iframe.lazy-frame' present (4 hits in templates/earlyCss.txt) |
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

**Perf:** (perf-sample không nằm trong subset run này)

<!-- QA-AUTO:END -->
