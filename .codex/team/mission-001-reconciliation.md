# Mission M-2026-05-27-001-bundle-scouts — Reconciliation Report

> Commander synthesis of both Scout reports.
> Read this BEFORE starting any follow-up mission.

## Inputs

- [scout-app-bundle-report.md](scout-app-bundle-report.md) — 24 Vue components, 7 sections, 182 lines
- [scout-modules-bundle-report.md](scout-modules-bundle-report.md) — 25 modules, 8 sections, 346 lines

## Root cause unification

Both Scouts independently hit the **same root cause** from different angles:

> Bundle's `loginChannel` function is the central dispatcher that:
> 1. Sets `navigationStore.isLoggedIn = true`
> 2. Sets `window.session.channel = session.me.channel` + `window.session.channelId`
> 3. Emits `onChannelContextChanged` event to ALL legacy modules
>
> In our clone, `loginChannel` **never fires** because the auth flow that triggers it (bundle's login modal completion) is bypassed by Serial Key + `tfBridgeSessionMe`.

Wiring `loginChannel`-equivalent in blockScript fixes:

| Surface affected | Currently broken | Fixed by loginChannel dispatch |
|---|---|---|
| Topbar Pro/Free chip | Never mounts (isLoggedIn=false) | ✅ Chip renders correctly |
| setup.onVisible | Silent fail (no session.channel) | ✅ Setup page renders |
| tts AI voice state | Never loads | ✅ Voices populate |
| actionsandevents 4 dxDataGrids | Null → JS errors | ✅ Grids build |
| 15 dark modules' init | No widget setup | ✅ Each page renders |

## Follow-up missions

### M-2026-05-27-002 — loginChannel orchestrator (PRIORITY 1)

**Objective:** Add `tfDispatchLoginChannel` IIFE in blockScript that mimics bundle's `loginChannel` flow.

**Behavior:**
1. Wait for `window.session.me` populated (via `tfBridgeSessionMe`).
2. Wait for `window.navigationStore` mounted.
3. Once both ready (poll or hook):
   - `navigationStore.set('isLoggedIn', true)` — plain assignment (Gate 30a lesson).
   - `window.session.channel = session.me.channel`
   - `window.session.channelId = session.me.channel.channelId`
   - For each module in `[start, setup, obsoverlays, goals, graphicoverlays, sounds, actionsandevents, chatbot, tts, user, transactions, challenge, ...]`:
     - If `window[module]` exists AND has `onChannelContextChanged` fn → call it inside try/catch.

**Files touched:**
- `backend-node/src/templates/blockScript.txt` (high-risk — backup first)

**Verification:**
- Topbar chip renders 100k
- Setup page shows content
- Sound Alerts trigger dropdown still works (Gate 30j unaffected)
- AI voices Pro tab populates
- actionsandevents page shows 4 grids
- 15 dark pages: render without console errors (UI may still be incomplete but no crash)

**Team:**
- Strategist (plan exact dispatch order + race condition handling)
- Engineer (write IIFE)
- Apothecary (verify regression matrix from CLAUDE.md §1.11)
- Demolition (code review)

---

### M-2026-05-27-003 — actionsandevents page + dxSelectBox virtualization (PRIORITY 2)

**Objective:** Fix actionsandevents page (most complex non-working page) + apply Gate 30j virtualization pattern to 2 remaining 3845-item dropdowns.

**Behavior:**
1. After M-002 lands, verify actionsandevents 4 grids build correctly.
2. Apply paginated `DataSource` + `loading="lazy"` + `decoding="async"` pattern (Gate 30j) to:
   - actionsandevents event-dialog gift picker
   - giftoverlays metric gift picker
3. Both use TikTok CDN image proxy `/tiktok-img-cache/*` (already added 2026-05-27).

**Verification:**
- Click "Create Action" → event dialog → gift picker opens in <1s
- giftoverlays page → add gift trigger → picker opens fast

---

### M-2026-05-27-004 — 15 dark modules PAGES expansion (PRIORITY 3, LARGE)

**Objective:** Per-module audit + wire each dark module.

**Scope:** tts, user, transactions, challenge, wheel, coindrop, giftoverlays, lastx, halving, rtmpgen, timer, songrequests, likeathon, obsdocks, christmasevent.

**Approach:**
1. For each module: read its `init()` + `onVisible()` + `onChannelContextChanged()` from `decompiled/modules/deobfuscated.js`.
2. Categorize by complexity: ✅ trivial (just call init+onCCC), ⚠️ needs UI element check, ❌ deep RE required.
3. Batch ✅ modules in one IIFE expansion. Open separate sub-missions for ⚠️ + ❌.

**Sub-mission candidates (per module):**
- M-005a: songrequests (likely needs Spotify integration check)
- M-005b: christmasevent (seasonal, low priority)
- M-005c: wheel/coindrop/halving overlays (related game widgets)

---

## Pattern principle (to add to CLAUDE.md)

**Gate 31 — loginChannel central dispatcher (proposed):**

> Bundle's gốc has 2 distinct module lifecycle hook firing mechanisms:
> 1. **`onVisible()`** — fires when user navigates TO a page (gốc: nav.pageChange; clone: wired by `tfTriggerOverlaysOnVisible` IIFE).
> 2. **`onChannelContextChanged()`** — fires when session establishes / channel switches (gốc: `loginChannel` + `window.switchProfile`; clone: ❌ NOT wired).
>
> Wiring ONLY onVisible (current state) misses session-init UI build (4 grids, tts voices, isLoggedIn flag, etc.). Need separate `tfDispatchLoginChannel` IIFE that emits onChannelContextChanged after `session.me` populated.

---

## Action items for Commander

- [ ] Show this reconciliation to user
- [ ] User picks mission to launch first (M-002 recommended)
- [ ] Spawn Strategist for selected mission
- [ ] Update CLAUDE.md with Gate 31 after M-002 verified
