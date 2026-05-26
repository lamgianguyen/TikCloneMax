# Archived Gates

Gates moved out of [`CLAUDE.md`](../CLAUDE.md) because they are superseded, but kept for historical reference (root-cause trail, anti-pattern record, partial discoveries still useful).

When you read a `[ARCHIVED]` stub in `CLAUDE.md`, jump here for the full body.

---

## Gate 19: Layout overflow khi window resize (responsive)

**Status:** SUPERSEDED by Gate 20 (overlay library page root cause was `#pages` width, not card widths).
**Still useful for:** Tailwind `grid-cols-*` responsive pattern on other pages.

> Diagnosed sai root cause cho overlay library page. Vẫn giữ để reference các pattern responsive grid (cho các trang Tailwind `grid-cols-*`), nhưng cho **overlay library page** dùng Gate 20.

**Triệu chứng:** Khi maximize, các card 2-column (Ghép xu PRO + Hũ đựng tiền xu PRO, etc.) extend ra ngoài viewport. Body scrollWidth (2250px) > viewport (1920px).

**Root cause (sai):** Bundle dùng **LEGACY class `.obsOverlayContainer`** (NOT Tailwind grid-cols-*). Container `display: flex` không wrap. Cards có `min-width: 560px` (cũ) fix-width → 2 cards = ~1900px → overflow.

Cards classes verified từ probe:
- `.obsOverlayOnPage.greyBackgroundSection.greyBackgroundSectionOverlayFix` (Ghép xu)
- `.greyBackgroundSection.greyBackgroundSectionOverlayFix` (Hũ đựng tiền xu)
- `.graphicSection` (legacy)

Anti-pattern (đã từng có):
- ❌ CSS chỉ target `.graphicSection` → miss `.obsOverlayOnPage` và `.greyBackgroundSection` → fix không apply

**Fix (CSS responsive grid override — vẫn dùng được cho các page khác):**

```css
/* Override fixed columns với auto-fit + minmax */
[class*="grid-cols-2"]:not([class*="md:grid-cols-2"]):not([class*="lg:grid-cols-2"]) {
  grid-template-columns: repeat(auto-fit, minmax(min(450px, 100%), 1fr)) !important;
}
[class*="grid-cols-3"]:not([class*="md:grid-cols-3"]):not([class*="lg:grid-cols-3"]) {
  grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr)) !important;
}
/* Card grid children không push content ra ngoài */
div[class*="grid"] > div {
  min-width: 0 !important;
  overflow: hidden !important;
}
/* Input + buttons trong card shrink-friendly */
div[class*="grid"] input[type="text"] {
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}
```

**Pattern principle:**
> Bundle's grid layouts thường fixed-columns. Khi cần responsive, override với `auto-fit` + `minmax(min(IDEAL_WIDTH, 100%), 1fr)`. Đặt `min-width: 0` cho grid children để khắc phục flexbox/grid default `min-width: auto` đẩy nội dung ra. Selector loại trừ `:not([class*="md:..."])` / `:not([class*="lg:..."])` để không phá responsive breakpoints bundle đã set sẵn.

**Anti-pattern:**
- ❌ Đặt `overflow-x: auto` ở body — tạo scroll bar horizontal không đẹp
- ❌ Set max-width fixed (e.g., `max-width: 1200px`) — bị white space ở screens lớn

---

## Gate 23c: Pinia navigation store — Object.defineProperty trap for isPro + flag-icons proxy + AI voices loader (2026-05-22)

**Status:** PARTIALLY SUPERSEDED by Gate 30 (in `CLAUDE.md`).
- ❌ `Object.defineProperty` trap cho `nav.isPro` là **SAI** (không trigger Vue 3 reactivity) → dùng plain `nav.isPro = true` qua reactive proxy `set` trap.
- ✅ Discovery về Pinia nav store + flag-icons proxy + AI voices loader chain vẫn đúng và load-bearing.

Đọc Gate 30 trong `CLAUDE.md` trước khi sửa code liên quan chip / Pro.

