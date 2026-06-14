# Side Effects and Dynamic Imports

Most imports bring values into a file.

```js
import { add } from "./math.js";
```

But some modules are imported because they do something when they run.

Other modules are loaded later only when needed.

This lesson covers:

- side-effect imports
- module side effects
- dynamic `import()`
- when to use each pattern

## What Is a Side Effect?

A side effect is something code does beyond returning a value.

Examples:

- logging to the console
- changing the DOM
- modifying a global variable
- registering an event listener
- starting a timer
- making a network request

Example:

```js
console.log("App started");
```

This is a side effect because it affects the outside world.

## Side Effects in Modules

A module can run code at the top level.

```js
// setup.js
console.log("Setting up app");

document.body.classList.add("ready");
```

If another file imports it:

```js
import "./setup.js";
```

The module runs.

No values are imported.

This is called a side-effect import.

## When Side-Effect Imports Are Useful

Side-effect imports can be useful for setup code.

Examples:

```js
import "./styles.css";
import "./setupAnalytics.js";
import "./registerServiceWorker.js";
```

In bundler-based projects, importing CSS is commonly treated as a side effect.

Plain browser JavaScript does not import CSS this way without tooling.

## Be Careful With Side Effects

Side effects can make code harder to understand.

```js
import "./setup.js";
```

This line does not show what changed.

You have to open `setup.js` to know what happened.

Prefer explicit function calls when clarity matters.

```js
import { setupApp } from "./setup.js";

setupApp();
```

This makes the action visible.

## Modules Run Once

A module runs once when it is first imported.

```js
// setup.js
console.log("setup running");
```

```js
// a.js
import "./setup.js";
```

```js
// b.js
import "./setup.js";
```

Even if both `a.js` and `b.js` import `setup.js`, the module is evaluated once.

The exact order depends on the import graph.

## Dynamic Imports

Static imports load modules at the top level.

```js
import { add } from "./math.js";
```

Dynamic import uses the `import()` function-like syntax.

```js
const math = await import("./math.js");

console.log(math.add(2, 3));
```

Dynamic imports return a Promise.

That means you can use:

```js
import("./math.js").then((math) => {
  console.log(math.add(2, 3));
});
```

or:

```js
const math = await import("./math.js");
```

inside an async context or module with top-level await support.

## Why Use Dynamic Import?

Use dynamic import when you do not need a module immediately.

Examples:

- load a large feature only when clicked
- load admin code only for admins
- load a chart library only on the chart page
- load language files only when needed

Example:

```js
button.addEventListener("click", async () => {
  const { showHelpModal } = await import("./helpModal.js");

  showHelpModal();
});
```

The help modal code loads when the button is clicked.

## Dynamic Import With Default Exports

Dynamic import returns a module object.

For named exports:

```js
const module = await import("./math.js");

module.add(2, 3);
```

Or destructure:

```js
const { add } = await import("./math.js");
```

For default exports:

```js
const module = await import("./logger.js");

module.default("Loaded");
```

Or:

```js
const { default: log } = await import("./logger.js");

log("Loaded");
```

## Static Import vs Dynamic Import

| Import type | When it loads | Syntax |
| --- | --- | --- |
| Static import | Before module runs | `import { add } from "./math.js"` |
| Dynamic import | When code reaches it | `await import("./math.js")` |

Use static imports by default.

Use dynamic imports when delayed loading is useful.

## Error Handling With Dynamic Import

Dynamic imports can fail.

The file might not exist, the network might fail, or the module might throw while loading.

```js
try {
  const { showHelpModal } = await import("./helpModal.js");
  showHelpModal();
} catch (error) {
  console.log("Could not load help modal");
}
```

You will learn more about promises and error handling later.

For now, remember that dynamic import is asynchronous.

## Best Practices

Use static imports for normal dependencies.

Use dynamic imports for optional or heavy code.

Prefer explicit setup functions over hidden side effects when possible.

Keep side-effect modules small and clearly named.

Handle dynamic import failures when loading optional features.

Do not use dynamic import just to avoid organizing imports.

## Common Mistakes

### Mistake 1: Forgetting Dynamic Import Is Async

```js
const math = import("./math.js");

console.log(math.add(2, 3)); // wrong
```

`math` is a Promise.

Use:

```js
const math = await import("./math.js");
```

### Mistake 2: Overusing Side-Effect Imports

```js
import "./doManyThings.js";
```

If the module changes many parts of the app, the import becomes hard to reason about.

Prefer:

```js
import { initializeApp } from "./setup.js";

initializeApp();
```

### Mistake 3: Using Dynamic Import for Everything

Static imports are simpler and easier to analyze.

Use dynamic imports only when delayed loading provides a real benefit.

## Summary

Modules can have side effects and can be loaded dynamically.

- A side effect changes something outside the current function's return value.
- `import "./file.js"` runs a module for its side effects.
- Side-effect imports should be used carefully.
- Dynamic `import()` loads a module asynchronously.
- Dynamic import returns a Promise.
- Static imports should be the default.
- Dynamic imports are useful for optional or heavy features.
