# Closures and Async Cleanup

Closures are powerful, but they can keep data alive longer than expected.

Async code can do the same. Timers, pending requests, subscriptions, and callbacks can all retain values through closures.

## Closures Retain Variables

A closure is a function that remembers variables from the scope where it was created.

```js
function createGreeter(name) {
  return function greet() {
    console.log(`Hello, ${name}`);
  };
}

const greetAda = createGreeter("Ada");
greetAda();
```

The returned function remembers `name`.

That is useful and expected.

## Closures Can Retain Large Data

```js
function createSearch(users) {
  return function search(query) {
    return users.filter((user) => user.name.includes(query));
  };
}

const searchUsers = createSearch(largeUserList);
```

As long as `searchUsers` exists, `largeUserList` stays reachable.

If the function only needs a smaller piece of data, store the smaller piece.

```js
function createNameSearch(users) {
  const names = users.map((user) => user.name);

  return function search(query) {
    return names.filter((name) => name.includes(query));
  };
}
```

## Timers Capture Variables

```js
function showTemporaryMessage(element, message) {
  element.textContent = message;

  const timeoutId = setTimeout(() => {
    element.textContent = "";
  }, 5000);

  return function cancelMessage() {
    clearTimeout(timeoutId);
  };
}
```

The timeout callback keeps `element` and `message` reachable until it runs or is cleared.

## Async Requests Can Finish Late

A request may finish after the related screen or component is gone.

```js
async function loadProfile(element, userId) {
  const response = await fetch(`/api/users/${userId}`);
  const profile = await response.json();

  element.textContent = profile.name;
}
```

The async function keeps `element` reachable until the request and JSON parsing finish.

Use `AbortController` when the underlying API supports cancellation.

```js
function loadProfile(element, userId) {
  const controller = new AbortController();

  async function run() {
    const response = await fetch(`/api/users/${userId}`, {
      signal: controller.signal,
    });
    const profile = await response.json();

    element.textContent = profile.name;
  }

  run().catch((error) => {
    if (error.name !== "AbortError") {
      console.error(error);
    }
  });

  return function cleanup() {
    controller.abort();
  };
}
```

## Ignore Stale Results

Sometimes you cannot cancel the underlying work.

You can still ignore old results.

```js
let latestRequestId = 0;

async function search(query) {
  const requestId = ++latestRequestId;
  const results = await searchApi(query);

  if (requestId !== latestRequestId) {
    return;
  }

  renderResults(results);
}
```

This avoids applying outdated work. It does not stop memory used by the request while it is pending, but it prevents stale updates.

## Subscriptions Need Unsubscribe

```js
function mountNotifications(user) {
  return notifications.subscribe((message) => {
    showNotification(user.name, message);
  });
}
```

The subscription callback captures `user`.

Call the returned unsubscribe function when the feature is no longer active.

## Best Practices

- Keep closures focused on the values they actually need.
- Avoid capturing huge objects when a small ID or string is enough.
- Return cleanup functions from setup functions.
- Clear timers and unsubscribe from streams.
- Abort fetch requests when the related UI or operation is no longer needed.
- Guard against stale async results when cancellation is not available.

## Common Mistakes

- Assuming a local variable disappears when a returned function still references it.
- Capturing DOM nodes in long-lived callbacks.
- Forgetting that pending async functions retain their local variables.
- Handling `AbortError` as an unexpected failure.

## Summary

Closures and async callbacks keep the variables they use reachable. That is often useful, but it can become a leak when callbacks outlive the feature that created them.

Design setup code with cleanup in mind.
