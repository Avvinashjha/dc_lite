# Lazy Loading and Dynamic Import

Lazy loading means loading something only when it is needed.

This can improve startup performance by reducing the amount of work done up front.

## Why Lazy Loading Helps

When a page loads, the browser may need to download, parse, compile, and run JavaScript.

If you load code for every feature immediately, the first load can become slow.

Lazy loading can defer work for:

- rarely used screens
- admin-only features
- large libraries
- below-the-fold images
- optional widgets

## Dynamic `import()`

JavaScript modules can be loaded dynamically with `import()`.

```js
button.addEventListener("click", async () => {
  const module = await import("./export-report.js");

  module.exportReport();
});
```

The module is loaded when the button is clicked.

This is different from a static import.

```js
import { exportReport } from "./export-report.js";
```

Static imports are loaded before the module runs.

## Loading a Heavy Library When Needed

```js
async function showChart(data) {
  const { createChart } = await import("./chart-library.js");

  createChart("#chart", data);
}
```

If charts are not always shown, this can reduce initial JavaScript cost.

## Handle Loading States

Lazy loading introduces waiting.

Show the user what is happening.

```js
async function openSettings() {
  settingsPanel.textContent = "Loading settings...";

  const { renderSettings } = await import("./settings-panel.js");

  renderSettings(settingsPanel);
}
```

Without a loading state, the interface may feel broken.

## Handle Errors

Dynamic imports can fail if the network fails or the file cannot be loaded.

```js
async function openEditor() {
  try {
    const { renderEditor } = await import("./editor.js");
    renderEditor();
  } catch (error) {
    console.error(error);
    showMessage("The editor could not be loaded. Please try again.");
  }
}
```

Always think about failure paths for lazy-loaded features.

## Lazy Loading Images

Images can also be lazy loaded.

```html
<img src="product.jpg" alt="Product photo" loading="lazy">
```

The browser can delay loading the image until it is closer to the viewport.

This is useful for long pages with many images.

Do not lazy load the main hero image if it is important for the first screen.

## Intersection Observer

`IntersectionObserver` lets you run code when an element enters the viewport.

```js
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      loadCardDetails(entry.target);
      observer.unobserve(entry.target);
    }
  }
});

for (const card of document.querySelectorAll(".product-card")) {
  observer.observe(card);
}
```

This can lazy load details, images, or widgets when they become relevant.

## Do Not Lazy Load Everything

Lazy loading has tradeoffs.

It can:

- delay a feature when the user first needs it
- create more network requests
- make error handling more complex
- make code splitting harder to reason about

Important startup code should usually load immediately.

Rare or expensive features are better candidates for lazy loading.

## Common Mistakes

- Lazy loading critical content needed for the first screen.
- Forgetting loading and error states.
- Splitting code into too many tiny files.
- Lazy loading a feature that almost every user needs immediately.
- Assuming smaller initial bundles always mean a faster overall experience.

## Summary

Lazy loading defers work until it is needed.

Use dynamic `import()` for optional JavaScript and browser features like `loading="lazy"` or `IntersectionObserver` for content that can wait.

Balance faster startup against later loading delays.
