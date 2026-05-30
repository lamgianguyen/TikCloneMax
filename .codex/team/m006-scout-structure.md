# m006-scout-structure - Gift Icon Layout Analysis

**Mission:** M-2026-05-29-006  
**Role:** Scout-Item-Structure  
**Date:** 2026-05-29  
**Source files:** blockScript.txt lines 1062-1109, deobfuscated.js lines 13335-13363

---

## current-structure

### Row element

CSS: display:table-row; height:40px

.dx-list-item-content is NOT display:table -- it is flex (DevExtreme default).
No display:table parent anywhere in itemTemplate.
The row is an **orphan table-row** that triggers anonymous table generation.

### Gift icon element (item.icon is falsy)

Element: div

Final computed CSS (all jQuery .css() calls resolved):
- display: inline-block
- height: 40px; width: 40px
- background-image: url(proxy-url) or none
- background-size: contain; background-repeat: no-repeat; background-position: center
- flex-shrink: 0  (INERT -- containing block is not flex)
- text-align: center

No display:table-cell.
### Event icon element (item.icon truthy -- FontAwesome)

Element: div with class fas fa-xxx

Final computed CSS:
- font-size: 30px; color: #31b5d5
- height: 40px; width: 40px; text-align: center

No display:table-cell. No explicit display (defaults block). Has FontAwesome ::before glyph character.

### Label element

Element: span

CSS: display:table-cell; padding-left:20px; vertical-align:top

This IS explicitly display:table-cell.

---

## squeeze-mechanism

### Anonymous table generation

When display:table-row appears without a display:table ancestor, the browser generates:

    [anonymous table]                  <- generated, display:table
      [anonymous row-group]            <- generated
        div display:table-row          <- our row
          div display:inline-block     <- icon -- wrapped in anonymous table-cell
          span display:table-cell      <- label -- proper explicit cell

### Anonymous table-cell sizing rule (CSS Table Model Section 17.5)

Anonymous table-cells are sized by the min-content width of their contents.
A child with width:40px does NOT force the anonymous cell to 40px unless
the child has intrinsic inline content (replaced elements, text nodes, pseudo-element glyphs).

### Why gift icon (div + background-image) collapses

The gift icon div has background-image as its only visual content -- no text nodes,
no child DOM elements, no replaced-element intrinsic dimensions.
The min-content width of a background-only div is ZERO.
The anonymous table-cell wrapping it collapses to ~0px.

The width:40px on the child div applies to the div own box model but does NOT
stretch the anonymous cell. The table algorithm assigns this column 0 width.
The label span (explicit display:table-cell) claims all available width.
The gift icon renders inside a 0-wide clip box: invisible or a 1-2px sliver.

flex-shrink:0 on the icon is COMPLETELY INERT here -- it only applies when the containing
block is a flex container. The anonymous table-cell is a block container.

### Why event icon survives in the same structure

FontAwesome CSS injects a glyph via ::before pseudo-element. This glyph character has
a non-zero advance width (~20-30px at 30px font-size). Inline text content drives the
anonymous table-cell min-content calculation. The anonymous cell is sized to the glyph
advance width. The event icon column is ~25px wide -- icon visible.

Key asymmetry:
- FontAwesome ::before glyph = inline text = non-zero intrinsic width -> anonymous cell ~25px -> visible
- background-image = CSS decoration = zero intrinsic inline content -> anonymous cell 0px -> squeezed/invisible

### Why goc img worked but our div does not

Native bundle (deobfuscated.js:13344) uses img. An img is a REPLACED ELEMENT with intrinsic dimensions.
An img with width:40px; height:40px is treated as having 40px intrinsic width in the CSS Table Model.
Anonymous table-cell for an img child sizes to 40px -> column 40px wide -> image visible.

Our M-005 patch switched img to div+background-image to avoid cross-origin img quirks.
The proxy URL solves the load problem, but the element-type change from img (replaced, intrinsic 40px)
to div (non-replaced, intrinsic 0) causes the anonymous-cell collapse. This is the root cause.

---

## goc-comparison

Native bundle (deobfuscated.js lines 13335-13363) is structurally identical to our patch
EXCEPT the icon element type:

