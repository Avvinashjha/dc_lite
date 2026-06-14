# Performance and Memory Debugging

Performance debugging is about finding why code feels slow, blocks interaction, uses too much memory, or does unnecessary work.

At the fundamentals level, you do not need to be a performance expert.

You should know how to notice common problems and gather evidence before optimizing.

## Measure Before Optimizing

Do not optimize based only on guesses.

First identify the symptom:

- slow page load
- slow API request
- delayed click response
- frozen scrolling
- repeated rendering
- growing memory usage

Then use the right tool:

- Network panel for slow requests
- Performance panel for long tasks and scripting work
- Memory panel for growing memory usage
- `console.time()` for quick local measurements

## Quick Timing With `console.time`

For small checks, use `console.time()`.

```js
console.time("build list");

const itemsHtml = items.map((item) => `<li>${item.name}</li>`).join("");

console.timeEnd("build list");
```

This tells you how long that block took.

It is simple, but it only measures the code you wrap.

For UI problems, use the browser Performance panel.

## Long Tasks

JavaScript runs on the main thread in the browser.

If one task takes too long, the page cannot respond to input, paint updates, or run other JavaScript during that time.

Example:

```js
function blockPage() {
  const start = Date.now();

  while (Date.now() - start < 3000) {
    // Busy wait for 3 seconds.
  }
}
```

During this loop, the page feels frozen.

Real long tasks are usually less obvious:

- processing a huge array all at once
- rendering thousands of DOM nodes
- running expensive calculations on every key press
- repeatedly reading and writing layout values

## Too Much Work in Loops

Large loops can be fine, but expensive work inside them adds up.

```js
for (const item of items) {
  document.body.innerHTML += `<p>${item.name}</p>`;
}
```

This repeatedly reparses and rewrites the body.

Prefer building the result first, then updating the DOM once.

```js
const html = items.map((item) => `<p>${item.name}</p>`).join("");
document.body.insertAdjacentHTML("beforeend", html);
```

When debugging slow code, look for repeated work that can be batched.

## Layout Thrashing

The browser calculates layout when it needs element sizes and positions.

Repeatedly mixing layout reads and writes can be expensive.

```js
for (const box of boxes) {
  box.style.width = `${container.offsetWidth / 2}px`;
}
```

This reads `container.offsetWidth` every loop iteration.

Read once, then write many times.

```js
const width = container.offsetWidth / 2;

for (const box of boxes) {
  box.style.width = `${width}px`;
}
```

## Duplicate Work

Performance bugs are often caused by doing the same work too many times.

Use `console.count()` to check call frequency.

```js
function renderResults(results) {
  console.count("renderResults");
  // render results
}
```

If a function runs far more often than expected, inspect what triggers it.

Common causes:

- event listeners added repeatedly
- timers not cleared
- input handlers doing work on every keystroke
- rendering the whole list when one item changes

## Debouncing User Input

Search boxes often trigger too much work.

```js
input.addEventListener("input", () => {
  search(input.value);
});
```

This calls `search` on every keystroke.

A debounce waits until the user pauses.

```js
function debounce(callback, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

input.addEventListener(
  "input",
  debounce(() => {
    search(input.value);
  }, 300),
);
```

Use this when repeated events trigger expensive work.

## Memory Leaks

A memory leak happens when your program keeps references to data it no longer needs.

In browser JavaScript, common causes include:

- intervals that are never cleared
- event listeners attached to removed elements
- large arrays kept in global variables
- caches that never remove old entries
- closures that keep large objects alive

Example:

```js
const removedItems = [];

function removeItem(itemElement) {
  removedItems.push(itemElement);
  itemElement.remove();
}
```

The elements are removed from the DOM, but the array still references them.

If this happens repeatedly, memory usage can grow.

## Cleaning Up

Clean up timers and listeners when they are no longer needed.

```js
const controller = new AbortController();

window.addEventListener(
  "resize",
  () => {
    console.log("resized");
  },
  { signal: controller.signal },
);

controller.abort();
```

You can also remove a listener with the same function reference.

```js
function handleResize() {
  console.log("resized");
}

window.addEventListener("resize", handleResize);
window.removeEventListener("resize", handleResize);
```

Anonymous functions cannot be removed unless you kept a reference to them.

## Source Maps

Production JavaScript is often bundled, minified, or transformed.

Source maps connect generated code back to the original source code.

With source maps, DevTools can show your original files instead of one large minified file.

If stack traces point to unreadable bundled code, check whether source maps are enabled in your build and browser.

Be careful with public source maps for private applications. They can expose source code to users.

## Common Mistakes

Do not optimize code that is not actually slow.

Do not use `console.time()` once and treat the result as perfect. Timings can vary.

Do not ignore slow network requests when the UI feels slow. The bottleneck may not be JavaScript.

Do not keep references to removed DOM nodes or large data forever.

Do not add complex performance fixes before measuring the real problem.

## Summary

Performance and memory debugging starts with measurement.

Look for:

- long tasks that block the page
- repeated or duplicate work
- expensive loops
- unnecessary DOM updates
- layout reads mixed with writes
- timers and listeners that are not cleaned up
- source map issues in built code

The best optimization is targeted at the real bottleneck.
