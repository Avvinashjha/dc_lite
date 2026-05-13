# Higher-Order Functions

A **higher-order function** is any function that does at least one of the following: it takes another function as an argument, or it returns a function. That is the whole definition — and it unlocks most of the expressive power of modern JavaScript.

## Why higher-order functions?

Look at these three pieces of code. They only differ in the transformation:

```javascript
const doubled = [];
for (const n of [1, 2, 3]) doubled.push(n * 2);

const squared = [];
for (const n of [1, 2, 3]) squared.push(n * n);

const negated = [];
for (const n of [1, 2, 3]) negated.push(-n);
```

The loop structure is noise. What we actually care about is the tiny transformation: `n * 2`, `n * n`, `-n`. A higher-order function lets us **pass that transformation as data**:

```javascript
[1, 2, 3].map(n => n * 2); // [2, 4, 6]
[1, 2, 3].map(n => n * n); // [1, 4, 9]
[1, 2, 3].map(n => -n);    // [-1, -2, -3]
```

One line each, intent visible, no mutable accumulators.

## The core trio: `map`, `filter`, `reduce`

Every JavaScript developer should be fluent with these three array methods.

### `map` — transform each element

```javascript
const users = [
  { name: "Alice", age: 30 },
  { name: "Bob",   age: 25 },
];

const names = users.map(u => u.name);
// ["Alice", "Bob"]
```

`map` always returns a **new array of the same length**.

### `filter` — keep matching elements

```javascript
const adults = users.filter(u => u.age >= 18);
```

`filter` returns a new array with only the elements for which the callback is truthy. Its length is `<=` the original.

### `reduce` — fold many values into one

`reduce` walks the array carrying an accumulator:

```javascript
const nums = [1, 2, 3, 4];
const total = nums.reduce((acc, n) => acc + n, 0); // 10
```

The initial `0` is important — without it, `reduce` uses the first element as the seed. The general shape is:

```text
reduce((acc, current) => nextAcc, initialValue)
         ▲          ▲           ▲
         │          │           └─ returned from each step
         │          └─ the current array element
         └─ accumulated result so far
```

`reduce` is strictly more powerful than `map` and `filter` — you can express both with it — but it is less readable, so reach for `map`/`filter` when they fit.

## Writing your own higher-order functions

### Build `map` from scratch

```javascript
function map(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i));
  }
  return result;
}

map([1, 2, 3], n => n * 10); // [10, 20, 30]
```

### A reusable `repeat`

```javascript
function repeat(times, action) {
  for (let i = 0; i < times; i++) action(i);
}

repeat(3, i => console.log(`Ping ${i}`));
// Ping 0 / Ping 1 / Ping 2
```

### A function that **returns** a function (factory)

```javascript
function greaterThan(limit) {
  return n => n > limit;
}

const over18 = greaterThan(18);
[10, 20, 30].filter(over18); // [20, 30]
```

`over18` is a specialized predicate built from a general one. This is **partial application** — locking in some arguments up front to produce a simpler function.

## Callbacks

The most common form of higher-order function is a function that takes a **callback**: a function passed as input that will be invoked later. Every event handler, every timer, every `Array.prototype.*` higher-order method is this pattern.

```javascript
function onClick(button, callback) {
  button.addEventListener("click", callback);
}

setTimeout(() => console.log("1 second later"), 1000);
```

Callbacks are how asynchronous code historically expressed "do this after that is done."

## Pure functions

A **pure function** has two properties:

1. Given the same inputs, it always returns the same output.
2. It causes no observable side effects (no mutation, no I/O, no randomness, no clock, no network).

```javascript
function add(a, b) { return a + b; }        // ✅ pure

let counter = 0;
function nextId() { return ++counter; }     // ❌ impure — depends on outside state

function save(user) { db.insert(user); }    // ❌ impure — I/O side effect
```

Pure functions are a joy to work with because:

- They are easy to test — no setup, no mocking.
- They are safe to cache (memoize) — same input, same output.
- They compose cleanly — you can chain them without surprises.

Keep the **core of your program pure** and push side effects to the edges.

## `map`, `filter`, `reduce` — chained together

A realistic example: from a list of orders, sum the total paid by adult customers with delivered orders.

```javascript
const orders = [
  { user: "Alice",   age: 30, amount: 100, status: "delivered" },
  { user: "Bob",     age: 15, amount: 80,  status: "delivered" },
  { user: "Carol",   age: 22, amount: 45,  status: "cancelled" },
  { user: "Dave",    age: 41, amount: 60,  status: "delivered" },
];

const total = orders
  .filter(o => o.age >= 18)
  .filter(o => o.status === "delivered")
  .reduce((acc, o) => acc + o.amount, 0);

// 160
```

Each step is a small, named intent. Compare this to a single imperative loop with three conditions and a running total — which would you rather read at 2am?

:::quiz
question: Which best defines a higher-order function?
options:
  - A function declared outside any other function.
  - A function that only returns numbers.
  - A function that either takes a function as input or returns a function.
  - A function written using the `function` keyword.
answer: 2
explanation: A higher-order function accepts another function as an argument, or returns one, or both. That is what makes `map`, `filter`, `reduce`, `setTimeout`, and event handlers work.
:::

:::quiz
question: What does `[1, 2, 3, 4].filter(n => n % 2 === 0).map(n => n * 10).reduce((s, n) => s + n, 0)` produce?
options:
  - 0
  - 60
  - 100
  - 30
answer: 1
explanation: filter keeps [2, 4]; map turns them into [20, 40]; reduce sums to 60.
:::

:::quiz
question: Which of these is a pure function?
options:
  - A function that reads `Date.now()` and returns the current hour.
  - A function that appends a value to a module-level array and returns the array.
  - A function that takes two numbers and returns their product.
  - A function that logs its argument and returns undefined.
answer: 2
explanation: A pure function returns the same output for the same inputs and has no side effects. Multiplying two numbers is pure; using the clock, mutating external state, or logging are side effects.
:::

:::exercise
title: Implement `filter` from scratch
description: Without using `Array.prototype.filter`, write a function `myFilter(arr, predicate)` that returns a new array containing the elements for which `predicate(element)` is truthy. Verify with the provided test below.
starterCode: |
  function myFilter(arr, predicate) {
    // Build and return a new array. Do not mutate `arr`.
  }

  const nums = [1, 2, 3, 4, 5, 6];
  console.log(myFilter(nums, n => n % 2 === 0)); // [2, 4, 6]
  console.log(myFilter(nums, n => n > 10));      // []
  console.log(nums);                             // original unchanged
:::

## Key takeaways

- A higher-order function takes or returns a function — that is the whole idea.
- `map`, `filter`, `reduce` express most data transformations without loops.
- Factory functions (functions that return functions) produce specialized behavior from general code.
- Keep functions **pure** where possible; isolate side effects at the edges of your program.

## Practice

- [Two Sum](/problems/two-sum) — can you express the brute-force solution with `filter`/`find`? What is the trade-off vs. a hash map?
- [Reverse Integer](/problems/reverse-integer) — try implementing it with `String.split` + `reverse` + `join` and compare to a purely arithmetic version.
