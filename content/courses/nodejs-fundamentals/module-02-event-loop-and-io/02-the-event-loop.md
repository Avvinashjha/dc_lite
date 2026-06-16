# The Event Loop Explained

## Why It Matters

The event loop is the scheduling model behind Node.js. You do not need to memorize every internal detail to write good Node.js code, but you do need a practical mental model: keep the main thread free, let I/O finish in the background, and run callbacks quickly when they are scheduled.

When the event loop is blocked, a Node.js server may stop responding even though the process has not crashed.

## Core Concepts

### One main JavaScript thread

Most application JavaScript runs on one main thread. That thread executes your functions, promise continuations, event handlers, and callbacks. If you keep it busy with CPU work, nothing else can run.

```js
const start = Date.now();

while (Date.now() - start < 5000) {
  // Busy wait blocks the event loop.
}

console.log('Finished blocking');
```

During that loop, timers, HTTP handlers, and promise continuations cannot run.

### I/O is delegated

When you start file, network, DNS, or timer work, Node.js often delegates waiting to the operating system or libuv. When the work is ready, the event loop schedules your JavaScript callback or promise continuation.

```js
import { readFile } from 'node:fs/promises';

const promise = readFile('notes.txt', 'utf8');
console.log('File read started');

const text = await promise;
console.log(text);
```

### Macrotasks and microtasks

Promise continuations are microtasks. Timers and I/O callbacks are scheduled in event loop phases. Microtasks are processed between larger tasks, which is why promise callbacks often run before timers.

```js
setTimeout(() => console.log('timeout'), 0);

Promise.resolve().then(() => console.log('promise'));

console.log('sync');
```

Typical output:

```text
sync
promise
timeout
```

## Mental Model

Think of Node.js as repeatedly asking:

1. Is there synchronous JavaScript currently running?
2. Are there microtasks ready, such as promise continuations?
3. Are any timers ready?
4. Did I/O complete?
5. Are there close callbacks or immediate callbacks to run?

The exact internals are more detailed, but this model helps you reason about why quick callbacks are healthy and long callbacks are dangerous.

## Use Cases

Understanding the event loop helps you:

- Diagnose slow APIs.
- Avoid synchronous work in servers.
- Decide when to use workers.
- Understand timer ordering.
- Write better tests for async behavior.
- Explain why one slow request can affect others.

## Common Mistakes

- Believing async code always runs in parallel. It is concurrent waiting, not automatic CPU parallelism.
- Performing expensive JSON parsing, compression, or encryption on the main thread for large payloads.
- Creating infinite promise chains that starve timers and I/O.
- Using timers as a substitute for proper synchronization.
- Ignoring event loop lag as an operational signal.

## Practical Challenge

Create `event-loop-order.mjs`:

```js
import { readFile } from 'node:fs';

setTimeout(() => console.log('timer'), 0);
setImmediate(() => console.log('immediate'));

readFile(new URL(import.meta.url), () => {
  console.log('file callback');
});

Promise.resolve().then(() => console.log('promise'));

console.log('sync');
```

Run it several times. Notice which ordering is stable and which can vary.

## Recap

The event loop lets Node.js coordinate many pending operations with one main JavaScript thread. Your job is to keep that thread responsive. Use async I/O for waiting work and move heavy CPU work away from the main event loop.
