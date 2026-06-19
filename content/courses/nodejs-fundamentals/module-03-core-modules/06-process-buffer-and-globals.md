# process, Buffer, and Node.js Globals

## Why It Matters

Node.js programs need to interact with their runtime environment. `process` exposes arguments, environment variables, exit codes, signals, and standard streams. `Buffer` represents binary data. Globals provide values and functions available without importing.

These APIs are powerful because they sit close to the runtime. They also deserve care because they affect configuration, security, memory, and process lifecycle.

## Core Concepts

### process

```js
import process from 'node:process';

console.log(process.argv);
console.log(process.env.NODE_ENV);
console.log(process.cwd());
console.log(process.pid);
```

Common uses:

- Read command line arguments.
- Read environment variables.
- Set `process.exitCode`.
- Listen for shutdown signals.
- Access `stdin`, `stdout`, and `stderr`.

### Buffer

`Buffer` stores bytes. It is common when working with files, sockets, cryptography, and binary protocols.

```js
const buffer = Buffer.from('hello', 'utf8');

console.log(buffer);
console.log(buffer.toString('hex'));
console.log(buffer.toString('utf8'));
```

Text is not the same as bytes. Encoding tells Node.js how to convert between them.

### Globals

Node.js includes globals such as `console`, `Buffer`, `setTimeout`, `URL`, `fetch`, and `process`. Even when globals exist, explicit imports can make code easier to test and read.

```js
import process from 'node:process';
```

## Syntax and Examples

### Reading configuration

```js
import process from 'node:process';

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error('PORT must be a positive integer');
}

console.log(`Using port ${port}`);
```

Environment variables are strings. Validate and convert them before use.

### Graceful shutdown signal

```js
import process from 'node:process';

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  process.exitCode = 0;
});
```

Real servers should stop accepting new work and close resources before exiting.

### Binary data

```js
import { randomBytes } from 'node:crypto';

const token = randomBytes(16);
console.log(token.toString('base64url'));
```

Use encodings such as `hex`, `base64`, or `base64url` when bytes need to be represented as text.

## Common Mistakes

- Treating environment variables as booleans or numbers without parsing.
- Logging secrets from `process.env`.
- Calling `process.exit()` before async logs or cleanup complete.
- Confusing string length with byte length.
- Mutating global state in modules and making tests order-dependent.

## Practical Challenge

Write `config-check.mjs` that reads `PORT`, `LOG_LEVEL`, and `DATABASE_URL` from the environment. Validate them and print a safe summary that never logs the full database URL.

## Recap

`process` connects your code to the running process. `Buffer` handles bytes. Node.js globals are convenient, but explicit runtime handling, validation, and encoding awareness make programs safer and easier to debug.
