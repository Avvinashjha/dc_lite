# Predicting Execution Order

Event-loop questions often ask:

```text
What logs first?
```

You can predict most beginner examples with a simple process.

## The Basic Rule

Use this order:

1. Run synchronous code.
2. Run microtasks.
3. Run macrotasks.

Short version:

```text
Stack -> Microtasks -> Tasks
```

## Example 1

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

Output:

```text
A
D
C
B
```

Why?

Synchronous:

```text
A
D
```

Microtask:

```text
C
```

Macrotask:

```text
B
```

## Example 2: Multiple Promises

```js
console.log("Start");

Promise.resolve().then(() => {
  console.log("Promise 1");
});

Promise.resolve().then(() => {
  console.log("Promise 2");
});

console.log("End");
```

Output:

```text
Start
End
Promise 1
Promise 2
```

Microtasks run in the order they were queued.

## Example 3: Microtask Creates Another Microtask

```js
Promise.resolve().then(() => {
  console.log("A");

  Promise.resolve().then(() => {
    console.log("B");
  });
});

setTimeout(() => {
  console.log("C");
}, 0);
```

Output:

```text
A
B
C
```

The microtask queue drains before the timer task runs.

## Example 4: Timer Creates a Promise

```js
setTimeout(() => {
  console.log("Timer 1");

  Promise.resolve().then(() => {
    console.log("Promise inside timer");
  });
}, 0);

setTimeout(() => {
  console.log("Timer 2");
}, 0);
```

Output:

```text
Timer 1
Promise inside timer
Timer 2
```

After one task runs, microtasks are processed before the next task.

## Example 5: Already Resolved Promise

```js
const promise = Promise.resolve("Done");

console.log("A");

promise.then((value) => {
  console.log(value);
});

console.log("B");
```

Output:

```text
A
B
Done
```

Already resolved does not mean `.then()` runs immediately.

It still queues a microtask.

## Prediction Checklist

When solving event-loop order:

1. Mark all synchronous logs.
2. Put promise callbacks in the microtask queue.
3. Put timers/events in the task queue.
4. Run all synchronous code first.
5. Drain microtasks.
6. Run one task.
7. Drain microtasks again.
8. Repeat.

## Common Sources

Synchronous:

```js
console.log("sync");
```

Microtask:

```js
Promise.resolve().then(callback);
queueMicrotask(callback);
```

Macrotask:

```js
setTimeout(callback, 0);
setInterval(callback, 1000);
```

## Best Practices

Do not write production code that depends on tricky timing unless necessary.

Prefer clear async flow with promises and `async` / `await`.

Use event-loop knowledge to debug, not to make code clever.

When in doubt, break examples into stack, microtasks, and tasks.

## Common Mistakes

### Mistake 1: Running Timers Before Promises

Promise callbacks are microtasks.

They run before timer tasks.

### Mistake 2: Thinking Resolved Promises Are Synchronous

`.then()` still runs later as a microtask.

### Mistake 3: Forgetting Microtasks After Each Task

After a timer callback runs, any microtasks it creates run before the next timer callback.

## Summary

You can predict many event-loop examples with one model:

```text
Stack -> Microtasks -> Tasks
```

- Synchronous code runs first.
- Promise callbacks are microtasks.
- Timer callbacks are tasks.
- Microtasks drain before the next task.
- Each task is followed by another microtask checkpoint.
- Use event-loop knowledge to debug async behavior clearly.
