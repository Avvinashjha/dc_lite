# Script Loading and Browser Modules

Browser JavaScript does not run in isolation.

It is loaded by HTML, parsed by the browser, and executed at specific times.

Understanding script loading helps you avoid common bugs like selecting DOM elements before they exist.

## Classic Scripts

A basic script tag loads and runs JavaScript.

```html
<script src="app.js"></script>
```

By default, when the browser reaches this tag:

1. HTML parsing pauses.
2. The script is downloaded if needed.
3. The script runs.
4. HTML parsing continues.

This can delay page rendering if the script is large or slow to download.

## Script Placement

One traditional approach is to place scripts near the end of `<body>`.

```html
<body>
  <button id="save">Save</button>

  <script src="app.js"></script>
</body>
```

By the time `app.js` runs, the button has already been parsed.

```js
const button = document.querySelector("#save");

button.addEventListener("click", () => {
  console.log("Saved");
});
```

This works, but modern pages often use `defer` instead.

## The `defer` Attribute

`defer` tells the browser to download the script without blocking HTML parsing.

The script runs after the document has been parsed.

```html
<head>
  <script defer src="app.js"></script>
</head>
```

Deferred scripts keep their order.

```html
<script defer src="utils.js"></script>
<script defer src="app.js"></script>
```

`utils.js` runs before `app.js`.

`defer` is a good default for many regular scripts.

## The `async` Attribute

`async` also downloads without blocking HTML parsing.

But an async script runs as soon as it is ready.

```html
<script async src="analytics.js"></script>
```

Async scripts do not guarantee execution order.

Use `async` for independent scripts, such as analytics or ads, where order does not matter.

Avoid `async` when one script depends on another.

## Browser Modules

Modern browsers support JavaScript modules directly.

```html
<script type="module" src="app.js"></script>
```

Module scripts:

- use `import` and `export`
- have their own module scope
- are deferred by default
- run in strict mode
- do not create global variables from top-level declarations

Example:

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

```js
// app.js
import { add } from "./math.js";

console.log(add(2, 3));
```

HTML:

```html
<script type="module" src="app.js"></script>
```

In browsers, module import paths usually need a file path.

```js
import { add } from "./math.js";
```

This is different from many bundled project setups where tools resolve package names and extensions for you.

## Module Scope

Classic scripts share the global scope.

```html
<script>
  var count = 1;
</script>

<script>
  console.log(window.count); // 1
</script>
```

Modules have their own scope.

```html
<script type="module">
  const count = 1;

  console.log(window.count); // undefined
</script>
```

This is one reason modules are safer for larger codebases.

## `DOMContentLoaded` and `load`

`DOMContentLoaded` fires when the HTML document has been parsed.

```js
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is ready");
});
```

The `load` event fires later, after images and other resources are loaded.

```js
window.addEventListener("load", () => {
  console.log("Page resources are loaded");
});
```

Use `DOMContentLoaded` when you only need DOM elements.

Use `load` when you need all external resources to be complete.

With `defer` or `type="module"`, you often do not need a `DOMContentLoaded` listener for basic element selection.

## Dynamic Imports

Modules can be loaded dynamically with `import()`.

```js
const button = document.querySelector("#load-chart");

button.addEventListener("click", async () => {
  const { renderChart } = await import("./chart.js");

  renderChart();
});
```

Dynamic imports return promises.

They are useful for loading code only when needed.

## Inline Scripts

Inline scripts are written directly in HTML.

```html
<script>
  console.log("Inline script");
</script>
```

They can be useful for small demos, but production code is usually easier to maintain in separate files.

Inline scripts can also interact with security policies such as Content Security Policy.

## Best Practices

- Use `defer` for normal classic scripts.
- Use `type="module"` for modern module-based browser code.
- Use `async` only for independent scripts.
- Prefer modules over global variables.
- Use `DOMContentLoaded` when code may run before the DOM is ready.
- Keep scripts small enough that they do not block the main thread for long.

## Common Mistakes

Selecting elements before they exist:

```html
<head>
  <script src="app.js"></script>
</head>
<body>
  <button id="save">Save</button>
</body>
```

`app.js` may run before the button is parsed.

Fix with `defer`:

```html
<script defer src="app.js"></script>
```

Another mistake is using `async` for dependent scripts:

```html
<script async src="library.js"></script>
<script async src="app.js"></script>
```

`app.js` might run before `library.js`.

Use `defer` or modules when order matters.

## Summary

Script loading controls when browser JavaScript runs.

Classic scripts block parsing by default. `defer` waits until the DOM is parsed while preserving order. `async` runs whenever the script is ready. Browser modules are deferred by default and give each file its own scope.
