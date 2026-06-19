# Introduction to Modules

As programs grow, keeping all JavaScript in one file becomes difficult.

Imagine a project with:

- user authentication
- shopping cart logic
- API calls
- form validation
- helper functions
- UI rendering

Putting everything in one file makes the code hard to read, test, and reuse.

Modules solve this problem.

## What Is a Module?

A module is a JavaScript file that contains code you can reuse in other files.

Example:

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

Another file can import and use it:

```js
// app.js
import { add } from "./math.js";

console.log(add(2, 3)); // 5
```

Each file can focus on one responsibility.

## Why Modules Matter

Modules help you:

- organize code into smaller files
- reuse functions, objects, and classes
- avoid global variable pollution
- make dependencies explicit
- test code more easily
- understand large projects faster

Instead of one large file, you can create many focused files.

```text
project/
  app.js
  math.js
  users.js
  api.js
  formatters.js
```

## The Problem Before Modules

Before modules, JavaScript files were often loaded with multiple `<script>` tags.

```html
<script src="helpers.js"></script>
<script src="users.js"></script>
<script src="app.js"></script>
```

This had problems.

The order mattered:

```html
<script src="app.js"></script>
<script src="helpers.js"></script>
```

If `app.js` depended on `helpers.js`, this could break.

Variables could also leak into the global scope.

```js
// helpers.js
var message = "Hello";
```

Another file might accidentally reuse the same global name.

Modules avoid these problems by giving each file its own scope.

## Module Scope

In a module, top-level variables are scoped to that module.

```js
// config.js
const apiUrl = "https://api.example.com";
```

`apiUrl` is not automatically global.

Other files cannot use it unless you export it.

```js
export const apiUrl = "https://api.example.com";
```

Then another file can import it:

```js
import { apiUrl } from "./config.js";
```

This makes dependencies clear.

## Exporting and Importing

Modules use two main keywords:

- `export`
- `import`

`export` makes code available to other modules.

```js
export function formatName(name) {
  return name.trim().toUpperCase();
}
```

`import` brings exported code into another file.

```js
import { formatName } from "./formatters.js";
```

You will learn the syntax in detail in the next lesson.

## Modules Are Loaded Once

A module runs once when it is first imported.

If multiple files import the same module, they share the same module instance.

```js
// counter.js
let count = 0;

export function increment() {
  count += 1;
  return count;
}
```

```js
// a.js
import { increment } from "./counter.js";

console.log(increment()); // 1
```

```js
// b.js
import { increment } from "./counter.js";

console.log(increment()); // 2 if a.js already ran first
```

The module's internal state is shared through its exports.

This can be useful, but it also means module-level state should be used carefully.

## Modules Are Strict Mode by Default

ES modules automatically run in strict mode.

You do not need to write:

```js
"use strict";
```

This affects behavior such as:

- accidental globals
- `this` in top-level code
- duplicate parameter names

Strict mode catches more mistakes.

## Browser Modules

In the browser, use `type="module"`.

```html
<script type="module" src="./app.js"></script>
```

Then `app.js` can use `import` and `export`.

```js
import { add } from "./math.js";

console.log(add(2, 3));
```

Browser module imports usually need explicit file paths.

```js
import { add } from "./math.js";
```

The `./` matters.

## Modules in Node.js

Node.js also supports ES modules.

There are a few ways to enable them, commonly:

- use `.mjs` files
- or set `"type": "module"` in `package.json`

Example `package.json`:

```json
{
  "type": "module"
}
```

Then you can write:

```js
import { readFile } from "node:fs/promises";
```

Node.js has some module rules that differ from browsers and bundlers.

You will usually learn those details when building Node projects.

## Modules and Bundlers

Modern frontend projects often use tools like:

- Vite
- Webpack
- Rollup
- Parcel

These tools understand module imports and bundle files for the browser.

Example:

```js
import Button from "./components/Button.js";
import "./styles.css";
```

Bundlers can also handle imports that browsers do not understand directly, such as CSS imports or package imports.

## Best Practices

Keep modules focused.

One file should usually have one main purpose.

Export only what other files need.

Prefer explicit imports:

```js
import { formatDate } from "./formatters.js";
```

Avoid relying on global variables.

Keep side effects easy to spot.

Use clear file names:

```text
formatters.js
apiClient.js
userService.js
```

## Common Mistakes

### Mistake 1: Forgetting to Export

```js
function add(a, b) {
  return a + b;
}
```

Another file cannot import `add` unless it is exported.

```js
export function add(a, b) {
  return a + b;
}
```

### Mistake 2: Forgetting `type="module"` in the Browser

```html
<script src="./app.js"></script>
```

If `app.js` uses imports, use:

```html
<script type="module" src="./app.js"></script>
```

### Mistake 3: Depending on Global Variables

Modules are designed to make dependencies explicit.

Instead of assuming a value exists globally, import it.

## Summary

Modules let you split JavaScript into reusable files.

- A module is a JavaScript file with its own scope.
- Use `export` to share code.
- Use `import` to use exported code from another file.
- Modules help avoid global scope pollution.
- Browser modules use `<script type="module">`.
- Modules run in strict mode by default.
- Module imports make dependencies explicit.
