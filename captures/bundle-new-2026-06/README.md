# Bundle TikFinity MỚI — staged để update SAU (tải 2026-06-10)

> User: "cứ tải về đi sau này update lên sau". **CHƯA áp dụng** — 4 file ở đây vẫn là bản mới chờ thay vào `downloads/combo/`. Clone hiện tại vẫn dùng bản cũ (May 20).

## File đã tải (từ https://tikfinity.zerody.one/combo/)

| File | Bản này (mới) | combo/ hiện tại (cũ May 20) | Chênh |
|---|---|---|---|
| app.js | 4,208,066 | 3,934,072 | +274 KB |
| modules.js | 1,372,816 | 1,279,315 | +93 KB |
| modules.css | 35,942 | 31,615 | +4.3 KB |
| ui.css | 2,575 | 2,575 | giống (không đổi) |

`decompiled-new/modules/deobfuscated.js` (26,759 dòng) = modules.js mới đã webcrack — để diff.

## CÓ GÌ MỚI (đã verify trong decompiled)

1. **Follower Counter** (`followerCounter*`, `createFollowerCounter`?) — overlay + **action** đếm follower theo **mốc** (MilestoneSelect → đạt N follower → chạy action). deob mới ~21902-22056.
2. **Countdown Goal** (`createCountdownGoal` deob:19227/19424, `countdownGoalOverlay/MetricContainer/CustomValues`) — overlay mục tiêu **đếm ngược** + custom values + metric + prefix/suffix.
3. **Style Preview** (`stylePreview*`) + `goalPrefix`/`goalSuffix` — xem trước kiểu overlay + tuỳ biến text goal.

→ Chủ yếu thêm **2 overlay mới**. Anchor cấu trúc clone **SỐNG SÓT** trong bản mới: `obsOverlayOnPage ✓ widgetCoinmatch ✓ lazy-frame ✓ streamProfileId ✓ tts_api__ ✓`.

## ⚠️ KHI UPDATE — đọc trước (rủi ro cao, §9 + qa/BUNDLE_UPDATE.md)

**Cái sẽ VỠ:** nhiều IIFE trong `blockScript.txt` bám **OFFSET app.js** (vd `TTSProDropdown @1957836`, nav store `@1584059`, `switchLanguage @3522500`...). Bản mới +274KB → **offset xê dịch HẾT** → các patch offset-based vỡ. 35+ Gate + voice-picker chain + Pinia trap + i18n cần re-verify.

**Quy trình update an toàn:**
1. `cp -r downloads/combo downloads/combo.bak-<ngày>-pre-update` (backup).
2. `cp captures/bundle-new-2026-06/*.{js,css} downloads/combo/` (thay).
3. Re-RE: `NODE_OPTIONS=--max-old-space-size=6144 npx webcrack downloads/combo/app.js -o decompiled/app` + `... modules.js -o decompiled/modules` (cập nhật artifact đọc-tham-chiếu).
4. `npm run qa` → **gate-health** báo Gate nào trôi (needle mất) → đọc `qa/BUNDLE_UPDATE.md`.
5. Sửa từng gate trôi: tìm lại offset/symbol mới trong `decompiled/` → cập nhật IIFE trong `blockScript.txt`.
6. `node backend-node/scripts/extract-new-i18n.js` (i18n keys mới) → `POST /api/_dev/reload-html`.
7. Verify checklist §9: login / profile switch / sub-sidebar / chat events / TTS / topbar LIVE / chip 100k / voice picker / overlay cards.
8. Fail critical → rollback `downloads/combo.bak-*`.

**Đo layout sau update:** dùng `qa/.measure/measure4.js` (Playwright headless) để check overlay card + iframe-fill không vỡ.
