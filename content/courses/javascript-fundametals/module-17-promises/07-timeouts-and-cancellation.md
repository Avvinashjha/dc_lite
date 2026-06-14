# Timeouts and Cancellation

Promises represent async work, but a Promise itself does not have a built-in cancel button.

Once a Promise starts, it usually keeps running until it settles.

Still, you can build practical timeout and cancellation patterns around promises.

## Timeout With `Promise.race()`

`Promise.race()` can create timeout behavior.

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Timed out"));
    }, ms);
  });
}

const result = await Promise.race([
  loadData(),
  timeout(3000),
]);
```

If `loadData()` finishes first, you get its result.

If `timeout(3000)` rejects first, the race rejects.

## Important Timeout Caveat

`Promise.race()` does not automatically stop the slower operation.

It only decides which result wins the race.

If `loadData()` is a network request, it may still continue unless the API supports cancellation.

For real fetch cancellation, use `AbortController`.

## AbortController With fetch

`AbortController` lets you cancel some async browser APIs, including `fetch`.

```js
const controller = new AbortController();

const request = fetch("/api/user", {
  signal: controller.signal,
});

controller.abort();
```

When aborted, `fetch` rejects.

## Fetch Timeout Example

```js
async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, ms);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

The timeout aborts the request.

`finally` clears the timer if the request finishes first.

## Handling Abort Errors

```js
try {
  const response = await fetchWithTimeout("/api/user", 3000);
  console.log(response);
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Request was cancelled");
  } else {
    console.log("Request failed:", error.message);
  }
}
```

Abort errors are expected when cancellation is intentional.

Handle them separately when needed.

## Ignoring Stale Results

Sometimes you cannot cancel the underlying work.

You can ignore old results instead.

```js
let latestRequestId = 0;

async function search(query) {
  const requestId = ++latestRequestId;
  const results = await searchApi(query);

  if (requestId !== latestRequestId) {
    return;
  }

  showResults(results);
}
```

This is useful in search boxes where users type quickly.

Only the latest request updates the UI.

## Best Practices

Use `Promise.race()` for timeout behavior.

Remember that racing does not necessarily cancel the losing Promise.

Use `AbortController` when the API supports cancellation.

Clear timers in `finally`.

Handle intentional cancellation separately from unexpected failures.

Ignore stale results when cancellation is not available.

## Common Mistakes

### Mistake 1: Thinking `Promise.race()` Cancels the Loser

It does not.

It only settles with the first settled Promise.

### Mistake 2: Forgetting to Clear a Timeout

If the main operation finishes first, clear the timeout.

Use `finally`.

### Mistake 3: Treating Abort as a Crash

If the user intentionally cancels a request, that is often expected behavior.

Handle `AbortError` separately.

## Summary

Promises do not have built-in cancellation, but you can build useful patterns.

- Use `Promise.race()` for timeouts.
- `Promise.race()` does not automatically cancel slower operations.
- Use `AbortController` to cancel supported APIs like `fetch`.
- Clear timeout timers in `finally`.
- Handle `AbortError` intentionally.
- Ignore stale results when cancellation is not available.
