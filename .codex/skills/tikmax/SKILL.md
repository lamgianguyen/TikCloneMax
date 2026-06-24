---
name: tikmax
description: ONE master skill for TikMax (TikFinity clone). Covers Space Marine doctrine (8-10 agent team, ALWAYS-ON, Commander autonomy), project architecture, HTML injection pipeline, hot-reload matrix, and operating playbooks for TTS / i18n / profile switch / bundle update / Sound Alerts. Replaces previous 6 split skills (tikmax-core, tikmax-doctrine, tikmax-tts-debug, tikmax-debug-locale, tikmax-profile-switch, tikmax-bundle-update) into a single file to avoid Claude reading wrong skill.
when_to_use: ANY task in TikCloneMax repo. Read this entire file once per session before touching code.
---

# TikMax — Master Skill

> Project: Electron + Node + Express + Socket.IO + bundled gốc TikFinity frontend (Vue 3 obfuscated + jQuery legacy modules) + SQLite.
> Goal: app stability first. Every change passes mission protocol below.

---

## §0 LỜI MỞ ĐẦU — đọc trước, hiểu bộ skill này từ đâu mà có

> **Gửi người (hoặc agent) đọc sau:**
>
> Bộ skill này **KHÔNG đo bằng ngày**. Nó không phải thứ gõ một prompt là có. Không có model nào sinh ra nó trong một lượt. Mỗi dòng trong file này — mỗi Gate, mỗi anti-pattern, mỗi "đừng làm X vì đã thử và nó phá Y" — là **kết tủa của một quá trình test và fix bug liên tục, đào tới từng ngóc ngách** của một bundle obfuscated khổng lồ mà không ai có source gốc.
>
> Nó được dựng nên qua **rất nhiều ngày sửa đi sửa lại**, cập nhật liên tục theo từng bản bundle mới, từng lần "OK rồi chạy lại lỗi", từng đêm trace một event đi lạc qua 5 lớp (DOM → bundle → Pinia → backend → Electron). Những con số như "offset 70895", "ballSize chỉ áp bóng mới", "non-200 bị widget bỏ qua", "proInfo:null mới đúng" — không tra được ở đâu cả. Chúng là **bằng chứng runtime đổi bằng thời gian thật**, ghi lại để người sau KHÔNG phải đốt lại những đêm đó.
>
> Đây là một **hệ thống skill phức tạp, chi tiết tới từng lớp, do một người dựng nên** — kiên trì, tỉ mỉ, đi tới tận cùng nguyên nhân thay vì vá tạm. Hệ thống Gate + FIXLOG + 3-strike + READ-GỐC-FIRST + đội-hình-agent bên dưới chính là cách người đó biến công sức đó thành thứ tái dùng được.
>
> **Vì vậy:** đọc kỹ trước khi sửa. Tôn trọng các "Dead-end đã thử". Đừng phát minh lại con đường đã có người đi và chứng minh là cụt. Khi bạn thêm một fix mới đã verify, hãy ghi lại đúng kỷ luật bên dưới — bạn đang nối tiếp một công trình, không phải bắt đầu lại từ đầu.

---

## §1 Doctrine — 8-10 agent team, ALWAYS-ON, Commander autonomy

**OVERRIDES "solo by default".** Every non-trivial user request → Commander assess difficulty → right-size team → execute → report. Commander tự decide, không hỏi user "chọn A hay B" trừ khi (a) explicit hỏi options, (b) sắp phá behavior đang work, (c) resource cost lớn.

**Team size = TIERED (not always 8-10):**

| Tier | Criteria | Team | Composition |
|---|---|---|---|
| Trivial | 1 line/typo/rename | Commander solo | no declare |
| Easy | 1-2 file, clear, low risk | 1-2 specialist | relevant agent + optional reviewer |
| Medium | 3-5 file, moderate | 3-5 agents | Scout? + Engineer + Apothecary + optional Demolition |
| Large | cross-cutting/high-risk/fuzzy/security/DB | 8-10 full | full roster |

Assess: #files, scope clarity, risk tier, known/novel, reversibility. Mobilize ONLY relevant specialists. Security-touching → ALWAYS +Demolition-Sec.

### Chain of command

```
            USER
              ↓
   [Commander / Team-Lead]  ← me (default session)
              ↓
   ┌──────────┼──────────────────────────┐
   │          │                          │
[Strategist] [Scout × N]              [Librarian]
              ↓                          ↑
        [Engineer / Demolition]          │
              ↓                          │
        [Apothecary]                     │
              ↓                          │
   [Demolition + Demolition-Sec]         │
              └──── merged report ───────┘
                          ↓
                   [Commander decides]
```

### Role → agent type + DEFAULT MODEL (MANDATORY pass `model:` when spawning)

| Role | Maps to | Model | Tools | Purpose |
|------|---------|-------|-------|---------|
| **Commander** | team-lead (default session) | Opus (parent) | All | Orchestrate, delegate, merge |
| **Strategist** | `Plan` / `planner` | **Opus** | Read-only | Battle plan, dependency analysis |
| **Architect** | `architect` | **Opus** | Read-only | System design tradeoffs |
| **Demolition-Sec** | `security-reviewer` | **Opus** | Read-only | Threat modeling |
| **Scout (broad)** | `code-explorer` / `Explore` | **Sonnet** | Read-only | Multi-file RE, dependency mapping |
| **Scout (single-file)** | `code-explorer` | **Haiku** | Read-only | Symbol confirm, simple lookup |
| **Engineer (multi-file)** | `general-purpose` | **Sonnet** | Full | Implementation per plan |
| **Engineer (1-2 file)** | `general-purpose` | **Haiku** | Full | Mechanical edit per spec |
| **Demolition** | `code-reviewer` | **Sonnet** | Read-only | Code quality + pattern review |
| **Apothecary (static)** | `build-error-resolver` | **Haiku** | Full | Syntax/lint/file structure |
| **Apothecary (runtime)** | `build-error-resolver` | **Sonnet** | Full | Bug trace across files |
| **Chaplain-E2E** | `e2e-runner` | **Sonnet** | Full | Test exec + failure parse |
| **Librarian** | `doc-updater` | **Haiku** | Docs only | Structured doc writes |
| **Perf** | `performance-optimizer` | **Sonnet** | Full | Profile + optimization |
| **Database** | `database-reviewer` | **Sonnet** | Full | Schema + query analysis |
| **Refactor-Cleaner** | `refactor-cleaner` | **Sonnet** | Full | Dead code purge |

**Spawn syntax:** every Agent call MUST include `model: 'opus' | 'sonnet' | 'haiku'` per table above. Inheriting Opus default makes mission take 30-60 min instead of 10-20 min. Override only with justification (novel architecture → bump to Opus, scope narrows → drop to Sonnet).

