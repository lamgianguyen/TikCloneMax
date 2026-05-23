# TikFinity Clone - Core Operating Principles (v6 - Self-Contained Skill)

Bạn là Senior Engineer làm việc trên **TikFinity Clone**: Node.js, Express, Socket.IO, TikTok Live Connector, bundled TikFinity frontend, và Electron shell.

Mục tiêu số 1: **giữ app ổn định**. Tính năng mới hoặc bug fix chỉ được coi là xong khi có bằng chứng kiểm chứng rõ ràng và không phá các luồng đang chạy ổn.

## 0.0 Quick context map — đọc trước khi sửa code

**Files PHẢI biết:**

| Surface area | File chính | Phụ trợ |
|---|---|---|
| Bundle interception | [backend-node/src/templates/blockScript.txt](backend-node/src/templates/blockScript.txt) | IIFEs: tfI18nPreBake, tfForceProCredits, tfActivateProUI, tfHandleTtsGenerate, tfHandleTtsTikfinityUser, tfHandleTtsTikfinityCom |
| Bundle styling overrides | [backend-node/src/templates/earlyCss.txt](backend-node/src/templates/earlyCss.txt) | Inject vào HTML head; 5 critical UI gates A-E xem §Gate 22 |
| HTML middleware injection | [backend-node/src/middleware/index-html.js](backend-node/src/middleware/index-html.js) | reloadGuard + earlyCss + blockScript + authScript |
| /api/me handler | [backend-node/src/routes/me.js](backend-node/src/routes/me.js) | Pro shape: proInfo:null, subscription:null, channeluser:object — xem §Gate 23b |
| Bundle decompiled (read-only) | [decompiled/modules/deobfuscated.js](decompiled/modules/deobfuscated.js) | ~945KB readable Vue app. Grep symbols TRƯỚC khi guess |
| API contracts captured | [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md) | 26 endpoints shape + sample. Diff với handler để fix UI bug |
| 228 endpoints catalogue | [docs/COMPLETE_ENDPOINT_INDEX.md](docs/COMPLETE_ENDPOINT_INDEX.md) | Full list — dùng cho stub router fallback |
| Boot sequence + per-feature flow | [docs/BUNDLE_CALL_FLOW.md](docs/BUNDLE_CALL_FLOW.md) | §10 có 5 UI bugs A-E + fixes |

**Skill mapping rule (theo yêu cầu user 2026-05-22):**

> CLAUDE.md là **self-contained skill file** — phải đủ thông tin để 1 agent fresh đọc xong hiểu architecture + critical gates + cách fix bugs. Khi cần chi tiết hơn, REFERENCE file khác qua markdown link, KHÔNG copy-paste toàn bộ content.

**Workflow chuẩn khi gặp UI bug:**

1. Đọc §Gates trong file này (1.00 - 25) — có 25+ gates đã catalogued
2. Nếu gate match → áp fix
3. Nếu không match → grep `decompiled/modules/deobfuscated.js` cho symbol
4. Nếu cần shape API → grep `docs/API_CONTRACTS.md`
5. Probe DOM via DevTools Console (mẫu probe trong §Gate 20 §Gate 25)
6. Document gate mới vào §Gate 26+

---

## 0. Scope và thứ tự ưu tiên

File này áp dụng cho mọi thay đổi trong repo `TikCloneMax`.

Thứ tự ưu tiên khi có xung đột:

1. Yêu cầu trực tiếp mới nhất của user.
2. Quy tắc an toàn trong `CLAUDE.md`.
3. Superpowers/skills đang có sẵn trong Codex.
4. Best practice chung.

Superpowers được dùng như guardrail kỹ thuật, không được dùng để làm nặng task nhỏ. Nếu superpower không khả dụng, vẫn phải làm theo cùng tinh thần thủ công.

---

## 1. Non-Negotiable Principles

00. **Bundle UI override priority (workaround pattern hierarchy)**

Khi bundle obfuscated render khác mong đợi, áp dụng theo thứ tự ƯU TIÊN — pattern nào cao hơn fail thì xuống pattern dưới:

| Priority | Pattern | Khi nào dùng | File touch |
|---|---|---|---|
| 1 | **Backend response fix** | Nếu bundle đọc field từ HTTP response API và data của tôi sai shape | `routes/*.js`, mock `/api/*` |
| 2 | **Pinia/store force-patch** | Nếu bundle read từ Pinia/window store mà response API không trigger update | `blockScript.txt` IIFE periodic 2s |
| 3 | **`data-*` attribute + CSS** | Nếu bundle render hardcoded text mà Vue re-render đè lại JS mutation | `data-tf-*` attribute trên `<html>` + earlyCss rules |
| 4 | **CSS pseudo-element override** | Nếu bundle render fixed string/format mà cần thay đổi visual ONLY | `font-size:0` + `::before content` (KHÔNG `display:none` — break flex) |
| 5 | **DOM MutationObserver replace** | Last resort cho dynamic text. PHẢI throttle ≥100ms để không fight Vue |
| ❌ | **Patch bundle's render function** | KHÔNG bao giờ — obfuscated, blast radius unknown, fragile per bundle update |
| ❌ | **Set Pinia value as wrong type** | E.g., `proCredits: '100k'` (string thay vì number) — break downstream math |

Choose lowest-priority pattern that solves problem. CSS > JS observer.

0. **TikClone là ALL-PRO by design**
   Serial Key gate ở TikfinityServer startup đã unlock TẤT CẢ tính năng Pro của bundle. Mọi response của `/api/me`, `/api/tts/user`, `/api/tts/auth-token` PHẢI emit user state là Pro:
   - `/api/me` → `isPro: true`, `subscription.isPro: true`, `userFeatures.isPro: true`
   - JWT từ `/api/tts/auth-token` payload có `subscriptionEnabled: true` + `subscriptionPeriodCredits > 0`
   - `/api/tts/user` quota: `currentUsageMode: 'subscription'`, `subscriptionCreditsRemaining: 100000`, `subscriptionCreditsTotal: 100000`

   Side-effect duy nhất: bundle's topbar chip render TikTok avatar thay vì coin (Pro UX gốc). Fix qua CSS override trong `earlyCss.txt` (force-hide `<img>` + show coin twemoji 1fa99 pseudo-element). Selector dùng `bg-[#D435554D]` (chip's burgundy background) — ổn định qua bundle updates.

   KHÔNG được set isPro=false hoặc currentUsageMode='free' để workaround vấn đề khác — sẽ lock các Pro feature người dùng kỳ vọng.

1. **Không tạo regression mới**
   Mọi thay đổi phải xét tác động đến login, UI, navigation, TikTok events, profile switch, realtime connection, Socket.IO, TTS, Activity Feed, topbar, và Electron boot.

2. **Minimal Change First**  
   Ưu tiên sửa nhỏ nhất có thể: 1 dòng > 1 function > 1 file > nhiều module. Không refactor tiện tay.

3. **Root Cause Before Fix**
   Không vá theo cảm giác. Bug fix phải có reproduce/evidence, hypothesis, và root cause hoặc phạm vi nghi ngờ rất rõ.

4. **Backup Before Risky Edits**
   File/folder rủi ro cao phải backup và verify backup trước khi sửa.

5. **Evidence Before Completion**
   Không nói "đã xong", "fixed", "pass", hoặc tương đương nếu chưa chạy verification mới và đọc output.

6. **Stability Over Completeness**
   Nếu fix hoàn hảo làm tăng rủi ro, chọn fix nhỏ an toàn trước, ghi rõ phần còn lại.

7. **Race/Reconnect Is High Risk**
   Logic liên quan TikTok connection, profile switch, Socket.IO, reconnect, session state phải có mutex, abort flag, generation token, hoặc state machine rõ ràng.

8. **No Hardcode, No Magic Number**
   Config, timeout, retry, route, selector, event name phải có tên rõ hoặc reuse constant hiện có.

9. **Meaningful Logs With Context**
   Log cần có flow, profile/channel/session/generation/error context khi liên quan realtime hoặc auth.

10. **Protect User Work**
    Không revert hoặc overwrite thay đổi không phải của mình nếu user không yêu cầu.

11. **UI Verification Gate (added 2026-05-22 sau over-engineering session)**
    BẮT BUỘC verify UI KHÔNG REGRESSION trước khi claim fix. Cụ thể:

    **Trước khi edit:**
    - Screenshot/probe current working state của các surface area liên quan
    - Liệt kê features đang WORK (vd: chip 100k, switch profile, click connect, AI voices, etc.)
    - Backup file edit (`.bak-YYYY-MM-DD-pre-<change>`)

    **Sau mỗi edit (TỪNG file riêng, không batch):**
    - Restart electron (hoặc Ctrl+R nếu file static)
    - Verify TỪNG feature trong working list KHÔNG break
    - Specific UI surfaces phải re-test:
      - Topbar: Pro chip number, PRO badge, profile dropdown, LIVE/Disconnected status
      - Sidebar: Stream Profile dropdown (10 profiles cho Pro), switch profile flow
      - Pages: Cài đặt (input + button), Lớp phủ (cards layout), Hành động (sub-sidebar)
      - Connect: topbar click + inline button (cả 2 phải work)
      - Voice picker: AI tab + Pro tab + Free tab (voices phải load)
      - Widgets: chat appears, gift events, TTS speaks

    **Nếu verify FAIL ở bất kỳ feature nào:**
    - REVERT immediately, KHÔNG add thêm patch
    - Document regression vào Gate mới
    - Hỏi user direction trước khi tiếp tục

    **Anti-patterns đã vi phạm trong session 2026-05-22 (ghi để tránh tái phạm):**
    - ❌ Multiple iteration cycle cùng 1 vấn đề (proInfo v1→v2→v3→v4) — should probe before guess
    - ❌ defineProperty trap aggressive → block Vue update → mất switch profile
    - ❌ Inject custom UI thay vì grep bundle native button source (Gate 26 confused)
    - ❌ Không backup TRƯỚC edit (chỉ backup khi user remind)
    - ❌ Không verify working features sau mỗi edit — accumulated regression

    **Quy trình safer thay thế:**
    1. ONE change at a time
    2. Verify working list sau mỗi change
    3. STOP và revert nếu thấy regression
    4. Gate doc only AFTER user confirm fix work

---

## 2. Superpowers Policy

Áp dụng superpower theo tình huống, không nhồi vào mọi việc.

| Tình huống | Superpower nên dùng | Cách áp dụng trong project này |
|---|---|---|
| Bug, test fail, unexpected behavior, build fail | `superpowers:systematic-debugging` | Bắt buộc tìm root cause trước khi code. Nếu đã thử nhiều fix mà vẫn lỗi, quay lại evidence thay vì thêm patch. |
| Feature, bugfix, refactor, behavior change | `superpowers:test-driven-development` | Viết failing test trước khi khả thi. Nếu Electron/TikTok Live/UI bundle khó auto-test, tạo repro script, smoke check, hoặc manual verification checklist trước khi sửa. |
| Task nhiều bước, chạm nhiều module, hoặc high-risk | `superpowers:writing-plans` | Lập plan ngắn có file touched, impact, rollback, và verification trước khi code. Không cần cho task nhỏ 1 file/1 dòng. |
| Trước khi claim complete/fixed/passing | `superpowers:verification-before-completion` | Bắt buộc chạy verification mới trong cùng lượt làm việc và báo đúng kết quả. |
| Review feedback hoặc user nói fix chưa đúng | `superpowers:receiving-code-review` hoặc debugging flow | Không đồng ý mù quáng. Xác minh feedback, reproduce lại, rồi mới sửa. |
| Major/high-risk change trước merge/commit | `superpowers:requesting-code-review` | Khuyến nghị nếu chạm bundle, DB, Electron main, auth, Socket.IO, profile switch, TikTok connection. |

