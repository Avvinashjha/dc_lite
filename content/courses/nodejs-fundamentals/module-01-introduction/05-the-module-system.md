# The Module System (CommonJS vs ESM)

## Why It Matters

Modules control how code is split, reused, loaded, tested, and published. In Node.js you will encounter two module systems: CommonJS and ES modules. Many bugs in Node.js projects come from mixing them without understanding the rules.

Modern Node.js supports ESM well, and new examples should usually prefer `import` and `export`. CommonJS still matters because a large amount of older Node.js code and many packages use `require()` and `module.exports`.

## Core Concepts

### ES modules

ES modules are the JavaScript standard module system.

```js
// math.js
export function add(a, b) {
  return a + b;
}

export const meaning = 42;
```

```js
// app.js
import { add, meaning } from './math.js';

console.log(add(2, 3));
console.log(meaning);
```

Use ESM when:

- Your project has `"type": "module"` in `package.json`.
- You use `.mjs` files.
- You are writing modern Node.js examples or new application code.

### CommonJS

CommonJS is Node.js's original module system.

```js
// math.cjs
function add(a, b) {
  return a + b;
}

module.exports = { add };
```

```js
// app.cjs
const { add } = require('./math.cjs');

console.log(add(2, 3));
```

Use CommonJS when:

- Maintaining older projects.
- Working in a codebase that has not migrated to ESM.
- Using tools that still expect CommonJS configuration files.

### How Node.js decides module type

Node.js uses extension and package metadata:

- `.mjs` is ESM.
- `.cjs` is CommonJS.
- `.js` follows the nearest `package.json` `"type"` field.

```json
{
  "type": "module"
}
```

With this setting, `.js` files are ESM. Without it, `.js` files are commonly treated as CommonJS.

## Syntax and Examples

### Default and named exports

```js
// logger.js
export default function log(message) {
  console.log(`[app] ${message}`);
}

export function warn(message) {
  console.warn(`[app] ${message}`);
}
```

```js
import log, { warn } from './logger.js';

log('started');
warn('low disk space');
```

Named exports are often easier to refactor because import names stay explicit. Default exports can be convenient for a module with one main purpose.

### Importing built-in modules

Prefer `node:` specifiers:

```js
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'package.json');
const packageJson = await readFile(filePath, 'utf8');
console.log(packageJson);
```

### Dynamic import

`import()` loads a module asynchronously. It works in both ESM and CommonJS.

```js
const moduleName = './feature.js';
const feature = await import(moduleName);

feature.run();
```

Use dynamic import for optional features, conditional loading, or expensive modules that are not always needed.

## CommonJS and ESM Interop

ESM can usually import CommonJS default-style:

```js
import legacyPackage from 'legacy-package';
```

CommonJS cannot directly use top-level `import`, but it can use dynamic import:

```js
async function main() {
  const { default: chalk } = await import('chalk');
  console.log(chalk.green('ok'));
}

main();
```

Interop rules can be surprising. For application code, prefer choosing one module system per project.

## Common Mistakes

- Forgetting file extensions in relative ESM imports. Use `./math.js`, not `./math`.
- Mixing `require()` into ESM files.
- Expecting `__dirname` and `__filename` in ESM. Use `import.meta.url` when needed.
- Changing `"type"` in `package.json` without checking config files and scripts.
- Publishing packages without declaring exports clearly.

## Practical Challenge

Create an ESM project with:

- `package.json` containing `"type": "module"`
- `calculator.js` exporting `add`, `subtract`, and `multiply`
- `index.js` importing those functions and reading two numbers from `process.argv`

Run:

```bash
node index.js 6 7
```

Then rewrite the same example as CommonJS using `.cjs` files.

## Recap

ESM is the modern JavaScript module system and should be your default for new Node.js learning. CommonJS remains important for older code and tooling. Know how Node.js chooses module type, use explicit relative file extensions in ESM, and prefer `node:` imports for built-in modules.
