# Modules in the Browser and Node.js

ES modules use the same `import` and `export` syntax, but different environments have different loading rules.

The two environments you will hear about most are:

- browsers
- Node.js

Modern build tools also affect how modules work in real projects.

## Browser Modules

In a browser, a JavaScript file can use imports if it is loaded as a module.

```html
<script type="module" src="./app.js"></script>
```

Then `app.js` can import other modules.

```js
// app.js
import { add } from "./math.js";

console.log(add(2, 3));
```

Without `type="module"`, the browser treats the file as a normal script.

Then `import` statements will not work.

## Browser Module Paths

Browser module imports usually need explicit paths.

```js
import { add } from "./math.js";
```

The `./` means the file is in the same folder.

This is different:

```js
import { add } from "math.js";
```

The browser does not treat this as a local relative file path.

For local files, use `./` or `../`.

## File Extensions

In browser modules, include the file extension.

```js
import { add } from "./math.js";
```

Some bundlers allow this:

```js
import { add } from "./math";
```

But plain browser modules usually need:

```js
./math.js
```

## Modules Are Deferred by Default

Browser module scripts are deferred by default.

That means they wait for the HTML document to be parsed before running.

```html
<script type="module" src="./app.js"></script>
```

You usually do not need to add `defer`.

This makes modules safer than old scripts that could run before the page was ready.

## Module Scope in Browsers

Top-level variables in modules do not become global variables.

```js
// app.js
const message = "Hello";
```

This does not create `window.message`.

That is a good thing.

Modules help prevent accidental global pollution.

## Node.js Modules

Node.js supports two module systems:

- CommonJS
- ES modules

CommonJS uses:

```js
const fs = require("fs");

module.exports = {};
```

ES modules use:

```js
import fs from "node:fs";

export {};
```

This module focuses on ES modules.

## Enabling ES Modules in Node.js

Common ways to use ES modules in Node:

Use `.mjs` files:

```text
app.mjs
```

Or set `"type": "module"` in `package.json`:

```json
{
  "type": "module"
}
```

Then `.js` files are treated as ES modules.

## Node Built-In Imports

Node.js has built-in modules.

Modern code often uses the `node:` prefix.

```js
import { readFile } from "node:fs/promises";

const text = await readFile("./data.txt", "utf8");
```

The `node:` prefix makes it clear that the import is a Node built-in module.

## Package Imports

In projects with dependencies, you may import packages.

```js
import express from "express";
```

This does not start with `./` because it is not a local file.

It comes from `node_modules`.

Browsers do not understand package imports directly without tooling.

Bundlers or runtimes resolve them.

## Bundlers and Dev Tools

Modern frontend projects commonly use tools such as Vite.

They let you write imports like:

```js
import { createApp } from "vue";
import "./styles.css";
import logoUrl from "./logo.svg";
```

Plain browsers do not handle all of those import types by themselves.

The tool processes them for you.

## Best Practices

Use explicit relative paths for local files:

```js
import { add } from "./math.js";
```

Use `type="module"` for browser module scripts.

Know whether your project uses plain browser modules, Node.js, or a bundler.

Do not mix CommonJS and ES module syntax randomly.

Follow your project's module style.

## Common Mistakes

### Mistake 1: Forgetting `type="module"`

```html
<script src="./app.js"></script>
```

If `app.js` uses imports:

```html
<script type="module" src="./app.js"></script>
```

### Mistake 2: Missing `./` for Local Files

```js
import { add } from "math.js";
```

Correct:

```js
import { add } from "./math.js";
```

### Mistake 3: Assuming Browser and Bundler Rules Are Identical

A bundler may allow imports that a browser does not understand directly.

Always know what environment is running your code.

## Summary

ES modules work in browsers, Node.js, and bundler-based projects, but loading rules differ.

- Browser modules use `<script type="module">`.
- Browser local imports usually need `./`, `../`, and file extensions.
- Module scripts are deferred by default.
- Node.js supports both CommonJS and ES modules.
- Node can use ES modules with `.mjs` or `"type": "module"`.
- Bundlers can support extra import features beyond plain browsers.