Không dùng subagent/parallel-agent workflow trừ khi user yêu cầu rõ hoặc task có các phần độc lập thật sự. Nếu dùng, phải chia ownership file rõ và không để các agent sửa cùng file.

---

## 3. Risk Tiers

### Low Risk

Ví dụ: docs nhỏ, comment không runtime, typo, log text không đổi behavior.

Yêu cầu: impact ngắn + quick verification. Backup thường không cần.

### Standard Risk

Ví dụ: service/helper riêng lẻ, route phụ, UI script nhỏ, config ít ảnh hưởng.

Yêu cầu: impact rõ, minimal plan, test hoặc smoke check phù hợp.

### High Risk

Bắt buộc backup trước khi sửa:

- `downloads/**`
- `backend-node/src/templates/*.txt`
- `backend-node/src/templates/*.json` nếu được inject vào HTML/runtime
- `backend-node/src/middleware/*.js`
- `backend-node/src/index.js`
- `electron/main.js`
- Database schema, migration, seed quan trọng, `.db`
- Auth/login route, TikTok Live route/service, Socket.IO event layer
- Profile switch, reconnect, session state, TTS reader, Activity Feed
- File lớn/shared file khi thay đổi behavior hoặc blast radius chưa rõ

### Critical Bundle Risk

`downloads/combo/app.js`, `modules.js`, `modules.css`, `ui.css` là obfuscated frontend gốc. Chỉ update khi user chủ động yêu cầu và đã có backup + rollback plan.

---

## 4. Pre-Edit Gate

Trước khi sửa file, phải xác định:

1. File/function sẽ chạm và lý do.
2. Risk tier.
3. Luồng có thể bị ảnh hưởng: login, UI, navigation, TikTok events, profile switch, realtime connection, TTS, Activity Feed, Electron boot.
4. Cách sửa nhỏ nhất.
5. Rollback plan nếu high-risk.
6. Verification plan.

Với task nhỏ low-risk, có thể trả lời gọn trong 1-2 câu. Với standard/high-risk, phải rõ ràng trước khi apply.

---

## 5. Backup Discipline

### Khi bắt buộc backup

Backup trước mọi thay đổi high-risk hoặc critical bundle. Không sửa trước rồi mới backup.

### Quy trình bắt buộc

1. Liệt kê file/folder sẽ touch và lý do.
2. Backup với suffix không overwrite, ví dụ `.bak-2026-05-21-pre-auth-fix`.
3. Verify backup bằng size hoặc hash.
4. Nêu rollback command trước khi apply.
5. Apply minimal change.
6. Verify sau apply. Nếu fail ở critical path và không có fix nhỏ rõ ràng, rollback trước.
7. Giữ ít nhất 2 backup gần nhất cho bundle/templates/Electron main/backend bootstrap/DB.

### PowerShell backup examples

Backup file:

```powershell
$src = 'backend-node/src/templates/blockScript.txt'
$bak = 'backend-node/src/templates/blockScript.txt.bak-2026-05-21-pre-i18n'
Copy-Item -LiteralPath $src -Destination $bak -Force
Get-Item -LiteralPath $src,$bak | Select-Object FullName,Length,LastWriteTime
Get-FileHash -LiteralPath $src,$bak -Algorithm SHA256
```

Rollback file:

```powershell
Copy-Item -LiteralPath 'backend-node/src/templates/blockScript.txt.bak-2026-05-21-pre-i18n' -Destination 'backend-node/src/templates/blockScript.txt' -Force
```

Backup folder:

```powershell
Copy-Item -LiteralPath 'downloads/combo' -Destination 'downloads/combo.bak-2026-05-21-pre-update' -Recurse -Force
Get-ChildItem -LiteralPath 'downloads/combo','downloads/combo.bak-2026-05-21-pre-update' -Recurse | Measure-Object -Property Length -Sum
```

Rollback folder: verify resolved paths first, then move current broken folder aside and restore backup.

```powershell
Move-Item -LiteralPath 'downloads/combo' -Destination 'downloads/combo.failed-2026-05-21'
Copy-Item -LiteralPath 'downloads/combo.bak-2026-05-21-pre-update' -Destination 'downloads/combo' -Recurse -Force
```

Anti-patterns:

- Sửa high-risk file mà không backup.
- Backup nhưng không verify.
- Overwrite backup cũ.
- Xóa backup trước khi bản mới chạy ổn định.
- Debug lâu trên critical broken state thay vì rollback.

---

## 6. Bug Fix Workflow

Khi user yêu cầu sửa lỗi:

1. **Reproduce hoặc thu evidence**
   Đọc error đầy đủ, stack trace, log, console, network, DB state nếu có. Nếu không reproduce được, nói rõ thiếu data nào.

2. **Trace root cause**
   Tìm nơi bad state/value/event bắt đầu. Với multi-component flow, log ở boundary: renderer -> backend -> Socket.IO -> TikTok connector -> DB.

3. **Compare working pattern**
   Tìm code tương tự đang chạy đúng trong repo trước khi tự chế pattern mới.

4. **State hypothesis**
   Nêu "root cause khả dĩ là X vì Y". Không fix nhiều giả thuyết cùng lúc.

5. **Impact assessment**
   Ghi file/function bị ảnh hưởng và các critical flows có rủi ro.

6. **Failing test hoặc repro first**
   Ưu tiên automated test. Nếu không khả thi, tạo script/probe/manual steps cụ thể để chứng minh lỗi trước khi sửa.

7. **Minimal fix**
   Sửa đúng root cause, không refactor phụ.

8. **Verify**
   Chạy test/smoke/manual check phù hợp, rồi mới claim.

Nếu user nói "vẫn còn lỗi": không vội patch tiếp. Hỏi hoặc thu lại exact steps, log, screenshot/console, expected vs actual, thời điểm xảy ra, profile/channel đang dùng.

---

## 7. Feature Development Workflow

Khi thêm tính năng hoặc đổi behavior:

1. Hiểu mục tiêu, input/output, UX flow, config/state cần thêm.
2. Nếu task chạm nhiều module hoặc high-risk, viết plan trước khi code.
3. Chọn nơi đặt logic theo pattern hiện có trong repo.
4. Ưu tiên extend behavior cũ thay vì thay đổi behavior đang ổn định.
5. Dùng flag/config/fallback cho tính năng có rủi ro.
6. Viết failing test trước nếu khả thi.
7. Implement nhỏ, có error handling.
8. Verify feature mới và regression ở luồng cũ.

Không thêm dependency, migration, background timer, global state, hoặc IPC/socket event mới nếu không có lý do rõ và verification tương ứng.

---

## 8. Realtime, TikTok, Profile Switch, Socket.IO

Các khu vực này luôn được coi là high-risk.

Quy tắc bắt buộc:

- Mỗi connection attempt phải có owner rõ: profile/channel/session/generation.
- Async callback cũ phải bị ignore khi generation/session không còn hiện hành.
- Disconnect/reconnect phải idempotent.
- Không có timer/retry loop không có cleanup.
- Không emit Socket.IO event từ stale connection.
- Profile switch phải abort hoặc invalidate connection cũ trước khi tạo connection mới.
- UI state không được dựa vào event đến muộn nếu đã switch profile.
- Log connect/disconnect/reconnect/error phải có context.

Verification tối thiểu khi chạm khu vực này:

- Login vẫn hoạt động.
- Connect TikTok Live một profile.
- Switch profile rồi reconnect.
- Disconnect rồi connect lại.
- Chat/gift/like/follow hoặc event liên quan vẫn vào Activity Feed nếu có thể test.
- Socket.IO client không nhận duplicate events sau reconnect.

---

## 9. Bundle Management

### Khi được update bundle

Chỉ update `downloads/combo/*` khi đủ 3 điều kiện:

1. User chủ động yêu cầu update bundle.
2. Đã backup `downloads/combo/`.
3. Đã có impact + rollback plan.

### Impact phải xét

- Bundle hiện tại cũ bao nhiêu ngày.
- Vue scope ID (`data-v-*`).
- Tailwind/class names.
- Injection points: PostHog stripping, socket, TTS, navigation, reload guard, auth, topbar.
- Login, profile switch, sub-sidebar, Activity Feed.
- i18n path/key changes.

### Cách update an toàn

Khuyến nghị user tự download từ `https://tikfinity.zerody.one/`:

1. Mở site.
2. DevTools Network, reload.
3. Save 4 file: `app.js`, `modules.js`, `modules.css`, `ui.css`.
4. Đặt vào `downloads/combo/` sau khi backup đã xong.

Sau update phải verify:

- Login flow.
- Profile switch.
- Sub-sidebar/navigation.
- TikTok chat events.
- TTS reader.
- Topbar/LIVE status/Activity Feed.
- Console không có lỗi nghiêm trọng.
- i18n keys mới.

Fail ở critical item thì rollback bundle.

---

## 10. i18n and Template Injection Traps

### Late-mutation trap

Bundle copy `tfPageloadData.localization.<lang>` vào vue-i18n/Composition API store ngay lúc init. Patch chạy sau bundle init là quá muộn và modal có thể render raw key.

Fix đúng: cài `Object.defineProperty(window, 'tfPageloadData', ...)` trong head injection trước khi inline script gán `window.tfPageloadData`.

### Localization path-change trap

Bundle mới có thể dùng:

- Mới: `tfPageloadData.localization.<lang>`
- Cũ: `tfPageloadData.appConfig.localization.<lang>`

Khi update bundle, probe trong DevTools:

```js
Object.keys(window.tfPageloadData)
Object.keys(window.tfPageloadData.localization || {})
```

Verify voice picker keys:

```js
Object.keys(window.tfPageloadData.localization.en).filter(k => k.includes('voice_picker')).length
```

Kết quả phải lớn hơn 0 nếu patch đúng path.

### i18n audit sau bundle update

Chạy:

```powershell
node backend-node/scripts/extract-new-i18n.js
```

Script ghi missing keys vào:

```text
backend-node/src/templates/i18n-patch.json
```

`backend-node/src/middleware/index-html.js` hiện đọc `i18n-patch.json` trong lúc build HTML, nên sau khi regenerate cần gọi reload endpoint để clear HTML cache:

```powershell
Invoke-WebRequest -Method POST -Uri 'http://localhost:5285/api/_dev/reload-html'
```

Nếu logic đọc file bị chuyển lên module init trong tương lai, phải restart Electron/backend.

### Literal tag trap trong template

`index-html.js` dùng regex inject quanh head/body opening tags. Không viết literal head/body HTML tags trong comment hoặc string của `backend-node/src/templates/*.txt`, vì regex có thể match nhầm và phá inline script.

Dùng cách viết tách như:

- `the h-e-a-d element`
- `the b-o-d-y element`
- `'<bo' + 'dy>'` nếu thật sự cần literal trong code

Sau khi sửa template, chạy:

```powershell
node backend-node/scripts/check-script-syntax.js
```

Pass toàn bộ inline scripts mới được coi là an toàn để boot bundle.

---

## 11. Hot Reload vs Restart

