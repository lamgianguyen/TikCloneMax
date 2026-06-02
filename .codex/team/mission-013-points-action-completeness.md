# Mission M-013 — Points read-back + Action test side-effects ("làm được cái nào làm hết")

**Date:** 2026-06-02
**Commander:** main thread (inline implement) + 5-agent adversarial verification workflow (wf_248f68f9)
**Outcome:** 2 genuine backend gaps FIXED + verified; 4 "not-done" items proven NOT backend gaps.

## The decisive finding (READ-GỐC-FIRST paid off)

The prior feature-matrix critic flagged "Actions don't fire on live" + "Points config not honored" as
backend gaps. **Both were WRONG — the critic checked only the backend bridge.** Reading the gốc proved
Actions + Points fire **CLIENT-SIDE in the bundle**, driven by our bridge's Socket.IO broadcasts:

- Socket event → `broadcastlistener.tiktokConnection.on("gift", broadcastlistener.onGift)`
  (app/deobfuscated.js 71648-71759) → `broadcastlistener.onGift` (71943) →
  `TikTokObjToYouNowObj` (72083; sets `obj.value = diamondCount*repeatCount`) →
  `emitTiktokEventToModules("Gift", obj)` (71797: loops `window.appConfig.modules`, calls
  `window[mod].onGift`) → fans out to BOTH:
  - `actionsandevents.onGift` (modules 10922) → `executeActionsFromEvent` → **Actions fire**.
  - `setup.onGift` (modules 2508) reads `textboxPointsPerBar` × value + `addSubscriberBonus` →
    `transaction.put` → `PUT rest/transaction` → **Points awarded per config**.
- `setup.onChat` (2486, chat-minute, 60s dedup) + `setup.onShare` (2533, per-invite) same pattern.

→ **Firing/awarding server-side would DOUBLE-FIRE.** The bridge correctly must NOT do it.

## Genuine backend gaps (FIXED)

### #2 Points read-back — the real bug behind "points config not honored"
Points were **written** (`transaction.put` → `points.setBalance`) but `rest/channeluser` +
`odata/channeluser` returned `[]` **unconditionally** → every balance read back as **0**
(broke `!points`, wheel-spin cost check, transfers, Points leaderboard grid).
Key mismatch: bundle WRITES by `username` but READS by numeric `userId` (modules 4218) → needed an
identity map recorded at write time.
- `services/points.js`: + `pointsmeta_<username>` identity rows (userId/nickname/thumbnail), `recordIdentity`
  (merge upsert, no-op when unchanged), `getMeta`, `findUsernameByUserId`, `toChannelUser(channelId,…)`,
  `getChannelUser({userId|username})`, `listChannelUsers`.
- `routes/data.js`: PUT `/rest/transaction` records identity; GET `/rest/channeluser` returns single
  (by `?userId=` OR `?username=`) or leaderboard; GET `/odata/channeluser` returns `{value, @odata.count}`.
- `services/tiktok-bridge.js` chat handler: records identity (guarded try/catch) so chat-only viewers
  resolve by userId. Identity ONLY — no extra points delta (no double-count).

### #3 Action TEST side-effects
`/actions/test` broadcast the overlay but hard-coded `*Fired:false` — `dispatchActionSideEffects`
(widget.js 234) was dead code. Now wired: `context.__test=true` + real webhook/streamerbot/minecraft/
keystroke dispatch + `...sideEffects` in the response. + `http(s)`-only scheme guard on the
user-supplied `webhookUrl` (SSRF hardening; private hosts intentionally allowed for localhost integrations).

### #6 OBS — DONE
`npm i obs-websocket-js` (exit 0). `routes/obs.js` already lazy-loads via `tryLoadObsModule()` → real
connect now works.

## NOT backend gaps (client-side / already present — no code added, per YAGNI)
- **#1 Actions live-fire** — client-side (above). RUNTIME (needs a live test).
- **#8 Goal/LastX test** — client-side (`lastx.overlays[X].testuser`, modules 22686).
- **#9 Reset** — bundle resets client-side (`goals.resetAll`, modules 21196; zero `/api/reset` calls
  from the bundle); `routes/reset.js` already exists.

## Verification (workflow wf_248f68f9 — 4 reviewers salvaged after synth StructuredOutput failure)
2 CRITICALs caught + FIXED:
1. `toChannelUser` hardcoded `channelId:0` but the Points OData grid filters
   `["channelId","=",window.session.channelId]` (modules 13720) → grid empty. Fixed: thread real channelId.
2. `reset.js` only cleared `points_user_%` → stale `pointsmeta_%` survived resets. Fixed: both reset paths
   now clear meta too.
Plus: bridge `recordIdentity` wrapped in try/catch; webhook scheme guard; PUT response `totalAmount` added.
False alarms dropped: `context.__test` order (works — Socket.IO serializes at emit; 2 reviewers agree);
field naming (cosmetic); auth on `/actions/test` (consistent with all widget endpoints — OBS sources unauthed).

Runtime-proven (in-memory sqlite): `LIKE 'points_user_%'` does NOT match `pointsmeta_*`; userId→username
resolves; all 8 points.js exports present. `node --check` PASS on all 6 edited files.

## Files + backups (all .bak-2026-06-02-*)
widget.js (pre-test-sideeffects), data.js (pre-channeluser-readback), points.js (pre-identity-map),
tiktok-bridge.js (pre-identity-record), reset.js (pre-meta-cleanup).

## REQUIRES BACKEND RESTART to take effect. All RUNTIME-untested (code-verified only).
