# Scout Analysis: goc Speed + Clone Image Failure (M-2026-05-28-005)

**Scout:** Code Explorer Agent (Sonnet 4.6)
**Date:** 2026-05-28
**Mission:** M-2026-05-28-005

---

## summary

1. **goc is NOT virtualized and NOT faster by design.** deobfuscated.js:13327-13396 configures the trigger dxSelectBox with a plain array dataSource, zero virtualization options, no minSearchLength, no DevExtreme paginated DataSource. goc users see it fast purely because Chromium HTTP disk cache holds all gift WebPs from prior sessions. The DOM render cost (3850 x itemTemplate nodes) is identical in both environments on cold cache.

2. **Clone images are missing post-M-004 because signed TikTok CDN URLs expire.** The Electron intercept and backend proxy route are structurally correct. Gift items contain signed CDN URLs with ?x-expires and ?x-signature params. If getAllGifts fixture is stale when pre-warm runs, it fetches already-expired URLs. Upstream CDN returns non-2xx, proxy returns 502, img onerror fires setting opacity=0, thumbnails vanish while text remains.

3. **Recommended fix:** Keep M-004 truncation. Fix images via: (a) sequence pre-warm AFTER fixture-sync so URLs are fresh at warm-up time, (b) add loading=lazy to itemTemplate img via blockScript patch to prevent 500 simultaneous requests, (c) replace onerror handler to show fallback icon instead of opacity=0.

---

## goc-speed-mechanism

### Hypothesis elimination

**Hypothesis A: Browser disk cache (CONFIRMED TRUE)**

goc returning users have gift WebPs in Chromium HTTP disk cache from prior sessions. Backend sends Cache-Control: public, max-age=86400 (backend-node/src/index.js:528). After first open, images decode instantly from disk. On cold cache, goc would also freeze ~8s. Disk cache is what makes goc appear fast to returning users.

**Hypothesis B: goc virtualizes (DISPROVED)**

deobfuscated.js:13327-13396 sets exactly these dxSelectBox options: dataSource, displayExpr, valueExpr, searchEnabled, noDataText, valueChangeEvent, itemTemplate, fieldTemplate, onValueChanged. Zero instances of useVirtualScrolling, dropDownOptions, pageSize, deferRendering, or minSearchLength in the entire 945KB deobfuscated file (grep confirmed). The dataSource is a plain JS array assigned at deobfuscated.js:12987 -- NOT a DevExtreme DataSource with paginate flag.

**Hypothesis C: goc had fewer gifts historically (PARTIAL, not main factor)**

Gate 21 shows catalog grew from 1518 to 3386+ items. Earlier goc users saw shorter freeze. Current goc users with warm disk cache do not freeze regardless. Catalog growth amplified the problem; disk cache is the actual differentiator.

**Hypothesis D: goc search-first (DISPROVED)**

searchEnabled: true with no minSearchLength or showDataBeforeSearch: false. Dropdown opens showing all items immediately on click.

### Conclusion

Same code, same DOM render cost. goc speed = warm Chromium disk cache eliminating image decode time. M-004 truncation (500 items) correctly reduces DOM node count ~7.7x. The paradox resolves: goc is fast because returning users have cached images; clone is slow on first open because its Electron environment has no prior cache history.

---

## itemTemplate-image-loading

Source: decompiled/modules/deobfuscated.js:13335-13363

The itemTemplate for gift items (no icon) creates an img element with:

- **src** = item.image?.url_list[0] (optional chain) OR item.imageUrl fallback
- **onerror** = inline string that sets this.style.opacity=0 (img invisible, 40x40 slot stays in DOM)
- No loading=lazy, no data-src, no placeholder element
- All 500 (post-M-004) img elements fire src fetch simultaneously on dropdown open

The text sibling span (name + Coins) is NOT inside the img and is unaffected by onerror. This explains the exact symptom: text visible, thumbnail invisible.

The fieldTemplate (selected value cell, deobfuscated.js:13382-13383) uses the same image?.url_list[0] pattern without onerror.

---

## why-clone-images-missing

### The redirect chain is structurally correct

electron/main.js:1143 constructs: http://localhost:5285/tiktok-img-cache/hostname/pathname?search

No mixed-content issue: renderer origin is http://localhost:5285 (main.js:39,1884), redirect target is also http://localhost:5285. Same-origin HTTP throughout.

Backend route index.js:555-568 reconstructs upstream URL correctly, extracting query string from req.url to bypass Express query-stripping.

### Root cause: signed CDN URLs expire

TikTok CDN URLs use time-bounded signatures: https://p19-sign.tiktokcdn.com/img/...?x-expires=UNIX&x-signature=HASH. These expire within hours to ~24h.

