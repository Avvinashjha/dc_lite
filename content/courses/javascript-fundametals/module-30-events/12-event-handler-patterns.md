# Event Handler Patterns

Real applications need event handlers that stay responsive, clean up after
themselves, and are easy to debug.

This lesson covers practical patterns you will use often.

## Async Event Handlers

Event handlers can be `async`.

```js
const button = document.querySelector("#load-profile");
const output = document.querySelector("#profile");

button.addEventListener("click", async () => {
  const response = await fetch("/api/profile");
  const profile = await response.json();

  output.textContent = profile.name;
});
```

This is common when an event starts a network request.

## Handle Async Errors

Errors inside async handlers do not get caught by surrounding synchronous code.

Use `try` / `catch` inside the handler.

```js
button.addEventListener("click", async () => {
  try {
    button.disabled = true;

    const response = await fetch("/api/profile");

    if (!response.ok) {
      throw new Error("Profile request failed");
    }

    const profile = await response.json();
    output.textContent = profile.name;
  } catch (error) {
    output.textContent = "Could not load profile.";
    console.error(error);
  } finally {
    button.disabled = false;
  }
});
```

Disable buttons while work is in progress if repeated clicks would cause
duplicate requests or inconsistent state.

## Debouncing

Debouncing delays work until events stop happening for a short time.

It is useful for search boxes and resize handlers.

```js
function debounce(callback, delay) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
```

Example:

```js
const search = document.querySelector("#search");

const runSearch = debounce((event) => {
  console.log("Search for:", event.target.value);
}, 300);

search.addEventListener("input", runSearch);
```

If the user types quickly, the search waits until they pause.

## Throttling

Throttling limits work to at most once during a time window.

It is useful for frequent events like `scroll`, `resize`, and `mousemove`.

```js
function throttle(callback, delay) {
  let waiting = false;

  return (...args) => {
    if (waiting) {
      return;
    }

    callback(...args);
    waiting = true;

    setTimeout(() => {
      waiting = false;
    }, delay);
  };
}
```

Example:

```js
const reportScroll = throttle(() => {
  console.log(window.scrollY);
}, 200);

window.addEventListener("scroll", reportScroll, { passive: true });
```

## Debounce vs Throttle

| Pattern | Best for |
| --- | --- |
| Debounce | wait until activity pauses |
| Throttle | run at a controlled rate during ongoing activity |

Search suggestions often use debounce.

Scroll progress indicators often use throttle.

## Cleaning Up Listeners

Listeners can keep references alive.

If a listener points to a removed element or large object, memory may not be
released as expected.

```js
function openModal() {
  const modal = document.querySelector("#modal");

  function handleKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  document.addEventListener("keydown", handleKeydown);

  function closeModal() {
    document.removeEventListener("keydown", handleKeydown);
    modal.remove();
  }
}
```

Cleanup is especially important for:

- modals
- tooltips
- pages in single-page applications
- listeners on `window` or `document`
- timers started inside event handlers

## Cleanup with `AbortController`

An `AbortController` can clean up multiple listeners at once.

```js
const controller = new AbortController();

document.addEventListener("keydown", handleKeydown, {
  signal: controller.signal
});

window.addEventListener("resize", handleResize, {
  signal: controller.signal
});

controller.abort();
```

When `abort()` is called, both listeners are removed.

## Avoid Duplicate Listeners

A common bug is registering the same behavior repeatedly.

```js
function render() {
  button.addEventListener("click", handleClick);
}
```

If `render()` runs many times, the handler may be added many times.

Move listener setup to a place that runs once, or clean up before registering
again.

## Debugging Event Problems

Useful debugging steps:

- log `event.type`
- log `event.target`
- log `event.currentTarget`
- inspect `event.composedPath()`
- check whether `preventDefault()` was called
- check whether propagation was stopped
- check the browser DevTools event listener panel

```js
document.addEventListener("click", (event) => {
  console.log({
    type: event.type,
    target: event.target,
    currentTarget: event.currentTarget,
    path: event.composedPath()
  });
});
```

Remove broad logging after debugging. Global event logs can become noisy quickly.

## Summary

Production event code needs more than basic listeners.

Use async handlers carefully, catch errors, debounce or throttle frequent events,
clean up long-lived listeners, and debug with `target`, `currentTarget`, and the
event path.
