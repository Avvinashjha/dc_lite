# Rendering and Long Tasks

In browsers, the event loop is connected to rendering.

Rendering means updating what the user sees on the page.

If JavaScript keeps the main thread busy for too long, the browser cannot render smoothly.

## JavaScript Can Block Rendering

```js
button.addEventListener("click", () => {
  status.textContent = "Working...";

  for (let i = 0; i < 1_000_000_000; i++) {}

  status.textContent = "Done";
});
```

You might expect the user to see `"Working..."` immediately.

But the long loop blocks the main thread.

The browser may not get a chance to paint the intermediate update.

The user may only see `"Done"` after the work finishes.

## Rendering Happens Between Turns

A simplified browser flow:

```text
1. Run a task.
2. Run microtasks.
3. Browser may render.
4. Run another task.
```

The browser needs the call stack to be clear before it can update the screen.

## Long Tasks

A long task is work that keeps the main thread busy for too long.

Long tasks can cause:

- delayed clicks
- delayed timers
- frozen UI
- dropped animation frames
- poor user experience

Example:

```js
function heavyWork() {
  for (let i = 0; i < 1_000_000_000; i++) {}
}
```

If this runs on the main thread, everything else waits.

## Breaking Work Into Chunks

You can split heavy work into chunks.

```js
function processItems(items) {
  const chunk = items.splice(0, 100);

  process(chunk);

  if (items.length > 0) {
    setTimeout(() => processItems(items), 0);
  }
}
```

This lets the browser handle other work between chunks.

It is not always the best performance solution, but it explains the idea.

## `requestAnimationFrame`

`requestAnimationFrame` schedules work before the next browser repaint.

```js
requestAnimationFrame(() => {
  box.style.transform = "translateX(100px)";
});
```

Use it for animation-related updates.

It helps align visual changes with the browser's rendering cycle.

## Microtasks and Rendering

Microtasks run before rendering.

If you keep adding microtasks, rendering may be delayed.

```js
function loop() {
  queueMicrotask(loop);
}

loop();
```

This can prevent the browser from reaching rendering.

Avoid endless microtask loops.

## Web Workers

For heavy CPU work, Web Workers can run code off the main thread.

Main thread:

```js
const worker = new Worker("worker.js");

worker.postMessage({ items });

worker.onmessage = (event) => {
  console.log(event.data);
};
```

Workers are an advanced topic, but the idea is important:

```text
Heavy CPU work should not freeze the UI.
```

## Best Practices

Avoid long synchronous work on the main thread.

Use `requestAnimationFrame` for visual updates.

Split large work into smaller chunks when needed.

Use Web Workers for expensive CPU-heavy work.

Avoid endless microtask loops.

Remember that rendering needs a clear main thread.

## Common Mistakes

### Mistake 1: Expecting DOM Updates to Paint During a Long Task

Changing the DOM does not guarantee the browser paints immediately.

The browser needs a chance to render.

### Mistake 2: Using Microtasks for Endless Work

Microtasks run before rendering.

Too many microtasks can block paint.

### Mistake 3: Doing Heavy CPU Work in Click Handlers

Long click handlers can make the page feel frozen.

## Summary

The event loop affects rendering.

- Browser rendering needs the main thread to be free.
- Long synchronous tasks can block paint and user input.
- Microtasks run before rendering.
- `requestAnimationFrame` is useful for animation-related updates.
- Large work can be chunked or moved to Web Workers.
