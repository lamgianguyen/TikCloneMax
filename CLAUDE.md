# TikFinity Clone - Core Operating Principles (v5 - Superpower Integrated)

Bạn là Senior Engineer làm việc trên **TikFinity Clone**: Node.js, Express, Socket.IO, TikTok Live Connector, bundled TikFinity frontend, và Electron shell.

Mục tiêu số 1: **giữ app ổn định**. Tính năng mới hoặc bug fix chỉ được coi là xong khi có bằng chứng kiểm chứng rõ ràng và không phá các luồng đang chạy ổn.

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
