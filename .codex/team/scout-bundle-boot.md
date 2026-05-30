# scout-bundle-boot -- Boot-Time Preload Research

Scout: Claude Sonnet 4.6 / 2026-05-28

## summary

Best preload hook: poll for window.sounds at blockScript load, then call sounds.loadTriggers() directly once window.sounds + window.actionsandevents exist and window.session is initialized. loadTriggers is pure async data -- no DOM contact. Assign truncated result to sounds.triggerDataSource and set sounds._tfTriggerTruncated = true before any consumer page is visited.

Boot-time safety: YES for data-only preload. Do NOT call refreshDataSource() at boot -- its .then() calls loadData() which hits absent DOM. Use sounds.loadTriggers() directly.

Race diagnosis: M-003 truncation only activates after the user navigates to sounds page. refreshDataSource() is async (~200-600ms for /api/getAllGifts). A fast click between t=0 and the first 200ms poll tick sees all 3850 items. Primary freeze = dxSelectBox rendering 3845 img nodes synchronously (deobfuscated.js:13329-13363), not the loadData() rebuild.

---

## q1-module-timing

### Object declaration order in modules.js

All three module globals declared by var at parse time when /combo/modules.js fires onload.
File: decompiled/modules/deobfuscated.js

| Object | Line | When |
|---|---|---|
| var actionsandevents = {...} | 6399 | modules.js parse (synchronous) |
| var sounds = {...} | 12921 | modules.js parse (synchronous) |
| var giftoverlays = {...} | 21957 | modules.js parse (synchronous) |

sounds.triggerDataSource initialized as [] at deobfuscated.js:12924.
sounds.loadTriggers assigned at deobfuscated.js:13036.
sounds.refreshDataSource assigned at deobfuscated.js:12971.
Both callable immediately after modules.js onload fires.

### Load chain

1. app.js loads first via script tag in page HTML.
2. blockScript.txt IIFEs run in declaration order within the injected script block.
3. window._injectModules defined at blockScript.txt:2532 as lazy loader: appends script src=/combo/modules.js and resolves Promise on s.onload (blockScript.txt:2537).
4. window.sounds does NOT exist until modules.js onload fires (after network fetch + parse).
5. window.session.me populated by tfBridgeSessionMe (blockScript.txt:1077) via immediate /api/me fetch at line 1113 -- roughly concurrent with modules.js load.

### When is loadTriggers safe to call?

Requires: (a) window.sounds exists (modules.js loaded), (b) window.actionsandevents exists (same load), (c) window.session is an object.
tfBridgeSessionMe writes window.session = {} at blockScript.txt:1085 before its /api/me fetch starts.

session.me / session.me.channel NOT required:
- getAllEmotes: if session.me absent, returns [] immediately (deobfuscated.js:11660). Safe.
- getAllGifts: if session.me absent, uses lang = window.navigator.language (deobfuscated.js:11737). Safe.

CRITICAL: window.session.me access throws TypeError if window.session is undefined. Gate preload on window.session existence.

---

## q2-boot-safety

### sounds.refreshDataSource at boot -- analysis

sounds.refreshDataSource (deobfuscated.js:12971):
  sounds.setGridLoading(true)    -- jQuery #sounds-grid: no-op on absent element (line 12968)
  sounds.loadTriggers().then() {
    sounds.triggerDataSource = arr  -- safe array assignment (line 12987)
    sounds.loadData()               -- PROBLEM: dxButton + dxDataGrid on absent DOM (line 12988)
    sounds.setGridLoading(false)    -- no-op
  }

sounds.loadData (line 13153): calls dxButton on #buttonSoundsNew and dxDataGrid on #datagridSounds.
jQuery empty set on absent elements. DevExpress generally silently ignores, but may produce unhandled Promise rejections.
Not safe at boot.

RECOMMENDATION: use sounds.loadTriggers() directly at boot, not sounds.refreshDataSource().

### Channel/session dependency of loadTriggers internals

getAllGifts (deobfuscated.js:11726): session dependency optional. Multi-part null check at line 11734.
If session.me absent, falls to lang = window.navigator.language (line 11737). Fetch proceeds without session.

getAllEmotes (line 11655): line 11659 -- explicit null check for window.session.me and .channel.
If either absent, returns [] immediately (line 11660). Safe if window.session is an object.

