# Concurrency Model

JavaScript has a concurrency model based on the event loop.

Concurrency means a program can make progress on multiple tasks over time.

It does not necessarily mean multiple pieces of JavaScript run at the exact same moment.

On the browser main thread, JavaScript runs one piece of code at a time.

## Single-Threaded Execution

JavaScript on the main thread has one call stack.

```js
console.log("A");
console.log("B");
```

`B` cannot run until `A` finishes.

This is why long synchronous work blocks the page.

## Non-Blocking APIs

Runtime APIs let JavaScript start work and continue.

```js
console.log("Start");

fetch("/api/user").then((response) => {
  console.log("Response received");
});

console.log("End");
```

The request happens outside the call stack.

When it finishes, the callback is scheduled.

JavaScript does not sit on the same line waiting for the network response.

## Concurrency vs Parallelism

Concurrency:

```text
Managing multiple tasks over time.
```

Parallelism:

```text
Running multiple tasks at the exact same time.
```

JavaScript's event loop gives concurrency on the main thread.

Actual parallelism can happen in some environments through:

- browser Web Workers
- Node.js worker threads
- native browser/network systems

But normal JavaScript on the main call stack runs one piece at a time.

## Event Loop Mental Model

Simplified flow:

```text
1. Run synchronous code on the stack.
2. When stack is empty, run microtasks.
3. Run one task from the task queue.
4. Run microtasks again.
5. Repeat.
```

This is enough to predict many beginner examples.

## Example

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

1. Synchronous code logs `A` and `D`.
2. Promise microtask logs `C`.
3. Timer task logs `B`.

## Long Tasks

A long task is synchronous work that takes too long.

```js
button.addEventListener("click", () => {
  for (let i = 0; i < 1_000_000_000; i++) {}
});
```

While the loop runs:

- clicks cannot be handled
- timers are delayed
- rendering may be blocked
- the page may feel frozen

The event loop cannot process other work while the stack is busy.

## Splitting Work

Sometimes large work can be split into smaller chunks.

```js
function processInChunks(items) {
  const chunk = items.splice(0, 100);

  process(chunk);

  if (items.length > 0) {
    setTimeout(() => processInChunks(items), 0);
  }
}
```

This gives the event loop chances to process other tasks between chunks.

Modern apps may also use Web Workers for heavy work.

## Best Practices

Keep main-thread work small.

Use async APIs for waiting operations.

Use Web Workers for heavy CPU work when needed.

Understand that async callbacks still run on the call stack when executed.

Use the stack, microtask, task model to predict order.

## Common Mistakes

### Mistake 1: Thinking Async Means Parallel JavaScript Execution

Async callbacks still run one at a time on the main stack.

### Mistake 2: Blocking the Stack With Heavy Work

If the stack is busy, the event loop cannot run other callbacks.

### Mistake 3: Forgetting Microtasks Run Before Tasks

Promise callbacks usually run before timers.

## Summary

JavaScript's concurrency model is based on the event loop.

- Main-thread JavaScript runs one piece of code at a time.
- Runtime APIs can do waiting work outside the stack.
- The event loop schedules callbacks back onto the stack.
- Microtasks run before the next task.
- Long synchronous work blocks the event loop.
- Concurrency is not the same as parallel JavaScript execution.
