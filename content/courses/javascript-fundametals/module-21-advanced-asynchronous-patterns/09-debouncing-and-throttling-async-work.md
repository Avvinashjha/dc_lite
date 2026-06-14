# Debouncing and Throttling Async Work

Debouncing and throttling control how often a function runs.

They are especially useful for async work triggered by frequent events.

Examples:

- search while typing
- saving drafts
- resizing a window
- scrolling
- validating form input

## The Problem

This search handler sends a request on every keystroke.

```js
input.addEventListener("input", async (event) => {
  const results = await searchProducts(event.target.value);
  renderResults(results);
});
```

If the user types quickly, this may send many requests.

Debouncing and throttling reduce that pressure.

## Debouncing

Debouncing waits until events stop for a short time.

It is good for search boxes.

```js
function debounce(callback, delayMs) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delayMs);
  };
}
```

Usage:

```js
const handleSearch = debounce((query) => {
  searchProducts(query).then(renderResults);
}, 300);

input.addEventListener("input", (event) => {
  handleSearch(event.target.value);
});
```

The search runs only after the user pauses typing.

## Debouncing an Async Function

An async callback still needs error handling.

```js
const handleSearch = debounce(async (query) => {
  try {
    const results = await searchProducts(query);
    renderResults(results);
  } catch (error) {
    showError(error);
  }
}, 300);
```

The debounce helper does not automatically catch Promise rejections.

The async function should handle them.

## Debounce With Cancellation

Debouncing reduces the number of requests, but it does not cancel an in-flight request.

For search, combine debounce with `AbortController`.

```js
let currentController;

const handleSearch = debounce(async (query) => {
  if (currentController) {
    currentController.abort();
  }

  currentController = new AbortController();

  try {
    const results = await searchProducts(query, currentController.signal);
    renderResults(results);
  } catch (error) {
    if (error.name !== "AbortError") {
      showError(error);
    }
  }
}, 300);
```

This prevents old requests from continuing after a new search starts.

## Throttling

Throttling runs a function at most once within a time window.

It is good for scroll or resize events.

```js
function throttle(callback, delayMs) {
  let lastRun = 0;

  return (...args) => {
    const now = Date.now();

    if (now - lastRun >= delayMs) {
      lastRun = now;
      callback(...args);
    }
  };
}
```

Usage:

```js
const handleScroll = throttle(() => {
  loadVisibleItems();
}, 500);

window.addEventListener("scroll", handleScroll);
```

No matter how many scroll events fire, the callback runs at most once every 500 milliseconds.

## Debounce vs Throttle

Use debounce when you want to wait for a pause.

Examples:

- search after typing stops
- validate a field after input settles
- autosave after edits pause

Use throttle when you want regular updates, but not too often.

Examples:

- scroll position tracking
- resize handling
- refreshing live metrics

## Stale Results Still Matter

Debounce and throttle control when work starts.

They do not guarantee results finish in the same order.

Use a request id when only the newest result should render.

```js
let latestRequestId = 0;

const handleSearch = debounce(async (query) => {
  const requestId = latestRequestId + 1;
  latestRequestId = requestId;

  const results = await searchProducts(query);

  if (requestId === latestRequestId) {
    renderResults(results);
  }
}, 300);
```

## Common Mistakes

Do not debounce the wrong function.

Create the debounced function once, then reuse it.

```js
input.addEventListener("input", (event) => {
  const debounced = debounce(searchProducts, 300);
  debounced(event.target.value);
});
```

This creates a new debounced function for every event, so it will not debounce correctly.

Create it outside:

```js
const debouncedSearch = debounce(searchProducts, 300);

input.addEventListener("input", (event) => {
  debouncedSearch(event.target.value);
});
```

Do not treat debounce as cancellation.

If a request has already started, debounce alone will not stop it.

## Best Practices

- Use debounce for user input that should wait for a pause.
- Use throttle for high-frequency events that need periodic updates.
- Handle errors inside async debounced or throttled callbacks.
- Combine with cancellation or stale-result checks when needed.
- Create the debounced or throttled function once.

## Summary

Debouncing waits until events settle.

Throttling limits how often work can run.

Both patterns make async event handling more efficient, but they should be combined with error handling, cancellation, and stale-result protection when requests are involved.