> **Discovery quan trọng nhất hôm đó:** Vue chip + Pro UI **KHÔNG** bind vào `window.session.me.userFeatures.isPro`. Chúng bind vào Pinia store `navigation`. Patch `window.session.me` không propagate sang Pinia computed refs.

**Probe runtime (verified):**

```js
// Vue Pinia state structure (verified via probe in DevTools Console):
document.querySelector('[data-v-app]').__vue_app__.config.globalProperties.$pinia.state.value.navigation
// {
//   isPro: false,                     ← Vue chip checks THIS, not window.session.me
//   ttsProCredits: 0,                 ← bundle's syncNavigationStoreCredits()
//                                      writes to window.navigationStore (which
//                                      doesn't exist) → Pinia stays at default
//   ttsFreeMessages: 25,
//   ttsFreeMessagesMax: 25,
//   trialBannerDismissed: true,
// }
```

**Bundle dead code:** [modules/deobfuscated.js line 4789-4795](../decompiled/modules/deobfuscated.js):
```js
window.navigationStore.set("ttsFreeMessages", tts.freeMessages || 0);
window.navigationStore.set("ttsProCredits", tts.proCredits || 0);
```
**`window.navigationStore` không tồn tại** (renamed/moved to Pinia trong Vue refactor) → entire sync function silently fails. Pinia store stays default.

**Critical fix — ~~Object.defineProperty trap on Pinia store~~ → SUPERSEDED, dùng PLAIN ASSIGNMENT:**

> ⚠️ **2026-05-26 update:** Khẳng định "direct assignment `nav.isPro = true` FAILS" là **SAI**. Đó là PINIA OPTIONS-STORE với `state()` function trả về plain bool — `nav.isPro = true` đi qua Vue 3 reactive proxy's `set` trap → trigger reactivity → chip re-render. **`Object.defineProperty` không qua proxy `set` trap → Vue dep notifier KHÔNG fire → chip stuck.** Xem Gate 30 trong `CLAUDE.md` để biết chi tiết + reproducer.

```js
// [blockScript.txt::tfPiniaProTrap] — CORRECT approach (post-2026-05-26)
if (nav.isPro !== true) {
  try { nav.isPro = true; } catch(_){}    // plain assignment, qua reactive set trap
}

// Plain ref writes — also trigger Vue reactivity
nav.ttsProCredits = 100000;
nav.ttsProCreditsMax = 100000;
nav.trialBannerDismissed = true;
```

~~OLD WRONG (defineProperty)~~:
```js
// ❌ DO NOT USE — descriptor change doesn't trigger Vue reactivity
Object.defineProperty(nav, 'isPro', { get: () => true, set: () => {} });
```

**Result:**
- Chip flips 25 → 100k ✅
- PRO badge appears under app title ✅
- Sidebar "Nâng cấp lên PRO" hidden ✅

**Anti-pattern documented:**
- ❌ Patch ONLY `window.session.me.userFeatures.isPro` — Pinia computed reads from somewhere else, doesn't propagate
- ❌ Direct `nav.isPro = true` — silently fails if Pinia uses `computed()` (NOT applicable here — Pinia store is options-store với plain bool)
- ❌ Patch ONLY `window.tts.proCredits` — bundle's dead sync code doesn't propagate to Pinia
- ✅ Plain assignment cho Pinia options-store refs → Vue reactive set trap fire → chip re-render

**Pattern principle — Vue Pinia state vs vanilla window (corrected):**

> Vue 3 + Pinia stores state in reactive proxies. Pinia OPTIONS-store với `state()` returning plain bool/number → field readable AND writable từ ngoài qua proxy `set` trap. Pinia SETUP-store với `const isPro = computed(...)` → field read-only từ ngoài (computed refs don't have `set` trap).
>
> **Để identify store type:** đọc bundle's store definition. Nếu thấy `state: () => ({ isPro: false })` → options-store, plain assignment OK. Nếu thấy `setup() { const isPro = computed(...); return { isPro } }` → setup-store, plain assignment silently fails.

---
