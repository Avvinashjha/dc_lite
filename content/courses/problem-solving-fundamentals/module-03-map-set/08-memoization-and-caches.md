# Memoization and Caches

A **cache** stores expensive function results keyed by arguments. **Memoization** wraps a pure function so repeated inputs return the cached output. `Map` is a natural cache store — especially when keys are objects or composite values.

## Simple memoize

```javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

```text
call fib(40)
  key "[40]" not in Map -> compute -> store
call fib(40) again
  key "[40]" in Map -> return instantly
```

**Caveat:** `JSON.stringify` keys break for functions, `undefined` ordering, or circular structures. For single numeric args, use the number directly as key: `cache.get(n)`.

## Fibonacci memo (Module 01 revisited)

```javascript
function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const r = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, r);
  return r;
}
```

## LRU cache (preview)

A **least-rerecently-used** cache evicts old entries when full — often implemented with **Map** insertion order: re-`set` a key to mark it fresh; `delete` oldest. Full LRU is a common interview design problem; for this course, know that **Map order + move-to-end** patterns enable O(1) operations with careful design.

## Pure functions only

Memoizing impure functions (random, `Date.now`, I/O) caches wrong results.

:::quiz
question: Why is memoization safe only for pure functions?
options:
  - Same inputs must always yield same outputs; impure functions can differ each call.
  - Pure functions run faster.
answer: 0
explanation: A cache assumes the first computed value is correct for all future identical calls — only true for pure functions.
:::

:::quiz
question: Using JSON.stringify(args) as a cache key fails when...
options:
  - Object arguments have keys in different orders producing different strings for the same logical object, or values are not JSON-serializable.
  - Arguments are always numbers.
answer: 0
explanation: Key stability and serializability matter; for robust caches use structured keys or a library.
:::

:::quiz
question: Map works well as a memo cache for recursive DP because...
options:
  - Subproblems are often identified by small integer or tuple keys with O(1) get/set.
  - Map sorts keys automatically.
answer: 0
explanation: Fast lookup and store per subproblem is exactly what tabulation/memoization needs.
:::

:::exercise
title: Memoize factorial
description: Write `memoizeFactorial` that returns a function `fact(n)` computing n! with a Map caching results for each n. Base: fact(0) = fact(1) = 1.
starterCode: |
  function memoizeFactorial() {
    const cache = new Map([[0, 1], [1, 1]]);
    return function fact(n) {
      // ...
    };
  }

  const fact = memoizeFactorial();
  console.log(fact(5), fact(5)); // 120, 120 (second call hits cache)
:::

## Practice

- [Fibonacci Number](/problems/fibonacci-number) — top-down with Map.
- [Climbing Stairs](/problems/climbing-stairs) — memoized recursion.
