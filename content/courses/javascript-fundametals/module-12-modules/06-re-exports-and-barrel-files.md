# Re-exports and Barrel Files

Sometimes one module imports code from another module and exports it again.

This is called a re-export.

Re-exports are often used to create cleaner import paths.

## Basic Re-export

```js
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

Another file can re-export those functions:

```js
// index.js
export { add, subtract } from "./math.js";
```

Now another module can import from `index.js`:

```js
import { add } from "./index.js";
```

## Export Everything From Another Module

You can re-export all named exports.

```js
export * from "./math.js";
```

This exports all named exports from `math.js`.

It does not re-export a default export automatically.

## Barrel Files

A barrel file gathers exports from several files into one file.

Example folder:

```text
utils/
  index.js
  formatters.js
  validators.js
  math.js
```

```js
// utils/index.js
export * from "./formatters.js";
export * from "./validators.js";
export * from "./math.js";
```

Then another file can import from the folder entry point:

```js
import { formatDate, isValidEmail, add } from "./utils/index.js";
```

With bundler configuration, some projects allow:

```js
import { formatDate } from "./utils";
```

But plain browser modules usually need the explicit file path.

## Re-exporting With Aliases

You can rename exports while re-exporting.

```js
export { formatDate as formatDisplayDate } from "./formatters.js";
```

Then import:

```js
import { formatDisplayDate } from "./utils/index.js";
```

Aliases can make exports more descriptive at module boundaries.

## Re-exporting Default Exports

Default exports need special syntax.

```js
// Button.js
export default function Button() {}
```

Re-export as a named export:

```js
// index.js
export { default as Button } from "./Button.js";
```

Then import:

```js
import { Button } from "./index.js";
```

This pattern is common in component folders.

## Why Use Barrel Files?

Barrel files can make imports cleaner.

Without a barrel:

```js
import { formatDate } from "./utils/formatters.js";
import { isValidEmail } from "./utils/validators.js";
import { add } from "./utils/math.js";
```

With a barrel:

```js
import { formatDate, isValidEmail, add } from "./utils/index.js";
```

This can be convenient.

## When Barrel Files Can Hurt

Barrel files can also make code harder to trace.

If `index.js` exports too much, it becomes unclear where code really comes from.

```js
import { doSomething } from "./utils/index.js";
```

You may need to open multiple files to find the original definition.

Barrel files can also create circular dependencies if used carelessly.

Use them when they make imports clearer, not just shorter.

## Public API of a Folder

A good barrel file acts like a public API for a folder.

```text
components/
  Button.js
  Modal.js
  Input.js
  index.js
```

```js
// components/index.js
export { default as Button } from "./Button.js";
export { default as Modal } from "./Modal.js";
export { default as Input } from "./Input.js";
```

Other parts of the app can import from the folder's public entry point.

```js
import { Button, Modal } from "./components/index.js";
```

## Best Practices

Use re-exports to create clear public module boundaries.

Keep barrel files focused.

Avoid exporting unrelated code from one barrel.

Be careful with circular dependencies.

Use explicit imports when they are clearer than barrel imports.

Re-export default exports as named exports when it improves consistency.

## Common Mistakes

### Mistake 1: Expecting `export *` to Include Defaults

```js
export * from "./Button.js";
```

This does not automatically re-export the default export.

Use:

```js
export { default as Button } from "./Button.js";
```

### Mistake 2: Creating a Giant Barrel

```js
// everything/index.js
export * from "../api.js";
export * from "../components/index.js";
export * from "../utils/index.js";
export * from "../config.js";
```

This can hide where things come from.

### Mistake 3: Using Barrels to Avoid Thinking About Structure

Barrel files should clarify the public API.

They should not hide a messy folder design.

## Summary

Re-exports let one module export values from another module.

- `export { name } from "./file.js"` re-exports selected names.
- `export * from "./file.js"` re-exports named exports.
- Default exports need special re-export syntax.
- Barrel files gather exports into an entry file like `index.js`.
- Barrel files can make imports cleaner.
- Overused barrel files can hide dependencies and create confusion.
