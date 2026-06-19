# Async Node APIs and Errors

Node.js programs often wait for input/output work.

Examples:

- reading files
- writing files
- making HTTP requests
- receiving requests
- querying databases
- waiting for timers

Most modern Node APIs are asynchronous because waiting should not block the whole process.

## Synchronous vs Asynchronous APIs

Some Node modules provide both sync and async versions.

Synchronous file read:

```js
import { readFileSync } from "node:fs";

const text = readFileSync("notes.txt", "utf8");

console.log(text);
```

Asynchronous file read:

```js
import { readFile } from "node:fs/promises";

const text = await readFile("notes.txt", "utf8");

console.log(text);
```

Synchronous APIs block the current thread until the work finishes.

Asynchronous APIs let Node keep handling other work.

## Prefer Async for Servers

In a server, blocking work can delay every request.

```js
// Avoid in request handlers
const text = readFileSync("large-file.txt", "utf8");
```

If many users send requests, synchronous file or CPU-heavy work can make the server feel frozen.

Prefer async APIs in server code.

```js
const text = await readFile("large-file.txt", "utf8");
```

Small one-time scripts sometimes use sync APIs for simplicity, but async is the better default for server and library code.

## Callback APIs

Older Node APIs often use callbacks.

```js
import fs from "node:fs";

fs.readFile("notes.txt", "utf8", (error, text) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(text);
});
```

Node callbacks commonly follow this pattern:

```text
(error, result) => {}
```

The first argument is an error if something went wrong.

The result comes after the error.

## Promise APIs

Promise APIs work cleanly with `async` and `await`.

```js
import { readFile } from "node:fs/promises";

try {
  const text = await readFile("notes.txt", "utf8");
  console.log(text);
} catch (error) {
  console.error("Could not read file");
  console.error(error.message);
}
```

When available, promise APIs are usually easier to read than callback APIs.

## Promisifying Callback APIs

Some older APIs only support callbacks.

Node provides `promisify()`.

```js
import { promisify } from "node:util";
import fs from "node:fs";

const readFile = promisify(fs.readFile);

const text = await readFile("notes.txt", "utf8");

console.log(text);
```

Use built-in promise APIs when they exist.

Use `promisify()` when you need to adapt an older callback API.

## Error Handling with `await`

Use `try` / `catch`.

```js
try {
  const text = await readFile("missing.txt", "utf8");
  console.log(text);
} catch (error) {
  console.error(error.code);
  console.error(error.message);
}
```

Many Node errors include a `code`.

Examples:

- `ENOENT`: file or directory does not exist
- `EACCES`: permission denied
- `EADDRINUSE`: network port is already in use

Error codes help you handle known failures.

## Handling Expected Errors

Handle errors when you can do something useful.

```js
try {
  const text = await readFile("optional.txt", "utf8");
  console.log(text);
} catch (error) {
  if (error.code === "ENOENT") {
    console.log("No optional file found");
  } else {
    throw error;
  }
}
```

This handles the missing file case but still throws unexpected errors.

## Unhandled Rejections

If a Promise rejects and no code handles it, Node reports an unhandled rejection.

```js
import { readFile } from "node:fs/promises";

readFile("missing.txt", "utf8");
```

This starts an async operation but does not `await` or `.catch()` it.

Better:

```js
try {
  await readFile("missing.txt", "utf8");
} catch (error) {
  console.error(error.message);
}
```

## Running Tasks in Parallel

Use `Promise.all()` for independent async work.

```js
import { readFile } from "node:fs/promises";

const [usersText, settingsText] = await Promise.all([
  readFile("users.json", "utf8"),
  readFile("settings.json", "utf8"),
]);

console.log(usersText);
console.log(settingsText);
```

This starts both reads before waiting for both to finish.

Use this only when tasks do not depend on each other.

## Timeouts and Cancellation

Some Node APIs support `AbortController`.

Example with `fetch`:

```js
const controller = new AbortController();

const timeoutId = setTimeout(() => {
  controller.abort();
}, 3000);

try {
  const response = await fetch("https://example.com", {
    signal: controller.signal,
  });

  console.log(response.status);
} finally {
  clearTimeout(timeoutId);
}
```

Cancellation support depends on the API.

Always check the API documentation.

## Process-Level Error Events

Node can report serious unhandled errors through process events.

```js
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exitCode = 1;
});
```

```js
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  process.exitCode = 1;
});
```

These are last-resort safety nets.

Do not use them as a replacement for normal `try` / `catch` and Promise error handling.

## Common Mistakes

Do not forget `await` when you need the result.

Do not use sync APIs inside request handlers unless you have a strong reason.

Do not catch every error and silently ignore it.

Do not treat all errors as missing-file errors.

Do not use process-level error handlers as normal control flow.

## Summary

Node.js is built around asynchronous I/O.

Prefer promise-based APIs with `async` and `await`, handle expected errors specifically, let unexpected errors surface, and avoid blocking server code with synchronous APIs.
