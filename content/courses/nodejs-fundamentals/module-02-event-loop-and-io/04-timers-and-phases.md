# Timers, nextTick and setImmediate

## Why It Matters

Timers are easy to use but easy to misunderstand. `setTimeout`, `setInterval`, `setImmediate`, `process.nextTick`, and promise microtasks all schedule work for later, but they do not mean the same thing.

Knowing their differences helps you write predictable async code and avoid starving the event loop.

## Core Concepts

### setTimeout

`setTimeout` schedules a callback after at least the given delay.

```js
setTimeout(() => {
  console.log('Runs after at least 100 ms');
}, 100);
```

The delay is not exact. If the event loop is busy, the callback runs later.

### setInterval

`setInterval` repeats a callback:

```js
const interval = setInterval(() => {
  console.log('tick');
}, 1000);

setTimeout(() => {
  clearInterval(interval);
}, 5000);
```

Avoid intervals for work that might take longer than the interval. A recursive `setTimeout` can be safer because it schedules the next run after the current one finishes.

### setImmediate

`setImmediate` schedules work for the check phase of the event loop. It is useful when you want to yield and run something after I/O callbacks have had a chance to proceed.

```js
setImmediate(() => {
  console.log('immediate');
});
```

### process.nextTick

`process.nextTick` runs before the event loop continues. It is Node.js-specific and very high priority.

```js
process.nextTick(() => {
  console.log('next tick');
});
```

Use it sparingly. Recursive `nextTick` calls can starve I/O.

### Promise microtasks

Promise callbacks are microtasks:

```js
Promise.resolve().then(() => {
  console.log('promise microtask');
});
```

In modern code, promises are usually preferred over `process.nextTick` for ordinary async continuation.

## Example Ordering

```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
```

Expected high-level order:

```text
sync
nextTick
promise
timeout/immediate ordering may vary
```

`setTimeout(..., 0)` does not mean "run immediately". It means "run when the timers phase can process a timer whose minimum delay has elapsed."

## Use Cases

Use `setTimeout` for delays, retries, and timeouts. Use `setInterval` for simple periodic work with clear cleanup. Use `setImmediate` to yield after the current poll phase. Use promises for most async sequencing. Use `process.nextTick` only when you need Node.js-specific behavior before the event loop proceeds.

## Common Mistakes

- Depending on exact timer timing under load.
- Creating intervals without clearing them.
- Using `process.nextTick` for general application flow.
- Forgetting that timers keep the process alive unless cleared or unreferenced.
- Writing tests that depend on fragile ordering between `setTimeout(0)` and `setImmediate`.

## Practical Challenge

Create a script that logs the order of:

- Synchronous `console.log`
- `Promise.resolve().then(...)`
- `process.nextTick(...)`
- `setTimeout(..., 0)`
- `setImmediate(...)`

Then add a file read with `node:fs` and schedule `setImmediate` inside its callback. Compare the output.

## Recap

Timers schedule work; they do not guarantee exact execution time. Promise microtasks and `process.nextTick` run before normal event loop phases continue. Use the simplest scheduler that matches the intent, and avoid starving I/O with high-priority queues.
