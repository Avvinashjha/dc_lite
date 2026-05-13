# Complexity, Memoization, and Practice

You have built the tools — functions, closures, recursion, patterns, tracing. In this final lesson of the module you will learn how to **measure** the cost of your recursive code, how to **speed it up** with memoization, and exactly **which problems to solve next** to cement everything.

## Reading a recurrence

Every recursive function has a **recurrence relation** — a formula for its running time `T(n)` in terms of smaller inputs. You do not need a computer science degree; a handful of patterns covers 90% of cases.

### Linear recursion

```javascript
function sumTo(n) {
  if (n <= 0) return 0;
  return n + sumTo(n - 1);
}
```

Recurrence: `T(n) = T(n - 1) + O(1)`.

Reading: "the work at size `n` equals the work at size `n - 1` plus a constant." This unrolls to `O(n)`.

### Halving recursion

```javascript
function binarySearch(arr, target, low, high) { /* ... */ }
```

Recurrence: `T(n) = T(n / 2) + O(1)`.

Reading: "each call halves the input and does constant extra work." This gives `O(log n)`.

### Branching recursion (two halves, both recursed)

Merge sort recurses on both halves and does O(n) merging work:

`T(n) = 2 * T(n / 2) + O(n)` → `O(n log n)`.

### Doubly branching, constant work

Naive Fibonacci:

`T(n) = T(n - 1) + T(n - 2) + O(1)` → approximately `O(2^n)`.

### Cheat sheet

| Recurrence shape               | Solves to   | Examples                              |
| ------------------------------ | ----------- | ------------------------------------- |
| T(n) = T(n - 1) + O(1)         | O(n)        | sumTo, factorial, linear scans        |
| T(n) = T(n - 1) + O(n)         | O(n²)       | slice-based recursion, naive reverse  |
| T(n) = T(n / 2) + O(1)         | O(log n)    | binary search, pow(x, n) optimized    |
| T(n) = 2·T(n / 2) + O(n)       | O(n log n)  | merge sort                            |
| T(n) = T(n - 1) + T(n - 2) + O(1) | O(2^n)   | naive fib, unmemoized multi-recursion |

Alongside **time**, always ask about **stack space**: a recursion `d` levels deep uses O(d) memory on the stack.

## Memoization: cache the answers

Naive Fibonacci is `O(2^n)` because it recomputes `fib(3)`, `fib(2)`, `fib(1)` many times. If we simply **remember** each answer the first time we compute it, every distinct subproblem is solved exactly once — and the whole thing collapses to `O(n)`.

```javascript
function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);

  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}

fib(50); // instant — 12586269025
```

Three rules apply to every memoized recursion:

1. **Pure inputs.** The cache key is the arguments. If the function reads outside state or uses randomness, the cache is unsafe.
2. **Finite subproblems.** If the input space is bounded (e.g., `n` is an integer 0..50), memoization transforms exponential-branching recursions into polynomial time.
3. **Keys must be comparable.** Numbers and strings are ideal. For tuples, JSON-stringify carefully or use a nested Map.

### Using a closure to hide the cache

The `memo = new Map()` default parameter is convenient but re-seeds per top-level call. A closure-based version exposes a cleaner API:

```javascript
function makeFib() {
  const memo = new Map();
  return function fib(n) {
    if (n < 2) return n;
    if (memo.has(n)) return memo.get(n);
    const result = fib(n - 1) + fib(n - 2);
    memo.set(n, result);
    return result;
  };
}

const fib = makeFib();
fib(100); // 354224848179261915075
```

Notice how this ties together almost everything from the module: a factory function returns a closure that captures a private `Map` and calls itself recursively.

### Generic `memoize` helper

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

