---
name: tikmax
description: ONE master skill for TikMax (TikFinity clone). Covers Space Marine doctrine (8-10 agent team, ALWAYS-ON, Commander autonomy), project architecture, HTML injection pipeline, hot-reload matrix, and operating playbooks for TTS / i18n / profile switch / bundle update / Sound Alerts. Replaces previous 6 split skills (tikmax-core, tikmax-doctrine, tikmax-tts-debug, tikmax-debug-locale, tikmax-profile-switch, tikmax-bundle-update) into a single file to avoid Claude reading wrong skill.
when_to_use: ANY task in TikCloneMax repo. Read this entire file once per session before touching code.
---

# TikMax — Master Skill

> Project: Electron + Node + Express + Socket.IO + bundled gốc TikFinity frontend (Vue 3 obfuscated + jQuery legacy modules) + SQLite.
> Goal: app stability first. Every change passes mission protocol below.

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

**Update steps**:
1. Drop new bundle files into `downloads/combo/` + per-locale HTMLs
2. Re-decompile: `wakaru downloads/combo/modules.js -o decompiled/modules/deobfuscated.js`
3. Re-extract i18n keys: `node scripts/extract-new-i18n.js`
4. Refresh voice catalog if endpoint shape changed
5. Restart Electron

**Common breakage**:
- Offsets in Gates change (symbols stable: `obsoverlays.onVisible`, `localization.switchLanguage`, etc.) → re-grep by symbol name
- New i18n keys → run `extract-new-i18n.js`
- New page types → add to `tfTriggerOverlaysOnVisible.PAGES` array
- Renamed methods → grep `getElementsByClassName.*obsOverlayOnPage` → update shim
- `tfPageloadData` shape change → update `tfI18nPreBake` selectors

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

**Superpower skills** (use as framework, not replacement):
- `systematic-debugging` — bug, test fail, unexpected behavior
- `test-driven-development` — feature, bugfix, refactor
- `writing-plans` — multi-step / high-risk
- `verification-before-completion` — before claim done
- `receiving-code-review` — when user says fix isn't right

This is THE skill file for TikMax. Old split files (tikmax-core, tikmax-doctrine, tikmax-tts-debug, tikmax-debug-locale, tikmax-profile-switch, tikmax-bundle-update) **DEPRECATED** as of 2026-05-28 — content merged here.
