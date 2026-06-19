# Throttling

Throttling limits a function so it can run at most once during a fixed time window.

It is useful when events happen continuously and you still want regular updates.

## Debounce vs Throttle

Debouncing waits until activity stops.

Throttling runs at a controlled rate while activity continues.

| Technique | Best For |
| --- | --- |
| Debounce | search after typing stops |
| Throttle | scroll or pointer updates while movement continues |

## A Common Problem

Scroll events can fire very frequently.

```js
window.addEventListener("scroll", () => {
  updateProgressBar(window.scrollY);
});
```

If `updateProgressBar()` does expensive work, the page may feel janky.

## Throttle Helper

```js
function throttle(callback, delay) {
  let lastRun = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastRun >= delay) {
      lastRun = now;
      callback.apply(this, args);
    }
  };
}
```

Use it:

```js
const throttledProgress = throttle(() => {
  updateProgressBar(window.scrollY);
}, 100);

window.addEventListener("scroll", throttledProgress);
```

Now the progress bar updates at most once every 100 milliseconds.

## Throttling Pointer Movement

Pointer events can also be frequent.

```js
const updateCoordinates = throttle((event) => {
  coordinates.textContent = `${event.clientX}, ${event.clientY}`;
}, 50);

window.addEventListener("pointermove", updateCoordinates);
```

This keeps the UI responsive without updating on every event.

## Trailing Updates

The simple throttle helper runs immediately when enough time has passed.

It does not guarantee one final call after events stop.

Some throttle implementations include a trailing call.

That can be useful when you need the final state to be reflected exactly.

For example, a drag preview may need one last update after movement stops.

## `requestAnimationFrame()` for Visual Updates

For visual updates, `requestAnimationFrame()` can be a better fit than a fixed millisecond throttle.

```js
let latestScrollY = 0;
let scheduled = false;

window.addEventListener("scroll", () => {
  latestScrollY = window.scrollY;

  if (!scheduled) {
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      updateProgressBar(latestScrollY);
    });
  }
});
```

This schedules the update before the browser's next paint.

## Good Uses for Throttling

Throttling is useful for:

- scroll updates
- pointer movement
- resize updates during resizing
- progress indicators
- repeated analytics events

## Common Mistakes

- Using debounce when the UI needs updates during continuous activity.
- Choosing a delay so high that the UI feels laggy.
- Forgetting that visual updates may work better with `requestAnimationFrame()`.
- Doing heavy DOM reads and writes inside each throttled call.
- Assuming throttling fixes all performance problems without measuring.

## Summary

Throttling runs a function at a controlled rate.

Use it when events happen continuously but the user still needs periodic feedback.

For visual updates tied to painting, consider `requestAnimationFrame()`.
