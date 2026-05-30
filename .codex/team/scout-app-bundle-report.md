# Scout-Bundle-App Report
Mission: M-2026-05-27-001-bundle-scouts
Scout: Scout-Bundle-App
Source: downloads/combo/app.js (3.93 MB obfuscated Vue 3 bundle)
Date: 2026-05-27

---

## ui-components-catalogue

All components identified via __name pattern search in app.js. Offsets are byte positions.

| # | Component Name | Offset | Renders When | Reads From | Clone Wired |
|---|---------------|--------|-------------|-----------|-------------|
| 1 | Tooltip | @1667712 | On hover | props: content, placement | Yes (passive) |
| 2 | StreamerRankCard | @1686886 | Inside rank panels | props: rank data | Partial |
| 3 | ChristmasEffect | @1709409 | Seasonal flag active | props: enabled | No (feature-flagged) |
| 4 | CategoryButton | @1793512 | Sidebar category nav | props: category, isActive | Yes |
| 5 | ProBadge | @1808087 | Next to Pro user name | navigationStore.isPro | Partial |
| 6 | DropdownBase | @1850149 | Base for all dropdowns | props: items, selected | Yes (base) |
| 7 | StreamProfileDropdown | @1853627 | Topbar when isPro=true | window.navigationStore.streamProfileId, streamProfiles | Partial - needs window.switchProfile |
| 8 | TTSProDropdown | @1957827 | Topbar chip isPro=true | props: proCredits, proCreditsMax, topUpCredits, topUpCreditsMax, creditsRefreshDays, variant | Partial |
| 9 | SegmentTabs | @1980769 | Tab switcher surfaces | props: tabs, activeTab | Yes |
| 10 | TTSFreeDropdown | @1990295 | Topbar chip isPro=false | props: freeMessages, freeMessagesMax | Partial |
| 11 | ProChipWrapper | @1985552 | Topbar isLoggedIn+isPro | storeToRefs(navigationStore): proCredits, proCreditsMax, streamProfileId, streamProfiles | Partial |
| 12 | FreeChipWrapper | @1997133 | Topbar isLoggedIn+!isPro | navigationStore.ttsFreeMessages | Partial |
| 13 | Topbar | @2000485 | Always (top of shell) | storeToRefs(navigationStore): isLive, isLoggedIn, isPro | Partial - isLoggedIn never set |
| 14 | ProDiscordBanner | @2025768 | Pro upgrade flow | navigationStore.isPro | Partial |
| 15 | Button | @2031103 | Generic button | props: variant, size, disabled, onClick | Yes |
| 16 | InvertedModalCard | @2054004 | Modal container | props: title, body slot | Yes |
| 17 | TrialEndedConfirmationModal | @2067941 | After trial expires | navigationStore.hasActiveTrial | Partial |
| 18 | App (nav root) | @2072673 | Always - root Vue | navigationStore (full store) | Yes |
| 19 | Chip | @2096364 | Various label contexts | props: label, color | Yes |
| 20 | TrialProgressBar | @2169193 | hasActiveTrial=true | navigationStore.trialInfo | Partial - trialInfo only from loginChannel |
| 21 | TTSMoreCreditsModal | @2211315 | Credits depleted | navigationStore.ttsProCredits | Partial |
| 22 | TtsVoicePickerModal | @2246222 | Voice picker dialog | props: voices, includeRandomVoice, selectedVoiceId, onSelect, onTest | Partial |
| 23 | App (voice picker root) | @2277477 | VueTtsVoicePickerModal mount | navigationStore (partial) | Partial |
| 24 | VueTtsVoicePickerModal (wrapper) | @2226713 | createApp wrapper | window.aiTts, window.navigationStore | Partial |

**Total: 24 components**
---

## lifecycle-dispatchers

Vue lifecycle hooks. All called as _0x4be858["onMounted"](fn) due to obfuscation.

