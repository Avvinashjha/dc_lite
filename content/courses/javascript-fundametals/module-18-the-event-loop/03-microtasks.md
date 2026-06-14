# Microtasks

Microtasks are high-priority queued callbacks that run after the current call stack finishes and before the next macrotask.

The most common microtasks you will see come from promises.

```js
console.log("A");

Promise.resolve().then(() => {
  console.log("B");
});

console.log("C");
```

Output:

```text
A
C
B
```

The `.then()` callback is a microtask.

## When Microtasks Run

The simplified order is:

1. Run synchronous code on the call stack.
2. Run all queued microtasks.
3. Run the next macrotask.
4. Repeat.

Example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");
```

Output:

```text
Start
End
Promise
Timer
```

The promise microtask runs before the timer task.

## Common Microtask Sources

Common microtask sources include:

- Promise `.then()`
- Promise `.catch()`
- Promise `.finally()`
- `queueMicrotask()`
- mutation observer callbacks in browsers

Most beginner examples use promises.

## `queueMicrotask()`

`queueMicrotask()` schedules a microtask directly.

```js
console.log("A");

queueMicrotask(() => {
  console.log("B");
});

console.log("C");
```

Output:

```text
A
C
B
```

You will not need `queueMicrotask()` often as a beginner, but it helps reveal how microtasks work.

## Microtasks Drain Fully

When JavaScript starts processing microtasks, it runs all currently queued microtasks before moving to the next macrotask.

```js
Promise.resolve().then(() => {
  console.log("Microtask 1");

  Promise.resolve().then(() => {
    console.log("Microtask 2");
  });
});

setTimeout(() => {
  console.log("Timer");
}, 0);
```

Output:

```text
Microtask 1
Microtask 2
Timer
```

The second microtask is added while microtasks are being processed.

It still runs before the timer.

## Microtask Starvation

If microtasks keep adding more microtasks forever, timers and rendering may not get a chance to run.

```js
function loop() {
  queueMicrotask(loop);
}

loop();
```

This is a bad idea.

It can starve the event loop.

Use microtasks carefully.

## Promises and Microtasks

Even an already-resolved Promise schedules `.then()` for later.

```js
const promise = Promise.resolve("Done");

promise.then((value) => {
  console.log(value);
});

console.log("After");
```

Output:

```text
After
Done
```

`.then()` does not run immediately.

It runs as a microtask after the current stack clears.

## Best Practices

Remember that Promise callbacks are microtasks.

Expect microtasks to run before timers.

Avoid creating endless microtask loops.

Use microtasks mainly through promises unless you have a specific reason.

When predicting output, run synchronous code first, then microtasks.

## Common Mistakes

### Mistake 1: Expecting `.then()` to Run Immediately

```js
Promise.resolve().then(() => console.log("Promise"));
console.log("Sync");
```

This logs:

```text
Sync
Promise
```

### Mistake 2: Expecting Timers Before Promises

```js
setTimeout(() => console.log("Timer"), 0);
Promise.resolve().then(() => console.log("Promise"));
```

The promise callback runs first after synchronous code.

### Mistake 3: Scheduling Infinite Microtasks

Endless microtask loops can block timers and rendering.

## Summary

Microtasks run after the call stack clears and before the next macrotask.

- Promise callbacks are microtasks.
- `queueMicrotask()` schedules a microtask directly.
- Microtasks run before timers.
- The microtask queue drains fully before the next macrotask.
- Too many microtasks can starve timers and rendering.
