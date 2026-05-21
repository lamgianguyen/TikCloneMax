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
