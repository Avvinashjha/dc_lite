# Modules in Node

Modules let you split a program into separate files.

You have already seen JavaScript modules in the language itself. Node.js supports modules too, but there are two module systems you will see in real projects:

- CommonJS
- ES modules

Understanding both helps you read older Node code and write modern Node code.

## Why Modules Matter

Without modules, large programs become one long file.

Modules let you:

- organize code by responsibility
- reuse functions
- hide implementation details
- test smaller pieces
- import built-in and third-party packages

Example project:

```text
project/
  app.js
  math.js
  package.json
```

## CommonJS

CommonJS is the older Node module system.

It uses `require()` and `module.exports`.

```js
// math.cjs
function add(a, b) {
  return a + b;
}

module.exports = {
  add,
};
```

Import it:

```js
// app.cjs
const { add } = require("./math.cjs");

console.log(add(2, 3));
```

CommonJS is still common in older packages, build tools, and many existing Node projects.

## ES Modules

ES modules use `import` and `export`.

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

Import it:

```js
// app.js
import { add } from "./math.js";

console.log(add(2, 3));
```

This syntax matches the standard JavaScript module syntax used by browsers and bundlers.

## How Node Chooses a Module System

Node decides how to treat a file based on file extension and `package.json`.

Common rules:

- `.cjs` files are CommonJS
- `.mjs` files are ES modules
- `.js` depends on `"type"` in `package.json`

If `package.json` contains:

```json
{
  "type": "module"
}
```

then `.js` files are treated as ES modules.

If `package.json` contains:

```json
{
  "type": "commonjs"
}
```

or has no `"type"` field, `.js` files are commonly treated as CommonJS.

Many modern projects set `"type": "module"`.

## File Extensions Matter

In Node ES modules, include the file extension for relative imports.

```js
import { add } from "./math.js";
```

This is better than:

```js
import { add } from "./math";
```

Node's ES module resolver expects explicit paths more often than browser bundlers do.

## Default and Named Exports

Named export:

```js
export function formatName(name) {
  return name.trim().toLowerCase();
}
```

Named import:

```js
import { formatName } from "./format.js";
```

Default export:

```js
export default function formatName(name) {
  return name.trim().toLowerCase();
}
```

Default import:

```js
import formatName from "./format.js";
```

Prefer named exports for utility modules because they are easier to refactor and search for.

## Importing Built-In Modules

Node has built-in modules.

Modern Node examples often use the `node:` prefix.

```js
import path from "node:path";
import { readFile } from "node:fs/promises";
```

The `node:` prefix makes it clear that the module comes from Node itself, not from `node_modules`.

CommonJS can import built-ins too:

```js
const path = require("node:path");
```

## Dynamic Import

ES modules support dynamic import.

```js
const moduleName = "./math.js";
const math = await import(moduleName);

console.log(math.add(2, 3));
```

Dynamic import is useful when:

- loading code conditionally
- delaying expensive imports
- choosing a module at runtime

Do not use it when a normal static import is clearer.

## CommonJS and ES Modules Together

Mixing CommonJS and ES modules can be confusing.

In general:

- ES modules can import many CommonJS modules
- CommonJS cannot use top-level `import`
- CommonJS can use dynamic `import()`
- named imports from CommonJS may not behave like named ES exports

When starting a new beginner project, choose one module style and use it consistently.

For modern Node code, ES modules are a good default.

## Module Scope

Each module has its own scope.

```js
// counter.js
let count = 0;

export function increment() {
  count += 1;
  return count;
}
```

`count` is not a global variable.

Only exported values are available to other modules.

This helps keep code organized.

## Common Mistakes

Do not forget `./` for local imports.

```js
import { add } from "math.js"; // Looks for a package
import { add } from "./math.js"; // Looks for a local file
```

Do not mix `require()` and `import` randomly in the same file.

Do not omit file extensions in Node ES module relative imports.

Do not assume `__dirname` exists in ES modules.

Use `import.meta.url` or pass paths explicitly when needed.

## Summary

Node.js supports CommonJS and ES modules.

CommonJS uses `require()` and `module.exports`.

ES modules use `import` and `export`.

Modern Node projects often use ES modules with `"type": "module"` in `package.json`, while many older packages still use CommonJS.