// Works for any pure function of hashable inputs.
const slow = n => { /* imagine heavy work */ return n * 2; };
const fast = memoize(slow);
```

This is how real libraries (lodash's `memoize`, React's `useMemo`) are built internally.

### Memoization ≠ dynamic programming (yet)

Memoization is **top-down DP**: you still write the recursion and cache on the way down. **Bottom-up DP** rewrites the recurrence as a loop filling a table. Both produce the same time complexity; the bottom-up version usually saves stack space. That is a story for a later module — but you have now met the first half of the technique.

## When NOT to use recursion

- **Very deep input.** Traversing a list of 100,000 nodes recursively risks stack overflow. Rewrite as a loop.
- **Simple accumulation.** `sumTo`, counting, reversing a fixed array — loops are clearer.
- **Tight hot paths.** Function-call overhead is small but nonzero; loops win in microbenchmarks.

Use recursion when the problem **feels** recursive — self-similar structure, "try every choice," divide-and-conquer. Use loops everywhere else.

## A curated practice ladder

Solve these in order. Each step builds on the last. Use the in-browser runner to verify, then read the solution.

### Tier 1 — Warmups (confidence)

1. [Sum of Digits](/problems/sum-of-digits-recursive) — base case `n < 10`, recursive case `n % 10 + f(Math.floor(n / 10))`.
2. [Power of Two](/problems/power-of-two) — recursion on `n / 2` with two failure conditions.
3. [Reverse String](/problems/reverse-string) — two-pointer recursion; do it in place if you can.

### Tier 2 — Classics (core recursion muscle)

4. [Fibonacci Number](/problems/fibonacci-number) — submit the naive version first, then memoize, then iterate. Observe the speedup.
5. [Pow(x, n)](/problems/pow-x-n) — exploit `x^n = x^(n/2) * x^(n/2)` for O(log n). Handle negative `n`.
6. [Tower of Hanoi](/problems/tower-of-hanoi) — every recursion textbook's poster child. Count the moves and compare to `2^n - 1`.

### Tier 3 — Stretch (recursion + combinatorics)

7. [Climbing Stairs](/problems/climbing-stairs) — same recurrence as Fibonacci; a perfect bridge to dynamic programming.
8. [Generate Parentheses](/problems/generate-parentheses) — "try every choice" with two branches (add `(` or add `)`), pruned by constraints. A gentle introduction to backtracking.
9. [Two Sum](/problems/two-sum) — not inherently recursive, but a great chance to practice designing a clean function signature and return contract. Try a recursive two-pointer on the sorted variant.

## How to work each problem

Before writing code:

1. State the **base case** aloud — the smallest input you can answer directly.
2. State the **recursive step** — how does the current problem relate to a smaller one?
3. Choose the **combine** operation — `+`, `max`, concatenation, include/exclude.
4. Eyeball the **recurrence** — is this O(n), O(log n), O(2^n)? Does it need memoization?

Then write the function, trace a tiny input on paper, and submit.

:::quiz
question: What is the time complexity of the naive recursive Fibonacci, and what does memoization bring it down to?
options:
  - O(n) → O(log n)
  - O(n²) → O(n)
  - O(2^n) → O(n)
  - O(log n) → O(1)
answer: 2
explanation: Naive Fibonacci branches into two every call and recomputes subproblems, giving roughly O(2^n). Memoization computes each `fib(k)` at most once, collapsing the work to O(n) (with O(n) extra memory for the cache).
:::

:::quiz
question: Memoization is safe for a function f(...) only when...
options:
  - f uses `console.log` internally.
  - f is a pure function: same inputs always produce the same output, with no side effects.
  - f is defined with the `function` keyword.
  - f is defined at the top level of the file.
answer: 1
explanation: The whole idea of a cache is that a given input maps to a single, stable output. Impure functions (using time, randomness, or external state) can produce different outputs for the same arguments and must not be memoized.
:::

:::quiz
question: A recursion with recurrence T(n) = T(n/2) + O(1) solves to what time complexity?
options:
  - O(1)
  - O(log n)
  - O(n)
  - O(n log n)
answer: 1
explanation: Each call halves the input and does constant extra work. The number of halvings needed to reach 1 is log n, giving O(log n). Binary search and fast exponentiation use this exact pattern.
:::

:::exercise
title: Memoize `climbStairs`
description: The number of distinct ways to climb `n` stairs, taking 1 or 2 at a time, is `F(n) = F(n-1) + F(n-2)` with base cases `F(1) = 1`, `F(2) = 2`. Implement `climbStairs(n)` using memoization so that `climbStairs(40)` runs instantly. Use a `Map` for the cache.
starterCode: |
  function climbStairs(n, memo = new Map()) {
    // 1. Handle base cases: n === 1 → 1, n === 2 → 2
    // 2. If memo has n, return it
    // 3. Compute climbStairs(n-1, memo) + climbStairs(n-2, memo), cache, return
  }

  console.log(climbStairs(1));  // 1
  console.log(climbStairs(2));  // 2
  console.log(climbStairs(5));  // 8
  console.log(climbStairs(40)); // 165580141  (should be instant)
:::

## Module wrap-up

You now have a complete mental toolkit for recursive problem solving:

- Read a problem, spot the self-similar structure, and write a base + recursive case.
- Trace a small example on paper to validate.
- Classify the pattern (linear, multiple, tail) and predict the complexity.
- Reach for memoization when subproblems overlap.
- Know when a loop is simply the better answer.

Next module: **Arrays & Strings**. We will apply these functions and recursion skills to everyday data, layer in two-pointer and sliding-window techniques, and keep the practice ladder going.

## Practice (module capstone)

Work through the ladder above in order. By the time you finish all nine problems, you should feel equally comfortable sketching a recursion on paper, optimizing it with memoization, and rewriting it as a loop. That is the bar for this module.