**MAX thinking preamble (MANDATORY — insert at top of every Agent prompt):**

```
## Thinking budget
Use extended thinking LIBERALLY. TikMax involves obfuscated bundle RE +
multi-layer state (DOM / bundle / Pinia / backend / Electron). Think 3-5
hypotheses, eliminate via evidence, design minimal fix + regression list
BEFORE first tool call. Prefer 2 min thinking + 1 correct call over 8 calls
of guessing.
```

Role-specific augmentation also recommended (e.g., Demolition-Sec: "Think through 5-10 attack vectors before mitigations"). Even Haiku-tier agents (Apothecary/Librarian) benefit — they reason through edge cases instead of mechanical execution.

### Default team templates (Commander picks + customizes for each mission)

| Mission type | 8-10 agent roster |
|---|---|
| **UI bug fix** | Strategist + Scout-Bundle + Scout-Backend + Scout-DOM + Engineer + Apothecary + Demolition + Demolition-Sec + Librarian (+ Chaplain-E2E if test exists) |
| **Feature dev** | Strategist + Architect + Scout × 2 + Engineer × 2 + Apothecary + Demolition + Demolition-Sec + Chaplain-E2E + Librarian |
| **Research / audit** | Strategist + Scout × 5-7 + Librarian + Commander synth |
| **Perf** | Strategist + Perf-Baseline + Scout-Profile + Engineer + Apothecary + Demolition + Librarian + Chaplain-E2E |
| **DB / migration** | Strategist + Database + Engineer + Apothecary + Demolition-Sec + Librarian + Scout-DB-State |

### Mission protocol (mandatory)

1. **DECLARE** — Commander writes `.codex/team/current_mission.md` with mission_id + objective + 8-10 agents + ETA BEFORE spawning.
2. **File ownership absolute** — không 2 agent edit cùng file. Spawn parallel cho independent scopes, sequential cho dependent.
3. **Cross-talk qua `.codex/team/*.md` files** — agents link nhau bằng `[[other-agent#anchor]]` markdown anchors. Không gọi `SendMessage` trực tiếp trừ khi resume.
4. **Mission Brief** (Commander → Agent): structured prompt with `objective`, `scope` (files allowed), `forbidden` (out-of-scope files), `success_criteria`, `budget`.
5. **Mission Report** (Agent → Commander): structured Markdown with `files_changed`, `verification`, `risks`, `next_recommendation`. Free-form "done nha" replies REJECTED.
6. **Commander reconcile** — viết `.codex/team/mission-NNN-reconciliation.md` synth findings + đề xuất follow-up.
7. **War-room state** — `.codex/team/current_state.json::active_mission` + `team_roster` updated per spawn/complete.

### Per-agent budgets

| Role | max_tool_calls | max_runtime_min | max_cost_usd |
|------|----------------|------------------|---------------|
| Scout | 50 | 20 | 1.5 |
| Strategist | 30 | 15 | 1.0 |
| Engineer | 40 | 25 | 2.0 |
| Demolition | 60 | 40 | 3.5 |
| Apothecary | 50 | 30 | 2.0 |
| Demolition-Sec / Chaplain | 30 | 15 | 1.0 |
| Librarian | 25 | 10 | 0.5 |

Self-stop rule: agent reports `status: "budget_exceeded"` + partial work + reason if hits limit.

### Exception (vẫn solo, KHÔNG declare mission)

- 1 dòng typo / comment edit / variable rename trong 1 file
- User explicit "tự làm đi, không cần team"
- Continuation của mission đang chạy

### Anti-pattern doctrine violations (auto-reject)

- ❌ Spawn 1-3 agent cho mission lớn → undersized team
- ❌ Spawn agent với file ownership chồng chéo
- ❌ Skip mission DECLARE
- ❌ Commander tự code feature lớn → không leverage specialization
- ❌ Hỏi user "Chọn option nào?" → Commander tự decide, report rationale
- ❌ Plain "done nha" reply without structured Mission Report
- ❌ Modified file OUTSIDE declared scope

---

## §2 Architecture

### Project layout

```
TikCloneMax/
├── electron/                  ← Main process (window mgmt, splash, IPC, spawns backend-node)
├── backend-node/              ← Node Express + Socket.IO (port 5285)
│   └── src/
│       ├── index.js           ← Boot: middleware chain + route registration
│       ├── config.js          ← Single source of truth ports/paths/JWT_SECRET
│       ├── middleware/
│       │   ├── index-html.js  ← HTML injection pipeline (THE critical file)
│       │   └── auth.js        ← JWT verify
│       ├── routes/            ← 24 route files
│       ├── services/
│       │   ├── tiktok-bridge.js          ← In-process TikTok WebSocket relay
│       │   ├── socket-manager.js         ← Socket.IO broadcast abstraction
│       │   ├── bundle-fixtures-sync.js   ← Gate 21: sync getAllGifts from gốc on boot
│       │   └── tiktok-image-prewarm.js   ← M-001 (2026-05-28): pre-warm top 200 gift images
│       ├── db/ (better-sqlite3, knex migrations, 16 tables)
│       └── templates/         ← INJECTED into served HTML
│           ├── blockScript.txt   (~3000 lines IIFEs — Gate after Gate)
│           ├── earlyCss.txt
│           ├── authScript.txt
│           ├── reloadGuard.txt
│           ├── ttsScript.txt
│           ├── i18n-patch.json
│           └── voice-catalog.json
├── downloads/                 ← Frontend bundle (read-only — do NOT edit)
│   ├── index.html, vi, de, es (per-locale HTMLs)
│   ├── combo/{app.js, modules.js, modules.css}
│   ├── widget/                (iframe widget HTMLs)
│   └── config/localization/   (12 lang JSONs)
├── decompiled/modules/deobfuscated.js  ← 945KB readable RE reference (read-only)
├── .codex/
│   ├── skills/tikmax/SKILL.md       (this file)
│   └── team/                        (war-room)
└── CLAUDE.md                  (Gate system + policy)
```

**SQLite DB**: `%APPDATA%\tikfinity-desktop\tikfinity.db`. Single-user, single-writer.

### HTML injection pipeline (CRITICAL concept)

When user navigates to `http://localhost:5285/...`, `index-html.js::buildIndexHtml()`:

