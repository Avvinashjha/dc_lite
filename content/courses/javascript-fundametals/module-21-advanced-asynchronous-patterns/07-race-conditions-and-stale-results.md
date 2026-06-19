# Race Conditions and Stale Results

A race condition happens when the result depends on timing.

In async JavaScript, this often means an older operation finishes after a newer one and overwrites current state.

## A Common Search Problem

Imagine a user types quickly:

1. They search for `a`.
2. They search for `ab`.
3. The `ab` request finishes first.
4. The older `a` request finishes last and replaces the results.

The UI now shows stale data.

```js
async function search(query) {
  const response = await fetch(`/api/search?q=${query}`);
  const results = await response.json();

  renderResults(results);
}
```

This function does not know whether its result is still current.

## Track the Latest Request

One solution is a request id.

```js
let latestRequestId = 0;

async function search(query) {
  const requestId = latestRequestId + 1;
  latestRequestId = requestId;

  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const results = await response.json();

  if (requestId !== latestRequestId) {
    return;
  }

  renderResults(results);
}
```

Only the latest request is allowed to update the UI.

## Cancel Older Work

Another solution is cancellation.

```js
let currentController;

async function search(query) {
  if (currentController) {
    currentController.abort();
  }

  currentController = new AbortController();

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal: currentController.signal,
    });

    const results = await response.json();
    renderResults(results);
  } catch (error) {
    if (error.name !== "AbortError") {
      showError(error);
    }
  }
}
```

This stops the older request when the newer one begins.

In important UI flows, using both cancellation and stale-result checks can be safest.

## Shared State Races

Race conditions can also happen when multiple async tasks update shared state.

```js
let total = 0;

async function addPrice(id) {
  const price = await fetchPrice(id);
  total += price;
}

await Promise.all([addPrice(1), addPrice(2), addPrice(3)]);
```

This may work, but shared mutable state makes code harder to reason about.

A clearer approach collects results first.

```js
const prices = await Promise.all([
  fetchPrice(1),
  fetchPrice(2),
  fetchPrice(3),
]);

const total = prices.reduce((sum, price) => sum + price, 0);
```

The calculation is synchronous and predictable after all async work finishes.

## Last Write Wins

Sometimes the latest action should win.

Example: saving draft text as the user types.

```js
let latestSaveId = 0;

async function saveDraft(text) {
  const saveId = latestSaveId + 1;
  latestSaveId = saveId;

  await sendDraft(text);

  if (saveId === latestSaveId) {
    showSavedMessage();
  }
}
```

Only the latest save updates the status message.

## First Result Wins

Sometimes the first successful result should win.

```js
const fastestResponse = await Promise.any([
  fetch("/api/primary"),
  fetch("/api/backup"),
]);
```

This can be useful for fallback servers.

But remember: the slower operations are not automatically cancelled.

If cancellation matters, pass abort signals and abort the losers.

## Race Conditions in UI Components

Many UI bugs happen when async work finishes after the user navigates away or a component is removed.

The exact syntax depends on the framework, but the principle is the same:

- start async work
- keep a way to cancel or ignore it
- clean up when the screen no longer needs the result

```js
let isActive = true;

loadUser().then((user) => {
  if (isActive) {
    renderUser(user);
  }
});

function cleanup() {
  isActive = false;
}
```

For real fetch requests, `AbortController` is usually better than only using a flag.

## Common Mistakes

Do not assume requests finish in the order they started.

Network timing is unpredictable.

Do not let old requests update current UI state.

Do not rely on `Promise.race()` to cancel work.

It chooses the first settled Promise, but the other operations keep running unless you cancel them.

## Best Practices

- Give user-driven requests a way to be cancelled or ignored.
- Track the latest operation when only the newest result should update state.
- Avoid shared mutable state across parallel async tasks.
- Prefer collecting async results, then deriving state synchronously.
- Be explicit about whether first result wins or last result wins.

## Summary

Race conditions happen when async timing changes program behavior.

The most common beginner-facing bug is stale UI results.

Use request ids, cancellation, and careful state updates to make async code predictable.