getAllGiftsCached (line 11692): if getAllGiftsCalled is false (initial value deobfuscated.js:6406),
falls back to getAllGifts() (line 11702). Expected on first boot.

---

## q3-recommended-hook

### Recommended: Option (a) -- poll at blockScript load, after tfBridgeSessionMe

Rationale: No appBootStage events exist. window._injectModules Promise (blockScript.txt:2532) is internal.
Option (a) is the proven pattern -- tfTriggerOverlaysOnVisible uses same setInterval polling at blockScript.txt:921.

### Placement in blockScript.txt

Insert AFTER tfBridgeSessionMe closes (after line 1157) and BEFORE tfTriggerOverlaysOnVisible (before line 582).
Ensures window.session = {} is written before the poll starts.

### Code sketch (pseudocode -- Engineer adapts)

  (function tfPreloadTriggerData() {
    if (window.__tfTriggerPreloadStarted) return;
    window.__tfTriggerPreloadStarted = true;
    var MAX_TRIES = 60;  // 60 x 250ms = 15s timeout
    var TRUNCATE_LIMIT = 500;
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (tries > MAX_TRIES) { clearInterval(iv); return; }
      // Gate 1: modules.js loaded (deobfuscated.js:12921 + 6399)
      if (!window.sounds || typeof window.sounds.loadTriggers !== "function") return;
      if (!window.actionsandevents) return;
      // Gate 2: window.session initialized (blockScript.txt:1085)
      if (!window.session) return;
      // Gate 3: already done
      if (window.sounds._tfTriggerTruncated) { clearInterval(iv); return; }
      clearInterval(iv);
      window.sounds.loadTriggers()
        .then(function (items) {
          // Normalize IDs -- matches refreshDataSource at deobfuscated.js:12980
          for (var i = 0; i < items.length; i++) {
            if (items[i].id != null) items[i].id = items[i].id.toString();
          }
          var truncated = items.length > TRUNCATE_LIMIT
            ? items.slice(0, TRUNCATE_LIMIT) : items;
          window.sounds.triggerDataSource = truncated;
          window.sounds._tfTriggerTruncated = true;
          console.log("[TF-preload-triggers] done:", truncated.length, "of", items.length);
        })
        .catch(function (err) {
          // Do NOT set _tfTriggerTruncated -- page-visit M-003 retries
          console.warn("[TF-preload-triggers] failed:", err && err.message);
        });
    }, 250);
  })();

Why this works without loadData():
- sounds.triggerDataSource read by onEditorPreparing at deobfuscated.js:13329 at click time, by closure reference.
  Pre-populating before page visit means dropdown opens with the truncated array.
- _tfTriggerTruncated = true causes M-003 poll (blockScript.txt:690) to clear itself on first tick when sounds page is visited.
- loadData() creates dxDataGrid with sounds.soundsDataSource (alert rows), independent of triggerDataSource.

---

## q4-m003-race-diagnosis

### Why the current truncate races

M-003 truncation (blockScript.txt:678-710) fires ONLY when user navigates to sounds page.

Timeline:
1. User navigates to sounds page -- tryFire fires
2. refreshDataSource() called (blockScript.txt:653) -- async loadTriggers() -> getAllGiftsCached() -> /api/getAllGifts
3. t=0ms: truncation setInterval starts (200ms interval, 40 tries, 8s max)
4. t~200-600ms: /api/getAllGifts resolves -- sounds.triggerDataSource assigned 3850 items (deobfuscated.js:12987)
5. t=200ms: first poll tick checks triggerDataSource.length === 0 -- if fetch not resolved, skips
6. t=400ms: second tick -- may truncate IF user has not yet clicked

RACE WINDOW: If network resolves in <200ms and user clicks at t=150ms, triggerDataSource has 3850 items.
onEditorPreparing (deobfuscated.js:13329) reads current full array and renders all 3850 items.

SECONDARY ISSUE: Every navigation fires fresh refreshDataSource() (blockScript.txt:653).
deobfuscated.js:12987 overwrites triggerDataSource with 3850 items even if _tfTriggerTruncated was set from prior visit.
The blockScript.txt:690 guard fires at next 200ms tick only -- the array is full again for that window.

### Is loadData() the real freeze?

sounds.loadData() (deobfuscated.js:13153): builds dxDataGrid with sounds.soundsDataSource (user alert rows, typically 1-20 items). Fast. NOT the primary freeze.