| Offset | Owning Component (inferred) | What It Does | Fires in Clone? |
|--------|---------------------------|-------------|-----------------|
| @1767314 | StreamerRankCard area | Initializes rank display animation | Unknown |
| @1792729 | CategoryButton area | DOM setup for category highlight | Yes (passive DOM) |
| @1848297 | DropdownBase | Positions dropdown on mount | Yes (passive DOM) |
| @1859367 | StreamProfileDropdown | Reads navigationStore.streamProfiles on mount | Partial - profiles empty until tfPiniaProTrap |
| @1897652 | TTSProDropdown area | Initializes credit display | Partial - values from tfPiniaProTrap |
| @1939642 | ProChipWrapper/SegmentTabs | Tab/chip mount initialization | Partial |
| @1986449 | FreeChipWrapper | Reads ttsFreeMessages on mount | Partial |
| @2083730 | App (nav root) | Root app mounted - fires initial state check | Partial - isLoggedIn=false at mount |
| @2152967 | TrialProgressBar area | Reads trialInfo for progress bar | No - trialInfo always null |

**Critical Gap**: loginChannel at @3737009 is the ONLY function that sets
navigationStore.isLoggedIn=true. It never fires in the clone. App onMounted
@2083730 mounts with isLoggedIn=false. All conditional renders (ProChipWrapper,
FreeChipWrapper) never activate from lifecycle alone. tfPiniaProTrap sets
isPro/credits but does NOT set isLoggedIn.
---

## pinia-store-shape

Navigation store defined at @1584059. Exposed as window.navigationStore at @1586258.

### navigationStore (full shape)

| Field | Default | Set By | Read By | Clone Status |
|-------|---------|--------|---------|-------------|
| channelName | empty string | loginChannel @3739500 | Topbar display | NEVER SET |
| isLoggedIn | false | loginChannel @3739500 | Topbar, ProChipWrapper, FreeChipWrapper | NEVER SET TRUE |
| isPro | session?.me?.userFeatures?.isPro or false | loginChannel, tfPiniaProTrap | ProChipWrapper, TTSProDropdown, ProBadge | SET by tfPiniaProTrap (forces true) |
| hasActiveTrial | false | loginChannel @3739500 | TrialProgressBar, TrialEndedConfirmationModal | NEVER SET |
| trialInfo | null | loginChannel @3739500 | TrialProgressBar | NEVER SET |
| trialBannerDismissed | false | tfPiniaProTrap | Trial banner visibility | SET by tfPiniaProTrap (true) |
| ttsProCredits | 0 | tfPiniaProTrap | TTSProDropdown, TTSMoreCreditsModal | SET by tfPiniaProTrap (100000) |
| ttsProCreditsMax | 0 | tfPiniaProTrap | TTSProDropdown | SET by tfPiniaProTrap (100000) |
| ttsFreeMessages | 0 | loginChannel (indirect) | FreeChipWrapper, TTSFreeDropdown | NOT SET by any IIFE |
| ttsFreeMessagesMax | 0 | loginChannel (indirect) | FreeChipWrapper | NOT SET by any IIFE |
| streamProfileId | 1 (hardcoded) | loginChannel, tfPiniaProTrap | StreamProfileDropdown | SET by tfPiniaProTrap |
| streamProfiles | [] empty array | loginChannel via session.me.channel.profiles, tfPiniaProTrap | StreamProfileDropdown | SET by tfPiniaProTrap |
| isLive | false | tfPatchLiveBadge (indirect via HTML attr) | Topbar live indicator | Partial - HTML attr only, not Pinia |
| ttsHost | empty string | tfI18nPreBake via appConfig.ttsHost | getAiTtsBackendContext @3344494 | SET by tfI18nPreBake |

**Reactive deps**: ProChipWrapper and FreeChipWrapper use storeToRefs(window.navigationStore)
and update reactively when Pinia fields change after mount.

**window.session** plain object (@3684078):

---

## window-globals

All globals app.js sets on window, with producer/consumer/clone status.

