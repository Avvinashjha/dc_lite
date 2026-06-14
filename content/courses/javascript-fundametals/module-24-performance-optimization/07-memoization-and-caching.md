# Memoization and Caching

Memoization is an optimization technique that stores the result of a function call.

If the same inputs are used again, the stored result is returned instead of recalculating it.

## When Memoization Helps

Memoization helps when:

- a function is expensive
- the same inputs happen repeatedly
- the function is pure or behaves like a pure function
- cached results do not become stale too quickly

Memoization does not help much when every input is different.

It can also hurt performance if the cache grows too large.

## A Slow Function

```js
function calculateDiscount(price, customerType) {
  // Imagine this has expensive business rules.
  for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i);
  }

  return customerType === "vip" ? price * 0.8 : price * 0.95;
}
```

If the same price and customer type are used repeatedly, caching can avoid repeated work.

## Basic Memoization

```js
function memoize(callback) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = callback.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

Use it:

```js
const memoizedDiscount = memoize(calculateDiscount);

console.log(memoizedDiscount(100, "vip"));
console.log(memoizedDiscount(100, "vip")); // uses cached result
```

## Cache Keys Matter

The example uses `JSON.stringify(args)` to build a cache key.

That is simple, but not perfect.

Problems can include:

- objects with the same data but different key order
- values that cannot be serialized cleanly
- large objects that are expensive to stringify
- functions, symbols, or circular references

For real applications, choose a cache key that matches the data.

```js
function getProductCacheKey(productId, currency) {
  return `${productId}:${currency}`;
}
```

## Memoizing Pure Functions

Memoization works best with pure functions.

```js
function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}
```

For the same `amount` and `currency`, the result should be the same.

That makes it a reasonable memoization candidate if it is called often.

## Avoid Caching Stale Data

Caching API data can improve performance, but data can become stale.

```js
const userCache = new Map();

async function getUser(id) {
  if (userCache.has(id)) {
    return userCache.get(id);
  }

  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();

  userCache.set(id, user);
  return user;
}
```

This is simple, but it never refreshes.

In real applications, you may need:

- expiration times
- manual invalidation
- refetching after updates
- cache size limits

## Memory Tradeoff

Caching trades memory for speed.

That can be a good tradeoff, but not always.

```js
const cache = new Map();
```

A `Map` keeps strong references to its keys and values.

If the cache grows forever, memory usage grows too.

Use size limits or clear old entries when needed.

## Avoid Unnecessary Work Without Caching

Sometimes you do not need a cache.

You can simply avoid recalculating when inputs have not changed.

```js
let lastQuery = "";
let lastResults = [];

function search(query) {
  if (query === lastQuery) {
    return lastResults;
  }

  lastQuery = query;
  lastResults = runSearch(query);
  return lastResults;
}
```

This stores only the most recent result.

It is simpler and uses less memory than an unlimited cache.

## Common Mistakes

- Memoizing cheap functions and adding complexity for no benefit.
- Caching results from impure functions that depend on time, random values, or hidden state.
- Letting caches grow forever.
- Using weak cache keys that accidentally mix different inputs.
- Forgetting that cached API data can become stale.

## Summary

Memoization stores results so repeated calls can skip repeated work.

It is most useful for expensive, repeatable, pure calculations.

Use caching thoughtfully, because every cache introduces invalidation and memory tradeoffs.
