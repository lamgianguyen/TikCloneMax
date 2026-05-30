# M-2026-05-29-006: Gift Icon Layout — Scout CSS Report

**File searched:** `downloads/dx/css/dxdark.css` (795 KB, the only file containing `dx-list` selectors)
Note: `downloads/combo/modules.css`, `downloads/combo/ui.css`, `downloads/css/main.min.css`, `downloads/css/app.css` — none contain any `dx-list` or `dx-item` selectors; they are app-bundle CSS only.

---

## summary

The gift icon (an `<img>` or empty `<div>` with inline `width:40px;height:40px`) is squeezed to near-zero width by a **CSS table layout cascade** on the ancestor chain, not by flexbox.

The two rules that work together as the squeeze mechanism:

```css
/* Parent */
.dx-list-item {
  display: table;
  width: 100%;
  table-layout: fixed;   /* ← THE KILLER */
  overflow: hidden;
}

/* Direct parent of the icon container */
.dx-list-item-content {
  display: table-cell;
  width: 100%;           /* ← collapses sibling columns */
  overflow: hidden;
}
```

`table-layout: fixed` on `.dx-list-item` means column widths are distributed based on the **first row's declared widths**, not content. Since `.dx-list-item-content` declares `width: 100%`, it claims all available space. The icon container (`display:table-row` div > icon child) has no CSS column width and no intrinsic text content, so it gets zero allocation.

**Why FontAwesome glyphs survive:** A FontAwesome `<div>` renders its glyph via `::before { content: "\fXXX" }`, which is a text node with intrinsic content. Text nodes give the browser a minimum-content width to work with, providing resistance to collapse. An `<img>` or empty `<div>` with only inline `style="width:40px"` has no such fallback — the inline style is overridden by the table-fixed algorithm, and there is no intrinsic content to enforce a minimum.

---

## rules-found

| Selector | Squeezing property | File | Why it compresses icon-without-intrinsic-content |
|---|---|---|---|
| `.dx-list-item` | `display: table; table-layout: fixed` | `downloads/dx/css/dxdark.css` | Establishes fixed table layout — column widths are set by explicit CSS, not content. No declared width for the icon column = 0 width. |
| `.dx-list-item-content` | `display: table-cell; width: 100%` | `downloads/dx/css/dxdark.css` | As the sole declared table-cell child, claims 100% of fixed table width, leaving zero for sibling/child columns. |
| `.dx-list-item-content` | `overflow: hidden; white-space: nowrap` | `downloads/dx/css/dxdark.css` | Clips anything that would overflow after zero-width allocation. |
| `.dx-list-item-content::before` | `content: "_"; width: 0; float: left` | `downloads/dx/css/dxdark.css` | Phantom inline element — provides a zero-width placeholder but does not reserve space for icon. |

Exact rule text (from `dxdark.css`):

```css
.dx-list-item {
  position: static;
  cursor: pointer;
  display: table;
  width: 100%;
  table-layout: fixed;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dx-list-item-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: table-cell;
  width: 100%;
}
```

---

## flex-vs-table

`.dx-list-item-content` is **NOT flexbox** in the DevExtreme dxdark theme. It is `display: table-cell`.

- No `display: flex` is set on `.dx-list-item`, `.dx-list-item-content`, or any dx-list ancestor.
- The squeeze is entirely a **CSS table-layout: fixed** problem, not a flex min-width:0 problem.
- `.dx-list-item` is `display: table` with `table-layout: fixed`. Its only declared table-cell child is `.dx-list-item-content` with `width: 100%`. This is effectively a single-column fixed table — any content that does not participate as a declared table-cell gets collapsed.

The inner template structure `<div style="display:table-row">` inside `.dx-list-item-content` (a `table-cell`) creates **anonymous table boxing**. The browser treats the table-row as an anonymous table wrapper inside the cell. Within that inner table-row, the icon `<img>/<div>` is not a `table-cell` element and has no CSS `display: table-cell` — it is rendered as a block/inline inside the row. Since the outer fixed-table already allocated 100% to `.dx-list-item-content`, and the icon has no CSS `width` that can override the fixed allocation at the table-cell level, it renders at zero or near-zero.

The `display: table-row` on the wrapper div is the second contributor: it causes the row to stretch to the full width of the table-cell it lives in, and the icon and span compete for that row's width as inline/block children. Without `display: table-cell` on the icon, and without `flex-shrink: 0`, the icon is squeezed.

---

## recommendation

**Primary fix — make the icon a proper table-cell with an explicit width:**

In the itemTemplate, change the icon's wrapper to `display: table-cell` with a fixed width, matching how DevExtreme structures its own badge/chevron columns:

```html
<div style="display:table; width:100%; table-layout:fixed;">
  <div style="display:table-cell; width:40px; min-width:40px; vertical-align:middle;">
    <img style="height:40px; width:40px;" src="..." />
  </div>
  <span style="display:table-cell; padding-left:20px; vertical-align:middle;">name</span>
</div>
```

**Alternative fix — CSS override targeting the icon specifically:**

Add a CSS rule that gives the icon a fixed non-compressible width inside the list context:

```css
.dx-list-item-content .gift-icon,
.dx-list-item-content img[src*="gift"],
.dx-list-item-content > div > div:first-child {
  display: table-cell !important;
  width: 40px !important;
  min-width: 40px !important;
  flex-shrink: 0;
  vertical-align: middle;
}
```

**Root cause in one line:** `.dx-list-item` uses `display:table; table-layout:fixed` and `.dx-list-item-content` claims `width:100%` as the only declared column, so any non-table-cell child of the itemTemplate gets zero-width allocation. The fix is to make the icon a `display:table-cell` with an explicit pixel width.
