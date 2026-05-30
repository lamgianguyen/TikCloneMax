# Current Mission

## Mission ID
M-2026-05-29-007-match-goc-itemtemplate

## Objective
Images hiện rồi (M-006) nhưng TEXT lệch khỏi gốc ("chữ lệch lum la"). User: hình 2 (gốc) là target. Gốc dùng structure đơn giản (icon plain div/img width:40px + label span table-cell), KHÔNG có extra table-cell wrapper (M-006 thêm) → text lệch. Cần extract EXACT gốc itemTemplate + dropdown CSS từ obfuscated/decompiled code → replicate 1:1.

## Gốc HTML (user-provided, event item)
```html
<div style="display:table-row;height:40px">
  <div class="fas fa-share" style="font-size:30px;color:rgb(49,181,213);height:40px;width:40px;text-align:center"></div>
  <span style="display:table-cell;padding-left:20px;vertical-align:top">
    <div style="font-size:1.2em">Share</div>
    <div style="font-size:0.8em;margin-top:3px"></div>
  </span>
</div>
```
Note: gốc icon NOT wrapped in extra table-cell. Gốc gift uses `<img>` (replaced element → 40px intrinsic → anonymous cell works). Our M-005 div-bg (0 intrinsic) broke it; M-006 wrapper fixed size but deviated alignment.

## Status
SCOUTING — 2 obfuscated-code agents (per user: 1 Opus + 1 Sonnet).

## Active agents
1. **Scout-Goc-ItemTemplate** [Opus + max thinking] → read `decompiled/modules/deobfuscated.js` ~13327-13396: extract EXACT triggerId itemTemplate (every element + every CSS prop, event-icon + gift-img branches + label + row). Also check fieldTemplate. Write `.codex/team/m007-goc-itemtemplate.md`.
2. **Scout-Goc-DropdownCSS** [Sonnet + max thinking] → read `downloads/dx/css/dxdark.css` + bundle CSS: find dropdown/list container CSS affecting text-align + item layout (why gốc aligns left clean). `.dx-list-item-content`, text-align inheritance, `.dx-list` overlay. Write `.codex/team/m007-goc-dropdowncss.md`.

## Then
Commander reconcile → Engineer replicate gốc EXACTLY (revert M-005 div-bg → `<img src=proxy no-onerror>`, revert M-006 wrapper, restore gốc label CSS). Keep proxy rewrite + truncate.

## Context — current deviations from gốc (to revert)
- M-005: gift `<img>` → `<div background-image>` (0 intrinsic → broke anonymous cell)
- M-006 change A: extra `<div display:table-cell>` wrapper around icon
- M-006b: label text-align:left, width:100%, vertical-align:middle, padding-left:12px (gốc: vertical-align:top, padding-left:20px, no text-align/width)
- M-006 change B (earlyCss): table-layout:auto overrides (may be unneeded if match gốc img structure)
- KEEP: tfWrapAndPreloadTriggers (truncate 500), tfRewriteGiftImagesToCache (proxy + onerror-clear), toProxy helper
