# Animation, Idle Work, and Workers

Some performance work is about choosing the right time and place to run code.

The browser gives you APIs for animation, low-priority work, and background processing.

## `requestAnimationFrame()`

Use `requestAnimationFrame()` when JavaScript updates something visual.

The callback runs before the browser's next paint.

```js
function moveBox(position) {
  requestAnimationFrame(() => {
    box.style.transform = `translateX(${position}px)`;
  });
}
```

This helps visual updates line up with rendering.

## Animation Loop

```js
let x = 0;

function animate() {
  x += 2;
  box.style.transform = `translateX(${x}px)`;

  if (x < 300) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);
```

This is better for animation than repeatedly using `setInterval()`.

The browser can pause or slow animation work when the tab is not visible.

## `requestIdleCallback()`

`requestIdleCallback()` schedules low-priority work when the browser has idle time.

```js
requestIdleCallback(() => {
  preloadSuggestions();
});
```

It can be useful for work that should not block important interactions.

Examples:

- preloading optional data
- preparing a cache
- logging analytics
- cleaning up old data

## Idle Work Must Be Optional

Idle callbacks may run later than expected.

They may not run at all in some situations or environments.

Do not put critical work only in `requestIdleCallback()`.

```js
if ("requestIdleCallback" in window) {
  requestIdleCallback(preloadSuggestions);
} else {
  setTimeout(preloadSuggestions, 1000);
}
```

Use a fallback when needed.

## Web Workers

Web Workers let you run JavaScript on a background thread.

They are useful for CPU-heavy work that would otherwise block the main thread.

Main file:

```js
const worker = new Worker("worker.js");

worker.postMessage({ type: "analyze", items });

worker.addEventListener("message", (event) => {
  renderAnalysis(event.data);
});
```

Worker file:

```js
self.addEventListener("message", (event) => {
  const result = analyzeItems(event.data.items);

  self.postMessage(result);
});
```

The main thread sends data to the worker.

The worker sends results back.

## Worker Tradeoffs

Workers are powerful, but they are not free.

Consider:

- data must be copied or transferred between threads
- workers cannot directly access the DOM
- setup adds complexity
- small tasks may be slower because of messaging overhead

Workers are best for meaningful CPU-heavy work.

Examples:

- parsing large files
- image processing
- complex calculations
- searching or transforming large datasets

## Transferring Data

Large binary data can sometimes be transferred instead of copied.

```js
worker.postMessage(arrayBuffer, [arrayBuffer]);
```

After transfer, the original `arrayBuffer` is no longer usable on the sending side.

This can improve performance for large data, but it requires care.

## Choosing the Right API

| Goal | Good Option |
| --- | --- |
| update visual state before paint | `requestAnimationFrame()` |
| run low-priority optional work | `requestIdleCallback()` |
| avoid blocking with CPU-heavy work | Web Worker |
| run code after a delay | `setTimeout()` |

## Common Mistakes

- Using `setInterval()` for animations that should follow browser paint.
- Putting critical logic in `requestIdleCallback()` with no fallback.
- Moving tiny tasks to workers and adding overhead for no benefit.
- Trying to change the DOM directly inside a worker.
- Sending huge data repeatedly between the main thread and a worker without considering transfer costs.

## Summary

Use `requestAnimationFrame()` for visual updates, `requestIdleCallback()` for optional low-priority work, and Web Workers for meaningful CPU-heavy tasks.

These APIs do not make slow code disappear, but they help keep the main thread responsive.