| Loại thay đổi | Cách áp dụng |
|---|---|
| `backend-node/src/templates/*.txt` | `POST /api/_dev/reload-html` thường đủ |
| `backend-node/src/templates/i18n-patch.json` | Regenerate rồi `POST /api/_dev/reload-html` nếu current code vẫn đọc trong `buildIndexHtml()` |
| `backend-node/src/templates/voice-catalog.json` | `POST /api/_dev/reload-html` |
| `backend-node/src/middleware/*.js` | Restart backend/Electron |
| `backend-node/src/index.js` | Restart backend/Electron |
| `electron/main.js` | Restart Electron |
| `downloads/combo/*` | Reload renderer/hard refresh sau khi backup/update |
| `downloads/css/*`, `downloads/js/*` | Reload renderer hoặc `POST /api/_dev/reload-html` nếu injected version/cache changes |
| DB migration/schema | Backup DB, run migration, restart if connections cache schema |

---

## 12. Verification Matrix

Chọn verification theo blast radius. Không claim nếu chỉ chạy một check không chứng minh được phần đã sửa.

### General commands

```powershell
npm --prefix backend-node run migrate
node backend-node/scripts/check-script-syntax.js
npm --prefix backend-node start
npm --prefix electron start
```

Chỉ chạy command phù hợp với task. Không tự ý chạy migration nếu task không liên quan DB hoặc có rủi ro dữ liệu.

### Manual smoke checks

Khi có UI/Electron/runtime change, user hoặc agent cần kiểm tra:

- App boot không lỗi console nghiêm trọng.
- Login/logout.
- Navigation/sub-sidebar.
- Profile switch.
- TikTok connect/disconnect/reconnect.
- Activity Feed nhận event.
- TTS voice picker/reader nếu chạm TTS/i18n.
- Topbar LIVE status.

### Completion report must include

- Files changed.
- Risk/impact summary.
- Verification command hoặc manual check đã chạy.
- Chỗ chưa verify được và lý do.
- Rollback path nếu high-risk.

---

## 13. Review Checklist Before Final Answer

Trước khi trả lời cuối:

1. Có đúng yêu cầu mới nhất của user không.
2. Có chạm file ngoài scope không.
3. Có backup cho high-risk file không.
4. Có evidence verification mới không.
5. Có regression risk nào cần nói rõ không.
6. Nếu chưa test được phần nào, nói thẳng.

Rule vàng: **sửa xong mà tạo lỗi mới hoặc phá chức năng cũ là không chấp nhận**.

---

## 14. Bundle Voice Picker — Known Issues + Fix Map (2026-05-21)

Voice picker modal (AI/Pro/Singing/Free Voices) trong bundle ≥3.9MB có MULTIPLE gating layers. Một mỗi gate đứng riêng đều làm modal empty. Phải fix HẾT để modal hiển thị voices.

### Gate 1: Profile mismatch → settings.restore reload loop

**Triệu chứng:** Bundle gọi `settings.restore()` → `location.reload()` → reload-guard window=8/8 KILL SWITCH → app stuck black/inconsistent.

**Root cause:** `Channels.ProfileId` trong DB trỏ tới profile không tồn tại trong `Profiles` table (vd Channel.ProfileId=2 nhưng Profiles chỉ có Id=1). Bundle load settings cho profile-không-có → bị stale → trigger restore → reload.

**Fix:**
```sql
-- Direct DB fix:
UPDATE Channels SET ProfileId = 1 WHERE ProfileId NOT IN (SELECT Id FROM Profiles);
```
Hoặc qua API: `POST /api/me { "profileId": 1 }`.

**Prevent:** Add clamp guard ở `/api/me`: nếu request profileId không có trong Profiles table, reject hoặc auto-fallback profile 1.

### Gate 2: `tf_locale=VN` cookie không được middleware nhận

**Triệu chứng:** User chuyển ngôn ngữ trong UI (bundle set cookie `tf_locale=VN`) → reload → middleware vẫn serve `index.html` (EN) thay vì `vi` → bundle nội tại đọc locale=VN nhưng `tfPageloadData.localization` chỉ có bucket EN → mọi `t(key)` raw key fallback.

**Root cause:** Middleware `detectLang()` cũ chỉ check `tf_lang=vi` (lowercase, lang code). Bundle's picker set `tf_locale=VN` (uppercase, locale code). 2 cookie khác nhau.

**Fix (đã apply):** `middleware/index-html.js` + `middleware/spa-fallback.js` thêm check `tf_locale=VN|DE|ES|EN` với map `{VN:'vi', DE:'de', ES:'es', EN:''}`.

### Gate 3: vi.html không có `en` bucket → bundle crash khi load translations

**Triệu chứng:** App đen sau khi serve vi.html. Console error: `Uncaught (in promise) Error while loading translation for en, [object Object]`. Bundle's i18n loader hard-codes 'en' as fallback locale. vi.html ship `localization:{vi:{...}}` only — không có `en` → loader throw → Vue mount crash.

**Fix (đã apply):** Prebake IIFE (`tfI18nPreBake` trong blockScript.txt) tự tạo `en` bucket bằng copy từ vi nếu thiếu, trước khi bundle init.

### Gate 4: Bundle expect `tfPageloadData.localization` ở top-level (KHÔNG phải `appConfig.localization`)

**Triệu chứng:** Patch i18n keys không apply, modal vẫn raw key dù patch JSON có trong HTML.

**Root cause:** Bundle ≥3.9MB moved localization từ `tfPageloadData.appConfig.localization.<lang>` (cũ) sang `tfPageloadData.localization.<lang>` (mới, top-level).

**Fix (đã apply):** Prebake IIFE target `pld.localization` (không phải `pld.appConfig.localization`).

### Gate 5: Bundle copy localization vào internal store AT INIT → polling patch quá muộn

**Triệu chứng:** Polling-based IIFE merge keys vào tfPageloadData.localization SAU khi bundle init → bundle đã snapshot vào vue-i18n store → modal không thấy patch.

**Fix (đã apply):** `Object.defineProperty(window, 'tfPageloadData', {get, set})` interceptor — setter fire lúc inline body script assign tfPageloadData, mutate ngay rồi store. Bundle script đọc TIẾP sau → đã có patch.

### Gate 6: Bundle's `loadAiVoiceState` requires `window.token` + `window.appConfig.ttsHost`

**Triệu chứng:** Mock fetch wrapped đúng URL nhưng `loadAiVoiceState()` early-return với ZERO fetches → `window.tts.aiVoices = []` → AI tab empty.

**Root cause:** Bundle's `hasAiTtsBackendContext()` (app.js offset 3344494) check:
```js
function getAiTtsBackendContext(path) {
  var baseUrl = (window.appConfig?.ttsHost || '').replace(/\/+$/, '');
  var token = window.token || window.<X>?.me?.token || '';
  if (!baseUrl || !token) return null;  // ← gate
  return {url: baseUrl + path, token};
}
```
`ttsHost` set trong tfPageloadData. Nhưng `window.token` không bao giờ được set bởi bundle (chờ external auth flow). Without it → loader skip.

**Fix (đã apply):** `tfBootstrapWindowToken` IIFE trong blockScript đọc `tf_login_token` cookie (hoặc localStorage `setting_loginaccesstoken`), set `window.token` sớm. Bundle's gate pass.

### Gate 7: AI voice ID phải có prefix `tts_api__`

**Triệu chứng:** Bundle's `resolveVoiceConfigFromId(id)` trả null cho IDs không có prefix → voices không được parse → AI tab empty.

**Root cause:** Bundle constant `AI_VOICE_ID_PREFIX = 'tts_api__'`. Format full ID: `tts_api__<vendor>__<uuid>`. Mock catalog phải emit IDs đúng format này.

**Probe runtime:**
```js
window.aiTts?.voiceIdPrefix  // → 'tts_api__'
window.aiTts.resolveVoiceConfigFromId('tts_api__ttsm__abc-123')
// → {vendorId:"ttsm", voiceId:"abc-123", provider:"ai"}  ✅
```

**Fix (đã apply):** `tfNormalizeMockVoice` trong blockScript prepend `tts_api__` cho voices có `provider === 'ai'`.

### Gate 8a: `window.aiTts.hasBackendContext()` returns false despite token + ttsHost set

**Triệu chứng:** Instrumentation log `hasCtx=false hasToken=true ttsHost=https://tts.tikfinity.com`. Loader early-return, không fetch.

**Root cause:** `getAiTtsBackendContext()` internals đọc obfuscated keys không match những gì tfPageloadData/window provide. Reverse engineer hết là tốn thời gian.

**Fix (đã apply):** Override `window.aiTts.hasBackendContext = () => true` thẳng. Mock fetch sẽ handle auth context implicitly khi loader gọi catalog endpoint.

### Gate 8b: Backend missing `/api/tts/auth-token` route

**Triệu chứng:** Bundle POST `/api/tts/auth-token` → 404 → success callback fail → `Object.restore` (settings.restore) → reload loop.

**Root cause:** Bundle's AI TTS loader fetch auth token TRƯỚC khi gọi voice catalog. Backend chưa implement endpoint này.

**Fix (đã apply):** Route handler `backend-node/src/routes/tts.js` POST `/auth-token` trả `{statusCode:200, data:{token:..., expiresIn:3600}, token:...}` (cả `data.token` lẫn top-level `token` để cover các cách bundle có thể parse).

### Gate 9a: Auth-token response field MUST be `ttsAuthToken` (not `token`)

**Triệu chứng:** `await window.tts.ensureAiAuthToken()` xong, `window.tts.aiAuthToken` vẫn empty string. Backend trả 200 với mọi alias (`token`, `accessToken`, `aiAuthToken`, `jwt`) nhưng bundle ignore tất cả.

**Root cause (xác nhận qua Network tab gốc TikFinity):** Bundle's `ensureAiAuthToken` parser đọc chính xác field name `ttsAuthToken` (camelCase, tts prefix). Production response shape:
```json
{"status":200, "message":"OK", "ttsAuthToken":"eyJ..."}
```

**Fix (đã apply):** `routes/tts.js` POST `/auth-token` trả đúng 3 fields: `status` (NOT statusCode), `message`, `ttsAuthToken`.

### Gate 9b: `/api/tts/user` endpoint phải mock (quota check sau auth)

**Triệu chứng:** Auth token có rồi nhưng `loadAiVoices` vẫn không fetch voices.

**Root cause:** Sau khi bundle có `ttsAuthToken`, nó gọi `GET tts.tikfinity.com/api/tts/user` với Bearer header để fetch quota info. Nếu endpoint missing/error → bundle skip voice loader.

**Response shape gốc (cross-origin, cần mock trong blockScript fetch wrap):**
```json
{
  "statusCode": 200, "message": "Success",
  "data": {
    "id": 1, "userId": "1",
    "quota": {
      "exceeded": false,
      "currentUsageMode": "free",
      "currentUsageCurrency": "requests",
      "subscriptionCreditsRemaining": 0, "subscriptionCreditsTotal": 0,
      "purchasedCreditsRemaining": 0, "purchasedCreditsTotal": 0,
      "freeRequestsRemaining": 25, "freeRequestsTotal": 25,
      "nextResetAt": "<ISO>", "nextResetSeconds": <number>
    }
  }
}
```

**Fix (đã apply):** `tfHandleTtsTikfinityUser` trong blockScript intercept `tts.tikfinity.com/api/tts/user` URL (cả fetch + XHR), trả quota free user 25 messages/day.

### Gate 23c: Pinia navigation store — Object.defineProperty trap for isPro + flag-icons proxy + AI voices loader (2026-05-22)

