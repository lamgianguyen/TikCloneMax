# M-007: goc dropdown CSS analysis

## dxdark-rules

### .dx-list-item (dxdark.css line 4894-4903)
  position: static; cursor: pointer; display: table; width: 100%;
  table-layout: fixed; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;

### .dx-list-item-content (dxdark.css line 4904-4910)
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  display: table-cell; width: 100%;
  (NO vertical-align set -- browser default = baseline)

### .dx-list-item-content padding (dxdark.css line 5291-5293)
  padding: 10px;  (standard)
  Dropdown override: .dx-dropdownlist-popup-wrapper ... .dx-list-item-content { padding: 7px 9px; }  (line 6526-6527)

### .dx-list-item-content::before (dxdark.css line 4911-4917)
  content: "_"; color: transparent; display: inline-block; width: 0; float: left;

### .dx-list (line 4859-4862)
  margin: 0; min-height: 3em;  (NO text-align)

### .dx-overlay-content (line 4169-4175)
  position: absolute; pointer-events: auto; z-index: 1000; outline: 0; overflow: hidden;
  (NO text-align)

### .dx-overlay-content .dx-popup-content (line 7702-7705)
  box-sizing: content-box;  (NO text-align)

### text-align:left ONLY on .dx-list .dx-empty-message (line 4918-4924)
  -- this is the "no items" placeholder div, NOT .dx-list-item or .dx-list-item-content

## text-align-inheritance

Ancestor chain for dropdown item text:
  html > body > .dx-overlay-content > .dx-popup-content > .dx-list > .dx-list-item > .dx-list-item-content > [inner div] > label span

NONE of these set text-align in dxdark.css.
Our earlyCss: body { background: #1c1d22; color: #e5e7eb; } -- no text-align.
Effective text-align = LEFT (browser default).

CONCLUSION: "chu lech" is NOT caused by text-align:center.
There is NO center anywhere in the ancestor chain.
The misalignment is structural/vertical, not horizontal.

## before-spacer-role

.dx-list-item-content::before: content:"_", color:transparent, display:inline-block, width:0, float:left

This creates a zero-width float at the left edge of the table-cell's anonymous block.
Purpose: establish a baseline-anchoring inline context at the cell top.

Effect on our itemTemplate (img-first items):
  .dx-list-item-content (table-cell)
    ::before  <-- float:left, width:0, lives in same anon block as the inner div
    [div style="display:table-row;height:40px"]  <-- inner row
      [img or icon-div]  <-- first child
      [span display:table-cell; padding-left:20px; vertical-align:top]

The float at width:0 does NOT shift text horizontally.
BUT it participates in the inline formatting context and overlaps the leading edge of the inner div.
For an img (inline replaced element) at the cell left edge, the float stacks on top of the img,
making it appear invisible (icon "co hien nhung bi che").
For text-only items: float at width:0 is invisible, no effect.

M-005 disabling ::before is CORRECT and NECESSARY for img-first items.

## our-overrides

### M-005 (earlyCss.txt lines 521-532)
  .dx-overlay-content .dx-list-item-content::before,
  .dx-popup-content .dx-list-item-content::before {
    display: none !important; content: none !important; background: none !important;
  }
  .dx-overlay-content .dx-list-item-content > div,
  .dx-popup-content .dx-list-item-content > div {
    position: relative; z-index: 1;
  }
VERDICT: KEEP. Removes float interference on icon. Scoped to dropdown overlays only.

### M-006 (earlyCss.txt lines 543-568)
Inner row -> display:table; table-layout:auto; width:100%
:first-child -> display:table-cell; width/min/max:40px; height:40px; vertical-align:top
:first-child > * -> display:inline-block; width:40px; height:40px; background-size:contain

CONFLICT ANALYSIS:
- OUTER .dx-list-item (table; table-layout:fixed) + .dx-list-item-content (table-cell; width:100%) is UNTOUCHED.
- The inner [style*="table-row"] div is a CHILD of .dx-list-item-content, not of .dx-list-item.
- Without M-006: goc bundle's div has inline display:table-row inside a table-cell.
  The anonymous table wrapper inherits the OUTER table-layout:fixed.
  Under fixed-layout: column with background-image only (no text) -> 0px width (collapsed).
- With M-006: inner div -> display:table; table-layout:auto.
  Auto layout measures intrinsic width. :first-child forced to 40px table-cell. Icon shows correctly.
- NO CONFLICT with outer dxdark fixed-table structure. Nested table inside table-cell is valid CSS.

### Does M-006 need to be removed when matching goc img structure?
NO. M-006 is NECESSARY to counteract table-layout:fixed collapsing the icon column.
It does not conflict with goc. Keep as-is, with one addition (see recommendation).

## recommendation

Q1: text-align on ancestor chain?
  Left (browser default). No center anywhere. Not the misalignment cause.

Q2: Does goc rely on ::before for alignment?
  No. Disable it for img-first items. M-005 correct.

Q3: Do M-006 overrides conflict with goc img structure?
  No conflict. Keep M-006.

Q4: Why does goc text appear left + "vertically centered"?
  - Left: browser default text-align:left, no override.
  - "Centered" appearance: goc bundle sets vertical-align:top on label span (deobfuscated.js:13360 inline style).
    In a 40px cell, ~14px font + ~20px text block, top-align with 7-10px padding gives a "looks centered" effect.
    NOT true vertical centering -- just visually acceptable because cell is only 40px.
  - Our clone's text misalignment ("chu lech"): label span inherits vertical-align:top from goc inline style,
    which places text at the very top of the cell. CSS padding-left:20px is set on the span but NO padding-top.
    If our cell renders at exactly 40px height correctly, text should look the same as goc.
    If text appears HIGHER than goc -> padding or line-height difference -> fix: add vertical-align:middle.

ACTION ITEMS:

1. KEEP M-005 as-is.

2. KEEP M-006 inner row + :first-child rules.

3. ADD after M-006 block:
  /* M-007: label span vertical alignment -- override goc bundle inline vertical-align:top
     on the label span so text appears vertically centered in 40px row. */
  .dx-overlay-content .dx-list-item-content [style*="table-row"] > :nth-child(2),
  .dx-popup-content   .dx-list-item-content [style*="table-row"] > :nth-child(2) {
    vertical-align: middle !important;
  }

4. OPTIONAL REMOVE: M-006 ":first-child > *" grandchild rule (display:inline-block on img children).
   Safe to remove for pure img icons. Keep only if font-glyph class-based icons need it.

Summary:
| Override                                    | Decision | Reason                              |
|---------------------------------------------|----------|-------------------------------------|
| M-005 ::before { display:none }             | KEEP     | Prevents float overlaying icon      |
| M-005 > div { z-index:1 }                   | KEEP     | Harmless                            |
| M-006 inner row -> table;table-layout:auto  | KEEP     | Prevents fixed-table column collapse|
| M-006 :first-child -> 40px table-cell       | KEEP     | Pins icon column width              |
| M-006 :first-child vertical-align:top       | KEEP     | Icon aligns to top (intended)       |
| M-006 :first-child > * display:inline-block | OPTIONAL | Keep for glyph icons, drop for img  |
| NEW :nth-child(2) vertical-align:middle     | ADD      | Fixes text "chu lech" root cause    |
