# DOM, Layout, and Paint

JavaScript performance is not only about calculations.

Changing the DOM can trigger browser rendering work.

To optimize UI code, you need to understand the basic rendering steps.

## Style, Layout, Paint, and Composite

After JavaScript changes the page, the browser may need to:

1. Recalculate styles.
2. Calculate layout.
3. Paint pixels.
4. Composite layers together.

Not every change requires every step.

Changing text content may affect layout.

Changing a color may require paint.

Changing `transform` or `opacity` can often be handled during compositing.

## Layout

Layout means calculating the size and position of elements.

These changes often require layout:

- changing width or height
- changing text that affects wrapping
- adding or removing elements
- changing font size
- reading or writing position-related styles

Layout can be expensive when many elements are involved.

## Reflow and Layout Thrashing

"Reflow" is an older term often used to mean layout.

Layout thrashing happens when code repeatedly writes to the DOM and then immediately reads layout information.

```js
for (const box of boxes) {
  box.style.width = "200px";
  console.log(box.offsetHeight);
}
```

The browser may need to recalculate layout many times.

## Batch Reads and Writes

A better pattern is to group reads together and writes together.

```js
const heights = [];

for (const box of boxes) {
  heights.push(box.offsetHeight);
}

for (const box of boxes) {
  box.style.width = "200px";
}
```

This gives the browser more room to optimize.

## Build Before Inserting

Adding many elements one by one can create repeated work.

```js
for (const item of items) {
  const li = document.createElement("li");
  li.textContent = item.name;
  list.append(li);
}
```

This may be fine for small lists.

For larger lists, build with a `DocumentFragment`.

```js
const fragment = document.createDocumentFragment();

for (const item of items) {
  const li = document.createElement("li");
  li.textContent = item.name;
  fragment.append(li);
}

list.append(fragment);
```

The fragment lets you prepare many nodes before inserting them into the live DOM.

## Avoid Rendering Too Much

The fastest DOM update is the one you do not make.

If only one item changes, avoid replacing the whole list.

```js
function updatePrice(row, price) {
  const priceCell = row.querySelector(".price");

  if (priceCell.textContent === String(price)) {
    return;
  }

  priceCell.textContent = price;
}
```

Small checks can prevent unnecessary DOM work.

## Large Lists

Rendering thousands of DOM nodes can be slow and memory-heavy.

For large lists, consider:

- pagination
- search and filtering
- virtualized lists
- rendering only visible items
- simplifying each item template

Virtualization means keeping only the visible rows in the DOM and replacing them as the user scrolls.

## Animation-Friendly Properties

For smooth animations, prefer properties that avoid layout.

Often better:

- `transform`
- `opacity`

Often more expensive:

- `width`
- `height`
- `top`
- `left`
- `margin`

Example:

```js
panel.style.transform = "translateX(100px)";
panel.style.opacity = "1";
```

This is usually easier for the browser to animate smoothly than repeatedly changing layout-related properties.

## Common Mistakes

- Rebuilding large parts of the DOM for small changes.
- Mixing layout reads and writes inside loops.
- Animating layout-heavy properties.
- Rendering huge lists without pagination or virtualization.
- Assuming DOM operations are cheap because each line of JavaScript looks simple.

## Summary

DOM updates can trigger style, layout, paint, and compositing work.

Batch DOM reads and writes, avoid unnecessary updates, use fragments for large insertions, and prefer animation-friendly properties where appropriate.