| Global | Set At | Producer | Consumer(s) | Clone Status |
|--------|--------|----------|-------------|-------------|
| window.Vue | @1586258 | app.js bundle init | modules.js pages, inline scripts | SET |
| window.VueRouter | @1586258 | app.js bundle init | Navigation shell routing | SET |
| window.Pinia | @1586258 | app.js bundle init | modules.js Pinia access | SET |
| window.navigationStore | @1586621 | app.js after Pinia init | 8+ locations in app.js and modules.js | SET (fields need loginChannel) |
| window.SwiperVue | @1586621 | app.js bundle init | Swiper carousel components | SET |
| window.session | @3684078 | app.js session init | ALL page modules | SET partial - .channelId/.channel never set |
| window.appInit | @3729715 | app.js fetch /api/config | Page modules waiting for appInit | SET if /api/config responds |
| window.appConfig | @3729715 via appInit | /api/config response | getAiTtsBackendContext reads .ttsHost | SET if /api/config returns ttsHost |
| window.token | blockScript tfBootstrapWindowToken | Cookie/localStorage IIFE | getAiTtsBackendContext @3344494 | SET by IIFE |
| window.aiTts | @3353848 | app.js after getAiTtsBackendContext | TtsVoicePickerModal, voice loader | SET but hasBackendContext=false until tfForceAiTtsBackend |
| window.switchProfile | @3762792 | app.js top-level fn | StreamProfileDropdown click | SET - calls api.doAction POST me |
| window.trial | @3918979 | app.js trial/pro block | Trial modal components | SET |
| window.pro | @3918979 | app.js trial/pro block | Pro upgrade flows | SET |
| window.moduleinjector | @3409312 | app.js module system | loginChannel dispatches through it | SET but never invoked (loginChannel never fires) |
| window.localization | @3522500 area | app.js i18n init | All page modules, tfPatchSwitchLanguage | SET - switchLanguage patched |
| window.tfPageloadData | Backend injection | Server template | app.js reads ttsHost, modules templates | SET via tfI18nPreBake Object.defineProperty |
---

## obfuscation-decoder-cheatsheet

Decode fns in app.js: _0x23d9c3, _0x516f8c, _0x3120, _0x25066f - all same string array.

| Encoded | Decoded | Context |
|---------|---------|---------|
| _0x516f8c(0x3120) | Topbar __name string (TBD - needs runtime decode) | @2000485 |
| concat TTSProDrop+down | TTSProDropdown | @1957827 |
| concat TTSFreeDro+pdown | TTSFreeDropdown | @1990295 |
| concat SegmentTab+s | SegmentTabs | @1980769 |
| concat TtsVoicePi+ckerModal | TtsVoicePickerModal | @2246222 |
| concat TTSMoreCre+ditsModal | TTSMoreCreditsModal | @2211315 |
| concat TrialEnded+Confirmati+on | TrialEndedConfirmation[Modal] | @2067941 |
| concat StreamProf+ileDropdown | StreamProfileDropdown | @1853627 |
| _0xecf1aa.set(streamProfileId, id) | navigationStore.set(streamProfileId, id) | @1853627 click |
| _0xecf1aa.set(channelName, ...) | navigationStore.set(channelName, ...) | @3739500 |
| _0xecf1aa.set(isLoggedIn, true) | navigationStore.set(isLoggedIn, true) | @3739500 |
| _0xecf1aa.set(isPro, ...) | navigationStore.set(isPro, ...) | @3739500 |
| api.doAction(POST, me, {profileId:id}) | POST /api/me with profileId | @3762792 |
| _0x4be858[onMounted](fn) | Vue onMounted(fn) | All 9 hooks |
| _0x4be858[storeToRefs](window.navigationStore) | storeToRefs(window.navigationStore) | Topbar, chips |
| __name key in component object | Vue component name property | All 24 components |
| emitChannelContextChanged key | moduleinjector.emitChannelContextChanged(name) | @3409312 |
| initJsModule key | moduleinjector.initJsModule(name) | @3409312 |
| getAiTtsBackendContext fn | reads appConfig.ttsHost + window.token; returns null if either missing | @3344494 |
---

## missing-ui-risks

Top 10 places the bundle expects a dispatch the clone may miss.