| Icon path | Element | Replaced? | Intrinsic width in anonymous table-cell |
|---|---|---|---|
| Goc gift | img | YES | 40px (from CSS width:40px) |
| Our patch gift | div + background-image | NO | 0px |
| Event icon (both) | div class=fas + ::before glyph | NO but glyph gives inline content | ~25px |

Same row (display:table-row), same absent display:table parent, same label (display:table-cell).
The ONLY layout-relevant difference is replaced vs non-replaced element in anonymous-table-cell context.

---

## recommended-structure

### Option (a): Make icon display:table-cell; width:40px

Set display:table-cell; width:40px; min-width:40px on icon. It becomes an explicit cell.

Weakness: CSS table column algorithm distributes available width proportionally between two explicit cells.
Hard 40px not guaranteed on narrow dropdown containers.
display:table-cell on a background-only div has subtle cross-browser height behavior edge cases.

### Option (b): Change row + icon + label to flexbox [RECOMMENDED]

Change row to display:flex; flex-direction:row; align-items:center; height:40px; width:100%.
Change icon to flex:0 0 40px; min-width:40px.
Change label to flex:1; min-width:0.

Why robust:
- Exits anonymous-table-cell model entirely -- no more content-sizing surprises
- Flex sizing is element-type-agnostic: works for img, div+background, FontAwesome, any future type
- flex:0 0 40px is an unconditional hard guarantee (flex-basis:40px, no shrink, no grow)
- flex-shrink:0 already written on gift icon (inert in table context) becomes functional
- No !important overrides needed; fix co-located with template code we fully own

### Option (c): earlyCss override (least preferred)

Target .dx-list-item-content div via earlyCss, override display:flex !important.
Requires overriding inline style with !important, precise selector, must survive DevExtreme rebuilds.
More fragile; fix separated from template code.

### Exact code for option (b) -- patchedItemTemplate changes in blockScript.txt

Row (line 1065, was display:table-row):

  var row = jQuery("<div>").css({
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    height: "40px",
    width: "100%",
  });

Gift icon (lines 1079-1088, was display:inline-block):

  iconEl = jQuery("<div>").css({
    height: "40px",
    width: "40px",
    "min-width": "40px",
    flex: "0 0 40px",
    display: "block",
    "background-image": proxySrc ? "url(" + proxySrc + ")" : "none",
    "background-size": "contain",
    "background-repeat": "no-repeat",
    "background-position": "center center",
  });

Shared iconEl tail (line 1101, was height/width/text-align only):

  iconEl
    .css("height", "40px")
    .css("width", "40px")
    .css("min-width", "40px")
    .css("flex", "0 0 40px")
    .css("text-align", "center");

Label cell (lines 1102-1107, was display:table-cell):

  var labelCell = jQuery("<span>")
    .css("flex", "1")
    .css("min-width", "0")
    .css("padding-left", "10px")
    .css("align-self", "flex-start")
    .css("padding-top", "2px")
    .append(nameDiv)
    .append(subTextDiv);

Event icon branch (lines 1069-1071) requires no change.
flex:0 0 40px applied in the shared tail is sufficient for FontAwesome div.

NOTE on min-width:0 on label: Without it, a flex child with long text (long gift name)
forces the flex item to min-content width and overflows the row container.
min-width:0 lets the flex algorithm shrink the label and truncate/wrap text normally.

---

## Summary answers to the four questions

1. Is the icon element display:table-cell?
   No. Gift icon is display:inline-block. Event icon is default block.
   Neither is table-cell. Both get wrapped in anonymous table-cells inside display:table-row.

2. Does the row display:table-row have a display:table parent?
   No. .dx-list-item-content is flex. The orphan table-row triggers anonymous table generation.
   The icon div lands inside an anonymous table-cell.

3. Why event icon survives but gift collapses?
   FontAwesome ::before glyph = inline text = non-zero intrinsic width -> anonymous cell ~25px -> visible.
   background-image div = CSS decoration = zero intrinsic inline content -> anonymous cell 0px -> invisible.

4. Recommended fix:
   Option (b) -- change row to display:flex, icon to flex:0 0 40px + min-width:40px,
   label to flex:1; min-width:0. Exits anonymous-table-cell model entirely.
   Works unconditionally for all icon types.