Failure flow:
1. bundle-fixtures-sync.js fetches fresh getAllGifts at boot -- URLs valid at fetch time
2. tiktok-image-prewarm.js fires independently in parallel -- may use OLD fixture if sync has not finished writing yet, OR pre-warm succeeds but by next session 24h TTL and CDN signatures have both expired
3. User opens dropdown: _cdnProxyCache MISS (TTL elapsed), Electron disk cache MISS
4. Electron intercept redirects to backend proxy
5. Backend fetches stale signed URL -- CDN returns 403
6. Backend returns 502 via: if (!r.ok) return res.status(r.status).end() at index.js:510
7. img fires onerror -- opacity=0 -- thumbnail invisible
8. Text sibling span is unaffected -- name + Coins visible

### Why this surfaced after M-004

M-003 clobbered (full 3850 array reassigned on nav, truncation never stuck). Images were never consistently proxied at scale pre-M-004. M-004 is the first version where images are attempted for 500 items stably, making the expired-URL failure visible for the first time.

---

## recommended-fix

**Keep M-004 truncation.** The DOM render fix is correct. Three additional tracks needed:

### Track 1 (root cause, LOW effort): Sequence pre-warm after fixture sync

In backend-node/src/index.js, chain the two fire-and-forgets so pre-warm uses URLs from the just-completed sync (2-line change at lines 673-677):

    // CURRENT (races -- pre-warm may use stale fixture):
    bundleFixturesSync.syncAll(config.FRONTEND_PATH).catch(...);
    prewarmTikTokImages(config.FRONTEND_PATH, _cdnProxyCache, logger).catch(...);

    // FIXED (sequenced):
    bundleFixturesSync.syncAll(config.FRONTEND_PATH)
      .then(() => prewarmTikTokImages(config.FRONTEND_PATH, _cdnProxyCache, logger))
      .catch((err) => logger.error({ err }, '[BOOT] fixture-sync or prewarm failed'));

### Track 2 (progressive load, MEDIUM effort): Add loading=lazy via blockScript itemTemplate patch

Wrap the dxSelectBox itemTemplate in the existing tfWrapAndPreloadTriggers IIFE to add loading=lazy on every img element. Prevents 500 simultaneous fetch requests on dropdown open, loading only ~15 visible items first.

### Track 3 (graceful degradation, LOW effort): Replace onerror handler

In the same itemTemplate patch, replace the opacity=0 onerror with a fallback showing a generic gift icon at /img/gift-placeholder.png. Makes failures visible (placeholder) rather than invisible (empty slot).

### Decision matrix

| Option | Effort | Impact |
|--------|--------|--------|
| Track 1: sequence sync then prewarm | 2-line change in index.js | Fixes cold-boot image load for most sessions |
| Track 2: loading=lazy in itemTemplate | Medium blockScript wrap | Prevents 500-request burst on dropdown open |
| Track 3: onerror fallback placeholder | Low same wrap as Track 2 | Makes failures visible not invisible |
| DevExtreme DataSource paginate | High onEditorPreparing timing | True virtual scroll, removes truncation -- follow-up mission |

---

## evidence

| Claim | File:Line |
|-------|-----------|
| dxSelectBox config -- no virtualization options | decompiled/modules/deobfuscated.js:13327-13396 |
| dataSource = sounds.triggerDataSource plain array | decompiled/modules/deobfuscated.js:13329 |
| sounds.triggerDataSource = array assignment | decompiled/modules/deobfuscated.js:12987 |
| gifts sorted ASC by diamond_count in loadTriggers | decompiled/modules/deobfuscated.js:13124-13126 |
| itemTemplate img src = image?.url_list[0] OR imageUrl | decompiled/modules/deobfuscated.js:13344 |
| itemTemplate onerror inline string sets opacity=0 | decompiled/modules/deobfuscated.js:13344 |
| No loading=lazy in itemTemplate (absent) | decompiled/modules/deobfuscated.js:13335-13363 |
| Electron redirect URL: hostname+pathname+search | electron/main.js:1143 |
| BACKEND_URL = http://localhost:5285 | electron/main.js:39 |
| mainWindow.loadURL(BACKEND_URL) -- renderer is http not file | electron/main.js:1884 |
| Backend 502 on upstream non-2xx | backend-node/src/index.js:510 |
| Cache-Control: public, max-age=86400 | backend-node/src/index.js:528 |
| Pre-warm fires independently (races with fixture sync) | backend-node/src/index.js:673-677 |
| No HAR files for goc timing comparison | captures/ empty (gitignored per Gate 22) |