1. Picks base HTML: `downloads/<lang>` for vi/de/es OR `downloads/index.html` otherwise
2. **Strips telemetry**: posthog/sentry/contentsquare/featurebase/gtag tags removed
3. **Rewrites cloud hosts**: `auth.zerody.one` → `''`, `myinstantsapi.zerody.one` → `/myinstants-proxy/`
4. For HTML-less locales (id/ja/ko/ms/pt-BR/th/tl/tr): inject lang JSON into `tfPageloadData.localization` via re-serialize + `</script>` escape
5. **Splices into head**: `reloadGuard + earlyCss + blockScript + authScript`
6. **Splices into body** (after `<body class="tf-logged-out">`): `ttsVoiceShim + guestTopbar + loginPopupScript + tiktokConnectScript + ttsScript + twemojiScript + tiktokSigninGate + reloadMask`
7. Caches by `(channelId, channelName, lang)` key

**Cache invalidation**: `POST /api/_dev/reload-html`. Auto via `fs.watch` on `templates/*.txt` + `downloads/js/*`.

### Hot-reload matrix (get wrong = waste 20min)

| Change to | Cache invalidate | Module reload | Process restart |
|-----------|------------------|---------------|-----------------|
| `templates/*.txt` | ✓ Auto via fs.watch | — | — |
| `downloads/js/tf-connect.js` | ✓ Auto | — | — |
| `downloads/config/localization/*.json` | ❌ Manual: `curl -X POST localhost:5285/api/_dev/reload-html` | — | — |
| `backend-node/src/routes/*.js` | — | ❌ Not supported | ✓ Required |
| `backend-node/src/middleware/*.js` | — | ❌ | ✓ Required |
| `backend-node/src/db/migrations/*` | — | — | ✓ Required (runs on boot) |
| `backend-node/src/db/models/*.js` | — | ❌ | ✓ Required |
| `backend-node/src/services/*.js` | — | ❌ | ✓ Required |
| `backend-node/src/index.js` | — | — | ✓ Required |
| `electron/*.js` | — | — | ✓ Required |
| `downloads/combo/app.js | modules.js` | — | — | Just Ctrl+R in app |

**Rule**: anything in `backend-node/src/` outside `templates/` = restart Electron. Anything in `templates/` = `reload-html`. Both = restart.

**Restart command**: `taskkill /F /IM electron.exe` then run `start_desktop.bat`.

### Backup discipline (mandatory before risky edits)

```powershell
$src = 'backend-node/src/templates/blockScript.txt'
$bak = "${src}.bak-2026-05-28-pre-<reason>"
Copy-Item -LiteralPath $src -Destination $bak -Force
Get-Item -LiteralPath $src,$bak | Select-Object FullName,Length,LastWriteTime
```

Naming: `<filename>.bak-YYYY-MM-DD-<reason>`. Keep 2 most recent per source. `.gitignore` has `*.bak-*`.

### Risk tiers (CLAUDE.md §3)

- **Low**: docs, comments, typo — no backup needed
- **Standard**: routes, services helpers, UI scripts — backup recommended
- **High** (BACKUP MANDATORY): `templates/*.txt`, `middleware/*.js`, `index.js`, `electron/main.js`, DB migrations, auth/TikTok routes
- **Critical bundle**: `downloads/combo/*` — only update on user request with full backup + rollback plan
  - ❌ **Bundle-op (update/revert/re-fetch `downloads/combo/*`, chạy qa/BUNDLE_UPDATE.md) để TẮT/ẨN một feature = SAI luồng.** Tắt/ẩn = proxy trả `200 {…:[]}` / `enabled:false` / CSS visible-toggle (CLAUDE.md §1.2b Disable/Hide). Bundle-op CHỈ khi user yêu cầu đổi PHIÊN BẢN bundle. Data-cut phải trả **HTTP 200** (non-200 bị widget poll bỏ qua → không ẩn).

---

## §3 Operating playbooks

### §3.1 TTS / chip 100k / voice picker

**Three-layer state model:**
```
LAYER 1: Backend /api/tts/user (mocked)
  → { data: { quota: { currentUsageMode: 'sub_credits',
                       subscriptionCreditsRemaining: 100000, ... } } }
LAYER 2: window.tts (hydrated by applyAiCreditsFromApiUser)
  Fields: proCredits, freeMessages, aiCreditsBlocked, lastKnownAiCreditsTotal
LAYER 3: Pinia nav store (synced by tts.syncNavigationStoreCredits)
  Fields: ttsProCredits, ttsFreeMessages, ttsTopUpCredits
LAYER 4: Chip render — parent component (app.js@2000485):
  if (isPro) → TTSProDropdown (proCredits + topUpCredits) → "100k"
  else       → TTSFreeDropdown (freeMessages) → "25" etc.
```

**Chip 100k bug (Gate 30a)**: defineProperty trap for `nav.isPro` bypasses Vue 3 reactive proxy's set trap → no re-render. **Fix**: plain assignment `nav.isPro = true` in `blockScript.txt::tfPiniaProTrap`.

**Voice picker mock**: `blockScript.txt::tfHandleTtsTikfinityCom` reads `templates/voice-catalog.json` (118 voices) → returns `{data: {voices, aiVoices}, result: {voices}}` (3 aliases).

**End-to-end TTS flow**:
```
chat → tts.speak(text) → /api/tts/generate (mock returns audioUrl + updated quota)
  → tts.applyAiCreditsFromApiUser → tts.syncNavigationStoreCredits → chip re-renders
  → audio element plays /api/tts/generate?voice=X&text=Y
  → backend routes/tts.js proxies to https://tiktok-tts.weilnet.workers.dev → MP3 stream
```

**DevTools probe**:
```js
console.log({
  proCredits: window.tts?.proCredits,
  freeMessages: window.tts?.freeMessages,
  navIsPro: document.querySelector('[data-v-app]').__vue_app__.config.globalProperties.$pinia.state.value.navigation.isPro,
  navTtsProCredits: document.querySelector('[data-v-app]').__vue_app__.config.globalProperties.$pinia.state.value.navigation.ttsProCredits,
  voiceCount: window.tts?.aiVoices?.length,
  chipText: [...document.querySelectorAll('span')].find(s => /^\d+k?$/.test(s.textContent.trim()))?.textContent
});
```

**Sound Alerts trigger dropdown (Gate 30j)**: bundle's central dispatcher doesn't fire `sounds.onChannelContextChanged()` → `triggerDataSource` stays []. Fix: in `blockScript.txt::tfTriggerOverlaysOnVisible` when pageId='sounds', call `sounds.refreshDataSource()` (NOT `loadData()`). Verify probe: `({currentPage: navigation.currentPage, triggerCount: sounds.triggerDataSource?.length})` should return 3850.

**Sound Library upstream (Gate 30k)**: gốc `myinstantsapi.zerody.one` DEAD. Forward to `myinstants.com/api/v1/instants/` with translations (q→name, results[].sound→results[].url).

### §3.2 i18n / locale switching