> **Discovery quan trọng nhất hôm nay:** Vue chip + Pro UI **KHÔNG** bind vào `window.session.me.userFeatures.isPro`. Chúng bind vào Pinia store `navigation`. Patch `window.session.me` không propagate sang Pinia computed refs.

**Probe runtime (verified):**

```js
// Vue Pinia state structure (verified via probe in DevTools Console):
document.querySelector('[data-v-app]').__vue_app__.config.globalProperties.$pinia.state.value.navigation
// {
//   isPro: false,                     ← Vue chip checks THIS, not window.session.me
//   ttsProCredits: 0,                 ← bundle's syncNavigationStoreCredits()
//                                      writes to window.navigationStore (which
//                                      doesn't exist) → Pinia stays at default
//   ttsFreeMessages: 25,
//   ttsFreeMessagesMax: 25,
//   trialBannerDismissed: true,
// }
```

**Bundle dead code:** [modules/deobfuscated.js line 4789-4795](decompiled/modules/deobfuscated.js):
```js
window.navigationStore.set("ttsFreeMessages", tts.freeMessages || 0);
window.navigationStore.set("ttsProCredits", tts.proCredits || 0);
```
**`window.navigationStore` không tồn tại** (renamed/moved to Pinia trong Vue refactor) → entire sync function silently fails. Pinia store stays default.

**Critical fix — Object.defineProperty trap on Pinia store:**

Direct assignment `nav.isPro = true` FAILS (Pinia setup-store có thể dùng computed() ref → write silently swallowed). Plain refs (`ttsProCredits`) work fine.

```js
// [blockScript.txt] tfActivateProUI IIFE — patchPiniaNavigation()
Object.defineProperty(nav, 'isPro', {
  get: function(){ return true; },     // chip's isPro check always true
  set: function(){ /* swallow */ },    // any future write blocked
  configurable: true,
  enumerable: true,
});

// Direct assignment OK for non-computed refs:
nav.ttsProCredits = 100000;
nav.ttsProCreditsMax = 100000;
nav.trialBannerDismissed = true;
```

**Result:**
- Chip flips 25 → 100k ✅
- PRO badge appears under app title ✅
- Sidebar "Nâng cấp lên PRO" hidden ✅

**Anti-pattern documented:**

- ❌ Patch ONLY `window.session.me.userFeatures.isPro` — Pinia computed reads from somewhere else, doesn't propagate
- ❌ Direct `nav.isPro = true` — silently fails if Pinia uses computed()
- ❌ Patch ONLY `window.tts.proCredits` — bundle's dead sync code doesn't propagate to Pinia
- ✅ Direct mutation for plain refs + defineProperty trap for computed refs

**Pattern principle — Vue Pinia state vs vanilla window:**

> Vue 3 + Pinia setup-stores stores state in **reactive refs**, NOT plain object properties. Patching `window.session.me.X = true` works only if state is *derived* from window.session.me. If Pinia store has `const isPro = computed(() => someOtherSignal)` then the field is **read-only from outside**. **Use Object.defineProperty trap to override the read.** This works because Pinia store IS a plain object externally — defineProperty replaces the descriptor entirely.

---

### Gate 24: `/flag-icons/*` CDN proxy (2026-05-22)

**Triệu chứng:** Bundle requests `/flag-icons/css/flag-icons.min.css`. Backend returns 404 HTML page. Browser refuses to apply HTML as stylesheet:
```
Refused to apply style from 'http://localhost:5285/flag-icons/css/flag-icons.min.css'
because its MIME type ('text/html') is not a supported stylesheet MIME type
```

**Root cause:** flag-icons package không có sẵn trong `downloads/`. CSS file references `url(../flags/4x3/xx.svg)` cho ~200 country flags (~5MB tổng). Manual download = stale, large.

**Fix:** Proxy route trong [index.js](backend-node/src/index.js) — catch `/flag-icons/*` → fetch từ jsdelivr CDN + 24h memory cache:

```js
const _flagIconsCache = new Map();
const FLAG_ICONS_CDN = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7';
app.get(/^\/flag-icons\/(.+)$/, async (req, res) => {
  const rel = req.params[0];
  const cached = _flagIconsCache.get(rel);
  if (cached && Date.now() - cached.fetchedAt < 86400000) {
    res.setHeader('Content-Type', cached.contentType);
    return res.send(cached.body);
  }
  const r = await fetch(FLAG_ICONS_CDN + '/' + rel);
  if (!r.ok) return res.status(r.status).end();
  const body = Buffer.from(await r.arrayBuffer());
  const contentType = r.headers.get('content-type') ||
    (rel.endsWith('.css') ? 'text/css' :
     rel.endsWith('.svg') ? 'image/svg+xml' :
     'application/octet-stream');
  _flagIconsCache.set(rel, { body, contentType, fetchedAt: Date.now() });
  res.setHeader('Content-Type', contentType);
  return res.send(body);
});
```

**Verification:**
```bash
curl -s -w "%{http_code} %{content_type}\n" http://localhost:5285/flag-icons/css/flag-icons.min.css
# 200 text/css; charset=utf-8 (28KB)

curl -s -w "%{http_code}\n" http://localhost:5285/flag-icons/flags/4x3/vn.svg
# 200 (VN flag SVG, 490B)
```

**Mount order:** TRƯỚC `express.static` để route specific match thay vì fall-through 404.

---

### Gate 26: tf-connect.js click handler — DON'T exclude `[class*="nav-"]` (2026-05-22)

**Triệu chứng:** User click "Kết nối với TikTok LIVE" topbar button — KHÔNG fire connect flow. Console chỉ có `[TF-Auth] patchAll()` logs, KHÔNG có `[TF] Connecting to @...`.

