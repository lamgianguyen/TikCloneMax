# scout-bundle-cdn-audit.md
**Mission:** M-2026-05-28-002-tiktok-cdn-intercept
**Scout:** Scout-Bundle-CDN
**Date:** 2026-05-28

---

## summary

Total CDN reference sites found: **53 files** contain tiktokcdn.com strings.

**Breakdown by category:**

| Category | Files | CDN URL count | Nature |
|---|---|---|---|
| Bundle data fixture (getAllGifts) | 1 | 3,930 | image.url_list[0] -- all p16-webcast.tiktokcdn.com |
| Bundle data fixture (rest/channeluser) | 1 | 99 | thumbnailUrl fields -- protocol-relative (bare hostname, no https://) |
| Bundle native code (deobfuscated.js) | 1 | 40 | Hardcoded test/demo CDN URLs in obsoverlays.test* + giftoverlays.* functions |
| Bundle native code (combo/app.js) | 1 | 2 | Obfuscated string table entry + test wheel profilePictureUrl |
| Bundle native code (combo/modules.js) | 1 | 9 | Obfuscated profilePictureUrl, giftPictureUrl, emoteImageUrl in test emitters |
| Widget HTMLs (all inside script blocks) | 37 files | ~180 | All in io.fakeEmit() / window.preview() test/preview code |
| Backend template (blockScript.txt) | 1 | 2 | CDN URL regex pattern for Sound Alerts dropdown itemTemplate rewrite |
| Backend template (earlyCss.txt) | 1 | 11 | CSS attribute selectors img[src*=tiktokcdn] -- hide/restyle TikTok avatars |
| Backend route (widget.js) | 1 | 1 | Hardcoded test thumbnail in widget test-fire stub |
| Backend service (tiktok-image-prewarm.js) | 1 | 3 | SSRF-guard regex constants only -- no actual CDN URL values |
| Backend index.js | 1 | 2 | SSRF-guard regex constant + comment text |
| Electron main.js | 1 | 4 | Intercept registration pattern + comment |

**Live (non-test) CDN traffic the Electron intercept will catch:**
- All https://*.tiktokcdn.com/* renderer requests -- every surface that sets img.src to a CDN URL.
- Gift images from getAllGifts fixture (image.url_list[0]): all 3,930 entries on p16-webcast.tiktokcdn.com.
- Live incoming events (gift, chat, like, follow) carry profilePictureUrl / giftPictureUrl from TikTok live API -- renderer sets those directly on img.src.

**NOT intercepted (server-side Node.js fetches):**
- tiktok-image-prewarm.js -- Node.js fetch() to upstream CDN, populates _cdnProxyCache. Runs in backend, not renderer.
- bundle-fixtures-sync.js -- zero CDN refs; syncs fixture files, no image fetches.

---

## bundle-native-code-matches

### deobfuscated.js
Path: c:Users
guyenlgDocumentsTikMaxTikCloneMaxdecompiledmodulesdeobfuscated.js

All 40 occurrences are in **test/demo helper functions** that fire simulated socket events with hardcoded CDN URLs as placeholder user/gift pictures. None are render paths for real live data.

| Lines | URL pattern | Containing function | Will intercept affect? |
|---|---|---|---|
| 20175, 20184, 20193, 20202 | p16-useast2a.tiktokcdn.com (profilePictureUrl) | obsoverlays.testEmojify | yes -- test chat events with CDN URL |
| 20205-20237 | p19-webcast.tiktokcdn.com (emoteImageUrl) | obsoverlays.testEmojify | yes |
| 20258 | p19-webcast.tiktokcdn.com (giftPictureUrl) | obsoverlays.testFirework | yes |
| 20269-20350 | p77-va, p19-webcast, p16-webcast | obsoverlays.testGifts | yes |
| 20357-20409 | p16-useast2a, p77-va, p19-pu-useast8.tiktokcdn-us.com, p16-va | obsoverlays.testTopGifter | mixed -- tiktokcdn-us.com NOT matched by intercept |
| 20439-20457 | same mixed hosts | obsoverlays.testTopLiker | mixed |
| 20621 | p16-useast2a.tiktokcdn.com (profilePictureUrl) | obsoverlays.testLikeFountain | yes |
| 20630, 20636 | p16-useast2a, p16-webcast | obsoverlays.testCannon | yes |
| 20663, 20667 | p19-webcast, p16-useast2a | obsoverlays.testCoinJar | yes |
| 22502, 22509 | p16-webcast.tiktokcdn.com (giftPictureUrl) | giftoverlays.checkGiftData default placeholders | yes |
| 6607, 6622 | derived from getAllGifts image.url_list[0] | actionsandevents.init Simulate Gift button | yes |

**Key architectural finding -- actionsandevents.getGiftItemTemplate (line 11923):**
The bundle native template does img.attr(src, item.image.url_list[0]) -- direct CDN URL on img.src with no lazy loading. Used in three places:
1. Line 6642: actionsandevents.init -- gift select in action config panel
2. Line 9886: actionsandevents.openNewEventModal -- gift select in event modal (all action types)
3. Line 22216: giftoverlays.onVisible context -- gift select in per-gift overlay config

blockScript.txt patches **only** the Sound Alerts datagridSounds dropdown (via onEditorPreparing hook). The other two usages rely solely on the Electron-level onBeforeRequest intercept.

### combo/app.js
Path: c:Users
guyenlgDocumentsTikMaxTikCloneMaxdownloadscomboapp.js

| Offset | Pattern | Usage |
|---|---|---|
| 334,159 | tiktokcdn. fragment | Obfuscated string table constant pool |
| 3,837,932 | .tiktokcdn.com/tos-u... assembled via string concat | profilePictureUrl in test wheel user object (wheel-of-actions test spin) |

### combo/modules.js
Path: c:Users
guyenlgDocumentsTikMaxTikCloneMaxdownloadscombomodules.js

| Offset | Field | Usage |
|---|---|---|
| 9,667 | string fragment | Obfuscated constant pool |
| 98,185 | string fragment | Obfuscated constant pool |
| 1,028,418 | profilePictureUrl | Test chat event emitter |
| 1,029,729 | profilePictureUrl + emoteImageUrl | Test emojify event |
| 1,031,018 | emoteImageUrl | Test emojify emote image |
| 1,035,162 | giftPictureUrl | Test gift event |
| 1,035,813 | giftPictureUrl | Test gift event |
| 1,051,736 | profilePictureUrl | Test likefountain event |
| 1,140,038 | giftPictureUrl | giftoverlays.checkGiftData default placeholder |

---

## bundle-data-fixtures

### getAllGifts
Path: c:Users
guyenlgDocumentsTikMaxTikCloneMaxdownloadsapigetAllGifts

- **Total entries:** 3,930 gifts
- **CDN URL field path:** gifts[n].image.url_list[0]
- **url_list length:** always 1 (no fallback URLs)
- **All URLs on single host:** p16-webcast.tiktokcdn.com
- **URL structure:** https://p16-webcast.tiktokcdn.com/img/<region>/webcast-<region>/resource/<hash>~tplv-obj.webp

Sample entries:

| id | name | image.url_list[0] |
|---|---|---|
| 5655 | Rose | https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/eba3a9bb85c33e017f3648eaf88d7189~tplv-obj.webp |
| 59881 | A Shard of Hope | https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/34207c50c472435d7d582ef5c1ca8ff2.png~tplv-obj.webp |
| 9087 | Flame heart | https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/b199d028d5beb081fe16edcf77db0830.png~tplv-obj.webp |
| 15189 | Chatting Popcorn | https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/f4813ddce6a6b3268df01af9fe3764d9.png~tplv-obj.webp |
| 19446 | Wink wink | https://p16-webcast.tiktokcdn.com/img/alisg/webcast-sg/resource/4a68411b3e92fc2bf68d458d5f906b74.png~tplv-obj.webp |

getAllGiftsCached is empty ([]) -- not a CDN URL source.

### rest/channeluser
Path: c:Users
guyenlgDocumentsTikMaxTikCloneMaxdownloadsapiestchanneluser

- **Total entries:** 99 channelusers
- **CDN URL field:** thumbnailUrl
- **CRITICAL FINDING:** All 99 values stored WITHOUT https:// -- bare hostname + path:
  Example: thumbnailUrl: p16-sg.tiktokcdn.com/tos-alisg-avt-0068/372c1a773c78a3d9d6f7072f471dcee3~tplv-tiktokx-cropcenter:100:100.webp
- **Intercept impact:** Electron pattern https://*.tiktokcdn.com/* will NOT match these. If the bundle sets img.src = thumbnailUrl directly, images will be broken (relative path resolution). Needs runtime probe to confirm whether bundle prepends https://.

### getAllAnimations
Path: c:Users
guyenlgDocumentsTikMaxTikCloneMaxdownloadsapigetAllAnimations

Zero TikTok CDN URL references. All animation URLs are local (/assets/lotties/...).

---

## html-templates-static

### earlyCss.txt
Path: c:Users
guyenlgDocumentsTikMaxTikCloneMaxackend-nodesrc	emplatesearlyCss.txt

CSS injected early into the bundle renderer. Uses img[src*=tiktokcdn] attribute selectors:

| Lines | Selector purpose |
|---|---|
| 292-297 | Hide TikTok avatar overflow chips in topbar (absolute-positioned images) |
| 421-424 | Hide TikTok avatar inside coin chip (burgundy + yellow bg variants) |
| 432-437 | Inject coin icon via ::before when TikTok avatar is hidden |
| 480-482 | Hide CDN images when data-tf-live-state=disconnected |
| 491-499 | Hide TikTok avatar in Stream Profile dropdown; inject rose twemoji background |

**Intercept impact:** After intercept, img.src becomes /tiktok-img-cache/p16-webcast.tiktokcdn.com/... The substring tiktokcdn still appears in the path, so img[src*=tiktokcdn] selectors **continue to match correctly**. No regression.

### blockScript.txt
Path: c:Users
guyenlgDocumentsTikMaxTikCloneMaxackend-nodesrc	emplateslockScript.txt

| Lines | Usage |
|---|---|
| 732-734 | Regex replace() rewrites CDN URLs to /tiktok-img-cache// in Sound Alerts trigger dropdown itemTemplate. Runs in renderer JS before img.src is set. |
| ~695 comment | Describes original freeze: img src=tiktokcdn without lazy loading froze renderer 8-9s. |

This is the **primary** CDN rewrite for the Sound Alerts dropdown. Electron intercept is belt-and-suspenders for CDN requests that escape blockScript (e.g., native template usages at deobfuscated.js lines 6642, 9886).

### Widget HTML files -- CDN usage pattern

All 37 widget HTML files with CDN references contain those references **exclusively inside script blocks** (inside io.fakeEmit() or window.preview() test functions). There are no hardcoded img src CDN attributes in any HTML markup. When preview test functions run in the Electron renderer, emitted CDN URLs are eventually set as img.src -- Electron intercept catches them.

| Widget | CDN refs | Purpose |
|---|---|---|
| chat.html | 17 | io.fakeEmit(chat) preview events with profilePictureUrl |
| cannon.html | 16 | Preview profilePictureUrl + giftPictureUrl |
| emojify.html | 13 | Preview chat profilePictureUrl |
| gifts.html | 12 | Preview gift events |
| firework.html | 8 | onGift(username, profileCDN, giftCDN) preview call |
| christmasevent.html | 8 | Preview gift events profilePictureUrl + giftPictureUrl |
| coinjar.html, carousel.html | 6 each | Preview event URLs |
| topgifter.html, topliker.html | 4 each | Preview profilePictureUrl |
| (all others) | 1-5 | Preview/test events |

---

## backend-direct-fetches

These are server-side (Node.js process) fetches -- NOT affected by the Electron renderer intercept.

### tiktok-image-prewarm.js
Path: backend-node/src/services/tiktok-image-prewarm.js

- Reads getAllGifts on boot, extracts image.url_list[0] for top 200 gifts
- Fetches each URL from TikTok CDN using Node.js fetch() with User-Agent: TikMax-clone/1.0
- Populates _cdnProxyCache Map so renderer requests hit memory immediately
- SSRF guard: /^[a-z0-9-]+.tiktokcdn.com$/i
- Fire-and-forget on boot; runs entirely in Node.js process
- NOT affected by Electron intercept -- this IS the server-side warmer that powers the proxy

### bundle-fixtures-sync.js
Path: backend-node/src/services/bundle-fixtures-sync.js

- Zero CDN URL references
- Syncs fixture files; no CDN image fetches
- NOT affected by Electron intercept

### index.js CDN proxy route (lines 554-568)
Path: backend-node/src/index.js

- GET /tiktok-img-cache/:host/:path -- serves cached CDN images to renderer
- Cache miss: Node.js fetch() upstream to https://<host>/<path>
- SSRF guard: host must match ^[a-z0-9-]+.tiktokcdn.com$
- NOT affected -- this is the terminus the Electron redirect points to

### widget.js test-fire stub (line 292)
Path: backend-node/src/routes/widget.js

- Hardcoded thumbnailUrl: https://p16-useast2a.tiktokcdn.com/... in test action context
- Emitted to widget renderer via socket broadcastArgs
- When widget sets this as img.src: Electron intercept WILL catch it

---

## intercept-impact-matrix

| Surface | CDN URL path to renderer | Mechanism | Assessment |
|---|---|---|---|
| Sound Alerts trigger dropdown | getAllGifts image.url_list[0] via native getGiftItemTemplate | blockScript regex rewrite + Electron onBeforeRequest fallback | affected (desirable) -- dual-layer |
| Gift browser modal | getAllGifts via actionsandevents.init selectBox (deobfuscated line 6642) | Electron onBeforeRequest only -- blockScript does NOT patch this | affected (desirable) |
| Event modal gift trigger | getAllGifts via openNewEventModal selectBox (deobfuscated line 9886) | Electron onBeforeRequest only | affected (desirable) |
| giftoverlays page | getAllGiftsCached via giftoverlays.giftList dxSelectBox (deobfuscated line 22216) | Electron onBeforeRequest | affected (desirable) |
| Live overlays gift events | TikTok live API -> tiktok-bridge.js -> socket gift with giftPictureUrl + profilePictureUrl | Electron onBeforeRequest | affected (desirable) |
| Live overlays chat events | profilePictureUrl via socket chat event | Electron onBeforeRequest | affected (desirable) |
| Live overlays like events | profilePictureUrl via socket like event | Electron onBeforeRequest | affected (desirable) |
| topgifter / topliker widgets | aggregates.js updateTopGifter socket -> img.src = user.profilePictureUrl | Electron onBeforeRequest | affected (desirable) |
| transactionviewer widget | tiktok-bridge.js:569 newTransaction thumbnailUrl = profilePictureUrl | Electron onBeforeRequest | affected (desirable) |
| christmasevent widget | socket christmas-event:gift with giftPictureUrl + profilePictureUrl | Electron onBeforeRequest | affected (desirable) |
| Widget preview/test mode | Hardcoded CDN URLs in io.fakeEmit and window.preview functions | Electron onBeforeRequest | affected (desirable) |
| giftoverlays.checkGiftData placeholders | Hardcoded giftPictureUrl at bundle lines 22502, 22509 | Electron onBeforeRequest | affected (desirable) |
| earlyCss.txt img[src*=tiktokcdn] CSS selectors | CSS attribute selector -- matches img.src value | n/a -- path still contains tiktokcdn after redirect | unaffected -- selectors keep working |
| tiktok-image-prewarm.js | Node.js fetch() in backend process | None -- server-side by design | NOT affected (correct) |
| bundle-fixtures-sync.js | No CDN fetches | None | NOT affected (correct) |
| rest/channeluser thumbnailUrl leaderboard | Fixture thumbnailUrl lacks https:// prefix | None currently | UNKNOWN -- see unknowns U2 |
| widget.js test action fire | thumbnailUrl emitted via socket to widget renderer | Electron onBeforeRequest when widget sets img.src | affected (desirable) |

---

## unknowns

### U1. tiktokcdn-us.com domain -- NOT covered by current intercept

Electron pattern https://*.tiktokcdn.com/* does NOT match *.tiktokcdn-us.com. Test fixtures at deobfuscated.js lines 20369, 20375, 20451, 20457 use p19-pu-useast8.tiktokcdn-us.com and p16.tiktokcdn-us.com. The SSRF guard regex in index.js and tiktok-image-prewarm.js also only permits *.tiktokcdn.com. If live TikTok API events for US-region users return profilePictureUrl values on tiktokcdn-us.com, those images bypass the intercept -- potential freeze + potential CORS issues.

Action needed: Monitor details.url in the Electron onBeforeRequest callback during a US-region live session.

### U2. rest/channeluser thumbnailUrl missing https:// prefix

All 99 thumbnailUrl values in the fixture are bare hostnames (e.g. p16-sg.tiktokcdn.com/path...). If the bundle leaderboard UI renders these as img.src = thumbnailUrl directly, the browser resolves them as relative paths -- images broken AND intercept does not apply. Need to confirm whether the bundle prepends https:// before rendering.

### U3. actionsandevents.init gift selectBox (line 6642) freeze risk

No loading=lazy on the native getGiftItemTemplate image. When this selectBox opens (event action config panel), all visible thumbnails fire simultaneous requests. Electron intercept redirects to proxy but cold-cache misses call upstream CDN from Node.js. Verify no renderer freeze comparable to the original Sound Alerts problem.

### U4. giftoverlays gift selectBox (line 22216) cache miss for rare gifts

Prewarm covers only the top 200 gifts. Scrolling to less-popular gifts triggers live upstream proxy fetches. No known freeze risk (no pagination issue like Sound Alerts) but worth monitoring response latency.

---

## recommendations

### R1. Extend intercept and SSRF guard to tiktokcdn-us.com

In electron/main.js, add https://*.tiktokcdn-us.com/* and http://*.tiktokcdn-us.com/* to the onBeforeRequest URL patterns. Extend TIKTOK_HOST_RE to /^[a-z0-9-]+.tiktokcdn(-us)?.com$/i. Mirror the same regex change in index.js and tiktok-image-prewarm.js SSRF guards. US-region users will otherwise see direct CDN fetches for profile pictures.

### R2. Fix rest/channeluser thumbnailUrl missing protocol prefix

Determine how the bundle consumes thumbnailUrl from the leaderboard REST fixture. If the bundle does not prepend https://, update the fixture or the backend route to serve fully qualified https://p16-sg.tiktokcdn.com/... URLs. This is likely a pre-existing latent bug unrelated to the intercept -- images in the leaderboard page are probably already broken.

### R3. Apply lazy-loading patch to the event modal gift selectBox (line 9886)

The actionsandevents.openNewEventModal gift selectBox uses native getGiftItemTemplate with no lazy loading. When this modal opens with a full gift list, all visible thumbnails fire simultaneous requests. Extend the onEditorPreparing blockScript patch to also cover select-box-specificgift elements, or monkey-patch actionsandevents.getGiftItemTemplate directly in blockScript to add loading=lazy and decoding=async.

### R4. Verify earlyCss selectors with a live intercepted session

Confirm visually that topbar avatar hiding and coin-icon injection still work after the intercept changes img.src from https://p16-webcast.tiktokcdn.com/... to /tiktok-img-cache/p16-webcast.tiktokcdn.com/.... The [src*=tiktokcdn] substring match should survive, but a quick visual check eliminates any doubt.

### R5. Add a runtime CDN host monitor

Log all distinct hostnames arriving at the Electron onBeforeRequest callback over a few live sessions. This will surface domain variants (tiktokcdn-us.com, regional edge CDN nodes, future TikTok CDN migrations) before they become user-visible broken images.
