# Recursion Patterns: Linear, Multiple, and Tail

Most recursive functions fall into a small number of recognizable **patterns**. Learning these shapes lets you classify a new problem quickly and reach for the right structure.

In this lesson we will cover three:

1. **Linear recursion** — one recursive call per function body.
2. **Multiple (branching) recursion** — two or more recursive calls per body.
3. **Tail recursion** — a recursive call as the very last action.

## 1. Linear recursion

Each call makes **exactly one** recursive call, producing a straight line of frames.

```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // one recursive call
}
```

Call tree:

```text
factorial(4)
  └─ factorial(3)
       └─ factorial(2)
            └─ factorial(1)     ◀── base case
```

Properties of linear recursion:

- Time: **O(n)** where `n` is the input size.
- Stack space: **O(n)** (one frame per call).
- Easy to convert to a loop.

Other examples: `sumTo(n)`, `countDown(n)`, reversing a string by peeling one character at a time, walking a singly linked list.

## 2. Multiple recursion (branching)

A function that makes **two or more** recursive calls per invocation produces a tree, not a line.

### The naive Fibonacci

The Fibonacci sequence: `F(0) = 0`, `F(1) = 1`, `F(n) = F(n-1) + F(n-2)`.

```javascript
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2); // two recursive calls
}
```

Call tree for `fib(5)`:

```text
                        fib(5)
                 /                  \
              fib(4)               fib(3)
             /      \             /      \
          fib(3)   fib(2)      fib(2)   fib(1)
          /    \   /   \        /   \
       fib(2) fib(1) fib(1) fib(0) fib(1) fib(0)
       /   \
    fib(1) fib(0)
```

Notice how `fib(3)` appears **twice**, `fib(2)` appears three times, `fib(1)` appears five times. We are recomputing the same subproblems over and over.

### Why this is slow

Every call branches into two. The tree has about `2^n` leaves, so naive `fib(n)` takes **O(2^n)** time. That is fine for `fib(10)`, painful for `fib(30)`, and completely infeasible for `fib(50)`.

The fix — **memoization** — is coming in the final lesson of this module. The important insight for now is:

> Multiple recursion without memoization often revisits the same subproblems, turning an O(n) problem into an O(2^n) one.

### When multiple recursion is the right tool

Trees, "try every choice" problems, and divide-and-conquer algorithms are naturally multiple-recursive:

- Tree traversals (`left` and `right`).
- Subsets / permutations / parentheses — include / exclude, try each choice.
- Merge sort, quick sort — split and recurse on each half.

These do not always re-solve the same subproblems, so they avoid the exponential trap.

### Subsets: a canonical multi-recursion

Generate every subset of an array by deciding, for each element, whether to include it:

```javascript
function subsets(arr) {
  if (arr.length === 0) return [[]];

  const first = arr[0];
  const rest  = arr.slice(1);
  const withoutFirst = subsets(rest);
  const withFirst    = withoutFirst.map(sub => [first, ...sub]);

  return [...withoutFirst, ...withFirst];
}

subsets([1, 2, 3]);
// [[], [3], [2], [2,3], [1], [1,3], [1,2], [1,2,3]]
```

Two conceptual branches at every element: *exclude* and *include*. That is multiple recursion, and it is the soul of backtracking.

## 3. Tail recursion

A recursive call is **tail-position** if it is the very last thing the function does — nothing happens to its return value before it is returned to the caller.

```javascript
// Not tail recursion: the multiply `n * ...` happens AFTER the recursive call returns.
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Tail recursion: recursive call is the last action; nothing to do on the way back.
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTail(n - 1, acc * n);
}
```

In the tail version, the result of each call **is** the result of the recursive call — no combining step. We carry the partial answer in an **accumulator** parameter and hand it forward.

```text
factorialTail(4, 1)   →   factorialTail(3, 4)
                      →   factorialTail(2, 12)
                      →   factorialTail(1, 24)
                      →   returns 24          ◀── answer ready at the base case
```

In some languages (Scheme, Scala) the compiler can reuse the same stack frame for tail calls, turning tail-recursive functions into constant-space loops. The JavaScript spec calls this *proper tail calls*, but **most engines (V8, SpiderMonkey) do not implement it**, so in practice the stack still grows O(n) in JavaScript.

Tail recursion is still valuable for two reasons:

1. It trains you to think in terms of accumulators, which is exactly how iteration works — making conversion to a loop trivial.
2. It is a natural mental stepping stone to dynamic programming.

