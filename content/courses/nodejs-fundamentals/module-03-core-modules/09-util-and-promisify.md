# The util Module and promisify

## Why It Matters

The `node:util` module contains helpers for working with Node.js conventions. The most famous is `promisify`, which converts error-first callback APIs into promise-returning functions.

This matters because many Node.js APIs and older packages still use callbacks, while modern application code often prefers `async` and `await`.

## Core Concepts

### Error-first callbacks

Traditional Node.js callbacks usually look like this:

```js
import { readFile } from 'node:fs';

readFile('data.txt', 'utf8', (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
});
```

The first callback argument is an error or `null`. The remaining arguments contain successful results.

### promisify

```js
import { readFile } from 'node:fs';
import { promisify } from 'node:util';

const readFileAsync = promisify(readFile);

const text = await readFileAsync('data.txt', 'utf8');
console.log(text);
```

Many core modules already have promise APIs, such as `node:fs/promises`, so use those when available. `promisify` is most useful for older callback-only APIs.

## Syntax and Examples

### Promisifying custom functions

```js
import { promisify } from 'node:util';

function delayCallback(ms, callback) {
  setTimeout(() => callback(null, `Waited ${ms}ms`), ms);
}

const delay = promisify(delayCallback);

console.log(await delay(100));
```

The callback must follow the `(error, result)` convention. If a function uses a different callback style, `promisify` may not behave correctly.

### inspect

`util.inspect` helps format objects for debugging.

```js
import { inspect } from 'node:util';

const value = { user: { id: 1, roles: ['admin'] } };

console.log(inspect(value, { depth: null, colors: true }));
```

For production logs, prefer structured logging over deep object dumps.

### debuglog

```js
import { debuglog } from 'node:util';

const debug = debuglog('app');

debug('Only prints when NODE_DEBUG includes app');
```

Run with:

```bash
NODE_DEBUG=app node index.mjs
```

## Use Cases

Use `node:util` for:

- Converting callback APIs to promises
- Better debugging output
- Lightweight conditional debug logs
- Working with inherited Node.js APIs

## Common Mistakes

- Promisifying a function that already returns a promise.
- Promisifying methods without binding `this`.
- Assuming every callback follows the error-first convention.
- Using `inspect` output as a stable data format.
- Leaving verbose debug output enabled in production.

## Practical Challenge

Find a callback API in `node:fs` and wrap it with `promisify`. Then replace your wrapper with the equivalent API from `node:fs/promises`. Compare which code you would keep in a new project.

## Recap

`node:util` helps bridge older Node.js patterns and modern code. `promisify` is valuable for callback-only APIs, but built-in promise APIs should be preferred when they exist.
