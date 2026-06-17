# The Node.js Error Model

## Why It Matters

Node.js applications fail through thrown exceptions, rejected promises, callback errors, event emitter errors, process signals, and external system failures. Understanding the error model helps you decide what to handle, what to retry, and what should crash fast.

## Core Concepts

- Synchronous code throws exceptions with `throw`.
- Promise-based code fails by rejecting.
- Older callback APIs usually pass `error` as the first callback argument.
- Event emitters may emit an `error` event that must be handled.
- Operational errors are expected runtime failures; programmer errors are bugs.

## Flow to Remember

An error occurs, the current async boundary determines how it is delivered, application code classifies it, and either handles it locally, forwards it to error middleware, or lets the process fail under supervision.

## Syntax and Examples

```js
import { readFile } from 'node:fs/promises';
import { EventEmitter } from 'node:events';

try {
  const config = await readFile('missing.json', 'utf8');
  console.log(config);
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Config file is missing');
  } else {
    throw error;
  }
}

const worker = new EventEmitter();
worker.on('error', (error) => {
  console.error('Worker failed', error);
});
```

## Use Cases and Tradeoffs

- Handle expected operational errors near the code that can recover.
- Let unexpected programmer errors surface loudly in development.
- Use structured custom errors for domain failures.
- Run production processes under a supervisor that restarts crashed services.

## Common Mistakes

- Catching every error and continuing in an unknown state.
- Treating rejected promises like synchronous exceptions without `await` or `.catch()`.
- Forgetting `error` listeners on emitters that can fail.
- Logging only `error.message` and losing stack/context.

## Practical Challenge

Write examples of the same file-not-found failure using sync `throw`, promise rejection, and callback-style error handling. Decide where each should be handled.

## Recap

- Node has multiple error delivery mechanisms.
- Operational errors and programmer errors deserve different responses.
- Errors should keep context without leaking secrets.