### Converting tail recursion to iteration

Once a function is tail-recursive with an accumulator, the loop version is almost mechanical:

```javascript
function factorialIter(n) {
  let acc = 1;
  for (let i = n; i > 1; i--) acc *= i;
  return acc;
}
```

The `acc` parameter becomes a `let` variable; the recursive call becomes the next loop iteration.

## Pattern cheat sheet

| Pattern            | Recursive calls | Typical time  | Typical stack | Examples                                  |
| ------------------ | --------------- | ------------- | ------------- | ----------------------------------------- |
| Linear             | 1               | O(n)          | O(n)          | factorial, sumTo, reverse string          |
| Multiple (branching) | 2+            | up to O(2^n)  | O(depth)      | naive fib, subsets, permutations, tree DFS |
| Tail               | 1, as last op   | O(n)          | O(n) in JS\*  | accumulator-style factorial, sumTo        |

\* Most JS engines do not optimize tail calls, so the stack still grows.

## Recognizing which pattern a problem needs

When you see a problem, ask:

1. Can I solve this by **peeling off one element** and recursing on the rest? → **linear recursion**.
2. Does every step offer **multiple choices**, or does the input split naturally into halves? → **multiple recursion / divide & conquer**.
3. Am I combining results with a simple operator (`+`, `*`, `max`) that I could instead accumulate forward? → refactor to **tail recursion**.

:::quiz
question: Which of the following is an example of LINEAR recursion?
options:
  - `fib(n)` returning `fib(n-1) + fib(n-2)`
  - `factorial(n)` returning `n * factorial(n-1)`
  - `subsets(arr)` returning the include-branch concatenated with the exclude-branch
  - A tree traversal that recurses into both left and right children
answer: 1
explanation: Linear recursion makes exactly one recursive call per invocation. `factorial` fits; the others are multiple/branching recursion.
:::

:::quiz
question: Why is naive `fib(n)` slow even though the recurrence F(n) = F(n-1) + F(n-2) is simple?
options:
  - Because JavaScript's call stack is especially slow.
  - Because the recursion tree recomputes the same subproblems exponentially many times.
  - Because addition is O(n) for large numbers.
  - Because arrow functions are slower than declarations.
answer: 1
explanation: Every call branches into two, and the same subproblems (like `fib(3)`, `fib(2)`) are recomputed across many branches, giving ~O(2^n) time.
:::

:::quiz
question: A function is tail-recursive when...
options:
  - It has at least one recursive call anywhere in its body.
  - Its recursive call is the very last action, with no further work on the returned value.
  - It uses an arrow function.
  - It recurses on both halves of the input.
answer: 1
explanation: Tail recursion means the recursive call's return value is passed straight through. An accumulator parameter is the classic way to achieve this.
:::

:::exercise
title: Two versions of sum
description: Write TWO versions of `sumOfArray(arr)`. Version A is linear-recursive and combines on the way back up. Version B is tail-recursive with an accumulator. Both must return the sum of the numbers in `arr` and must not use loops.
starterCode: |
  // Version A — linear (non-tail):
  function sumA(arr) {
    // base: empty array → 0
    // recursive: first + sumA(rest)
  }

  // Version B — tail-recursive with an accumulator:
  function sumB(arr, acc = 0) {
    // base: empty array → acc
    // recursive: sumB(rest, acc + first)
  }

  const nums = [3, 1, 4, 1, 5, 9, 2, 6];
  console.log(sumA(nums)); // 31
  console.log(sumB(nums)); // 31
:::

## Key takeaways

- **Linear recursion**: one call per step, O(n) time, O(n) stack, easy to loop-ify.
- **Multiple recursion**: branching; needed for trees and "try every choice" problems; watch for overlapping subproblems (coming: memoization).
- **Tail recursion**: the recursive call is the last thing done; accumulate forward. In JavaScript it does not save stack space in practice, but it is the bridge to iteration.
- Classify a problem by counting recursive calls and asking whether the work happens *before*, *after*, or *is* the recursive call.

## Practice

- [Fibonacci Number](/problems/fibonacci-number) — submit the naive multiple-recursion version, then a memoized version, then an iterative one.
- [Pow(x, n)](/problems/pow-x-n) — multi-recursion with a twist: use the identity `pow(x, n) = pow(x, n/2) * pow(x, n/2)` for O(log n) time.
- [Tower of Hanoi](/problems/tower-of-hanoi) — classic multiple recursion with three towers and a beautiful proof of minimality.