The freeze is in the dxSelectBox trigger column:
1. onEditorPreparing fires (deobfuscated.js:13305)
2. editorOptions.dataSource = sounds.triggerDataSource (line 13329) -- 3850-item plain array
3. dxSelectBox opens -- DevExpress renders ALL items via itemTemplate (lines 13335-13363) synchronously in one frame
4. Each gift item: jQuery img node + TikTok CDN src set -- 3845 img DOM elements + 3845 CDN requests fired
5. Result: 8-9s main thread freeze

loadData() called after truncate (blockScript.txt:701) adds ~300-500ms for dxDataGrid reinit -- secondary cost, not primary freeze.

---

## q5-data-without-dom

### Can we set triggerDataSource without loadData()?

YES. sounds.triggerDataSource referenced at exactly these locations in deobfuscated.js:

| Line | Context | When executes |
|---|---|---|
| 12924 | Initial value [] | modules.js parse |
| 12987 | Assignment in refreshDataSource().then() | When refreshDataSource resolves |
| 13253 | calculateSortValue in dxDataGrid column | Grid sort -- only after loadData() creates grid |
| 13262 | calculateCellValue for triggerName | Grid cell render -- only after loadData() |
| 13329 | onEditorPreparing triggerId field | User clicks Trigger cell -- only after loadData() |
| 13486 | sounds.play() -- find gift by ID | TikTok event fires during broadcast |

Lines 13253, 13262, 13329 are inside dxDataGrid callback closures created by loadData().
They do not exist before loadData() runs. They read triggerDataSource by closure reference at execution time.

Line 13329: captures sounds.triggerDataSource at the moment user clicks.
Pre-populating it at boot means dropdown opens with the truncated array.

Line 13486 (sounds.play()): if a playing gift ID was truncated away (rare gift beyond position 500),
line 13489 uses optional chain: [triggerId].concat(_0x219279?.otherIds || []). Safe.
Gift still matches by direct triggerId in soundsDataSource.filter() at line 13491.
Only otherIds aliases for rare truncated gifts are lost (minor).

CONCLUSION: window.sounds.triggerDataSource = truncatedArray at boot, before loadData() ever runs,
is safe and effective. No DOM contact required.

---

## risks

### Risk 1: loadTriggers() rejects (< 30 gifts returned)

deobfuscated.js:13131 throws if result.length < 30 (backend error or cold start).
Preload .catch() must NOT set _tfTriggerTruncated -- page-visit M-003 poll retries on next navigation.
Catch block: log warning only.

### Risk 2: Double /api/getAllGifts call

If actionsandevents.getAllGiftsCalled is false when preload fires AND actionsandevents page loading simultaneously,
two /api/getAllGifts fetches may fire. Both write actionsandevents.cachedGifts with identical data. Harmless.
Preload fires early (before any page visit) making this race unlikely.

### Risk 3: sounds.onChannelContextChanged overwrites triggerDataSource

sounds.onChannelContextChanged (deobfuscated.js:13000) calls refreshDataSource() which at line 12987
overwrites sounds.triggerDataSource with fresh 3850 items, clearing the preload.
In TikMax clone, onChannelContextChanged is error-suppressed at blockScript.txt:2678. If it fires, preload is lost.

Mitigation: after preload sets flag, wrap sounds.refreshDataSource to re-apply truncation in its .then() before loadData() is called.

### Risk 4: Using refreshDataSource instead of loadTriggers at boot

If Engineer calls sounds.refreshDataSource() at boot, the .then() calls loadData() on absent DOM.
May produce DevExpress unhandled rejections. Always use sounds.loadTriggers() directly at boot.

### Risk 5: Emotes absent at boot (no session.me.channel yet)

If preload fires before /api/me response arrives, getAllEmotes returns [] (deobfuscated.js:11660).
triggerDataSource has 5 hardcoded events + gifts but no emotes.
If _tfTriggerTruncated is set, page-visit refreshDataSource() (blockScript.txt:653, fires unconditionally)
overwrites triggerDataSource with 3850+ items including emotes -- but resets truncation (see Risk 3).

Mitigation: (a) gate preload on window.session.me.channel existence for full emote inclusion (delays ~500ms),
or (b) accept emotes absent from preload (emotes are small fraction, rarely critical as sound triggers).
