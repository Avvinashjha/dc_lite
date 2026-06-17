# Synchronous vs Asynchronous

## Why It Matters

The difference between synchronous and asynchronous code is one of the most important Node.js fundamentals. It affects performance, error handling, readability, and whether one user's request can delay everyone else.

Synchronous code completes before the next line runs. Asynchronous code starts work now and finishes later, allowing Node.js to do other things while waiting.

## Core Concepts

### Synchronous flow

```js
import { readFileSync } from 'node:fs';

const config = readFileSync('config.json', 'utf8');
console.log(config);
console.log('Done');
```

`readFileSync` blocks the JavaScript thread until the file is read. This is simple and sometimes acceptable during startup, but risky inside a server request handler.

### Asynchronous flow

```js
import { readFile } from 'node:fs/promises';

const config = await readFile('config.json', 'utf8');
console.log(config);
console.log('Done');
```

This still looks sequential because of `await`, but the runtime can process other events while the file operation is pending.

### Callback, promise, and async function styles

Older Node.js APIs often use callbacks:

```js
import { readFile } from 'node:fs';

readFile('config.json', 'utf8', (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
});
```

Modern code usually prefers promises:

```js
import { readFile } from 'node:fs/promises';

try {
  const data = await readFile('config.json', 'utf8');
  console.log(data);
} catch (error) {
  console.error('Could not read config:', error);
}
```

## Syntax and Examples

### Sequential awaits

```js
const user = await fetchUser(userId);
const orders = await fetchOrders(user.id);
```

Use sequential awaits when the second operation depends on the first.

### Concurrent awaits

```js
const [profile, notifications] = await Promise.all([
  fetchProfile(userId),
  fetchNotifications(userId),
]);
```

Use `Promise.all` when operations are independent. This can reduce total latency because both operations wait at the same time.

### Handling failure

`Promise.all` rejects as soon as one promise rejects:

```js
try {
  const [a, b] = await Promise.all([taskA(), taskB()]);
  console.log(a, b);
} catch (error) {
  console.error('At least one task failed:', error);
}
```

If you need every result, including failures, use `Promise.allSettled`.

## Use Cases

Synchronous code can be fine for:

- Startup configuration loading
- Small CLI scripts
- Test setup
- Build scripts where simplicity matters more than concurrency

Asynchronous code is preferred for:

- HTTP request handlers
- Database calls
- File uploads
- Network calls
- Long-running servers

## Common Mistakes

- Using sync APIs in request handlers.
- Starting independent async work one after another instead of using `Promise.all`.
- Forgetting `await`, which leaves a promise instead of the value.
- Wrapping every async call in its own `try/catch` instead of handling errors at the correct boundary.
- Assuming `await` makes work blocking in the same way as sync APIs. It pauses the async function, not the whole runtime.

## Practical Challenge

Write a script that reads `a.txt` and `b.txt` two ways:

1. Sequentially with two `await` statements.
2. Concurrently with `Promise.all`.

Use `console.time()` and `console.timeEnd()` to compare the shape of the code. Small files may not show much timing difference, but the pattern matters for databases and APIs.

## Recap

Synchronous code is simple but blocks the JavaScript thread. Asynchronous code allows Node.js to keep serving other work while I/O is pending. Use sequential awaits for dependent operations and `Promise.all` for independent operations.
