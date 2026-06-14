# import / export Syntax

Modules use `export` and `import`.

`export` makes code available outside the current file.

`import` brings exported code into another file.

## Named Exports

A named export exports a value by name.

```js
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

Another file can import those names:

```js
// app.js
import { add, subtract } from "./math.js";

console.log(add(5, 2)); // 7
console.log(subtract(5, 2)); // 3
```

The imported names must match the exported names.

## Exporting After Declaration

You can define values first and export them later.

```js
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

export { add, subtract };
```

This is useful when you want exports grouped at the bottom of a file.

## Exporting Variables

You can export constants and variables.

```js
// config.js
export const apiUrl = "https://api.example.com";
export const timeout = 5000;
```

Import them:

```js
import { apiUrl, timeout } from "./config.js";
```

## Exporting Objects

```js
// settings.js
export const settings = {
  theme: "dark",
  notifications: true,
};
```

Import:

```js
import { settings } from "./settings.js";

console.log(settings.theme); // dark
```

## Import Aliases

You can rename an import with `as`.

```js
// user.js
export function format(name) {
  return name.trim();
}
```

```js
// app.js
import { format as formatUserName } from "./user.js";

console.log(formatUserName(" Alice "));
```

Aliases are useful when names conflict or need more context.

## Export Aliases

You can also rename while exporting.

```js
function formatName(name) {
  return name.trim();
}

export { formatName as format };
```

Another file imports the exported name:

```js
import { format } from "./formatters.js";
```

## Namespace Imports

A namespace import collects all named exports into one object.

```js
// math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

```js
// app.js
import * as math from "./math.js";

console.log(math.add(2, 3)); // 5
console.log(math.multiply(2, 3)); // 6
```

This can be useful for utility modules.

Avoid overusing it when named imports would be clearer.

## Import Paths

Local imports usually start with:

- `./`
- `../`
- `/` in some environments

Example:

```js
import { add } from "./math.js";
```

`./` means:

```text
Start from the current file's folder.
```

`../` means:

```text
Go up one folder.
```

Example:

```js
import { formatDate } from "../utils/date.js";
```

In browser ES modules, file extensions are usually required:

```js
import { add } from "./math.js";
```

Bundlers may allow:

```js
import { add } from "./math";
```

But learning with explicit paths is clearer.

## Imports Are Static

Normal `import` statements must be at the top level of a module.

```js
import { add } from "./math.js";
```

Do not put static imports inside `if` blocks or functions.

```js
if (condition) {
  import { add } from "./math.js"; // invalid static import
}
```

For conditional loading, use dynamic `import()`.

You will learn that later in this module.

## Imports Are Read-Only Bindings

Imported bindings cannot be reassigned by the importing module.

```js
import { apiUrl } from "./config.js";

apiUrl = "new-url"; // TypeError
```

If you need different configuration, export a function or create a new local value.

## Live Bindings

ES module imports are live bindings.

That means if the exporting module changes an exported variable, importers see the updated value.

```js
// counter.js
export let count = 0;

export function increment() {
  count += 1;
}
```

```js
// app.js
import { count, increment } from "./counter.js";

console.log(count); // 0
increment();
console.log(count); // 1
```

You cannot reassign `count` from `app.js`, but you can observe changes made by the exporting module.

## Side-Effect Imports

Sometimes you import a module only to run it.

```js
import "./setup.js";
```

This is called a side-effect import.

It does not import names.

It just runs the module.

Use side-effect imports carefully because they can make behavior harder to trace.

## Best Practices

Prefer named exports for utility functions:

```js
export function formatDate(date) {}
```

Use clear import paths:

```js
import { formatDate } from "./formatters.js";
```

Use aliases when they improve clarity:

```js
import { format as formatUserName } from "./user.js";
```

Keep imports at the top of the file.

Avoid unnecessary side-effect imports.

## Common Mistakes

### Mistake 1: Missing Curly Braces for Named Imports

```js
import add from "./math.js";
```

If `add` is a named export, use:

```js
import { add } from "./math.js";
```

### Mistake 2: Forgetting the Relative Path Prefix

```js
import { add } from "math.js";
```

For a local file, use:

```js
import { add } from "./math.js";
```

### Mistake 3: Importing a Name That Was Not Exported

```js
import { divide } from "./math.js";
```

This only works if `math.js` exports `divide`.

## Summary

`export` shares code from a module.

`import` brings code into another module.

- Named exports are imported with curly braces.
- Names must match unless you use `as`.
- Namespace imports collect named exports into an object.
- Local import paths usually start with `./` or `../`.
- Static imports must be at the top level.
- Imported bindings are read-only from the importing file.
- Side-effect imports run a module without importing names.
