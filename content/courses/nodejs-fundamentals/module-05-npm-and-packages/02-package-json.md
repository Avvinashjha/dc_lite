# Understanding package.json

## Why It Matters

`package.json` is the manifest for a Node.js package. It describes the package name, version, module type, scripts, dependencies, entry points, supported Node.js versions, and publish behavior.

When something in a Node.js project feels mysterious, `package.json` is often the first file to inspect.

## Core Concepts

Example:

```json
{
  "name": "example-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "test": "node --test"
  },
  "dependencies": {
    "express": "^5.0.0"
  },
  "devDependencies": {
    "eslint": "^9.0.0"
  }
}
```

Important fields:

- `name`: package identifier.
- `version`: semantic version.
- `type`: controls whether `.js` files are ESM or CommonJS.
- `scripts`: project commands.
- `dependencies`: packages needed at runtime.
- `devDependencies`: packages needed for development or build/test.
- `engines`: expected Node.js versions.

## Syntax and Examples

### Module type

```json
{
  "type": "module"
}
```

This makes `.js` files use ESM:

```js
import { readFile } from 'node:fs/promises';
```

Without this, many Node.js projects treat `.js` as CommonJS.

### Scripts

```json
{
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "test": "node --test"
  }
}
```

Run with:

```bash
npm run dev
npm start
npm test
```

`start` and `test` have shortcuts. Custom scripts use `npm run`.

### Entry points

Libraries may define exports:

```json
{
  "exports": {
    ".": "./src/index.js",
    "./cli": "./src/cli.js"
  }
}
```

`exports` controls what consumers can import and helps avoid accidental reliance on internal files.

## Common Mistakes

- Editing `package-lock.json` manually instead of using npm commands.
- Putting build tools in `dependencies` when they belong in `devDependencies`.
- Forgetting `"type": "module"` and wondering why `import` fails.
- Publishing files accidentally because `files` or `.npmignore` is missing.
- Setting overly strict `engines` ranges without a reason.

## Practical Challenge

Create a `package.json` for a small API project. Include `type`, `scripts`, `engines`, one runtime dependency, and one dev dependency. Explain why each dependency is in its chosen section.

## Recap

`package.json` is the control center of a Node.js project. Learn its common fields first, then add advanced publishing and export fields only when needed.
