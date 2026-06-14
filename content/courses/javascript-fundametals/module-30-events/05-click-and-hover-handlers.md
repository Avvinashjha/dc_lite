# Click and Hover Handlers

Click and hover interactions are some of the first events you will use in the
browser.

They are common in buttons, menus, cards, tooltips, navigation, and interactive
lists.

## Click Handlers

Use a `click` listener when the user activates an element with a mouse, trackpad,
touch, or keyboard.

```html
<button id="menu-button">Open menu</button>
<nav id="menu" hidden>...</nav>
```

```js
const button = document.querySelector("#menu-button");
const menu = document.querySelector("#menu");

button.addEventListener("click", () => {
  menu.hidden = !menu.hidden;
});
```

For real buttons, prefer the `<button>` element. It already supports keyboard
activation and communicates its purpose to assistive technologies.

## Reading Click Information

The event object can tell you where the click happened.

```js
document.addEventListener("click", (event) => {
  console.log(event.clientX, event.clientY);
});
```

Useful mouse event properties:

| Property | Meaning |
| --- | --- |
| `clientX` / `clientY` | position inside the viewport |
| `pageX` / `pageY` | position on the page |
| `button` | which mouse button was used |
| `altKey`, `ctrlKey`, `shiftKey`, `metaKey` | modifier keys |

## Hover Handlers

Hover behavior is often built with `mouseenter` and `mouseleave`.

```js
const card = document.querySelector(".product-card");

card.addEventListener("mouseenter", () => {
  card.classList.add("is-active");
});

card.addEventListener("mouseleave", () => {
  card.classList.remove("is-active");
});
```

Use CSS `:hover` for purely visual effects when possible.

```css
.product-card:hover {
  border-color: blue;
}
```

Use JavaScript hover handlers when behavior needs logic, state, timing, or
communication with other parts of the page.

## `mouseover` vs `mouseenter`

`mouseover` bubbles.

`mouseenter` does not bubble.

That means `mouseover` can fire when moving between child elements inside the
same parent.

```js
card.addEventListener("mouseover", () => {
  console.log("Pointer moved over card or one of its children");
});

card.addEventListener("mouseenter", () => {
  console.log("Pointer entered the card boundary");
});
```

For simple hover behavior on one element, `mouseenter` and `mouseleave` are
usually easier to reason about.

## Pointer Events for Modern Input

Mouse events do not fully describe touch and stylus input.

Pointer events are designed for multiple input types.

```js
button.addEventListener("pointerenter", () => {
  button.classList.add("is-hovered");
});

button.addEventListener("pointerleave", () => {
  button.classList.remove("is-hovered");
});
```

For components that should work across devices, consider pointer events.

## Accessibility Considerations

Do not make important behavior available only on hover.

Some users:

- navigate with a keyboard
- use touch screens where hover does not exist
- use assistive technology
- have motor impairments

If hover shows important information, make it available through focus or click
too.

```js
const help = document.querySelector("#help");
const tooltip = document.querySelector("#tooltip");

function showTooltip() {
  tooltip.hidden = false;
}

function hideTooltip() {
  tooltip.hidden = true;
}

help.addEventListener("mouseenter", showTooltip);
help.addEventListener("mouseleave", hideTooltip);
help.addEventListener("focus", showTooltip);
help.addEventListener("blur", hideTooltip);
```

## Common Mistakes

Using a `div` as a button without keyboard support:

```html
<div id="save">Save</div>
```

Prefer:

```html
<button id="save">Save</button>
```

Putting critical content behind hover only:

```text
If the user cannot hover, they may never discover the content.
```

Doing heavy work on `mousemove`:

```js
document.addEventListener("mousemove", () => {
  // This can run many times per second.
});
```

## Summary

Click handlers are used for activation. Hover handlers are used for pointer
presence.

Use semantic elements, support keyboard and touch users, and prefer CSS for
simple visual hover effects.