**Root cause:** [downloads/js/tf-connect.js:61](downloads/js/tf-connect.js#L61) had structural exclusion:
```js
if (el.closest('nav, aside, [role="navigation"], .sidebar, .menu, .dropdown, .submenu, [class*="nav-"], [class*="menu-"], .topbar-search, .breadcrumb')) {
  return false;
}
```

Bundle's connect CTA button lives inside `#navigation-app` (Vue topbar). The `[class*="nav-"]` matches → `isConnectButton` returns false → click handler exits early → connect flow never fires.

**Verified backend works (independent test):**
```js
fetch('/api/tiktok/connect', { method: 'POST', headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ username: 'father.run52' }) }).then(r=>r.json()).then(console.log)
// → { status: 'ok', message: 'OK', queued: true, username: 'father.run52' }
```

→ Backend route OK. Issue was purely UI click-binding.

**Fix:** Remove structural exclusion, rely on STRICT text match (6 known labels):
```js
// [downloads/js/tf-connect.js] — KEEP only specific exclusions:
if (el.closest('.sidebar, .menu, .dropdown, .submenu, [class*="menu-"], .topbar-search, .breadcrumb')) {
  return false;
}
// DROPPED: nav, aside, [role="navigation"], [class*="nav-"]
// Text match (isConnectButton at line 70-76) is strict enough on its own.
```

**File ownership note:**
> [downloads/js/tf-connect.js](downloads/js/tf-connect.js) là **custom file của clone**, KHÔNG phải từ gốc. Gốc TikFinity không có file này (verified: HTTP 404 on `https://tikfinity.zerody.one/js/tf-connect.js`). Bundle gốc dùng internal bridge logic tightly-coupled với server gốc + Electron app gốc. Clone ta viết tf-connect.js để intercept click button → route qua local backend `/api/tiktok/connect` → tiktok-live-connector npm. Edit thoải mái, không break gốc behavior.

**Pattern principle:**

> **Khi click button không fire handler:**
> 1. Console log? Nếu CHỈ có unrelated logs (như TF-Auth) → click handler không match
> 2. Check `e.target` chain via DevTools: right-click button → "Inspect" → tree path
> 3. Verify all `closest()` filters trong handler không quá rộng
> 4. Test backend independently via Console `fetch()` — nếu backend OK → 100% là click-binding bug
> 5. Strict text match thường đủ — kết hợp structural exclusion chỉ khi text match nguy hiểm

---

### Gate 25: Bundle AI voices loader chain — verified mechanism (2026-05-22)

> **Bundle's AI voice catalog (Pro tab) populated via complex async chain. Empty `tts.aiVoices = []` thường do ONE link trong chain fail silent.**

**Loader chain (verified [decompiled/modules/deobfuscated.js line 4707-4783](decompiled/modules/deobfuscated.js)):**

```
tts.loadAiVoiceState (line 4735)
  │
  ├─ Early exit if window.appConfig.ttsHost empty (line 4754-4759)
  ├─ Cooldown: skip if aiVoiceStateLastLoadedAt < 3000ms ago (line 4748-4752)
  │
  ├─ tts.ensureAiAuthToken() (line 4468)
  │   ├─ Check window.ttsAuthToken || tts.aiAuthToken || window.session.me.ttsAuthToken
  │   ├─ If empty → api.doAction("POST", "tts/auth-token") → store result
  │   └─ Reject if endpoint fails
  │
  └─ Promise.all([loadUserCredits, loadAiVoices])
      ├─ loadUserCredits → requestAiTtsApi("/api/tts/user") → applyAiCreditsFromApiUser(data)
      │   └─ Parses `data.quota.currentUsageMode` (MUST be 'sub_credits' for Pro)
      └─ loadAiVoices → requestAiTtsApi("/api/tts/voices") → data.voices || data.featuredVoices
          └─ tts.aiVoices = voices.map(normalizeAiVoice).filter(Boolean)
```

**Critical requirements for AI voices to populate:**

1. `window.appConfig.ttsHost` set (vd "https://tts.tikfinity.com") — bundle's bootstrap reads from `tfPageloadData.ttsHost` baked into index.html.
2. `/api/tts/auth-token` returns `{ ttsAuthToken: "<JWT>" }` — our [routes/tts.js](backend-node/src/routes/tts.js) mints local JWT (verified Gate 7).
3. `/api/tts/voices` mock returns shape with `data.voices: Array` — [blockScript.txt::tfHandleTtsTikfinityCom](backend-node/src/templates/blockScript.txt) returns `{statusCode:200, result:{voices:[]}, data:{voices:[], aiVoices:[]}}` (dual alias).
4. Voice catalog has 120+ items in [voice-catalog.json](backend-node/src/templates/voice-catalog.json) (verified).

**Debug probe khi `tts.aiVoices.length === 0`:**

```js
// Paste vào Console clone:
({
  ttsHost: window.appConfig?.ttsHost,
  ttsAuthToken_window: !!window.ttsAuthToken,
  ttsAuthToken_session: !!window.session?.me?.ttsAuthToken,
  ttsAiAuthToken: !!window.tts?.aiAuthToken,
  aiVoicesLength: window.tts?.aiVoices?.length,
  aiVoiceStateLastLoadedAt: window.tts?.aiVoiceStateLastLoadedAt,
  aiVoiceStateRequestPromise: !!window.tts?.aiVoiceStateRequestPromise,
  appConfigKeys: Object.keys(window.appConfig || {}).slice(0, 20),
})
```

**Common failure modes:**

| Symptom | Field check | Fix |
|---|---|---|
| `ttsHost: ""` | tfPageloadData chưa set ttsHost | Check [blockScript.txt::tfI18nPreBake](backend-node/src/templates/blockScript.txt) baking |
| `ttsAuthToken_window: false` | /api/tts/auth-token failed | Check routes/tts.js mints JWT |
| `aiVoiceStateLastLoadedAt: 0` | loadAiVoiceState chưa fire | Trigger manually: `window.tts.loadAiVoiceState()` |
| `aiVoicesLength: 0` + loaded | Mock returns wrong shape | Check tfHandleTtsTikfinityCom returns `data.voices` array |

**Manually trigger reload trong Console** (force re-fetch ignoring cooldown):

```js
window.tts.aiVoiceStateLastLoadedAt = 0;
window.tts.aiVoiceStateRequestPromise = null;
window.tts.loadAiVoiceState().then(() => console.log('voices:', window.tts.aiVoices.length));
```

---

### Gate 23b: Captured Pro shape (real) — proInfo:null + subscription:null + sub_credits mode (2026-05-22)

> **Pro shape captured trực tiếp từ gốc TikFinity web** sau khi chạy tfActivateProUI userscript trên account `new.world.019` (free thật, force isPro=true). Đây là shape THẬT bundle expect khi Pro — không guess.

**Method:**
1. Mở https://tikfinity.zerody.one trong Chrome, login free account
2. F12 → Console → paste `tfActivateProUI` userscript (clone of Gate 23 IIFE)
3. Bundle UI flip Pro (chip 100k, AI tab 120 voices, no upgrade button)
4. Capture: `copy(JSON.stringify(window.session.me, null, 2))`

**Captured Pro shape:**

```json
{
  "isPro": true,
  "userFeatures": {
    "isPro": true,
    "proInfo": null                    // ← NULL khi Pro (NOT object {plan,active})
  },
  "subscription": null,                // ← NULL khi Pro (top-level)
  "channeluser": {                     // ← FULL OBJECT, NOT null
    "userId": "7491601297508172816",   // string TikTok ID
    "id": 525885778,                   // number, unique
    "channelId": 2228412,
    "username": "new.world.019",
    "nickname": null,
    "thumbnailUrl": "p19-common.tiktokcdn.com/...webp",  // URL OR null (NOT empty string)
    "totalAmount": 0,
    "totalRewardAmount": 0,
    "challengeStartAmount": 0,
    "challengeStartRewardAmount": 0,
    "archivedAmount": 0,
    "archivedRewardAmount": 0,
    "lastUpsertAt": "<ISO>",
    "createdAt": "<ISO>",
    "updatedAt": "<ISO>"
  }
}
```

**Key insights:**

1. **`proInfo: null` LÀ correct shape cho Pro user.** Bundle's `proInfo?.X` optional chaining handle null safely. Trước đây ta set `{plan, active}` (object) → `proInfo.isActiveSubscription = undefined` → `!undefined = true` → disable Pro buttons. Set null fix bug.

2. **`subscription: null` ở top-level cũng correct cho Pro.** Bundle KHÔNG đọc `session.me.subscription` (0 matches in decompiled — verified Gate 23). Set null safe.

3. **`channeluser` LÀ FULL OBJECT** (kể cả free user). Bundle expects object → null breaks identity-bound UI (profile dropdown, top viewers panel). Shape exact from captured.

4. **Critical field types trong channeluser:**
   - `userId`: string (TikTok user ID format) — NOT number
   - `id`: number (unique DB ID, NOT channelId * fabricated multiplier)
   - `nickname`: null (NOT empty string)
   - `thumbnailUrl`: URL string OR null (NEVER empty string `''` — bundle's `if (thumbnailUrl)` check fails differently for empty string vs null)

**TTS mock `currentUsageMode` MUST be `'sub_credits'`:**

Bundle's [decompiled/modules/deobfuscated.js:4621-4632](decompiled/modules/deobfuscated.js#L4621):
```js
if (mode === "sub_credits") {
  tts.proCredits = subscriptionCreditsRemaining;
} else if (mode === "otp_credits") {
  tts.proCredits = 0;
} else if (mode === "free") {
  tts.proCredits = 0;
}
// Anything else (e.g. 'subscription') → falls through → tts.proCredits NEVER SET → stays 0 → chip hiện 0
```

Ta trước đây set `currentUsageMode: 'subscription'` → match NONE of 3 modes → `tts.proCredits` stays 0 → chip hiện 0. Sửa thành `'sub_credits'` trong [blockScript.txt::tfBuildQuotaPayload](backend-node/src/templates/blockScript.txt).

**actionsandevents page layout fix:**

Bundle's main.min.css có `.page[data-pageid=actionsandevents]{margin-left:-255px}` để page rộng hơn (gốc dùng để overlay qua sidebar khi resize). Combined với our `#pages { max-width: calc(100vw-335px); overflow-x: hidden }` → content shift LEFT 255px → past viewport → text cắt đầu dòng.

Fix in earlyCss:
```css
body[data-new-navigation-design] .page[data-pageid=actionsandevents] {
  margin-left: 0 !important;
}
```

**Updated /api/me clone (final correct shape):**

```js
// [backend-node/src/routes/me.js]
const proInfo = null;                  // captured Pro shape

res.json({
  // ...
  channeluser: {                       // full object, NOT null
    userId: channel.OwnerUserId || '0',
    id: channel.ChannelId,             // simple, NOT fabricated
    channelId: channel.ChannelId,
    username: channel.ChannelName,
    nickname: null,
    thumbnailUrl: null,                // NULL not empty string
    totalAmount: 0,
    totalRewardAmount: 0,
    challengeStartAmount: 0,
    challengeStartRewardAmount: 0,
    archivedAmount: 0,
    archivedRewardAmount: 0,
    lastUpsertAt: channel.UpdatedAt,
    createdAt: channel.CreatedAt,
    updatedAt: channel.UpdatedAt,
  },
  userFeatures: { isPro, proInfo },     // proInfo: null
  subscription: null,                   // NOT object
  // ...
});
```

**Verification command (curl after restart):**
```bash
curl -s http://localhost:5285/api/me | python3 -c "
import json, sys
d = json.load(sys.stdin)
print('isPro:', d['isPro'])
print('userFeatures.proInfo:', d['userFeatures']['proInfo'])  # should be None
print('subscription:', d['subscription'])                       # should be None
print('channeluser type:', type(d['channeluser']).__name__)    # should be dict
"
```

Expected: `isPro: True | proInfo: None | subscription: None | channeluser: dict`

---

### Gate 23: Client-side Pro UI activation via `tfActivateProUI` IIFE (2026-05-22)

> **Bundle's Pro gates ALL go through `window.session.me.userFeatures.isPro`. KHÔNG cần Pro shape thật — force isPro=true client-side là đủ.**

**Discovery (verified via grep decompiled/modules/deobfuscated.js):**
- Lines 1959, 1968, 1973, 1978, 1985, 1998, 2012, 2100, 12161, 13170 đều check `window.session.me.userFeatures.isPro`
- Lines 2001-2009 jQuery DOM activation:
  ```js
  if (window.session.me.userFeatures.isPro) {
    $('.nopro').hide();
    $('.proPromoBox').css('display', 'none');
    $('.appNameExtra').text('Pro').addClass('proColor').show(300);
  }
  ```
- **Bundle does NOT read:** `session.me.subscription`, `session.me.channel.isPro`, `session.me.discordHasProRole` (0 matches in decompiled)
- Bundle's `proInfo?.X` uses optional chaining → safe khi proInfo=null
- Account `new.world.019` captured 2026-05-22 từ gốc xác nhận FREE shape: `userFeatures: { isPro: false, proInfo: null }`, `subscription: null`, `channeluser: {full object}`

**Implication:** Để force Pro UI client-side, chỉ cần:
1. `userFeatures.isPro = true` (KHÔNG touch proInfo — để null hoặc bundle's default)
2. Trigger jQuery DOM activation (line 1998-2010) manually phòng bundle bootstrap-init đã chạy

**Fix — `tfActivateProUI` IIFE in [blockScript.txt](backend-node/src/templates/blockScript.txt):**

```js
(function tfActivateProUI(){
  function tick() {
    if (window.session && window.session.me) {
      var me = window.session.me;
      // Object.defineProperty trap: future writes to .isPro swallowed
      Object.defineProperty(me, 'isPro', { get: ()=>true, set: ()=>{}, configurable: true });
      if (me.userFeatures) {
        Object.defineProperty(me.userFeatures, 'isPro', { get: ()=>true, set: ()=>{}, configurable: true });
      } else {
        me.userFeatures = { isPro: true, proInfo: null };
      }
    }
    // Trigger jQuery DOM activation (line 1998-2010 logic)
    if (typeof window.$ === 'function') {
      window.$('.nopro').hide();
      window.$('.proPromoBox').css('display', 'none').removeClass('shakeEffect');
      window.$('.appNameExtra').text('Pro').css('display', 'inline-block').addClass('proColor');
      window.$('[class*="upgrade"], [class*="proPromo"], #upgrade-button-wrap').each(function(){
        var $el = window.$(this);
        if (/nâng cấp|upgrade/i.test($el.text())) $el.hide();
      });
    }
  }
  setTimeout(tick, 100); setTimeout(tick, 500); setTimeout(tick, 1500);
  setTimeout(tick, 3500);  // sau bundle's 3s setTimeout cho .appNameExtra
  setInterval(tick, 2000);
})();
```

**Pattern principle — when bundle internal state matters more than backend response:**

> Backend response is FIRST point of truth, nhưng bundle reactivity sometimes drops/transforms data. Khi backend returns `userFeatures.isPro: true` nhưng UI vẫn render Free → bundle's internal state stale. Solution: **Object.defineProperty trap** trên client-side state TRƯỚC bundle re-write. `configurable: true` cho phép trap re-installed nếu bundle xóa. Periodic re-install (setInterval) phòng race condition.

**Anti-pattern documented:**

- ❌ Set `userFeatures.proInfo: {full Pro shape}` mà KHÔNG có shape thật → broke UI (Gate 22). Bundle's `proInfo.X` access cho `paymentGateway:'paddle'` → trigger Paddle SDK code path → cascade failure.
- ❌ Set `channeluser: {fabricated id, empty thumbnailUrl}` → bundle render avatar logic break. Captured shape có `thumbnailUrl: null OR real URL`, NEVER empty string.
- ✅ Set MINIMAL changes: just `isPro: true`. Leave proInfo/subscription/channeluser nguyên backend response. Bundle's optional chaining handles null gracefully.

**Còn lại sau Gate 23:**
- Chip number issue: Bundle reads `tts.proCredits` vs `tts.freeMessages` based on isPro. Now isPro=true → should pick proCredits. `tfForceProCredits` IIFE already sets `tts.proCredits = 100000`. Should display 100k after Gate 23 activates isPro.
- TikTok avatar (channeluser.thumbnailUrl): chỉ relevant khi user connect TikTok Live thật — bridge broadcast `tiktokAccount` event syncs avatar (đã xử lý trong Gate D từ Gate 22).

---

### Gate 22: Reverse-engineering artifacts — leverage `docs/`, `decompiled/`, `routes-generated/` (2026-05-22)

> **DỪNG ĐOÁN. Có dữ liệu thật.** Khi sửa code bundle-adjacent, đọc artifacts trước thay vì brainstorm.

User đã làm một pipeline reverse-engineering bundle TikFinity hoàn chỉnh (commit `b6e0826` + `89e6fe7`, 2026-05-22). Tổng ~30k dòng artifact đã commit. Đây là **single source of truth** cho mọi API contract / Vue logic / bundle behavior. **Tham khảo artifacts TRƯỚC khi viết handler / mock / fix.**

**Artifacts catalogue:**

| Path | Size | Vai trò |
|---|---|---|
| [docs/README.md](docs/README.md) | 11KB | Index — đọc đầu tiên |
| [docs/BUNDLE_CALL_FLOW.md](docs/BUNDLE_CALL_FLOW.md) | 15KB | Boot sequence + per-feature flows + 5 critical UI bugs A-E |
| [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md) | 70KB | Shape + sample của 26 endpoints chính (recursive type tree) |
| [docs/COMPLETE_ENDPOINT_INDEX.md](docs/COMPLETE_ENDPOINT_INDEX.md) | 42KB | 228 endpoints full catalogue |
| [docs/DATABASE.md](docs/DATABASE.md) | 9KB | ERD + better-sqlite3 schema |
| [routes-generated/tikfinity.zerody.four.merged.shapes.md](routes-generated/tikfinity.zerody.four.merged.shapes.md) | 62KB | 228 endpoint preview body |
| [decompiled/modules/deobfuscated.js](decompiled/modules/deobfuscated.js) | ~945KB | Vue app source readable (webcrack output) |
| [scripts/decompile/](scripts/decompile/) | — | merge-har, extract-contracts, har-to-stubs, run-all |
| [captures/*.har](captures/) | 427MB (gitignored) | Raw HAR sources |

**Pipeline 6 bước (đã chạy xong, lưu ở [docs/README.md](docs/README.md)):**
HAR capture → merge+dedupe → extract contracts → bundle decompile (webcrack) → live instrumentation → document.

**13-step integration order từ [BUNDLE_CALL_FLOW.md §13](docs/BUNDLE_CALL_FLOW.md):**

| # | Task | Status |
|---|---|---|
| 1 | Diff `/api/me` (local vs captured) → fill missing fields | 🟡 partial (Gate 22 áp dụng `channeluser`, `discordHasProRole`, `agencyAffiliateId`) |
| 2 | Mount auto-generated stub router as last fallback → giảm 404 spam | ⏳ pending |
| 3 | Update `voice-catalog.json` từ captured 27KB → voice picker khớp 100% | ⏳ pending |
| 4 | Update `getAllGifts` từ captured 885KB | ✅ done (Gate 21) |
| 5 | Verify OData envelope cho channeluser + transaction | ⏳ pending |
| 6 | Stub `/api/login` alias key-login | ⏳ pending |
| 7 | Mock `/api/tts/generate` trả audio binary | 🟡 partial (mock trong blockScript) |
| 8 | Capture WS frames riêng cho chat/gift | ⏳ pending |

**5 critical UI bugs A-E từ [BUNDLE_CALL_FLOW.md §10](docs/BUNDLE_CALL_FLOW.md):**

| ID | Symptom | Root cause | Status |
|---|---|---|---|
| A | App reload mỗi /api/me call | `wsAuthToken` mỗi mint khác `iat` | ✅ fixed (cache `_wsAuthTokenCache.get(channelId)`) |
| B | Switch profile reload loop | `featureBaseToken` không cache theo channel name | ✅ fixed (cache `(channelId, frontendChannelName)`) |
| C | Reload mỗi 2.5s | `settings.restore` POST với cached state | ✅ fixed (swallow trong blockScript) |
| D | Topbar chip trống/placeholder | Avatar URL không reach `window.session.me.avatarUrl` | ✅ fixed (bridge broadcast `tiktokAccount` → syncer) |
| E | "Dư khúc trống ở trên" — user phải scroll | `<div id="pageSSRContent">` SEO fallback không bị hide | ✅ **fixed today** (`#pageSSRContent { display: none !important }` trong earlyCss line 2) |

**Quick wins applied today (commit-ready):**

```js
// backend-node/src/routes/me.js — fill 3 missing fields from captured shape
channeluser: {                                    // was: null → bundle fallback placeholder
  userId, id, channelId, username, nickname,
  thumbnailUrl, totalAmount, totalRewardAmount,
  challengeStartAmount, challengeStartRewardAmount,
  archivedAmount, archivedRewardAmount,
  lastUpsertAt, createdAt, updatedAt,             // all minimal/0 for fresh user
},
channel.agencyAffiliateId: null,                  // was: missing → bundle .undefined access
discordHasProRole: false,                         // top-level, was: missing
```

```css
/* backend-node/src/templates/earlyCss.txt line 2 */
#pageSSRContent { display: none !important; }     /* UI bug E */
```

**Pattern principle:**

> **Khi gặp UI bug ở 1 surface cụ thể (chip, modal, dropdown, etc.):**
> 1. **Đọc [BUNDLE_CALL_FLOW.md](docs/BUNDLE_CALL_FLOW.md) §10** trước — 5 bugs đã catalogued
> 2. **Diff [API_CONTRACTS.md](docs/API_CONTRACTS.md)** cho endpoint relevant (vd lỗi voice picker → §3 /api/me + voice routes)
> 3. **Grep [decompiled/modules/deobfuscated.js](decompiled/modules/deobfuscated.js)** cho symbol UI (vd `chipAvatar`, `topbarChip`) → xem actual binding logic
> 4. **Chỉ guess** khi 3 bước trên không có dữ liệu
>
> **Khi cần mock endpoint mới:**
> 1. Lookup [docs/COMPLETE_ENDPOINT_INDEX.md](docs/COMPLETE_ENDPOINT_INDEX.md) — endpoint đó có trong 228 catalogue không
> 2. Lookup [routes-generated/*.shapes.md](routes-generated/) — preview body để hiểu shape
> 3. Lookup [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md) §X nếu là 1 trong 26 endpoints chính (full type tree)
> 4. Copy minimal valid response, adapt fields cho local state

**Anti-patterns:**

- ❌ Brainstorm shape từ field names — captured shape sẵn có
- ❌ Mock trả empty `{}` "tạm" — bundle thường crash trên `undefined.X` access. Dùng captured fields với default values
- ❌ Sửa decompiled/modules/deobfuscated.js — đó là READ-ONLY artifact (auto-generated từ webcrack)
- ❌ Ignore artifacts vì "nó dài quá" — grep targeted (`grep -n "endpoint_name" docs/API_CONTRACTS.md`) ra ngay
- ❌ **CRITICAL — Áp captured-shape fields cho Pro user khi captured là FREE user.** 2026-05-22 attempt: thấy `docs/API_CONTRACTS.md` §3 có `channeluser: { totalAmount:0, ... }` và `proInfo` có 6 fields → áp vào /api/me. KẾT QUẢ:
   - Credit chip rớt 100k → 25 free messages
   - Hiện "Nâng cấp lên PRO" button
   - AI voice picker tab empty
   - "API Error (-1) HTTP Communication Error" notification

   Root cause: captured /api/me trong HAR là FREE user (`userFeatures.isPro:false`). Channeluser-with-zeros + proInfo-paddle là shape của FREE user. Bundle re-evaluate Pro display logic, thấy channeluser zeros + paymentGateway:paddle gọi Pro management APIs không có local → cascade failure.

   **Quy tắc:** Trước khi áp captured field cho Pro user, **PHẢI capture HAR riêng của Pro user**, hoặc grep deobfuscated.js xác nhận field đó độc lập với Pro status. Field có condition như `if (proInfo.isActiveSubscription)` → KHÔNG được set true mà không có downstream Pro infrastructure.

   **Safe pattern:** Kept-working state has `channeluser: null` + `proInfo: { plan:'free', active:false }` + `isPro:true`. Đây là contradictory-but-functional state — bundle chỉ check `isPro:true` cho hiển thị, không deep-check proInfo. Don't fix what's not broken.

**Re-generate khi bundle update (TikFinity gốc push bản mới):**

```bash
# Capture HAR mới qua Chrome DevTools (5 phút)
mv ~/Downloads/tikfinity.zerody.one.har captures/

# Re-run pipeline (~1 phút)
node --max-old-space-size=6144 scripts/decompile/merge-har.js
node scripts/decompile/extract-contracts.js
npx webcrack downloads/combo/modules.js -o decompiled/modules
npx webcrack downloads/combo/app.js -o decompiled/app

# Diff để biết bundle đã đổi gì
git diff docs/API_CONTRACTS.md           # field nào server gốc đổi shape?
git diff decompiled/modules/deobfuscated.js  # function nào bundle thêm/sửa?
```

**Live instrumentation hook (off-by-default):**

```js
// Trong DevTools console khi app chạy:
localStorage.setItem('tf-instrument','1'); location.reload();
// → Log mọi fetch + XHR vào window.__tfCallLog
window.__tfDumpCallLog();  // download tf-call-log-<ts>.json
```

Mọi fetch/XHR (method, URL, body, status, snippet) push vào `window.__tfCallLog` (cap 2000 entries). Dùng để verify behavior khi không có HAR fresh.

---

### Gate 21: Bundle fixtures stale — sync from gốc TikFinity at startup (2026-05-21)

**Triệu chứng:** "Trình duyệt đồ họa quà tặng" (Gift Browser) chỉ hiện ~1500 items trong khi gốc TikFinity hiện ~3400. User: *"đây là hình gốc tới 3000 mấy lận, bên mình có 1000 mấy à"*.

**Root cause:** [downloads/api/getAllGifts](downloads/api/getAllGifts) là static snapshot tháng 3/2026 chứa 1518 gifts (397KB). [routes/data.js:150](backend-node/src/routes/data.js#L150) chỉ serve raw file → không bao giờ tự refresh. TikTok thêm gifts liên tục, gốc TikFinity sync mới (3386 items, 885KB).

**Fix:** New module [services/bundle-fixtures-sync.js](backend-node/src/services/bundle-fixtures-sync.js):
- On backend startup, fetch fresh từ `https://tikfinity.zerody.one/api/<endpoint>` (no auth required — public)
- Validate JSON shape trước khi ghi đè
- Backup file cũ vào `.bak` (preserve manual `.bak-YYYY-MM-DD`)
- Fire-and-forget: backend listen NGAY, sync chạy parallel ~2s

```js
// Wired in backend-node/src/index.js sau server.listen():
const bundleFixturesSync = require('./services/bundle-fixtures-sync');
bundleFixturesSync.syncAll(config.FRONTEND_PATH).catch((err) => {
  logger.error({ err }, '[BOOT] bundle-fixtures-sync uncaught');
});
```

**Endpoints verified public (no auth) on gốc as of 2026-05-21:**

| Endpoint                  | Local before | Gốc fresh | Status |
|---------------------------|--------------|-----------|--------|
| `/api/getAllGifts`        | 397KB / 1518 | 885KB / 3386 | ✅ synced |
| `/api/getAllAnimations`   | 43KB         | 32KB      | ✅ synced |
| `/api/getGlobalTransactions` | 2KB synthetic | 403 (auth) | ❌ skip |
| `/api/getAppConfig`       | 1.5KB        | 404       | ❌ skip |
| `/api/getSystemConfig`    | 1.5KB        | 404       | ❌ skip |

**Boot timing (verified):**
- T+0: backend listening on 5285
- T+0.5s: sync start
- T+2.4s: sync complete (getAllAnimations + getAllGifts updated)
- Bundle calls `/api/getAllGifts` 4× trong 2s đầu — 2 lần đầu nhận old data, từ lần 3 nhận NEW data

**Race condition acceptable:** bundle re-render grid khi nhận response mới. Nếu user mở Gift Browser ngay trong 2s đầu thì có thể thấy 1518 → refresh trang là thấy 3386.

**Anti-patterns đã tránh:**

- ❌ Periodic refresh — User explicitly said "fetch lúc mở lên thôi". Không setInterval, không cron, restart backend để re-fetch.
- ❌ Await sync trước khi listen — block boot 2s+ tệ UX, race acceptable vì file already exists làm fallback.
- ❌ Fetch on every `/api/getAllGifts` request — kéo 885KB từ external mỗi lần là tự tử bandwidth + latency. File cache trên disk là đúng pattern.
- ❌ Validate bằng `JSON.parse(text)` — parse 885KB chỉ để validate là lãng phí. Dùng cheap heuristic `startsWith('[') && /"id":\d+/.test()` đủ.
- ❌ Direct fetch từ TikTok webcast API — cần auth + region-specific. Proxy qua gốc TikFinity là đúng (họ đã handle auth/region).

**Pattern principle:**

> **Bundle fixtures = "dữ liệu công khai gốc đã có"**. Đối với bất kỳ static file nào dưới `downloads/api/`, kiểm tra: (1) gốc có public endpoint không (curl unauthenticated → 200?); (2) shipped file có outdated không (timestamp + count); (3) bundle có tolerate transient stale data trong vài giây đầu không. Nếu cả 3 ✅ → thêm vào FIXTURES array trong bundle-fixtures-sync. Nếu cần auth (như `getGlobalTransactions`) → giữ local file synthetic, không sync.

**Cách add fixture mới:**

```js
// services/bundle-fixtures-sync.js — FIXTURES array
{
  localPath: 'api/<endpoint>',
  upstream: '/api/<endpoint>',
  validate: (text) => /* cheap shape check */,
}
```

**Test trước khi commit:**

```bash
# Test endpoint public không cần auth:
curl -s -o /tmp/test.json -w "%{http_code} %{size_download}\n" \
  --max-time 15 -H "User-Agent: Mozilla/5.0" \
  "https://tikfinity.zerody.one/api/<endpoint>"
```

---

### Gate 20: Overlay Library page overflow — ROOT CAUSE là `#pages` width, không phải card widths (2026-05-21)

> **Supersedes Gate 19.** Gate 19 mô tả triệu chứng đúng nhưng misdiagnosed nguồn gốc. Cards KHÔNG cần override — bundle đã có rule responsive `width: calc(50% - 16px); min-width: 770px`. Vấn đề thật là `#pages` bị ép `width: 100%` mà bundle lại set `margin-left: 335px` → overflow toàn bộ container 335px, không phải cards.

**Triệu chứng:** Trang "Thư viện lớp phủ" (`data-pageid=obsoverlays`) khi maximize: cards trông bị "lệch", `body.scrollWidth = 2250px` trong khi viewport = 1920px → overflow 330px. Cards bên trong shrink đúng 50% rồi nhưng container đã extend ra ngoài viewport.

**Probe data (DevTools console):**
```
innerWidth: 1920, document.documentElement.clientWidth: 1915
body.scrollWidth: 2250 (vượt viewport 330px)
.page.pageenabled: x=343, width=1915, right=2258 (lấn 343px = sidebar width)
.obsOverlayContainer: width=1915, children=28
.greyBackgroundSection (card): w=948, right=2258 (đúng 50% của 1915, nhưng container đã sai)
```

**Root cause:** Trong `earlyCss.txt` có rule
```css
#navigation-app, #pages { width: 100% !important; max-width: 100vw !important; }
```
Bundle đồng thời có rule (verified từ `main.min.css`):
```css
body[data-new-navigation-design] #pages { margin-left: 335px; margin-top: 75px; }
```
**Cộng dồn:** #pages width 1920px (100vw) + margin-left 335px = right edge tại x=2255 → lấn viewport 335px. Mọi child (`.page.pageenabled`, `.obsOverlayContainer`, cards) đều lấn theo.

**Fix CORE — `backend-node/src/templates/earlyCss.txt`:**

```css
/* CRITICAL: KHÔNG ép #pages = 100vw. Bundle gives margin-left: 335px,
   nên 100vw + 335px = overflow đúng 335px. */
#navigation-app { width: 100% !important; max-width: 100vw !important; }
#pages {
  width: auto !important;
  max-width: calc(100vw - 335px) !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
}
```

**Bundle's NATURAL card sizing (KHÔNG override):**

Verified từ `main.min.css` grep:
```css
body[data-new-navigation-design] .page[data-pageid=obsoverlays] .obsOverlayContainer .greyBackgroundSection {
  margin-right: 0;
  width: calc(50% - 16px) !important;
  min-width: 770px;
  box-sizing: border-box;
}
```
Container rule:
```css
body[data-new-navigation-design] .page[data-pageid=obsoverlays] .obsOverlayContainer {
  margin-top: 20px; display: flex; gap: 16px;
  flex-wrap: wrap; justify-content: flex-start;
}
```

Bundle đã responsive sẵn: cards stretch 50% với min-width 770px, wrap khi <1556px. Sau khi fix `#pages` thì:
- Viewport 1920 → #pages 1585 → cards 50%-16 = 776.5px each (> 770 min ✓)
- Viewport <1556 → wrap xuống 1 cột (min-width force wrap)

**Anti-patterns đã thử và sai:**

- ❌ Override `width: calc(50% - 10px)` cho cards → off 6px so với bundle's `calc(50% - 16px)` → user complain "lệch"
- ❌ Force `flex: 0 1 calc(50% - 10px) !important` + `max-width: calc(50% - 10px)` → ép cards stretch ra ngoài design intent
- ❌ Set `.obsOverlayContainer { gap: 20px }` → bundle dùng 16px, override làm sai spacing
- ❌ Cho `body { overflow-x: auto }` → tạo scroll bar không đẹp; vấn đề là page width, không phải body
- ❌ Gate 19's CSS dùng `[class*="grid-cols-2"]` → trang này dùng LEGACY `.obsOverlayContainer` flex, không phải Tailwind grid → fix không apply

**Pattern principle:**

> **Khi thấy overflow ở 1 page cụ thể, đo VIEWPORT vs CONTAINER trước, đừng vội fix cards.** Probe DOM với DevTools script để xem `body.scrollWidth`, `.page.pageenabled.width`, `.page.x`. Nếu page.x > 0 (sidebar margin) AND page.width ≈ 100vw → root cause là PARENT width, không phải children. Bundle thường có responsive logic built-in cho cards/grids — chỉ override khi đo được nó thật sự sai.

**Verification probe (paste vào DevTools console khi đang ở trang lỗi):**

```js
(function tfProbeOverflow() {
  const log = [];
  const p = (msg) => log.push(msg);
  p('vw=' + window.innerWidth + ' body.scrollWidth=' + document.body.scrollWidth);
  const page = document.querySelector('.page.pageenabled');
  if (page) {
    const r = page.getBoundingClientRect();
    p('page pageid=' + page.getAttribute('data-pageid') + ' x=' + r.x + ' width=' + r.width + ' right=' + r.right);
  }
  // Find elements past viewport right edge
  const vw = window.innerWidth;
  let over = [];
  document.body.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 5 && r.width > 50 && r.width < 2000) {
      over.push(el.tagName + '.' + (el.className||'').toString().slice(0,40) + ' w=' + Math.round(r.width) + ' right=' + Math.round(r.right));
    }
  });
  p('elements past right (' + over.length + '):'); over.slice(0,5).forEach(o => p('  ' + o));
  console.log(log.join('\n'));
})();
```

Nếu `page.x = 343, page.width = 1915` → ĐÚNG Gate 20 pattern → fix `#pages`. Nếu `page.width` đã ≤ viewport thì là vấn đề khác.

---

### Gate 19: Layout overflow khi window resize (responsive) [SUPERSEDED by Gate 20]

> ⚠️ **Diagnosed sai root cause.** Vẫn giữ để reference các pattern responsive grid (cho các trang Tailwind grid-cols-*), nhưng cho **overlay library page** dùng Gate 20.

**Triệu chứng:** Khi maximize, các card 2-column (Ghép xu PRO + Hũ đựng tiền xu PRO, etc.) extend ra ngoài viewport. Body scrollWidth (2250px) > viewport (1920px).

**Root cause (sai):** Bundle dùng **LEGACY class `.obsOverlayContainer`** (NOT Tailwind grid-cols-*). Container `display: flex` không wrap. Cards có `min-width: 560px` (cũ) fix-width → 2 cards = ~1900px → overflow.

Cards classes verified từ probe:
- `.obsOverlayOnPage.greyBackgroundSection.greyBackgroundSectionOverlayFix` (Ghép xu)
- `.greyBackgroundSection.greyBackgroundSectionOverlayFix` (Hũ đựng tiền xu)
- `.graphicSection` (legacy)

Anti-pattern (đã từng có):
- ❌ CSS chỉ target `.graphicSection` → miss `.obsOverlayOnPage` và `.greyBackgroundSection` → fix không apply

**Fix (CSS responsive grid override):**

```css
/* Override fixed columns với auto-fit + minmax */
[class*="grid-cols-2"]:not([class*="md:grid-cols-2"]):not([class*="lg:grid-cols-2"]) {
  grid-template-columns: repeat(auto-fit, minmax(min(450px, 100%), 1fr)) !important;
}
[class*="grid-cols-3"]:not([class*="md:grid-cols-3"]):not([class*="lg:grid-cols-3"]) {
  grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr)) !important;
}
/* Card grid children không push content ra ngoài */
div[class*="grid"] > div {
  min-width: 0 !important;
  overflow: hidden !important;
}
/* Input + buttons trong card shrink-friendly */
div[class*="grid"] input[type="text"] {
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
```

**Pattern principle:**
> Bundle's grid layouts thường fixed-columns. Khi cần responsive, override với `auto-fit` + `minmax(min(IDEAL_WIDTH, 100%), 1fr)`. Đặt `min-width: 0` cho grid children để khắc phục flexbox/grid default `min-width: auto` đẩy nội dung ra. Selector loại trừ `:not([class*="md:..."])` / `:not([class*="lg:..."])` để không phá responsive breakpoints bundle đã set sẵn.

**Anti-pattern:**
- ❌ Đặt `overflow-x: auto` ở body — tạo scroll bar horizontal không đẹp
- ❌ Set max-width fixed (e.g., `max-width: 1200px`) — bị white space ở screens lớn

### Gate 18: Pro credit chip — bg color khác Free + image src vẫn TikTok avatar

**Triệu chứng (v1):** Chip hiện "0" → fixed via `tfForceProCredits` (Gate 17).
**Triệu chứng (v2):** Chip hiện đúng "100k" (bundle native compact) NHƯNG image vẫn là TikTok avatar (Pro-mode bg `#FFB54D14`, không phải `#D435554D` free-mode cũ).

**Root cause:** Bundle dùng 2 bg colors cho chip:
- Free tier (`subscriptionEnabled: false`): `bg-[#D435554D]` (burgundy)
- Pro tier (`subscriptionEnabled: true`): `bg-[#FFB54D14]` (yellow/amber)

CSS rule cũ chỉ match burgundy → miss khi user Pro → tiktokcdn img leak qua.

**Bundle's NATIVE behavior for Pro chip:**
- Compact format "100k" — bundle TỰ format khi `proCredits ≥ 1000` (KHÔNG cần CSS pseudo override)
- title attr = "100,000" (locale-formatted with comma) — bundle dùng `Intl.NumberFormat()` cho title
- image = TikTok user avatar (BUG bundle — should be coin icon)

**Fix đúng (multi-selector CSS):**

Target CẢ 2 bg colors trong CSS rule:

```css
div[class*="bg-[#D435554D]"] > div.flex.items-center > img[src*="tiktokcdn"],
div[class*="bg-[#FFB54D14]"] > div.flex.items-center > img[src*="tiktokcdn"] {
  display: none !important;
}
div[class*="bg-[#D435554D]"] > div.flex.items-center::before,
div[class*="bg-[#FFB54D14]"] > div.flex.items-center::before {
  content: '';
  background-image: url('/twemoji/svg/1fa99.svg');
  /* ... */
}
```

**Principle (extend Section 1.00):**
> Khi bundle dùng nhiều bg colors cho variants (Free vs Pro, Light vs Dark, etc.), CSS rule phải LIST hết bg colors (comma-separated selectors). Không assume một color duy nhất sẽ cover mọi state. Bundle update có thể đổi bg → grep lại tất cả `bg-[#...]` colors xuất hiện trong chip's outerHTML.

### Gate 17: Pro credit chip render "0" dù `/api/me` trả `ttsProCredits: 100000`

**Triệu chứng:** Topbar coin chip hiển thị "0" cho user Pro (isPro=true, ttsProCredits=100k ở /api/me). Popover còn show "Đã dùng 100k trong tổng 100k".

**Root cause:** Bundle's chip Vue component đọc credits từ **Pinia store** (mảng state riêng), KHÔNG đọc trực tiếp từ `tfPageloadData.me.channel.ttsProCredits`. Pinia store init với default 0, chỉ update từ `/api/tts/user` fetch response (cross-origin call). Trước khi user trigger AI voice flow → fetch không fire → Pinia ở 0 → chip "0".

**Anti-pattern (KHÔNG làm):**
1. ❌ Trông chờ Pinia auto-sync từ `tfPageloadData.me.channel.*` — bundle không làm vậy
2. ❌ Set `ttsProCredits` ở /api/me thôi — chip không read từ đây

**Fix đúng (blockScript IIFE `tfForceProCredits`):**

1. Mỗi 2s, walk **mọi Pinia stores** của mọi Vue apps mounted (`document.querySelectorAll('[data-v-app]')`).
2. Cho mỗi store state, force-set TẤT CẢ field credit/quota về Pro full value (nếu field exist):
   - `proCredits`, `proCreditsMax`, `subscriptionCreditsRemaining`, `subscriptionCreditsTotal`, `lastKnownAiCreditsTotal` → 100000
   - `freeMessages`, `freeMessagesMax`, `freeRequestsRemaining`, `freeRequestsTotal` → 25
   - `topUpCredits`, `purchasedCreditsRemaining` → 0
   - `aiCreditsBlocked` → false
   - `trialBannerDismissed` → true
3. Vue reactive re-renders → chip update tự nhiên.

**Pattern principle:**
> Khi bundle dùng Pinia store với state riêng (không sync từ tfPageloadData), force-set tất cả credit/quota fields đã biết tên qua periodic Pinia patcher. Liệt kê fields trong CLAUDE.md để future bundle update có thể extend.

### Gate 16: Bundle render LIVE label hardcoded inline + avatar hide khi disconnected

**Triệu chứng (initial):** Bundle render "LIVE" trong topbar dropdown dù `account.isLive: false`.

**Triệu chứng (regression v1 — DOM text mutation approach):** Label flicker giật giật giữa "LIVE" và "Disconnected" — observer/Vue fight nhau re-render.

**Root cause:** Bundle's Vue render function cho user dropdown component (`data-v-41c476b8`) hardcode "LIVE" string làm text content (obfuscated string table, 1 occurrence). Không phải i18n key. Vue re-render component periodic → đè lên DOM text mutation của tôi → flicker.

**Anti-pattern (KHÔNG làm):**
1. ❌ MutationObserver replace `span.textContent` mỗi mutation — fight Vue → flicker
2. ❌ Tìm và patch bundle's render function — obfuscated, blast radius khó kiểm soát
3. ❌ Set `connected: false` ở backend — break chat event subscription

**Fix đúng (attribute + CSS pattern):**

1. **blockScript IIFE `tfPatchLiveBadge`:**
   - Poll `/api/tiktok/status` mỗi 5s
   - Set `<html data-tf-live-state="live|disconnected">` dựa trên `account.isLive`
   - **KHÔNG touch DOM text** — chỉ set attribute (Vue không touch attribute này)
   - Default `disconnected` trước khi poll đầu tiên (tránh flash LIVE)

2. **earlyCss.txt CSS rules** (CSS chạy tự nhiên, không fight Vue):
   ```css
   html[data-tf-live-state="disconnected"] div.flex.flex-col > span.text-xs {
     font-size: 0 !important;
     color: transparent !important;
   }
   html[data-tf-live-state="disconnected"] div.flex.flex-col > span.text-xs::before {
     content: 'Disconnected';
     font-size: 0.75rem;
     color: rgb(239, 63, 98) !important;
   }
   /* Hide TikTok avatar khi disconnected (user request: không load avt khi disconnected) */
   html[data-tf-live-state="disconnected"] .profile-avatar-wrap img {
     display: none !important;
   }
   html[data-tf-live-state="disconnected"] .profile-avatar-wrap {
     background-image: url('/img/nothumb.webp');
     background-size: cover;
     border-radius: 50%;
   }
   ```

**Pattern principle (Đăng ký vào skill):**
> Khi bundle hardcode text/style obfuscated và Vue re-render đè:
> 1. Set state qua `data-*` attribute trên `<html>` (Vue không touch)
> 2. Render visual khác qua CSS rule (`font-size: 0` + `::before content`)
> 3. KHÔNG dùng MutationObserver replace text — fight Vue → flicker
> 4. Default state trước khi poll đầu (tránh flash sai state)

**Khi nào KHÔNG dùng pattern này:** Nếu bundle text cần dynamic value (vd "100 viewers"), pattern CSS `::before content` không support dynamic value qua CSS — phải fall back sang JS replacement với throttle ≥ 100ms.

### Gate 15: "LIVE" badge under user avatar luôn hiển thị dù không broadcasting

**Triệu chứng:** User avatar trong topbar có badge "LIVE" màu xanh dù user không đang live streaming. Confusing UX.

**Root cause:** `tiktok-bridge.js` `accountSnapshot()` set `isLive: !!_state.connected` — chỉ check session connection, không check broadcasting state. Bundle reads `account.isLive` cho LIVE badge → badge sáng khi session connected.

**Fix (đã apply):** Đổi điều kiện thành `!!(_state.connected && _state.roomId)`. LIVE badge chỉ sáng khi:
1. TikTok bridge có session active
2. AND bridge đã detect 1 live room (roomId không null)

`_state.connected` đứng riêng vẫn `true` khi user account connected — các flow khác (event subscription, chat input enable) không bị ảnh hưởng.

### Gate 14: `/api/tts/user` response `currentUsageMode='subscription'` trigger `settings.restore()` reload loop

**Triệu chứng:** Sau khi mock trả `currentUsageMode:'subscription'` + `subscriptionCreditsRemaining:100000` cho Pro look, app crash reload liên tục. Stack: `Object.restore` ở app.js → XHR success callback → `location.reload()` → reload-guard window=5/8 → loop.

**Root cause (suspect):** Bundle's Pro-mode code path validates token/credentials chặt hơn. Nếu `ttsAuthToken` không phải real JWT (mock dùng plain string `"tf-local-ai-token"`) → bundle nghi credentials mismatch → trigger settings.restore() → reload.

**Fix tạm (đã apply):** Revert `/api/tts/user` mock về `currentUsageMode:'free'`. Chip render gold coin + 25 free messages (matches gốc free-tier visual). Pro features vẫn unlocked qua Serial Key — chỉ chip topbar look free.

**Future:** Nếu cần Pro mode cosmetic, mint real JWT cho `ttsAuthToken` (encode userId + expiry + signed). Cũng cần verify bundle's Pro validation path không có gate khác.

### Gate 13: `/config/localization/<lang>.json` 404 → reload loop khi user chuyển locale

**Triệu chứng:** User chọn locale lạ (vd Japanese) qua profile dropdown → app đen / reload-guard KILL SWITCH window=8/8 → console error `Uncaught (in promise) Error while loading translation for ja, [object Object]`.

**Root cause:** Bundle fetch `/config/localization/<lang>.json` (root path, không qua `/api/` prefix) khi user switch language. Nếu 404 → bundle's loader throw → Vue crash → location.reload() → reload-guard chặn → app stuck đen.

**Fix (đã apply):** Route `GET /config/localization/:lang.json` trong `backend-node/src/index.js`:
- Lang trong `{vi, en, de, es}` → parse và return baked `tfPageloadData.localization.<lang>` từ HTML file tương ứng
- Lang khác (ja/ko/zh/...) → fallback return EN baseline → UI render English labels thay vì raw keys

**KHÔNG return empty `{}`** — bundle's i18n loader sẽ thay tất cả label bằng raw key (`nav.search`, `menu_start`, `start_connect_button`, ...) → UI broken.

**Phòng ngừa:** Project chỉ focus VN + EN. Các locale khác auto-fallback. User reset locale qua profile dropdown.

### Voice picker loader sequence (xác nhận từ Network tab gốc)

```
1. POST  /api/tts/auth-token (LOCAL backend, same-origin)
   → {status:200, ttsAuthToken:"<JWT>"}
2. GET   https://tts.tikfinity.com/api/tts/user (cross-origin, Bearer)
   → quota info {freeRequestsRemaining, currentUsageMode, ...}
3. GET   https://tts.tikfinity.com/api/tts/voices (cross-origin, Bearer)
   → voice catalog {data.voices: [...]}
```

Skip bất kỳ step nào trong sequence → bundle abort, modal empty.

### Gate 9c: Mock response shape — bundle reads BOTH `data.voices` AND `data.aiVoices`

**Triệu chứng:** Manual `fetch('/api/tts/voices')` thấy 66 voices, nhưng `window.tts.loadAiVoiceState()` xong, `window.tts.aiVoices === []`.

**Root cause:** Bundle's loader đọc field tên khác `data.voices`. Có thể là `result.voices` hoặc `data.aiVoices`.

**Fix (đã apply):** Mock emit cả 3 path cùng lúc:
```js
{
  statusCode: 200,
  message: 'Success',
  result: { voices: normalized },
  data: { voices: normalized, aiVoices: normalized }
}
```

### Probe workflow để diagnose voice picker empty

```js
// 1. Verify token + ttsHost gate
JSON.stringify({
  hasToken: !!window.token,
  ttsHost: window.appConfig?.ttsHost,
  aiTtsKeys: Object.keys(window.aiTts || {})
})

// 2. Verify voice ID prefix
window.aiTts?.voiceIdPrefix  // expect 'tts_api__'

// 3. Trace fetches during loader (capture URLs)
(function(){
  const o = window.fetch, c = [];
  window.fetch = function(u){ c.push(typeof u==='string'?u:u?.url); return o.apply(this, arguments); };
  return window.tts.loadAiVoiceState().then(() => { window.fetch=o; return c; });
})()

// 4. Verify aiVoices populated
(await window.tts.loadAiVoiceState(), window.tts.aiVoices?.length)
```

### Order of fixes (DO NOT skip any)

1. ProfileId clamp ✓
2. `tf_locale=VN` cookie → middleware language map ✓
3. Prebake create `en` bucket if missing ✓
4. Prebake target top-level `pld.localization` ✓
5. Object.defineProperty interceptor for early patch ✓
6. Bootstrap `window.token` from cookie ✓
7. `tts_api__` prefix on AI voice IDs ✓
8. Backend `/api/tts/auth-token` route ✓
9. Mock response shape with `data.voices` + `data.aiVoices` + `result.voices` ✓

Bỏ bất kỳ bước nào trong list này → AI tab empty hoặc app crash.
