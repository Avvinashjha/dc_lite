# Macrotasks

Macrotasks are larger units of work scheduled by the runtime.

They are often simply called tasks.

Common macrotasks include:

- script execution
- `setTimeout` callbacks
- `setInterval` callbacks
- DOM event callbacks
- message channel callbacks

For beginner event-loop reasoning, timers and events are the most important examples.

## Timer Example

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

Output:

```text
A
C
B
```

The timer callback is scheduled as a macrotask.

It cannot run until the current call stack is clear.

## Macrotasks vs Microtasks

Microtasks run before the next macrotask.

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

The timer is a macrotask.

The promise callback is a microtask.

After synchronous code finishes, microtasks run first.

## `setTimeout(..., 0)` Does Not Mean Immediate

```js
setTimeout(() => {
  console.log("Later");
}, 0);
```

This means:

```text
Schedule this callback after at least 0ms, when the event loop can pick it.
```

It does not interrupt current JavaScript.

It also waits behind microtasks.

## DOM Events Are Tasks

In browsers, user events are also scheduled as tasks.

```js
button.addEventListener("click", () => {
  console.log("Clicked");
});
```

When the user clicks, the runtime schedules the callback.

The callback runs when the call stack is clear and the event loop reaches that task.

## `setInterval`

`setInterval` schedules repeated tasks.

```js
const id = setInterval(() => {
  console.log("Tick");
}, 1000);
```

Each interval callback is a task.

If the main thread is busy, interval callbacks may be delayed.

Stop an interval with:

```js
clearInterval(id);
```

## Timers Can Be Delayed

Timers are not guaranteed to run exactly on time.

```js
setTimeout(() => {
  console.log("Timer");
}, 100);

// Long blocking work
for (let i = 0; i < 1_000_000_000; i++) {}
```

The timer cannot run while the stack is busy.

The delay means "not before this time", not "exactly at this time".

## Task Cycle Simplified

A simplified browser event-loop cycle:

1. Run one macrotask.
2. Run all microtasks.
3. Browser may render.
4. Run the next macrotask.

This is simplified, but useful for beginner reasoning.

## Best Practices

Do not rely on timers for exact precision.

Remember that microtasks run before timer callbacks.

Avoid long synchronous work that delays tasks.

Clear intervals when they are no longer needed.

Use `requestAnimationFrame` for animation-related work instead of guessing with timers.

## Common Mistakes

### Mistake 1: Assuming `setTimeout(fn, 0)` Runs Before Promises

Promises schedule microtasks.

Microtasks run before the next timer task.

### Mistake 2: Expecting Timers to Be Exact

Timers can be delayed by long-running JavaScript, browser throttling, or runtime scheduling.

### Mistake 3: Forgetting to Clear Intervals

Intervals keep running until cleared.

This can cause bugs and memory leaks.

## Summary

Macrotasks are scheduled units of runtime work.

- Timer callbacks are macrotasks.
- DOM event callbacks are tasks.
- `setTimeout(..., 0)` runs later, not immediately.
- Microtasks run before the next macrotask.
- Timers can be delayed by blocking synchronous code.
- Clear intervals when they are no longer needed.
