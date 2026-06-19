# Cancellation With AbortController

JavaScript Promises do not have built-in cancellation.

Once a Promise starts, you cannot cancel the Promise object itself.

But many async APIs support cancellation through `AbortController`.

## Why Cancellation Matters

Cancellation prevents wasted work.

Common examples:

- a user leaves a page while data is loading
- a user types a new search before the old search finishes
- a request takes too long
- a component is removed before its request completes

Without cancellation, old async work may still finish and update the wrong state.

## AbortController Basics

Create an `AbortController`.

Pass its `signal` to an API that supports cancellation.

Call `.abort()` when you want to cancel.

```js
const controller = new AbortController();

fetch("/api/users", {
  signal: controller.signal,
});

controller.abort();
```

The `signal` is the part you pass around.

The controller is the part that can trigger cancellation.

## Cancelling fetch

`fetch()` supports `AbortController`.

```js
async function loadUsers() {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, 3000);

  try {
    const response = await fetch("/api/users", {
      signal: controller.signal,
    });

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request was cancelled");
      return [];
    }

    throw error;
  }
}
```

When `fetch()` is aborted, it rejects with an abort error.

## Aborting From the Outside

A reusable function should often accept a signal instead of creating its own controller.

```js
async function fetchUser(id, signal) {
  const response = await fetch(`/api/users/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
```

The caller controls cancellation:

```js
const controller = new AbortController();

const userPromise = fetchUser(42, controller.signal);

controller.abort();
```

This keeps the function flexible.

## Timeout With AbortController

A timeout is one reason to cancel work.

```js
async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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

The `finally` block clears the timer whether the request succeeds, fails, or is aborted.

## Combining With User Actions

Search boxes often cancel old requests when the query changes.

```js
let currentSearchController;

async function searchUsers(query) {
  if (currentSearchController) {
    currentSearchController.abort();
  }

  currentSearchController = new AbortController();

  try {
    const response = await fetch(`/api/users?q=${encodeURIComponent(query)}`, {
      signal: currentSearchController.signal,
    });

    const users = await response.json();
    renderUsers(users);
  } catch (error) {
    if (error.name !== "AbortError") {
      showError(error);
    }
  }
}
```

Only the newest search is allowed to keep running.

## Cancellation Is Cooperative

`AbortController` does not magically stop every async function.

The async operation must check or support the signal.

You can support it in your own functions.

```js
async function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeoutId = setTimeout(resolve, ms);

    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeoutId);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}
```

The function listens for the abort event and rejects when cancellation happens.

## Common Mistakes

Do not ignore abort errors as if they are unexpected failures.

```js
try {
  await fetch("/api/users", { signal });
} catch (error) {
  showError("Something went wrong");
}
```

If the user intentionally cancelled the request, showing an error may be confusing.

Handle abort separately.

```js
if (error.name === "AbortError") {
  return;
}
```

Do not reuse an aborted controller.

```js
const controller = new AbortController();
controller.abort();

fetch("/api/users", { signal: controller.signal }); // already aborted
```

Create a new controller for new work.

## Best Practices

- Pass `signal` into reusable async functions.
- Use `finally` to clean up timers and listeners.
- Treat aborts differently from real failures.
- Create a new controller for each cancelable operation.
- Combine cancellation with stale-result checks for user-driven work.

## Summary

`AbortController` is the standard way to cancel many JavaScript async operations.

Promises are not cancelable by themselves, but APIs such as `fetch()` can listen to an abort signal.

Cancellation helps avoid wasted work and prevents old async results from affecting current UI state.
