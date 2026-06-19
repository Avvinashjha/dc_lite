# Synchronous vs Asynchronous

JavaScript often needs to wait for things.

Examples:

- loading data from an API
- reading a file
- waiting for a timer
- responding to a click
- saving data to a server

If JavaScript stopped everything while waiting, apps would feel frozen.

Asynchronous programming lets JavaScript start work now and finish it later without blocking everything else.

## Synchronous Code

Synchronous code runs one step at a time, in order.

```js
console.log("First");
console.log("Second");
console.log("Third");
```

Output:

```text
First
Second
Third
```

Each line finishes before the next line starts.

## Blocking Work

Synchronous work can block the next line.

```js
console.log("Start");

// Imagine this takes a long time.
for (let i = 0; i < 1_000_000_000; i++) {}

console.log("End");
```

JavaScript cannot move to `"End"` until the loop finishes.

In the browser, blocking work can make the page feel stuck.

## Asynchronous Code

Asynchronous code lets JavaScript schedule work for later.

```js
console.log("First");

setTimeout(() => {
  console.log("Second");
}, 1000);

console.log("Third");
```

Output:

```text
First
Third
Second
```

`setTimeout` schedules the callback.

JavaScript continues running the next line.

The callback runs later.

## Async Does Not Mean Faster

Asynchronous code does not make the waiting operation itself faster.

It lets the program keep doing other work while waiting.

Example:

```js
console.log("Request started");

setTimeout(() => {
  console.log("Request finished");
}, 2000);

console.log("UI is still responsive");
```

The timer still waits about two seconds.

But JavaScript does not block the whole program during that wait.

## Common Async Operations

You will use asynchronous programming for:

- timers: `setTimeout`, `setInterval`
- browser events: clicks, typing, scrolling
- network requests: `fetch`
- file operations in Node.js
- database calls
- animations

These operations finish later, so your code needs a way to react when they complete.

## Three Main Async Patterns

JavaScript has several async patterns.

You will learn:

1. Callbacks
2. Promises
3. `async` / `await`

Callbacks came first.

Promises made async flow easier to chain and handle.

`async` / `await` makes promise-based code read more like synchronous code.

## The Important Mental Model

When async work is scheduled, JavaScript does not wait at that line.

```js
setTimeout(() => {
  console.log("Later");
}, 1000);
```

This means:

```text
Run this callback later, after at least 1000ms.
```

It does not mean:

```text
Pause the entire program here for exactly 1000ms.
```

## Best Practices

Do not assume async code runs immediately.

Read async examples by asking:

```text
What runs now?
What is scheduled for later?
```

Use clear names for callbacks and async functions.

Keep async steps small and readable.

Avoid blocking the main thread with long synchronous work.

## Common Mistakes

### Mistake 1: Expecting Timer Code to Block

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
```

This logs:

```text
A
C
B
```

Even with `0`, the callback runs later.

### Mistake 2: Thinking Async Means Parallel CPU Work

Async waiting is not the same as running heavy JavaScript computation in parallel.

JavaScript can schedule I/O and callbacks, but long CPU-heavy work can still block the main thread.

### Mistake 3: Returning Before Async Work Finishes

```js
let result;

setTimeout(() => {
  result = "Done";
}, 1000);

console.log(result); // undefined
```

The timer callback has not run yet.

## Summary

Synchronous code runs line by line.

Asynchronous code schedules work to finish later.

- Synchronous code can block later code.
- Async code lets JavaScript keep running while waiting.
- Timers, events, APIs, and file operations are often async.
- Async code does not automatically mean faster.
- JavaScript uses callbacks, promises, and `async` / `await` to handle async work.
