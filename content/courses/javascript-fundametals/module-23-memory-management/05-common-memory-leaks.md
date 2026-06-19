# Common Memory Leaks

A memory leak happens when a program keeps memory it no longer needs.

In JavaScript, leaks usually come from unwanted references. The garbage collector is working correctly, but your code still makes old values reachable.

## Growing Global Arrays

```js
const activityLog = [];

function trackActivity(event) {
  activityLog.push({
    type: event.type,
    target: event.target,
    time: Date.now(),
  });
}
```

If `activityLog` grows forever, memory usage grows forever.

A safer version limits its size:

```js
const activityLog = [];
const MAX_LOGS = 100;

function trackActivity(event) {
  activityLog.push({
    type: event.type,
    time: Date.now(),
  });

  if (activityLog.length > MAX_LOGS) {
    activityLog.shift();
  }
}
```

This also avoids storing `event.target`, which may reference a large DOM subtree.

## Unbounded Caches

Caches improve performance by reusing expensive results.

They can leak memory if they never evict anything.

```js
const cache = new Map();

function getUserProfile(id) {
  if (!cache.has(id)) {
    cache.set(id, loadProfile(id));
  }

  return cache.get(id);
}
```

If `id` can have many values, the cache can grow without limit.

A simple limit helps:

```js
const cache = new Map();
const MAX_CACHE_SIZE = 50;

function remember(key, value) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }

  cache.set(key, value);
}
```

## Timers That Never Stop

Timers keep callbacks reachable while they are active.

```js
function startClock(element) {
  setInterval(() => {
    element.textContent = new Date().toLocaleTimeString();
  }, 1000);
}
```

The interval keeps the callback alive. The callback keeps `element` alive.

Return a cleanup function:

```js
function startClock(element) {
  const intervalId = setInterval(() => {
    element.textContent = new Date().toLocaleTimeString();
  }, 1000);

  return function stopClock() {
    clearInterval(intervalId);
  };
}
```

## Event Listeners Left Behind

```js
function attachSaveButton(button, form) {
  button.addEventListener("click", () => {
    saveForm(form);
  });
}
```

Use a named handler and remove it during cleanup:

```js
function attachSaveButton(button, form) {
  function handleClick() {
    saveForm(form);
  }

  button.addEventListener("click", handleClick);

  return function cleanup() {
    button.removeEventListener("click", handleClick);
  };
}
```

## Detached DOM Nodes

A detached DOM node is removed from the document but still referenced by JavaScript.

```js
const removedCards = [];

function removeCard(card) {
  card.remove();
  removedCards.push(card);
}
```

The card is gone from the page but still kept in `removedCards`.

Store only the information you need:

```js
const removedCardIds = [];

function removeCard(card) {
  removedCardIds.push(card.id);
  card.remove();
}
```

## Subscriptions

Many libraries return unsubscribe functions.

```js
const unsubscribe = store.subscribe(() => {
  render(store.getState());
});
```

If you never call `unsubscribe`, the store can keep the callback and related data alive.

```js
function mountView() {
  const unsubscribe = store.subscribe(render);

  return function unmountView() {
    unsubscribe();
  };
}
```

## Best Practices

- Bound collections that can grow over time.
- Return cleanup functions when starting timers, listeners, or subscriptions.
- Store IDs or small snapshots instead of full objects when possible.
- Clear references to detached DOM nodes.
- Review long-lived arrays, objects, maps, and sets carefully.

## Common Mistakes

- Using a cache without an eviction strategy.
- Starting intervals without storing the interval ID.
- Adding anonymous event listeners that cannot be removed later.
- Keeping full events, DOM nodes, or API responses when only a small field is needed.

## Summary

Most JavaScript memory leaks are unwanted references in long-lived places. Timers, listeners, caches, global arrays, subscriptions, and detached DOM nodes are common sources.

The fix is usually explicit cleanup or a smaller ownership boundary.
