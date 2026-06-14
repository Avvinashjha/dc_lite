# Debouncing

Debouncing limits how often a function runs.

It waits until activity has stopped for a certain amount of time.

This is useful when many events happen quickly but you only want to react after the user pauses.

## A Common Problem

Input events can fire on every keystroke.

```js
searchInput.addEventListener("input", (event) => {
  searchProducts(event.target.value);
});
```

If `searchProducts()` filters a large list or sends a network request, this can do too much work.

## Debounce Idea

With debouncing:

1. The event happens.
2. A timer starts.
3. If another event happens before the timer finishes, the timer resets.
4. The function runs only after the events stop for the delay.

## Debounce Helper

```js
function debounce(callback, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}
```

Use it:

```js
const debouncedSearch = debounce((query) => {
  searchProducts(query);
}, 300);

searchInput.addEventListener("input", (event) => {
  debouncedSearch(event.target.value);
});
```

Now the search runs after the user stops typing for 300 milliseconds.

## Why `apply()` Is Used

The helper uses:

```js
callback.apply(this, args);
```

This preserves:

- the `this` value from the returned function
- all arguments passed to the returned function

For many simple callbacks, `callback(...args)` is enough.

Using `apply()` makes the helper more flexible.

## Debouncing Network Requests

Debouncing is often used for autocomplete.

```js
const searchUsers = debounce(async (query) => {
  if (query.length < 2) {
    return;
  }

  const response = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
  const users = await response.json();

  renderUsers(users);
}, 300);
```

This avoids sending a request for every single keypress.

In real applications, you may also cancel older requests with `AbortController`.

## Immediate vs Delayed Debounce

The common debounce shown above runs after the delay.

Sometimes you want the function to run immediately, then ignore new calls until the delay passes.

That version is sometimes called leading debounce.

For beginners, the delayed version is easier and covers many search, resize, and validation cases.

## Good Uses for Debouncing

Debouncing is useful for:

- search boxes
- autocomplete
- saving drafts after typing stops
- window resize calculations
- form validation after the user pauses

## Poor Uses for Debouncing

Debouncing is not ideal when updates must happen regularly while activity continues.

For example, scroll position indicators should usually update while scrolling.

Throttling is often better there.

## Common Mistakes

- Creating a new debounced function inside every event callback.
- Using a delay that feels too slow for the user.
- Forgetting to handle stale network responses.
- Debouncing critical actions that should happen immediately.
- Thinking debouncing makes slow code fast; it only reduces how often the code runs.

## Summary

Debouncing waits for activity to pause before running a function.

Use it when events happen rapidly and only the final result matters, such as search input or resize calculations.