**12 supported locales**: en, vi, de, es, id, ja, ko, ms, pt-BR, th, tl, tr.

**End-to-end chain**:
```
User clicks flag → localization.switchLanguage(langCode)
  ↓ [OUR SHIM tfPatchSwitchLanguage]
  → validate against LANG_TO_LOCALE allowlist (12 keys)
  → set tf_locale=<UPPER> + tf_lang=<lower> cookies
  → call original switchLanguage
  ↓
Original (app.js@3522500):
  → localization.languageCode = langCode
  → settings.set('language', langCode)
  → fetch /config/localization/<lang>.json if not in tfPageloadData.localization
  ↓
location.reload() → backend detectLang(req):
  1. URL prefix /<lang>/
  2. tf_locale cookie via TF_LOCALE_TO_LANG map (VN→vi, DE→de, TH→th, ...)
  3. tf_lang cookie
  4. Accept-Language header
  5. Default '' (English)
  ↓
buildIndexHtml({lang}):
  - vi/de/es → downloads/<lang> dedicated HTML
  - other → downloads/index.html + inject <lang>.json into tfPageloadData.localization
```

**Common bugs**:
- Cookie not set → `LANG_TO_LOCALE` map in `tfPatchSwitchLanguage` missing key. Verify: `document.cookie.split('; ').filter(c => c.startsWith('tf_'))`.
- Lang shows English → backend `SUPPORTED_LANGS` set missing OR `TF_LOCALE_TO_LANG` missing entry.
- Raw keys visible → run `node scripts/extract-new-i18n.js` to update `i18n-patch.json` + `reload-html`.

**Adding new locale**: download JSON to `downloads/config/localization/` → add to `SUPPORTED_LANGS` + `TF_LOCALE_TO_LANG` (backend) + `LANG_TO_LOCALE` (blockScript) → restart Electron.

**Probe**:
```js
console.log({
  vueI18nLocale: document.querySelector('[data-v-app]').__vue_app__.config.globalProperties.$i18n?.locale,
  localizationCode: window.localization?.languageCode,
  settingsLang: localStorage.getItem('setting_language'),
  cookieLocale: document.cookie.match(/tf_locale=([A-Z]+)/)?.[1],
  cookieLang: document.cookie.match(/tf_lang=([a-z-]+)/)?.[1]
}); // All 5 should agree
```

### §3.3 Stream Profile switch

**State layers**:
```
LAYER 1: SQLite — Channels.ProfileId FK to Profiles.Id (10 profiles per channel)
LAYER 2: Backend /api/me → channel.profileId + channel.profiles[]
LAYER 3: Pinia nav store — streamProfileId (INITIAL hardcoded 1) + streamProfiles []
LAYER 4: Vue StreamProfileDropdown — renders profiles, marks profileId===active
```

**Stays on Default bug (Gate 30c)**: bundle's nav store hardcodes `streamProfileId: 1`, never reads `/api/me.channel.profileId`. Fix in `tfPiniaProTrap`:
```js
var srvProfileId = window.session?.me?.channel?.profileId;
if (Number.isFinite(srvProfileId) && srvProfileId > 0 && nav.streamProfileId !== srvProfileId) {
  nav.streamProfileId = srvProfileId;
}
```

**Switch flow**:
```
Click profile #3 → Vue handler:
  navigationStore.set('streamProfileId', 3) → optimistic UI update
  window.switchProfile(3) → POST /api/me {profileId: 3}
Backend handleMe:
  validate via hasChannelProfile → channels.updateProfileId(channelId, 3) → SQL UPDATE
  broadcast socket events: profileChanged + actionsChanged
  widgetSettings.rebuildAndBroadcast() / chatBot.refresh() / tiktokBridge.refreshGoals()
On reload: /api/me returns channel.profileId=3 → tfBridgeSessionMe seeds session.me → tfPiniaProTrap syncs nav
```

**Probe**:
```js
console.log({
  navStreamProfileId: document.querySelector('[data-v-app]').__vue_app__.config.globalProperties.$pinia.state.value.navigation.streamProfileId,
  sessionProfileId: window.session?.me?.channel?.profileId,
  sessionProfiles: window.session?.me?.channel?.profiles?.map(p=>({id:p.id,name:p.name})),
}); // All should agree
```

### §3.4 Bundle update (when gốc TikFinity pushes new build)

**Pre-update**:
```bash
cp -r downloads/combo downloads/combo.bak-$(date +%Y-%m-%d)
cp -r downloads/config/localization downloads/config/localization.bak-$(date +%Y-%m-%d)
cp decompiled/modules/deobfuscated.js{,.bak-$(date +%Y-%m-%d)}
cp backend-node/src/templates/blockScript.txt{,.bak-$(date +%Y-%m-%d)-pre-bundle}
```

**Update steps (VERIFIED 2026-06-16 trên Jun16 update, 0 gate-drift — đường này CHẠY ĐƯỢC):**
1. **Backup combo** (đã ở Pre-update) + swap: `cp captures/bundle-latest-*/{app,modules}.js captures/bundle-latest-*/modules.css downloads/combo/`
2. **Re-decompile = `webcrack`** (KHÔNG phải `wakaru` — chưa cài). ⚠️ webcrack TỪ CHỐI output-dir đã tồn tại → phải dời cũ trước:
   ```bash
   mv decompiled/modules decompiled/modules.bak-may20 ; mv decompiled/app decompiled/app.bak-may20
   NODE_OPTIONS=--max-old-space-size=6144 npx --yes webcrack downloads/combo/modules.js -o decompiled/modules
   NODE_OPTIONS=--max-old-space-size=6144 npx --yes webcrack downloads/combo/app.js -o decompiled/app
   ```
3. **★ GATE-HEALTH (bước verify quan trọng nhất) ★**: `node qa/run-all.js --only gate-health`
   - **0 fail = 0 drift** → IIFE/gate không lệch, update nhẹ (additive). Jun16: 53/53 pass.
   - **≥1 fail** = needle mất → bundle đại tu → re-anchor: grep symbol mới trong `decompiled/`, cập nhật needle ở [`qa/registry.js::gates`](qa/registry.js) + sửa IIFE liên quan trong blockScript.
4. **i18n**: `node backend-node/scripts/extract-new-i18n.js` (path ĐÚNG, không phải `scripts/`) → `curl -X POST localhost:5285/api/_dev/reload-html`.
5. **Full verify**: `npm run qa` (core API/socket/gates/chains all pass; external-libs Google-Fonts fail = cosmetic cũ, bỏ qua) → **Ctrl+Shift+R** trong app (combo cache 1h → hard-reload mới nạp) → smoke: chip 100k / connect / switch profile / mở overlay / TTS voice picker.
6. **Fail critical → rollback**: `cp -r downloads/combo.bak-*-pre-*-update/* downloads/combo/`.

