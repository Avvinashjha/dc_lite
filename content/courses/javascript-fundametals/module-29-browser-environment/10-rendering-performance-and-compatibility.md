# Rendering, Performance, and Compatibility

Browser JavaScript shares the page with rendering work.

The browser must parse HTML, apply CSS, calculate layout, paint pixels, respond to input, run JavaScript, and communicate with the network.

Understanding the basics helps you write code that feels responsive.

## The Rendering Pipeline

Browsers are complex, but a simplified rendering pipeline looks like this:

1. Parse HTML into the DOM.
2. Parse CSS into style rules.
3. Combine DOM and CSS to compute styles.
4. Calculate layout.
5. Paint pixels.
6. Composite layers onto the screen.

JavaScript can affect this process by changing the DOM or styles.

```js
const box = document.querySelector(".box");

box.classList.add("expanded");
```

This may require the browser to recalculate style, layout, and paint.

## Reflow and Repaint

Layout recalculation is often called reflow.

Painting updates pixels.

Changes that affect size or position can trigger layout.

Examples:

- changing width or height
- adding or removing elements
- changing text that changes element size
- changing font size

Changes that affect only color may require paint but not layout.

```js
button.style.backgroundColor = "green";
```

You do not need to memorize every internal detail. The practical lesson is to avoid excessive DOM changes in tight loops.

## Layout Thrashing

Layout thrashing happens when code repeatedly writes to the DOM and then reads layout.

```js
for (const item of items) {
  item.style.width = "200px";
  console.log(item.offsetWidth);
}
```

The browser may need to recalculate layout many times.

Prefer grouping reads and writes.

```js
const widths = [];

for (const item of items) {
  widths.push(item.offsetWidth);
}

for (const item of items) {
  item.style.width = "200px";
}
```

For small pages, this may not matter. For large or frequently updated UI, it can.

## Long Tasks

JavaScript usually runs on the browser's main thread.

If your code runs for too long, the browser cannot respond to input or render updates.

```js
button.addEventListener("click", () => {
  for (let i = 0; i < 1_000_000_000; i += 1) {
    // Expensive work
  }
});
```

This can freeze the page.

Ways to improve responsiveness:

- break work into smaller chunks
- avoid unnecessary loops
- debounce or throttle frequent events
- use `requestAnimationFrame()` for visual updates
- move heavy work to a Web Worker when appropriate

## `requestAnimationFrame`

`requestAnimationFrame()` schedules visual work before the next repaint.

```js
function moveBox() {
  const box = document.querySelector(".box");

  box.style.transform = "translateX(100px)";
}

requestAnimationFrame(moveBox);
```

It is useful for animation-related DOM updates.

For repeated animation:

```js
let position = 0;
const box = document.querySelector(".box");

function animate() {
  position += 2;
  box.style.transform = `translateX(${position}px)`;

  if (position < 200) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
```

Prefer CSS animations or transitions for simple visual effects.

## Scroll and Resize Events

`scroll` and `resize` can fire many times.

Avoid doing expensive work on every event.

```js
window.addEventListener("scroll", () => {
  console.log(window.scrollY);
});
```

For expensive work, use throttling.

```js
let scheduled = false;

window.addEventListener("scroll", () => {
  if (scheduled) {
    return;
  }

  scheduled = true;

  requestAnimationFrame(() => {
    console.log(window.scrollY);
    scheduled = false;
  });
});
```

This limits work to animation frames.

## Browser Compatibility

Different browsers may support different features.

Modern browsers are much more consistent than older browsers, but compatibility still matters.

Check support when using:

- new JavaScript syntax
- new Web APIs
- experimental browser features
- CSS features connected to JavaScript behavior

Use reliable references such as MDN or compatibility tables when unsure.

## Feature Detection

Feature detection checks whether an API exists before using it.

```js
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    console.log(entries);
  });
} else {
  console.log("IntersectionObserver is not supported");
}
```

This is usually better than checking the browser name.

```js
// Avoid relying on user-agent checks for normal feature support.
```

Browser names and versions can be misleading.

## Progressive Enhancement

Progressive enhancement means building a working baseline first, then adding enhanced behavior when supported.

Example:

- The HTML link works normally.
- JavaScript improves the experience when available.

```html
<a href="/settings" data-enhanced-link>Settings</a>
```

```js
if ("pushState" in history) {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-enhanced-link]");

    if (!link) {
      return;
    }

    event.preventDefault();
    history.pushState({}, "", link.href);
  });
}
```

If JavaScript fails, the link can still navigate.

## Best Practices

- Keep event handlers fast.
- Batch DOM reads and writes when performance matters.
- Use `requestAnimationFrame()` for visual updates.
- Be careful with frequent events like `scroll`, `resize`, and `input`.
- Prefer feature detection over browser detection.
- Build a working baseline before adding browser-specific enhancements.

## Common Mistakes

Creating many layout reads and writes in a loop:

```js
for (const card of cards) {
  card.style.height = `${card.offsetWidth}px`;
}
```

This mixes reading layout and writing styles repeatedly.

Another mistake is assuming a new API exists everywhere:

```js
await navigator.clipboard.writeText("Copied");
```

Use feature detection and error handling:

```js
if ("clipboard" in navigator) {
  try {
    await navigator.clipboard.writeText("Copied");
  } catch {
    console.log("Clipboard write failed");
  }
}
```

## Summary

Browser JavaScript affects rendering, responsiveness, and compatibility.

DOM and style changes can cause layout and paint work. Long JavaScript tasks can block input and rendering. Use feature detection, progressive enhancement, and performance-aware DOM patterns to build pages that work well across browsers.