| Rank | Risk | Bundle Expects | Clone Reality | Severity |
|------|------|---------------|--------------|---------|
| 1 | **isLoggedIn never true** | loginChannel @3739500 sets navigationStore.isLoggedIn=true after /api/channel succeeds | tfPiniaProTrap sets isPro=true but NEVER sets isLoggedIn. Topbar renders neither ProChipWrapper nor FreeChipWrapper | CRITICAL |
| 2 | **tts.onChannelContextChanged never fires** | loginChannel dispatches to tts module -> tts.setProVoicesHint() + tts.loadAiVoiceState() | No IIFE covers this. TTS AI voice state never loaded on session start | HIGH [[scout-modules#tts-onchannelcontextchanged]] |
| 3 | **window.session.channel never set** | loginChannel @3739500 sets session.channel = {profile: channelName} | tfBridgeSessionMe sets session.me but NOT session.channel. setup.onVisible gates on session.channel | HIGH |
| 4 | **window.session.channelId never set** | loginChannel sets session.channelId = parseInt(response.channel.channelId) | No IIFE sets this. Any module reading session.channelId gets undefined | HIGH |
| 5 | **TrialProgressBar null-access** | loginChannel sets hasActiveTrial + trialInfo; TrialProgressBar onMounted @2152967 reads trialInfo | trialInfo=null always; trialBannerDismissed=true from tfPiniaProTrap hides it anyway but null-access in onMounted possible | MEDIUM |
| 6 | **StreamProfileDropdown empty flash** | loginChannel populates session.me.channel.profiles synchronously before render | tfPiniaProTrap fills streamProfiles after app mounts (polls). Race: empty list renders first | MEDIUM |
| 7 | **actionsandevents.onChannelContextChanged gap** | loginChannel emits to actionsandevents @269919 | tfTriggerOverlaysOnVisible only calls onVisible not onChannelContextChanged | MEDIUM [[scout-modules#actionsandevents-onchannelcontextchanged]] |
| 8 | **chatbot.onChannelContextChanged gap** | loginChannel emits to chatbot @172594 | No IIFE covers this | MEDIUM [[scout-modules#chatbot-onchannelcontextchanged]] |
| 9 | **sounds.onChannelContextChanged gap** | loginChannel emits to sounds @539820 | tfTriggerOverlaysOnVisible calls refreshDataSource but NOT onChannelContextChanged | MEDIUM [[scout-modules#sounds-onchannelcontextchanged]] |
| 10 | **TtsVoicePickerModal voices empty on race** | expects voices[] from window.aiTts after backend context resolved | tfHandleTtsTikfinityCom mocks catalog BUT getAiTtsBackendContext returns null if appConfig.ttsHost missing; tfForceAiTtsBackend forces hasBackendContext=true but voice list still needs fetch to complete | LOW-MEDIUM |
---

## unknowns-and-followups

| # | Unknown | Where Seen | Suggested Follow-up |
|---|---------|-----------|-------------------|
| 1 | _0x516f8c(0x3120) decoded Topbar __name | @2000485 | Run node decode against app.js string table |
| 2 | Full navigationStore field list (may have extra fields) | @1584059 | Read app.js @1584059-1586000 fully |
| 3 | isLive reads Pinia or DOM attribute in topbar | Topbar @2000485, tfPatchLiveBadge | Grep topbar setup fn for isLive binding |
| 4 | Full module list loginChannel iterates | @3737009 loginChannel loop | Read loginChannel loop body to enumerate all modules |
| 5 | points/song/tools have onChannelContextChanged? | decompiled/modules/deobfuscated.js | Grep for onChannelContextChanged in those namespaces [[scout-modules#missing-onvisible]] |
| 6 | window.appConfig full shape beyond ttsHost | @3729715 | Grep app.js for appConfig. access patterns |
| 7 | window.pro and window.trial exact shapes | @3918979 | Read app.js @3918979-3920000 |
| 8 | moduleinjector.injectHtmlModule called anywhere? | @3409312 | Grep app.js for injectHtmlModule calls |
| 9 | Voice picker App @2277477 shares navigationStore or isolated? | @2277477 | Read createApp + Pinia install for voice picker |
| 10 | tfPatchSwitchLanguage applied before/after first render? | @3522500, blockScript @71694 | Check blockScript IIFE ordering |

---

*Report generated by Scout-Bundle-App | Mission M-2026-05-27-001-bundle-scouts*