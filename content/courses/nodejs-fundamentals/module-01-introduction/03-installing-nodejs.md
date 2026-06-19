# Installing Node.js

## Why It Matters

Node.js projects are sensitive to runtime versions. A project that works on Node.js 22 may fail on Node.js 16 because APIs, module behavior, fetch support, test runner features, and package requirements change over time.

Installing Node.js correctly is less about getting any `node` command to run and more about making version management repeatable for your machine, your teammates, CI, and production.

## Core Concepts

### Node.js versions

Node.js releases follow a regular schedule. Production projects usually prefer an active LTS version because it receives stability and security updates for a longer period.

Check your version:

```bash
node --version
npm --version
```

The `node` command runs JavaScript. The `npm` command manages packages and scripts. npm is bundled with Node.js, although teams sometimes use other package managers such as pnpm or Yarn.

### System installer vs version manager

You can install Node.js with:

- The official installer from `nodejs.org`
- A package manager such as Homebrew
- A version manager such as `nvm`, `fnm`, `volta`, or `asdf`

For learning, the official installer is fine. For real projects, a version manager is usually better because different projects may require different Node.js versions.

### Project version files

Teams often commit a version hint:

```text
.nvmrc
```

Example:

```text
22
```

Other tools use files such as `.node-version`, `package.json` `engines`, or Volta configuration.

```json
{
  "engines": {
    "node": ">=22"
  }
}
```

This does not always force the version by itself. It documents expectations and allows tooling to warn or switch versions.

## Installation Workflow

Install an LTS version, then verify:

```bash
node --version
npm --version
node -e "console.log('Node is working')"
```

Create a test file:

```js
import { platform } from 'node:os';

console.log(`Running on ${platform()}`);
```

Run it:

```bash
node test.mjs
```

If this works, Node.js can execute ESM files and import built-in modules.

## Understanding File Extensions

Node.js supports multiple ways to decide module format:

- `.mjs` files are treated as ES modules.
- `.cjs` files are treated as CommonJS modules.
- `.js` files depend on the nearest `package.json` `"type"` field.

For example:

```json
{
  "type": "module"
}
```

With this setting, `.js` files use ESM syntax:

```js
import { readFile } from 'node:fs/promises';
```

Without it, `.js` defaults to CommonJS in many projects:

```js
const { readFile } = require('node:fs/promises');
```

## Common Mistakes

- Installing Node.js globally once and never checking project version requirements.
- Using `sudo npm install -g` to fix permission problems. This can create confusing ownership issues.
- Mixing package managers without understanding their lockfiles.
- Assuming `node` and `npm` versions are the same thing.
- Running examples with `.js` when the project expects `.mjs` or `"type": "module"`.

## Troubleshooting

If `node` is not found, your shell cannot locate the executable. Restart the terminal or check your `PATH`.

If `npm install` fails with engine warnings, compare the project's required Node.js version with `node --version`.

If import syntax fails with `Cannot use import statement outside a module`, use `.mjs` or set `"type": "module"` in `package.json`.

## Practical Challenge

Create a folder named `node-install-check`, add a `package.json` with `"type": "module"`, and create `index.js`:

```js
import { versions } from 'node:process';

console.log('Node:', versions.node);
console.log('V8:', versions.v8);
```

Run it with:

```bash
node index.js
```

## Recap

A good Node.js installation is repeatable. Know which version you are running, prefer an LTS release for production work, use version hints in projects, and understand how file extensions and package settings affect module syntax.
