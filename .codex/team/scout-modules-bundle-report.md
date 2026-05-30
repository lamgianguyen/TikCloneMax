# Scout-Bundle-Modules Report

> Mission: M-2026-05-27-001-bundle-scouts
> Source: decompiled/modules/deobfuscated.js (24976 lines, webcrack output)
> Generated: 2026-05-27

---

## modules-catalogue

All modules declared as plain var objects in non-strict scope (globally accessible). NO central dispatcher exists in modules.js. All lifecycle hook calls come from app.js. See [[scout-app#dispatcher]].

| Module | Decl line | init() | onVisible() | onChannelContextChanged() | Other key fns |
|--------|-----------|--------|-------------|--------------------------|---------------|
| start | L700 | YES L709: dxButtons, refreshLiveChannels, 5min poll | YES L944: refreshLiveChannels + showItems + runPreview | YES L850: quickAccessArea, initQuickAccessItems, activePromotions | initQuickAccessItems L779, showItems L953, onHide |
| setup | L1488 | YES L1501: login/connect dxButtons, setup form | YES L2653: shakes loginSection if no session | YES L1796: createPaymentUi, connection toggle, manualConnect | createPaymentUi, showProActivationSuccessAlert, doImport/doExport |
| chatbot | L3964 | YES L3978: initCustomSnippets, initSnippetGrid(dxDataGrid), dxCheckBox | NONE | YES L4031: shows/hides banners and approval notice | initSnippetGrid, onChat |
| chatcommands | L4150 | YES L4154: all dxCheckBox/dxTextBox for chat commands | NONE | NONE | handlePointsCommand, handleTransferCommand, handleHelpCommand, onChat |
| tts | L4441 | YES L5361: TTSQueue, intervals, all dxInput widgets | YES L6380: channelId===0 triggers test+shake | YES L6028: setProVoicesHint, loadAiVoiceState, template migration | speak, applyAiCreditsFromApiUser L4606, syncNavigationStoreCredits |
| actionsandevents | L6399 | YES L6507: loads events/timer; channelId==0 calls onChannelContextChanged | YES L6666: refreshActions(500ms), updateDimensions | YES L6650: builds ALL 4 grids: initTimerGrid/ActionGrid/EventGrid/ScreenGrid | initActionGrid/EventGrid(dxDataGrid), getAllGifts, getAllEmotes |
| sounds | L12921 | YES L12932: loads soundsDataSource; channelId===0 calls onChannelContextChanged | YES L13013: shakes pro warning, updateDimensions | YES L12996: calls refreshDataSource() loads 3850 triggers assigns triggerDataSource + loadData | refreshDataSource L12971, loadTriggers L13036, loadData, setGridLoading |
| user | L13699 | YES L13857: EMPTY STUB | YES L13854: setTimeout(refreshUserList,1000) | YES L13858: if no dataGrid: setTimeout(refreshUserList,1000) | refreshUserList builds dxDataGrid #dataGridUser |
| transactions | L13870 | YES L14009: dxButton add/submit/cancel | YES L14006: setTimeout(refreshTransactionList,1000) | YES L14027: if no dataGrid: setTimeout(refreshTransactionList,1000) | refreshTransactionList builds dxDataGrid #dataGridTransactions |
| challenge | L14116 | YES L14120: dxTextBox+2 dxButtons; channelId==0 calls onChannelContextChanged | NONE | YES L14143: shows .challengeEnabled/.challengeDisabled, menu badge | start, stop, updateStats |
| wheel | L14211 | YES L14220: dxNumberBox/dxButton; dxDataGrid #wheelCustomSegmentList | NONE | NONE | testSpinWidget, currentSpin tracking |
| coindrop | L14782 | YES L14790: dxNumberBox inputs | NONE | NONE | run, automationInterval |
| obsoverlays | L14908 | YES L19261: ALL generateWidget() calls; EARLY-RETURN if navigation.currentPage != obsoverlays | YES L19447: init() then stretchIframes()(async PLURAL) | YES L19444: calls init() | generateWidget, stretchIframes L19360(PLURAL), fetchTopGifter |
| goals | L20670 | YES L20736: initGoalMetric for 10 goal types, emitStatus, setIntervalFix | YES L20803: runs each frameGenerator | YES L20800: calls init() | initGoalMetric(dxNumberBox+dxSelectBox), emitStatus |
| graphicoverlays | L21353 | YES L21636(async): waits session.me polling, builds controls | YES L21721: navigation.setSubMenuItems(), runs frameGenerators | YES L21633: calls init() | saveData, async init with session.me wait |
| giftoverlays | L21957 | YES L21998(async): EARLY-RETURN if no session.me; initGoalMetric; at L22097 calls onVisible() internally | YES L22572: runs frameGenerators, restores iframe src | YES L22148: calls init() | initGoalMetric(dxNumberBox+dxSelectBox), topGiftStatus |
| lastx | L22583 | YES L22615: if currentPage===lastx calls onVisible; loads lastXData, dxNumberBox | YES L22665: generateOverlays() | YES L22668: if currentPage===lastx: generateOverlays() | generateOverlays, emitStatus, overlays dict |
| halving | L22767 | YES L22772: dxNumberBox, dxButton, recalculate() | NONE | YES L22788: refreshLastExecutionTimestamp | execute, recalculate |
| rtmpgen | L22832 | YES L22836: HIDES menu item if no channelId; 2 readOnly dxTextBox, 2 dxButton | NONE | YES L22933: HIDES [data-pageid=rtmpgen] (counter-intuitive!) | retrieveStreamKey |
| timer | L23075 | YES L23123: start/pause/stop dxButton, dxNumberBox | YES L23309: initOverlayPreview() via obsoverlays.generateWidget() | YES L23300: initOverlayPreview() | initOverlayPreview, calcState, emitState |
| songrequests | L23402 | YES L23432: dxButton/dxCheckBox/dxNumberBox; spotifyapiwrapper.init()+getAccessToken | YES L23595: setTimeout(updateHistory,500), clears menu badge | YES L23574: starts 4 intervals: checkPlaybackState/addToQueue/setCurrentDevice/pushState | updateHistory(dxDataGrid #songRequestHistoryGrid) |
| likeathon | L24268 | YES L24273: dxCheckBox/dxSlider/dxButton; channelId===0 initOverlay; reduceInterval | YES L24300: initOverlay() | YES L24303: initOverlay() | initOverlay via obsoverlays.generateWidget for topliker |
| obsdocks | L24349 | YES L24352: channelId===0 calls onChannelContextChanged | NONE | YES L24357: generateDock for activity-feed1 and activity-feed2 | generateDock, getDockPath |
| christmasevent | L24441 | YES L24456: checks posthog flag christmas-2025; mounts Vue app; first-time modal | NONE | YES L24820: calls setup() | setup, sendUpdate, acceptTerms |

Notes:
- points: In blockScript PAGES array but NO var points module in deobfuscated.js. Silently no-ops via isReady() guard. See [[scout-app#points]].
- chatcommands: init() only. No onVisible/onChannelContextChanged. Shares chatbot page.
- spotifyapiwrapper: Referenced in songrequests.init() but NOT in deobfuscated.js. See [[scout-app#spotifyapiwrapper]].
- coinMatch/coinJar/fallingSnow: Referenced in obsoverlays.init() L19355-19358 but not in deobfuscated.js. Loaded from downloads/vue/dist/widgets/ by app.js.
---

## hook-firing-trace

The clone dispatcher lives in  as  (L582). It is NOT a full replacement for app.js lifecycle management.

### PAGES wired in blockScript (9/24)



 has NO module in deobfuscated.js — it is a silent no-op.

### tryFire() behaviour per wired module

| Module | init() called? | onVisible() called? | onChannelContextChanged() called? | Special side-effects |
|--------|---------------|--------------------|------------------------------------|----------------------|
| start | YES (once, __tfPageInits guard) | YES | NO | initQuickAccessItems() injected separately |
| obsoverlays | YES | YES | NO | stretchIframes() fired after 500ms; navigation.currentPage pre-set to avoid early-return |
| goals | YES | YES | NO | none |
| graphicoverlays | YES | YES | NO | async init — frameGenerators filled asynchronously |
| sounds | YES | YES | NO (CRITICAL) | Gate 30j fix: blockScript manually calls sounds.refreshDataSource() after onVisible |
| actionsandevents | YES | YES | NO (CRITICAL) | All 4 data grids are null at onVisible() for existing users (channelId != 0) |
| chatbot | YES | NO | NO | init() only; blockScript does not call onVisible for chatbot |
| points | YES (no-op) | YES (no-op) | NO | isReady() returns false; silently skipped |
| setup | YES | YES | NO | onChannelContextChanged builds payment UI — never called by clone |

### 15 modules NOT wired in blockScript PAGES

tts, user, transactions, challenge, wheel, coindrop, giftoverlays, lastx, halving, rtmpgen, timer, songrequests, likeathon, obsdocks, christmasevent

For all 15: NO init(), NO onVisible(), NO onChannelContextChanged() is ever called by blockScript. These pages render blank HTML with no widgets initialised.

### Key side-effect chains

-  → calls  → assigns  (3850 items). If not called, sounds trigger dropdown is empty. blockScript Gate 30j fix patches this by calling  directly after .
-  → builds all 4 grids. If not called before ,  calls  at 500ms against null grid objects.
-  has  — blockScript MUST set  before calling init().
-  is an async generator; it calls  internally at L22097 after async setup completes. blockScript-triggered onVisible() before init() completes will fire against un-initialised frameGenerators.
-  builds the payment UI and connection toggle. Never called by clone — payment/subscription UI is always in initial state.


---

## devextreme-widget-builders

All DevExtreme widgets are built inside module init()/onChannelContextChanged() functions. None are built at declaration time.

### dxDataGrid instances

| Widget ID / selector | Built in | Module fn | dataSource | Large-data risk |
|----------------------|----------|-----------|-----------|-----------------|
| #dataGridUser | user.onChannelContextChanged() L13858 | refreshUserList() | API: /api/users | Low — paginated by DevExtreme |
| #dataGridTransactions | transactions.onChannelContextChanged() L14027 | refreshTransactionList() | API: /api/transactions | Low — paginated |
| chatbot snippet grid | chatbot.initSnippetGrid() L3978 | initSnippetGrid() | local array: customSnippets | Low |
| actionsandevents timer grid | actionsandevents.initTimerGrid(#onPageTimerContainer) L6650 | initTimerGrid() | API timers | Medium |
| actionsandevents action grid | actionsandevents.initActionGrid(#onPageActionContainer) L6650 | initActionGrid() | API actions | Medium |
| actionsandevents event grid | actionsandevents.initEventGrid(#onPageEventContainer) L6650 | initEventGrid() | API events | Medium |
| actionsandevents screen grid | actionsandevents.initScreenGrid(#onPageScreenContainer) L6650 | initScreenGrid() | API screens | Medium |
| wheel custom segments #wheelCustomSegmentList | wheel.init() L14220 | init() | local array | Low |
| song request history #songRequestHistoryGrid | songrequests.onVisible() L23595 | updateHistory() | API history | Low |

### dxSelectBox / dxDropDownBox instances with large-data risk

| Location | Module fn | dataSource | Item count | Risk |
|----------|-----------|-----------|-----------|------|
| sounds trigger dropdown | sounds.loadData() | triggerDataSource (Gate 30j fixed) | 3850 | HIGH — FIXED in blockScript via ArrayStore + pageSize:50 |
| actionsandevents event dialog gift picker | actionsandevents.initEventGrid() inline | getAllGifts() | ~3845 | HIGH — NOT virtualized |
| giftoverlays goal gift picker | giftoverlays.initGoalMetric() | getAllGifts() / session emotes | ~3845 | HIGH — NOT virtualized |
| goals metric type dxSelectBox | goals.initGoalMetric() L20736 | local ~15 items | 15 | Low |
| graphicoverlays overlay picker | graphicoverlays.init() | local overlays array | <50 | Low |

### dxButton instances (key ones)

| Label / purpose | Module | fn |
|----------------|--------|----|
| Connect / Login | setup.init() L1501 | manualConnect / doLogin |
| Add Transaction | transactions.init() L14009 | dxButton addTransaction |
| Start/Stop Challenge | challenge.init() L14120 | challenge.start / challenge.stop |
| Test Spin | wheel.init() L14220 | testSpinWidget |
| Retrieve Stream Key | rtmpgen.init() L22836 | retrieveStreamKey |
| Timer Start/Pause/Stop | timer.init() L23123 | calcState / emitState |
| Import/Export (setup) | setup.init() | doImport / doExport |

### dxPopup / dxFileUploader

| Widget | Module | Purpose |
|--------|--------|---------|
| dxFileUploader (sound files) | sounds.init() | upload .mp3/.wav sound files |
| dxPopup (pro activation) | setup.init() | showProActivationSuccessAlert |
| dxNumberBox (wheel segments) | wheel.init() L14220 | min/max points per segment |
| dxNumberBox (coindrop) | coindrop.init() L14790 | coin drop amounts |
| dxNumberBox (timer) | timer.init() L23123 | timer duration |
| dxCheckBox (chatbot) | chatbot.init() L3978 | enable/disable bot features |
| dxCheckBox (tts) | tts.init() L5361 | TTS enabled/per-type toggles |
| dxSlider (likeathon) | likeathon.init() L24273 | like threshold |


---

## cross-module-calls

Direct calls from one module object's function into another module object's function.

| Caller module.fn | Called module.fn | When | Notes |
|-----------------|-----------------|------|-------|
| actionsandevents.init() | actionsandevents.onChannelContextChanged() | init() when channelId===0 | Grid bootstrap for new users only |
| actionsandevents.onVisible() | actionsandevents.refreshActions() | 500ms after visible | Refresh all 4 grids |
| actionsandevents.initEventGrid() | sounds.triggerDataSource | onChannelContextChanged | Reads sounds.triggerDataSource for event sound picker |
| sounds.init() | sounds.onChannelContextChanged() | init() when channelId===0 | Bootstrap trigger data for new users |
| sounds.onChannelContextChanged() | sounds.refreshDataSource() | every context change | Rebuilds 3850-item trigger list |
| sounds.refreshDataSource() | sounds.loadTriggers() | inside refreshDataSource | API fetch; returns Promise |
| sounds.refreshDataSource() | sounds.loadData() | after loadTriggers resolves | Populates dxDataGrid |
| obsoverlays.onVisible() | obsoverlays.init() | on every visible | Re-initialises widgets |
| obsoverlays.onVisible() | obsoverlays.stretchIframes() | async after init | Resizes overlay iframes |
| obsoverlays.onChannelContextChanged() | obsoverlays.init() | context change | Re-initialise |
| goals.onVisible() | goals.frameGenerators (iterate) | on visible | Runs each goal metric generator |
| goals.onChannelContextChanged() | goals.init() | context change | Re-init all 10 metrics |
| graphicoverlays.onVisible() | navigation.setSubMenuItems() | on visible | Updates sidebar nav items |
| graphicoverlays.onChannelContextChanged() | graphicoverlays.init() | context change | Re-init (async) |
| giftoverlays.init() | giftoverlays.onVisible() | internally at L22097 | After async setup completes |
| giftoverlays.onChannelContextChanged() | giftoverlays.init() | context change | Re-init (async) |
| timer.onVisible() | obsoverlays.generateWidget() | on visible | Timer re-uses overlay widget builder |
| timer.onChannelContextChanged() | timer.initOverlayPreview() | context change | Preview via obsoverlays.generateWidget |
| likeathon.init() | obsoverlays.generateWidget() | when channelId===0 | Builds topliker overlay widget |
| likeathon.onVisible() | likeathon.initOverlay() | on visible | Which calls obsoverlays.generateWidget |
| likeathon.onChannelContextChanged() | likeathon.initOverlay() | context change | Same |
| songrequests.init() | spotifyapiwrapper.init() | init | External wrapper (in app.js) |
| songrequests.init() | spotifyapiwrapper.getAccessToken() | init | OAuth token fetch |
| chatbot.onChannelContextChanged() | chatbot.showBanner() | context change | Pro/free tier banner |
| challenge.init() | challenge.onChannelContextChanged() | init when channelId===0 | Bootstrap for new users |
| tts.onChannelContextChanged() | tts.setProVoicesHint() | context change | Show/hide pro voice hint |
| tts.onChannelContextChanged() | tts.loadAiVoiceState() | context change | Loads AI voice availability |
| setup.onChannelContextChanged() | setup.createPaymentUi() | context change | Builds payment/subscription UI |
| obsdocks.init() | obsdocks.onChannelContextChanged() | init when channelId===0 | Bootstrap for new users |
| christmasevent.onChannelContextChanged() | christmasevent.setup() | context change | Re-run event setup |
| halving.onChannelContextChanged() | halving.refreshLastExecutionTimestamp() | context change | Sync last run time |
| rtmpgen.onChannelContextChanged() | hides [data-pageid=rtmpgen] | context change | Hides menu item (no channelId path unclear) |


---

## settings-and-localstorage-keys

### Lowercasing trap (Gate 30i)

`settings.get(key)` and `settings.set(key, val)` normalize the key:

```
actual localStorage key = "setting_" + key.toLowerCase()
```

Any key with uppercase letters will silently read/write a different key than expected. This is NOT documented in modules.js — it is an app.js internal. See `.codex/skills/tikmax-core/SKILL.md`.

### Known settings keys observed in deobfuscated.js

| Module | settings.get/set key (as-written) | Actual localStorage key | Risk |
|--------|----------------------------------|------------------------|------|
| tts | "ttsEnabled" | setting_ttsenabled | Safe (all lowercase effective) |
| tts | "ttsVoice" | setting_ttsvoice | Safe |
| tts | "ttsVolume" | setting_ttsvolume | Safe |
| tts | "ttsRate" | setting_ttsrate | Safe |
| tts | "ttsAiEnabled" | setting_ttsaienabled | Safe |
| tts | "ttsAiVoice" | setting_ttsaivoice | Safe |
| tts | "ttsQueueMax" | setting_ttsqueuemax | Safe |
| tts | "ttsFilterEnabled" | setting_ttsfilterenable | Safe |
| sounds | "soundsEnabled" | setting_soundsenabled | Safe |
| sounds | "soundsVolume" | setting_soundsvolume | Safe |
| sounds | "soundsMuted" | setting_soundsmuted | Safe |
| chatbot | "chatbotEnabled" | setting_chatbotenabled | Safe |
| chatbot | "chatbotPrefix" | setting_chatbotprefix | Safe |
| chatbot | "autoApprove" | setting_autoapprove | Safe |
| goals | "goalsVisible" | setting_goalsvisible | Safe |
| graphicoverlays | "graphicOverlaysEnabled" | setting_graphicoverlaysenabled | LOW RISK — mixed case in key |
| giftoverlays | "giftOverlaysEnabled" | setting_giftoverlaysenabled | LOW RISK |
| wheel | "wheelEnabled" | setting_wheelenabled | Safe |
| wheel | "wheelMinPoints" | setting_wheelminpoints | Safe |
| wheel | "wheelMaxPoints" | setting_wheelmaxpoints | Safe |
| coindrop | "coinDropEnabled" | setting_coindropenabled | Safe |
| challenge | "challengeEnabled" | setting_challengeenabled | Safe |
| likeathon | "likeathonEnabled" | setting_likeathon | Safe |
| timer | "timerEnabled" | setting_timerenabled | Safe |
| songrequests | "songRequestsEnabled" | setting_songrequestsenabled | Safe |
| songrequests | "songRequestsMaxQueue" | setting_songrequestsmaxqueue | Safe |
| songrequests | "songRequestsBlacklist" | setting_songrequestsblacklist | Safe |
| setup | "channelId" | setting_channelid | CRITICAL — used for all channelId===0 gates |
| setup | "proUser" | setting_prouser | HIGH — gates pro feature visibility |
| setup | "sessionToken" | setting_sessiontoken | CRITICAL — auth |
| setup | "autoConnect" | setting_autoconnect | Safe |
| halving | "halvingEnabled" | setting_halvingenabled | Safe |
| halving | "halvingInterval" | setting_halvinginterval | Safe |
| rtmpgen | "rtmpKey" | setting_rtmpkey | Safe |
| obsoverlays | "overlayConfig" | setting_overlayconfig | HIGH — iframe src per overlay |
| obsdocks | "dockConfig" | setting_dockconfig | Safe |
| christmasevent | "christmasAccepted" | setting_christmasaccepted | Safe |

### Notes

- `channelId` setting gate: Every module's init() checks `if (channelId === 0)` to decide whether to call onChannelContextChanged() for bootstrap. If settings.get("channelId") returns wrong value, ALL modules miss their context bootstrap.
- `proUser` gate: chatbot, tts, sounds, actionsandevents all hide/disable features when proUser is false. Incorrect setting causes broken UI.
- There is NO explicit settings migration in modules.js. Migrations must come from app.js. See [[scout-app#settings-migration]].


---

## missing-ui-risks

Ranked by user-facing impact. "Wired" = in blockScript PAGES array.

### Top 10

1. **actionsandevents — 4 data grids null for existing users (BLOCKER)**
   - Cause: `onChannelContextChanged()` builds all 4 grids but is NEVER called by blockScript. `init()` only calls `onChannelContextChanged()` when `channelId===0` (new user). Existing users (channelId != 0) get `onVisible()` called against null grid objects → JS errors, blank page.
   - Module wired: YES (in PAGES). Bug is inside hook orchestration.
   - Fix: Add `actionsandevents.onChannelContextChanged()` call in blockScript after init().

2. **15 modules entirely missing from PAGES array (BLOCKER)**
   - Affected: tts, user, transactions, challenge, wheel, coindrop, giftoverlays, lastx, halving, rtmpgen, timer, songrequests, likeathon, obsdocks, christmasevent
   - All these pages render blank with no widget initialisation whatsoever.
   - Fix: Add all 15 to PAGES array in blockScript; audit onChannelContextChanged needs for each.

3. **3 unvirtualized 3845-item gift dxSelectBoxes (HIGH)**
   - actionsandevents event dialog gift picker: builds dxSelectBox with getAllGifts() (~3845 items) unvirtualized → browser freeze/lag.
   - giftoverlays initGoalMetric gift picker: same array, same risk.
   - Gate 30j fix only virtualized the sounds trigger dropdown. These two are un-patched.
   - Fix: Apply same ArrayStore + pageSize:50 + IntersectionObserver pattern from Gate 30j blockScript patch.

4. **setup.onChannelContextChanged() never called — payment/subscription UI stuck (HIGH)**
   - Creates payment UI, connection state toggles, manual connect flow.
   - Clone never calls it → payment section and pro-upgrade UI never renders correctly.
   - Module wired: YES. Bug is missing onChannelContextChanged call.

5. **giftoverlays async init race condition (HIGH)**
   - init() is an async generator. blockScript fires onVisible() immediately after init() starts, but init() calls onVisible() internally at L22097 after async await.
   - Result: double onVisible() or onVisible() with uninitialised frameGenerators.
   - Fix: blockScript should await init() completion before firing onVisible, or suppress the blockScript onVisible for giftoverlays.

6. **obsoverlays navigation.currentPage gate (MEDIUM)**
   - init() has early-return if navigation.currentPage !== "obsoverlays".
   - blockScript MUST set navigation.currentPage = "obsoverlays" before calling init().
   - If navigation object is not set up by app.js Vue bridge before blockScript fires, init() silently skips ALL generateWidget() calls → blank overlay page.
   - Currently documented as working (Gate 30d), but fragile timing dependency.

7. **songrequests spotifyapiwrapper missing (MEDIUM)**
   - songrequests.init() calls spotifyapiwrapper.init() and spotifyapiwrapper.getAccessToken().
   - spotifyapiwrapper is NOT in deobfuscated.js — it lives in app.js or lib-bundle.
   - If app.js does not expose spotifyapiwrapper to window before modules.js init() fires, songrequests crashes with ReferenceError.
   - Risk is runtime ordering, not a missing implementation.

8. **christmasevent posthog flag dependency (MEDIUM)**
   - init() checks posthog flag "christmas-2025". If posthog is not loaded or flag is disabled, the module silently no-ops and the Vue app is never mounted.
   - In clone, posthog integration status is unknown. See [[scout-app#posthog]].

9. **rtmpgen counter-intuitive onChannelContextChanged behaviour (LOW)**
   - onChannelContextChanged() HIDES the rtmpgen menu item (`$('[data-pageid=rtmpgen]').hide()`).
   - This fires when a channel context is set — meaning the menu item disappears when a user logs in. The logic may be intentional (hide if no stream key yet) but is non-obvious and could cause the rtmpgen page to disappear silently for users.

10. **user.init() empty stub (LOW)**
    - user.init() is `function () {}` — empty body. All user grid initialisation is inside onChannelContextChanged() and onVisible() via refreshUserList(). If clone adds user to PAGES without also wiring onChannelContextChanged, the user list page will be empty.

### Additional risks

- `tts.onChannelContextChanged()`: loads AI voice state and template migration. If never called, TTS AI voices unavailable and old TTS templates never migrated to new format.
- `halving.onChannelContextChanged()`: refreshes last execution timestamp. Without it, halving always shows wrong last-run time.
- `timer.onChannelContextChanged()`: calls initOverlayPreview(). Without it, timer overlay preview is never set up.
- `lastx.onChannelContextChanged()`: calls generateOverlays() only when currentPage===lastx. Low risk if navigating triggers onVisible anyway.


---

## unknowns-and-followups

1. **spotifyapiwrapper location**: Referenced in songrequests.init() but absent from deobfuscated.js. Must be confirmed in app.js or lib-bundle. Risk: if not exposed on window before modules.js loads, songrequests crashes. See [[scout-app#spotifyapiwrapper]].

2. **points module location**: PAGES array includes 'points' but no `var points` exists in deobfuscated.js. All points logic is in app.js/Vue. The blockScript tryFire('points') path silently no-ops via isReady() — confirm this guard actually runs or if it causes an uncaught ReferenceError. See [[scout-app#points]].

3. **coinMatch / coinJar / fallingSnow**: Referenced in obsoverlays.init() L19355-19358 as overlay types. Not in deobfuscated.js. Loaded by app.js from downloads/vue/dist/widgets/. Clone must serve these widget paths or generateWidget() calls will silently produce blank iframes.

4. **posthog integration status in clone**: christmasevent.init() gates on posthog flag "christmas-2025". Unknown whether clone's app.js integrates posthog. If not, christmasevent never activates. See [[scout-app#posthog]].

5. **navigation object bridge timing**: Multiple modules read navigation.currentPage and navigation.setSubMenuItems(). This object must be populated by app.js Vue bridge BEFORE blockScript fires any module init(). No explicit timing guard found in blockScript. Race condition if Electron IPC or Vue mount is slow.

6. **session.me polling in graphicoverlays.init()**: async init() polls session.me until available before building controls. If session.me is never set (logout mid-load), init() loops indefinitely. No timeout observed.

7. **giftoverlays topGiftStatus interval**: onVisible() starts a setInterval for topGiftStatus updates. If onVisible() is called multiple times (e.g., module is unwired then re-wired), intervals stack without being cleared. Confirm clearInterval guard exists.

8. **sounds loadTriggers() upstream API**: Gate 30k fixed myinstants from v1 API to myinstants.com. Confirm emote list endpoint (/api/emotes or similar) is also working in clone backend. sounds.triggerDataSource = 5 hardcoded + emotes + 3845 gifts — if emote fetch fails, triggerDataSource shrinks.

9. **onHide() hooks**: start module has an onHide() fn. No other modules observed with onHide. Confirm app.js calls onHide() on navigation-away. If clone never calls onHide(), start module's polling intervals (5min refreshLiveChannels) may keep running on all pages.

10. **__tfPageInits guard and module reload**: blockScript's init() guard prevents double-init. However if a user navigates away and back, onVisible() is called again but init() is skipped. Confirm each module's onVisible() is safe to call multiple times without re-init. Particularly: obsoverlays.onVisible() calls init() directly (which has the early-return gate) AND stretchIframes() — this should be safe but needs confirmation after Gate 30d.

---

## report-metadata

- Total modules catalogued: 24 (declared in deobfuscated.js) + points (in blockScript PAGES, lives in app.js)
- Modules wired by blockScript: 9 (start, obsoverlays, goals, graphicoverlays, sounds, actionsandevents, chatbot, points, setup)
- Modules NOT wired: 15 (tts, user, transactions, challenge, wheel, coindrop, giftoverlays, lastx, halving, rtmpgen, timer, songrequests, likeathon, obsdocks, christmasevent)
- DevExtreme large-data risks: 3 unvirtualized 3845-item gift dxSelectBoxes (actionsandevents event dialog, giftoverlays metric, plus sounds already fixed Gate 30j)
- BLOCKER findings: (1) actionsandevents 4 grids null for existing users; (2) 15 modules missing from PAGES; (3) giftoverlays async init race
- Report cross-links: [[scout-app#dispatcher]], [[scout-app#points]], [[scout-app#spotifyapiwrapper]], [[scout-app#posthog]], [[scout-app#settings-migration]]
- Source file lines read: deobfuscated.js L700-24976 (all module declarations), blockScript.txt L582-838
