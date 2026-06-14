# JavaScript Engine and Runtime

JavaScript code does not run by magic.

It runs inside an environment.

That environment includes a JavaScript engine and a runtime.

Understanding the difference helps you understand the event loop.

## JavaScript Engine

The JavaScript engine reads and executes JavaScript code.

Examples of JavaScript engines:

- V8: Chrome, Node.js
- SpiderMonkey: Firefox
- JavaScriptCore: Safari

The engine handles things like:

- parsing JavaScript
- running code
- managing memory
- creating the call stack
- executing functions

The engine understands JavaScript itself.

## Runtime Environment

The runtime is the environment around the engine.

Examples:

- Browser runtime
- Node.js runtime

The runtime provides extra APIs that are not part of the core JavaScript language.

Browser APIs include:

- `setTimeout`
- `fetch`
- DOM APIs
- event listeners
- `localStorage`

Node.js APIs include:

- file system APIs
- HTTP server APIs
- process APIs
- timers

## Engine vs Runtime

JavaScript language feature:

```js
const total = [1, 2, 3].reduce((sum, number) => sum + number, 0);
```

Browser runtime feature:

```js
setTimeout(() => {
  console.log("Later");
}, 1000);
```

`setTimeout` is not the JavaScript language itself.

It is provided by the runtime.

## Why Runtime APIs Matter

Asynchronous features often involve the runtime.

Example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 1000);

console.log("End");
```

The JavaScript engine runs the code.

The runtime manages the timer.

When the timer is ready, the callback is scheduled to run later.

## The Main Pieces

To understand the event loop, you need these pieces:

- call stack
- Web APIs or runtime APIs
- task queue
- microtask queue
- event loop

In a simplified browser model:

```text
JavaScript code
  -> Call Stack
  -> Runtime APIs
  -> Queues
  -> Event Loop
```

The event loop decides when queued callbacks can move back onto the call stack.

## JavaScript Is Single-Threaded

JavaScript execution on the main thread is single-threaded.

That means one piece of JavaScript runs at a time on the main call stack.

```js
console.log("A");
console.log("B");
```

`B` cannot run until `A` finishes.

But the runtime can manage async operations outside the call stack.

That is how JavaScript can wait for timers, network responses, and user events without blocking every line of code.

## Browser vs Node.js

The browser and Node.js both use event-loop concepts.

But they are not identical in every detail.

This module focuses on the beginner mental model used most often in browser JavaScript:

```text
Synchronous code runs first.
Microtasks run before the next macrotask.
Timers and events are tasks.
Rendering happens between turns when the browser gets a chance.
```

Node.js has additional phases and details that you can study later.

## Best Practices

Separate language features from runtime APIs in your mind.

Remember that JavaScript runs one call stack at a time.

Understand that async APIs schedule callbacks for later.

Use this mental model when predicting output order:

```text
Stack first, then microtasks, then tasks.
```

## Common Mistakes

### Mistake 1: Thinking `setTimeout` Is the JavaScript Engine

`setTimeout` is provided by the runtime, not the core language engine.

### Mistake 2: Thinking Async Code Means Multiple JavaScript Lines Run at Once

JavaScript on the main thread still runs one piece of JS at a time.

Async work is scheduled and resumed later.

### Mistake 3: Assuming Browser and Node Event Loops Are Identical

They share concepts, but Node.js has extra phases and environment-specific behavior.

## Summary

JavaScript runs inside an engine and a runtime.

- The engine executes JavaScript code.
- The runtime provides APIs like timers, DOM events, and `fetch`.
- JavaScript execution on the main stack is single-threaded.
- Async runtime APIs schedule work to continue later.
- The event loop coordinates when queued work runs.