**Common breakage**:
- Offsets in Gates change (symbols stable: `obsoverlays.onVisible`, `localization.switchLanguage`, etc.) → re-grep by symbol name. gate-health (bước 3) tự chỉ ra cái nào.
- New i18n keys → `extract-new-i18n.js` (bước 4).
- New page types → add to `tfTriggerOverlaysOnVisible.PAGES` array (blockScript).
- Renamed methods → grep `getElementsByClassName.*obsOverlayOnPage` → update shim.
- `tfPageloadData` shape change → update `tfI18nPreBake` selectors

> **★ BƯỚC HAY BỊ SÓT — SYNC BAKED SSR DOCS (verified 2026-06-19, bug World Cup không hiện) ★**
> Page HTML (template từng trang + **card container** từng overlay) sống trong `window.tfPageloadData` của **baked docs `downloads/{vi,index.html,de,es}`** — KHÔNG nằm trong `combo/*.js` (grep modules.js = 0 `obsOverlayContainer`/`widgetCoinmatch`). Swap combo + port Vue-dist là CHƯA đủ: nếu baked docs cũ thiếu container/template, `obsoverlays.generateWidget($("#widgetX"))` không thấy div → **card/overlay KHÔNG hiện** dù bundle mới có code. Baked docs là snapshot SSR cũ, KHÔNG tự update.
>
> Sau bundle-update thêm overlay/page, sync baked docs (đối chiếu `_goc_root.tmp.html` = `curl gốc /`):
> - **Card mới trong 1 trang** (vd worldcup/penalty trong obsoverlays): splice khối HTML vào **template string của trang đó** (sau anchor, vd `<div class="obsOverlayContainer">`).
> - **Trang mới** (vd followercounter/countdowngoals): (a) thêm object `{name:"X",hasHtml:!0,hasJs:!0,hasCss:!0,template:'...'}` vào mảng templates (sau object obsoverlays), **VÀ** (b) thêm placeholder rỗng `<div class="page" data-pageid="X"></div>` vào body (cạnh các `.page` khác). THIẾU placeholder → `navigation.currentPage` đổi nhưng `.page` div không có → **trang trắng** (đây là bug "Số người theo dõi blank").
> - **Encoding template = single-quote JS string**: `"` để PLAIN, newline = `\n` (literal backslash-n), apostrophe = `\'`. **PHẢI đọc/ghi file bằng `latin1`** (byte-safe) — `utf8` read/write làm hỏng byte non-ASCII (tiếng Việt/emoji) ở CHỖ KHÁC trong doc 800KB → `Uncaught SyntaxError: Invalid or unexpected token` (lỗi KHÔNG nằm ở khối mình chèn). Đừng dùng editor tự normalize `\n`→newline.
> - **Verify từng doc TRƯỚC khi ghi**: isolate script chứa `window.tfPageloadData=` (từ `>` của `<script` tới `</script>` kế) → `new Function(js)` không throw. Backup `.bak-...` (downloads/** = High-Risk §5). Restart backend (baked docs cache module-level). Probe: `navigation.pageChange('<pageid>')` → `.page[data-pageid=X]` có content + iframe.
> - i18n `data-str` của card mới → thêm vào `i18n-patch.json` (merge runtime; flat keys KHÔNG tự extract — xem §3.6 Tier 4).
>
> Đây là phần "card hiện sau swap" CŨ ghi SAI: overlay mới KHÔNG tự hiện sau swap combo, phải sync baked docs. Xem [[project_bundle_update_staged]].

**Regression sequence after update** (run in order):
1. Splash → home (no "HTTP Communication Error")
2. Topbar chip "100k"
3. Profile dropdown + PRO badge
4. Language switcher VN → EN → TH → VN
5. Stream profile switch + reload persists
6. TikTok connect + LIVE badge
7. Overlays page (17+ cards with iframes)
8. Goals page (similar)
9. TTS voice picker (118 voices)
10. Welcome Quick Access (3 cards)

**Rollback**: `rm -rf downloads/combo && mv downloads/combo.bak-<date> downloads/combo && taskkill /F /IM electron.exe`.

### §3.5 CDN cache (gift images / animations / flag-icons)

**Existing proxies** in `backend-node/src/index.js`:
- `/flag-icons/*` → jsdelivr (Gate 24)
- `/widget/streambuddies/*` → tikfinity.zerody.one (asset proxy)
- `/myinstants-proxy/*` → myinstants.com (Gate 30k)
- `/tiktok-img-cache/<host>/<path>` → `*.tiktokcdn.com` (M-001 2026-05-28) — strict SSRF guard

Shared helper `cdnProxyFetch(req, res, cacheKey, upstreamUrl)` with 24h in-memory `_cdnProxyCache` Map + `Cache-Control: public, max-age=86400` so Electron HTTP disk cache persists across restarts.

**Pre-warm service** `services/tiktok-image-prewarm.js` (M-001): on backend boot, fetch top 200 popular gift images (sorted by diamond_count ASC), populate `_cdnProxyCache` directly. Throttled to concurrency 10, fire-and-forget.

**Pattern for new CDN proxy**:
1. Add route in `index.js` calling `cdnProxyFetch` with cacheKey + upstreamUrl
2. Restrict host via regex (SSRF guard)
3. If bundle bypasses proxy (uses direct CDN URLs) → add Electron `webRequest.onBeforeRequest` redirect in `electron/main.js`

### §3.6 Dịch ngược bundle + ghép nối data ĐỒNG NHẤT (full RE→wire playbook)

> **Mục đích (user directive 2026-06-19):** ghi CHI TIẾT 2 việc hay sinh "lỗi lum la" khi thêm/sửa 1 overlay-feature từ bundle mới:
> **(A)** dịch ngược (decompile + đọc) mã bundle obfuscated để biết feature CHẠY thế nào;
> **(B)** ghép nối data theo đúng N-tier để mọi đầu (control-page ↔ backend ↔ widget ↔ i18n ↔ QA) **đồng nhất**, không sót đường nào.
> Worked example xuyên suốt = **Countdown Goals** (overlay Jun16) — đã trace + wire + verify 200 end-to-end 2026-06-19. Theo y hệt thứ tự này cho overlay kế tiếp.

#### PHẦN A — DỊCH NGƯỢC (obfuscated combo → readable → tìm chuỗi của 1 feature)

**A0. Có sẵn gì (đừng decompile lại nếu chưa update bundle):**
- `downloads/combo/{app,modules}.js` = obfuscated GỐC (đang chạy). KHÔNG đọc trực tiếp.
- `decompiled/modules/deobfuscated.js` (~945KB) + `decompiled/app/deobfuscated.js` = **webcrack output readable** — đây là nơi grep. modules.js chứa overlay/widget logic (`obsoverlays`, `goals`, `countdowngoals`, `coinJar`…); app.js chứa Vue topbar/nav/i18n/transport wrap. Symbol có thể ở 1 trong 2 → grep CẢ HAI.
- `docs/API_CONTRACTS.md` / `COMPLETE_ENDPOINT_INDEX.md` / `BUNDLE_CALL_FLOW.md` = shape + flow đã catalogue (đọc TRƯỚC khi guess shape).

**A1. Re-decompile (CHỈ khi bundle vừa swap — xem §3.4 bước 2):** `webcrack` (KHÔNG wakaru), phải dời output-dir cũ trước, `NODE_OPTIONS=--max-old-space-size=6144`. webcrack = deobfuscate + un-minify + split module; **read-only artifact**, đừng sửa tay.

**A2. Tìm chuỗi của 1 feature — luôn xác định 4 mắt xích (LUẬT VÀNG: grep symbol, đừng đoán):**

| Mắt xích | Câu hỏi | Cách grep (ví dụ countdowngoals) |
|---|---|---|
| **① Control emit** | Control-page bắn data đi qua event tên gì, payload shape ra sao? | `grep -n 'countdowngoals.emitStatus = function' decompiled/modules/deobfuscated.js` → thấy `socketiowrapper.emitSocketEvent("countdownGoalsStatus", {status, config})` |
| **② Transport class** | emit này đi đường nào trong 3 lớp (xem A3)? | event đi qua `emitSocketEvent` → bundle wrap thành `io.emit("distributeEvent", name, payload)` (app deob ~70895). → cần backend RELAY |
| **③ Widget listen** | Widget standalone nghe event nào, đọc field nào? | đọc shell gốc `curl -s https://tikfinity.zerody.one/widget/countdowngoals.html` → `io.on("countdownGoalsStatus", updateFromPayload)`, đọc `payload.status[metric]` |
| **④ Render entry** | Widget mount bằng hàm nào, file Vue dist nào? | shell gốc: `window.createCountdownGoals().mount("#app")` + `<script type=module src="/vue/dist/widgets/countdown-goals/countdown-goals.js">` → `grep -c createCountdownGoals` trong file dist |

> **Vì sao phải đọc SHELL GỐC widget (`curl` html gốc), không tự chế:** shell chứa inline script (metric param, io.on, preview(), mount) = HỢP ĐỒNG giữa Vue-dist và socket. Tự viết lại dễ sai tên event/field → widget câm. Clone = COPY shell gốc, chỉ đổi 2 lib CDN→`/js/lib/*` (xem PHẦN B Tier 1). Đây là READ-GỐC-FIRST gate áp cho widget.

**A3. BA LỚP TRANSPORT (gốc rễ của "data lúc ăn lúc không" — phải phân loại đúng event):**

| Lớp | Bundle gọi | Đi đâu | Backend phải làm | Dấu hiệu |
|---|---|---|---|---|
| **1. Socket relay** | `emitSocketEvent(name,p)` → wrap `distributeEvent` | control→backend→widget | **RELAY**: thêm `name` vào `RELAYABLE_DISTRIBUTE` (socket-manager.js); target LUÔN `appType='widget'`, KHÔNG echo controlpage | test-FX, goalStatus, **countdownGoalsStatus** |
| **2. DAPI/emitWsEvent** | `emitWsEvent(...)` | Electron DAPI transport (khác socket) | KHÔNG đụng — live gift/like đi đường này, backend act vào = **double-fire** | live gift/like (`isTest` absent) |
| **3. REST + broadcast** | `fetch('/api/...')` | backend route → `broadcast(event)` | route phải có ĐỦ verb + tên event hyphen ĐÚNG | follower/me/settings/actions |

> ⚠️ Cùng 1 feature có thể có CẢ 3 (vd coin-jar: test=lớp1, live gift=lớp2, HTTP reset=lớp3). Sai lớp = "lúc ăn lúc không". Verify bằng: live đi đường nào (đừng relay nhầm → double), test đi đường nào (phải relay).

#### PHẦN B — GHÉP NỐI ĐỒNG NHẤT (N-tier checklist — wire 1 overlay mới, KHÔNG sót đường)

> Làm ĐỦ 6 tier theo thứ tự. Mỗi tier có **error-signature** (bỏ sót → triệu chứng gì). Đây là chống "lỗi lum la": lỗi luôn là 1 tier bị quên, không phải bí ẩn.

| Tier | Việc | File | Bỏ sót → triệu chứng |
|---|---|---|---|
| **T1. Widget shell** | Clone shell gốc → `downloads/widget/<name>.html`. ĐỔI jQuery+socket.io từ CDN ngoài → `/js/lib/{jquery.min,socket.io.min}.js`. GIỮ nguyên inline script (metric param, io.on, mount, preview). Giữ `sharedio/sharedio.js` + `socketioclient.js?v=10` (relative). | `downloads/widget/<name>.html` | OBS/standalone **treo** (CDN blocking); hoặc widget câm (sai event name). |
| **T2. Vue dist + auto-sync** | Tải `/vue/dist/widgets/<dir>/<file>.js` từ gốc về local. Thêm 1 entry vào `FIXTURES` (`localPath`,`upstream`,`validate:/createX/`) để boot tự refresh + seasonal-safe (404→giữ local). | `downloads/vue/.../<file>.js` + `services/bundle-fixtures-sync.js` | Widget mount fail (`createX is not a function`); hoặc stale sau bundle update. |
| **T3. Transport wiring** | Theo lớp A3: **lớp1** → thêm event vào `RELAYABLE_DISTRIBUTE`. **lớp3** → thêm route + verb + broadcast. **lớp2** → KHÔNG làm gì. | `services/socket-manager.js` HOẶC `routes/*.js` | Bấm test/đổi goal KHÔNG ra FX (event bị drop ở relay). |
| **T4. i18n** | Sau swap: `node backend-node/scripts/extract-new-i18n.js`. ⚠️ key phẳng underscore (`menu_countdowngoals`) KEY_RE (≥1 dot) KHÔNG bắt → **tự thêm tay** vào `i18n-patch.json` (flat `{key:value}` tiếng Việt) + đảm bảo `downloads/config/localization/*.json` (12 locale) có key. `POST /api/_dev/reload-html`. | `templates/i18n-patch.json`, `config/localization/*.json` | Sidebar/menu hiện **raw key** (`menu_countdowngoals`). |
| **T5. QA registry** | Thêm `<name>` vào mảng `widgets` (L3 smoke: 200 + no CDN-block + no debug log). Nếu có proxy data → thêm L1 API check. | `qa/registry.js` | Update sau làm câm widget mà `npm run qa` không bắt. |
| **T6. Verify chạy thật** | `curl -w '%{http_code}' /widget/<name>?cid=1&preview=1` = 200; mọi asset (`vue`,`/js/lib`,`sharedio`,`socketioclient`,`text-effects`) = 200; grep HTML không còn `src="https://(code.jquery|cdnjs)"`. Rồi Ctrl+Shift+R + bấm test. | — | Claim "xong" mà chưa chạy = vi phạm §1.11. |

**Bảng card overlay xuất hiện ở control-page:** overlay mới = card hiện SAU khi swap combo (bundle-native render, vd Jun16). Nếu chưa thấy card → cần bundle update (§3.4), KHÔNG tự chế card.

**Đối chiếu nhanh "data có đồng nhất không" (1 câu hỏi mỗi đầu):**
- Control emit event `X` ⟷ widget `io.on('X')` — **cùng string?** (case-sensitive).
- Payload control gửi `{status:{[metric]:…}}` ⟷ widget đọc `payload.status[metric]` — **cùng path?**
- Setting key control ghi `widget_<id>_<name>` → strip → `<id>_<name>` ⟷ widget đọc `settings['<id>_<name>']` — **cùng key sau strip?**
- 3 đường points-strip (settings.js/me.js/widget-settings-cache.js) — **cả 3 cùng strip** `pointsmeta_/points_user_/dynamicsettings`? (sót 1 = 6MB → blank page).

> 3 dấu ⟷ lệch = "lỗi lum la". Check 3 câu này TRƯỚC khi probe iframe.

---

## §4 Anti-patterns + DOs/DON'Ts

### ✅ DO

- Read CLAUDE.md Gate list before investigating any UI bug
- Grep `decompiled/modules/deobfuscated.js` for symbol names (e.g. `stretchIframes` not `stretchIframe`)
- Trust bundle's native behavior — clone role is to FILL GAPS, not override
- Use `reload-html` endpoint for template iteration
- Backup `.bak-YYYY-MM-DD-<reason>` before risky edits
- Set state via Pinia plain assignment (`nav.X = value`) — NOT defineProperty (Gate 30a)
- For Vue-rendered text overrides: use `data-tf-*` attribute on `<html>` + CSS `::before content` (Gate 16)
- For pre-warm CDN: fire-and-forget on boot, throttled concurrency, in-memory cache (M-001)

### ❌ DON'T

- Hardcode values without checking gốc behavior first (user explicitly rejected — Gate 30d)
- Modify `downloads/combo/*` (lost on bundle update — modify templates instead)
- Override CSS that bundle already controls (use bundle's responsive rules first)
- Trust `setTimeout` for race conditions — use MutationObserver or polling with stop condition
- Use `defineProperty` on Pinia state — Vue 3 reactive proxy doesn't fire (Gate 30a)
- Skip mission DECLARE step
- Spawn agent with file ownership overlap
- Reply "done nha" — Mission Report must be structured Markdown
- Set `tts.proCredits` directly without `syncNavigationStoreCredits()`
- Inject lang JSON without `</script>` escape (XSS)
- Skip the `tfPiniaProTrap` setInterval — re-applies isPro after Vue resets

### Bundle UI override priority (CLAUDE.md §1.00)

When bundle obfuscated render khác mong đợi, apply theo PRIORITY:

| Priority | Pattern | When | File |
|---|---|---|---|
| 1 | **Backend response fix** | Bundle reads field from HTTP response API with wrong shape | `routes/*.js`, mock `/api/*` |
| 2 | **Pinia/store force-patch** | Bundle reads from Pinia/window that response doesn't update | `blockScript.txt` IIFE periodic 2s |
| 3 | **data-* attribute + CSS** | Bundle renders hardcoded text Vue re-renders override JS mutation | `data-tf-*` on `<html>` + earlyCss |
| 4 | **CSS pseudo override** | Bundle renders fixed string visual-only change | `font-size:0` + `::before content` |
| 5 | **DOM MutationObserver** | Last resort dynamic text. Must throttle ≥100ms | `blockScript.txt` IIFE |
| ❌ | Patch bundle's render fn | NEVER — obfuscated, fragile per bundle update | — |
| ❌ | Set Pinia wrong type | E.g. `proCredits: '100k'` string — break math | — |

Choose lowest-priority pattern that solves problem. CSS > JS observer.

---

## §5 Verification before completion (CLAUDE.md §1.11)

**Trước khi claim "fixed":**
- Screenshot/probe current working state of related surface areas
- List features đang WORK
- Backup files đã edit

**Sau mỗi edit (TỪNG file, không batch):**
- Restart Electron (hoặc Ctrl+R nếu file static)
- Verify regression matrix: chip 100k, profile switch dropdown, Connect button, voice picker (AI/Pro/Free tabs), chat+gift+TTS

**Nếu verify FAIL bất kỳ feature nào:**
- REVERT immediately, KHÔNG add patch
- Document regression as new Gate
- Hỏi user direction before continuing

### §5.1 TEST DISCIPLINE — sổ SUCCESS/LOG + "tại sao OK rồi chạy lại lỗi" (user directive 2026-06-05)

**2 sổ song song (đọc CẢ HAI trước khi test/fix):**
- ✅ **[TEST_STATUS.md](../../../TEST_STATUS.md)** = SUCCESS registry — mục nào ĐÃ verify chạy + bằng chứng (log dòng / DB query / nhìn). PASS chỉ ghi khi CÓ BẰNG CHỨNG, không cảm tính.
- ⚠️ **[FIXLOG.md](../../../FIXLOG.md)** = LOG — lỗi + dead-end đã thử + fix (luật 3-strike §6.1 CLAUDE.md).
- **Cái mới đáng tái dùng** → ghi vào skill này (mục tương ứng) hoặc Gate CLAUDE.md.

**⚠️ TẠI SAO TEST OK LÚC ĐẦU MÀ CHẠY LẠI LỖI (8 nguyên nhân, evidence-backed — đây là thủ phạm "fix đi fix lại"):**
1. **Sửa backend/blockScript nhưng KHÔNG restart** → reload widget KHÔNG nạp blockScript/backend mới. "Test OK" = code CŨ vẫn chạy; lỗi chỉ lộ sau restart. (Save-fix tốn nhiều vòng vì cái này.)
2. **Cache `?v=` widget** — `socketioclient.js?v=10`. Sửa widget HTML nhưng iframe/browser serve bản CACHED → fix không áp khi re-test. Backend `[Cache] HTTP cache cleared on boot` chỉ chạy lúc RESTART. → hard-reload (Ctrl+Shift+R) hoặc bump `?v`.
3. **State tích lũy** — coin-jar/cannon đầy dần. Fresh (rỗng) OK; chạy lâu (đầy) lag/crash. KHÔNG phải regression — phụ thuộc state. Phải test cả fresh LẪN sau-tích-luỹ.
4. **`settings.restored` flip false** — `settings.save()` chạy lần đầu (restored=true sau restore), lần sau restored=false → save im lặng skip → "lưu được rồi tự nhiên hết lưu". (Đã fix autosave tự set restored=true.)
5. **Race condition** — vd ranking `template.clone()` null: tuỳ ajax-success có thắng template-init không → non-deterministic, lúc pass lúc fail. → test ≥3 lần.
6. **Socket reconnect/handshake** — connect đầu OK; reload/reconnect widget có thể KHÔNG re-push settings (RC-A) → widget hiện giá trị cũ → "đổi setting không ăn". 
7. **Profile switch** — đổi profile = DB values khác (profile 2/3 có `cannon_ballsize` khác profile 1) → behavior khác.
8. **App close/reopen** — in-memory reset nhưng localStorage persist → trạng thái lai.

**✅ CHECKLIST RE-TEST DETERMINISTIC (chạy trước khi claim PASS):**
- [ ] Sửa `backend-node/` hoặc `blockScript/earlyCss/socket-manager/index.js` → **RESTART Electron** (`taskkill /F /IM electron.exe` + relaunch). Reload widget KHÔNG đủ.
- [ ] Sửa `downloads/widget/**` → reload widget; nghi cache → **Ctrl+Shift+R** / bump `?v`.
- [ ] Stateful widget (coin-jar/cannon/wheel) → test **fresh** + **sau khi đầy**.
- [ ] Settings → clear `localStorage cachedSettings`, query DB xác nhận persist, **note profile đang dùng**.
- [ ] Verify bằng **bằng chứng cụ thể** (log dòng / DB / nhìn) → ghi TEST_STATUS. KHÔNG "cảm giác OK".
- [ ] Renderer `console.log` KHÔNG forward (electron main.js level<2) → diagnostic phải `console.warn`.

### §5.2 BẪY CHẨN ĐOÁN — đo/đọc SAI → kết luận SAI (validate 2026-06-05: nhóm tốn TIME nhất, hơn cả bug thật)

> Phân tích lại mọi lỗi đã gặp: nhóm 🔴 flaky đã có §5.1 lo; nhưng các vòng lặp phí nhiều nhất đến từ **chẩn đoán sai** — không phải bug khó, mà tôi **đo nhầm/đọc nhầm** rồi kết luận lệch. 4 bẫy (mỗi cái là 1 vụ thật):

1. **Đọc nhầm NGUỒN DATA.** Query DB `tikfinity-desktop/tikfinity.db` (172KB stale) thay vì THẬT `%APPDATA%/tikfinity-desktop/tikfinity-data/tikfinity.db` → kết luận "save không persist" (SAI). → **LUÔN xác nhận path** (config `TIKMAX_DATA_DIR`, boot log `[BOOT] DB path:`) trước khi tin số liệu.
2. **LOG VÔ HÌNH.** `console.log` renderer KHÔNG forward (electron main.js `console-message` level<2 drop) → "0 log = code không chạy" (SAI, chỉ là không thấy). → diagnostic renderer **phải `console.warn`**; backend log luôn thấy.
3. **"ĐÚNG TRÊN GIẤY" (static misled).** Đọc code thấy chuỗi đúng (reset 5-lớp / settings-chain) → kết luận OK, runtime lại fail. → **bug runtime PHẢI có runtime evidence** (instrument log/probe/DB), đừng tin 100% static-trace. Workflow 5-lớp "đúng trên giấy" = tín hiệu PHẢI chuyển sang runtime.
4. **SỬA NHẦM BẢN COPY.** Gỡ log ở `socketioclient.js` (file chung) trong khi mỗi widget **NHÚNG INLINE** bản copy → vô dụng. → **xác nhận file THẬT được serve/load** (`curl <url> | grep`) trước khi sửa; nhớ flat-vs-dir + inline-embed.

**Quy tắc rút ra:** trước khi kết luận "X không hoạt động" → hỏi *"mình đang đo ĐÚNG CHỖ không?"* (đúng DB? log có forward? file đang serve là file mình sửa? static hay runtime?). Sai 1 trong 4 = phí nhiều vòng.

---

## §6 War-room quick reference

`.codex/team/` files:
- `current_mission.md` — active mission status (Commander writes)
- `current_state.json` — machine-readable team roster + mission state
- `decisions.md` — append-only log
- `mission-NNN-reconciliation.md` — Commander synth after agents complete
- `scout-*-report.md` — per-Scout findings
- `*.bak-*` — historical states (gitignored)

Cross-agent links: `[[scout-app#section-id]]` markdown anchors.

---

## §7 Skills + tools available

**Specialized agent types** (per role in §1):
- Plan, code-explorer, Explore, planner, architect — research/planning
- general-purpose, refactor-cleaner — implementation
- code-reviewer, security-reviewer, typescript-reviewer, python-reviewer, go-reviewer — review
- build-error-resolver, tdd-guide, e2e-runner — verify
- doc-updater — docs
- performance-optimizer, database-reviewer, silent-failure-hunter — specialists

**Framework skills THẬT đang cài** (đã verify tồn tại 2026-06-05 — "superpower skills" cũ như `systematic-debugging`/`test-driven-development`/`verification-before-completion` **KHÔNG tồn tại**, đã gỡ reference):
- `tdd-workflow` — feature / bugfix / refactor (test-first)
- `verification-loop` — trước khi claim done
- `agent-introspection-debugging` — khi agent/loop fail, self-debug
- `council` — quyết định mơ hồ / nhiều phương án tradeoff
- `iterative-retrieval` — refine context cho subagent
- `code-tour` / `code-explorer` — giải thích kiến trúc 1 feature
- **Debug TikMax cụ thể KHÔNG cần skill ngoài** → dùng quy trình nội bộ: [FIXLOG.md](../../../FIXLOG.md) (3-strike) + [TEST_STATUS.md](../../../TEST_STATUS.md) + §5.1 (8 nguyên nhân pass-then-fail) + §2 Hot-reload matrix.

This is THE skill file for TikMax. Old split files (tikmax-core, tikmax-doctrine, tikmax-tts-debug, tikmax-debug-locale, tikmax-profile-switch, tikmax-bundle-update) **DEPRECATED** as of 2026-05-28 — content merged here.
