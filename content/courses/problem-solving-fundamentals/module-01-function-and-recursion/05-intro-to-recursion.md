# Introduction to Recursion

**Recursion is when a function calls itself to solve a smaller version of the same problem.** That is it. The hard part is not the code — it is training your brain to trust that the smaller call "just works" so you do not unravel it step by step.

## The mental model

Every recursive function has two must-have pieces:

1. **Base case** — a tiny version of the problem whose answer you know directly, with no further calls.
2. **Recursive case** — express the current problem in terms of a smaller version of itself, then combine the result.

If you forget the base case, the function calls itself forever and crashes. If you forget the recursive case, it never moves toward the answer.

```text
recursive function skeleton
┌───────────────────────────────────────┐
│  if (it's the simplest version)       │
│      return the known answer          │ ◀── base case
│                                       │
│  solve a smaller version              │
│  combine that answer with this step   │ ◀── recursive case
└───────────────────────────────────────┘
```

## Warmup 1: `countDown(n)`

Print `n, n-1, n-2, ..., 1`.

```javascript
function countDown(n) {
  if (n <= 0) return;          // base case: nothing to print
  console.log(n);              // do the work for this step
  countDown(n - 1);            // let the smaller version handle the rest
}

countDown(3);
// 3
// 2
// 1
```

Notice what we **do not** write: no loop, no counter. We say "print this number, then ask a smaller `countDown` to handle the rest." That is the recursive mindset.

## Warmup 2: `sumTo(n)`

Compute `1 + 2 + ... + n`.

```javascript
function sumTo(n) {
  if (n <= 0) return 0;        // base case
  return n + sumTo(n - 1);     // recursive case: combine with smaller answer
}

sumTo(5); // 15
```

Read the recursive line aloud: "the sum up to `n` is `n` plus the sum up to `n - 1`." That sentence is the whole definition — and the code mirrors it exactly.

## The classic: `factorial(n)`

`n! = 1 * 2 * 3 * ... * n`, with `0! = 1` by definition.

```javascript
function factorial(n) {
  if (n <= 1) return 1;        // base case
  return n * factorial(n - 1); // recursive case
}

factorial(4); // 24
```

Here is how `factorial(4)` unfolds conceptually:

```text
factorial(4)
 └─ 4 * factorial(3)
         └─ 3 * factorial(2)
                 └─ 2 * factorial(1)
                         └─ 1                 ◀── base case returns 1
                 ← returns 2 * 1 = 2
         ← returns 3 * 2 = 6
 ← returns 4 * 6 = 24
```

Reading top-down, each call says "I will finish once the smaller call below me finishes." Reading bottom-up, answers bubble back up and get combined.

## The "trust the recursion" leap

The biggest source of confusion for beginners is trying to simulate the entire unfolding in their head. Do not. Instead, assume the recursive call already works for the smaller case and focus only on:

- What is my **base case**? (Smallest input I can answer without recursing.)
- What does the **recursive call** give me? (The answer for `n - 1`, or half the input, or the rest of the list.)
- How do I **combine** that with the current step?

That is it. If those three answers are correct, the whole recursion is correct.

## Recursion vs. iteration

Anything you can do with recursion, you can do with a loop — and vice versa. They are equivalent in power. Prefer recursion when:

- The problem is **naturally self-similar** (trees, nested structures, "try every choice").
- Expressing the base + recursive step is dramatically clearer than a loop.

Prefer iteration when:

- You only need a simple counter or accumulator.
- You care about speed/memory and want to avoid call-stack overhead.

`sumTo(n)` is arguably clearer as a loop:

```javascript
function sumTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}
```

But traversing a binary tree, generating all subsets, or walking a filesystem directory is dramatically more natural with recursion — we will see those later in the course.

## Common beginner pitfalls

1. **Missing or wrong base case.** Always ask: for what input does this function return without recursing? Test with that tiny input first.
2. **Not moving toward the base case.** The recursive call must operate on a *smaller* input. `f(n - 0)` or `f(n)` are red flags.
3. **Doing the work after the recursion when you meant before** (or vice versa). In `countDown`, `console.log(n)` before the call prints descending; moving it after prints ascending.

```javascript
function countUp(n) {
  if (n <= 0) return;
  countUp(n - 1);      // finish the rest first...
  console.log(n);      // ...then print on the way back up
}

countUp(3); // 1, 2, 3
```

This is your first taste of something important: **"before" vs. "after" the recursive call** gives you two different behaviors for free.

:::quiz
question: Every correct recursive function MUST have which two components?
options:
  - A `for` loop and a counter variable.
  - A base case that stops recursion, and a recursive case that moves toward the base case.
  - A global variable and a helper function.
  - An early `throw` and a `try/catch`.
answer: 1
explanation: Without a base case the function recurses forever. Without a recursive case that shrinks the input, it never reaches the base case.
:::

:::quiz
question: What does `sumTo(0)` return in the lesson's implementation, and why?
options:
  - 0, because the base case handles n <= 0 and returns 0.
  - undefined, because there is no return.
  - 1, as a mathematical convention.
  - It recurses forever.
answer: 0
explanation: The base case is `if (n <= 0) return 0;`. `sumTo(0)` hits that branch and returns 0 directly — no recursion, no crash.
:::

:::quiz
question: You write `function f(n) { if (n === 0) return 0; return n + f(n); }`. What happens on `f(3)`?
options:
  - Returns 6.
  - Returns 0.
  - Throws a RangeError (stack overflow).
  - Returns undefined.
answer: 2
explanation: The recursive call `f(n)` does not shrink the input — it calls itself with the same `n`. The base case `n === 0` is never reached, and JavaScript eventually throws a RangeError for exceeding the call stack.
:::

:::exercise
title: Write `productTo(n)`
description: Implement `productTo(n)` recursively so that `productTo(n)` returns `1 * 2 * 3 * ... * n` for `n >= 1`, and returns `1` for `n <= 0`. Do NOT use any loops. State your base case and recursive case as a comment before writing the code.
starterCode: |
  function productTo(n) {
    // Base case: ?
    // Recursive case: ?
  }

  console.log(productTo(5)); // 120
  console.log(productTo(1)); // 1
  console.log(productTo(0)); // 1
:::

## Key takeaways

- A recursive function needs exactly two parts: a **base case** and a **recursive case** that shrinks the input.
- Do not mentally unroll every call. Trust the recursive call to handle the smaller problem.
- Doing work **before** the recursive call vs. **after** it produces different (but both useful) orderings.
- Prefer recursion for naturally self-similar problems. Prefer loops for simple accumulators.

## Practice

- [Fibonacci Number](/problems/fibonacci-number) — the most famous recursive definition. Write the naive version first.
- [Sum of Digits](/problems/sum-of-digits-recursive) — perfect warmup: base case `n < 10`, recursive case `n % 10 + f(Math.floor(n / 10))`.
- [Power of Two](/problems/power-of-two) — try a recursive solution: `n === 1` is true; `n > 1 && n % 2 === 0` reduces to checking `n / 2`.
