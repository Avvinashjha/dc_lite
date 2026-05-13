# Complexity, Pitfalls, and Practice Ladder

You've now covered the interview-relevant stack toolkit: raw implementations, classic problems, the monotonic-stack pattern, nested-structure parsing, and background awareness. This lesson ties it together with a cheat sheet, a list of common pitfalls, and a ladder of practice problems from "warm-up" to "hard."

## Complexity cheat sheet

### Core stack operations (both implementations)

| Operation | Array-backed | Linked-list-backed |
| --- | --- | --- |
| push | O(1) amortized | O(1) worst case |
| pop | O(1) amortized | O(1) worst case |
| peek | O(1) | O(1) |
| isEmpty / size | O(1) | O(1) |

Space for `n` elements: O(n) either way. Prefer the array-backed version in practice for cache locality.

### Problems covered in this module

| Problem | Time | Space | Technique |
| --- | --- | --- | --- |
| Queue from two stacks | O(1) amortized / op | O(n) | Two stacks, drain on demand |
| Stack from queues | O(n) per op (unavoidable) | O(n) | Rotate on push |
| Valid parentheses | O(n) | O(n) | Match-and-pop |
| Min Stack | O(1) / op | O(n) | Parallel min stack |
| Evaluate RPN | O(n) | O(n) | Push operands, pop two on operator |
| Next greater element | O(n) | O(n) | Monotonic decreasing stack |
| Daily temperatures | O(n) | O(n) | Monotonic decreasing stack (distance payload) |
| Largest rectangle in histogram | O(n) | O(n) | Monotonic increasing stack with sentinel |
| Trapping rain water | O(n) | O(n) | Monotonic decreasing stack with layered bounded water |
| Asteroid collision | O(n) | O(n) | Pure-stack collision resolution |
| Decode string | O(N_decoded) | O(D + N) | Two stacks for context and count |

## Pitfalls that appear repeatedly

1. **`unshift` / `shift` in the hot loop.** Both are O(n) in JavaScript arrays because they reindex. Always use `push` / `pop` on the end. If you truly need FIFO, either use two stacks (lesson 04) or reach for a proper deque structure.
2. **Forgetting empty-stack guards.** `stack.pop()` and `stack[stack.length - 1]` both return `undefined` on an empty stack — this is fine sometimes but can propagate as `NaN` if you do math. Always decide up front: throw, return sentinel, or treat `undefined` intentionally.
3. **Strict vs. non-strict comparisons in monotonic stacks.** `<` vs `<=` changes whether ties stay or get resolved. For "next strictly greater," use strict `<`; for "next greater-or-equal," use non-strict. This one-character change silently produces wrong answers.
4. **Storing values when you need indices.** If the problem asks for positions or distances, you need indices on the stack.
5. **Missing sentinel at end-of-array.** Problems like largest-rectangle-in-histogram need a final "flush" pass; an explicit sentinel of `0` (shorter than any bar) forces the monotonic loop to drain.
6. **Updating only one of two parallel stacks.** In min-stack and queue-from-stacks, the two stacks must stay in sync. An assertion `stack.length === minStack.length` during development catches this quickly.
7. **Mutating input unnecessarily.** Stacks are cheap; allocating an index array and leaving the original untouched makes the solution easier to reason about and test.
8. **Confusing stack direction in words vs. code.** "Decreasing from bottom to top" means `nums[stack[0]] > ... > nums[stack.top]`. Write this down next to your code during interviews — it's the most common source of flipped comparisons.

## Recognition checklist — when to reach for a stack

- "Valid / balanced / matching pairs" → stack.
- "Most recent X that satisfies Y" → stack.
- "Next/previous greater/smaller" → monotonic stack.
- "Evaluate / decode / parse nested expression" → stack (two stacks for nested context).
- "Replay / undo / history" → stack.
- "Simulate collisions where only the most recent unresolved item matters" → stack.

If a problem statement mentions any of the above phrasings, spend a minute sketching the stack before trying anything else.

## Practice ladder

### Warm-up (implementations)

- [Implement Queue using Stacks](/problems/implement-queue-using-stacks)
- [Implement Stack using Queues](/problems/implement-stack-using-queues) — optional
- [Valid Parentheses](/problems/valid-parentheses)

### Core patterns

- [Evaluate Reverse Polish Notation](/problems/evaluate-reverse-polish-notation)
- [Simplify Path](/problems/simplify-path)
- [Decode String](/problems/decode-string)
- [Daily Temperatures](/problems/daily-temperatures)

### Monotonic-stack heavyweights

- [Largest Rectangle in Histogram](/problems/largest-rectangle-in-histogram)
- [Trapping Rain Water](/problems/trapping-rain-water)

### Suggested 5-day drill plan

Day 1: Implementations & Valid Parentheses. Reimplement both Stack classes from scratch and solve Valid Parentheses without looking.

Day 2: Implement Queue using Stacks + Evaluate RPN + Simplify Path. Focus on understanding the amortized argument.

Day 3: Daily Temperatures. Solve it, then solve Next Greater Element on your own (re-implement with indices). Internalize the monotonic-decreasing-stack template.

Day 4: Largest Rectangle in Histogram. This is the boss. Draw the bar diagram, trace the sentinel behavior, understand the width formula.

Day 5: Trapping Rain Water (stack approach), then Decode String. Both reuse earlier patterns — use them as validation that you've internalized the toolkit.

### Stretch problems (if you want more)

- **LC 503 Next Greater Element II** — circular variant.
- **LC 85 Maximal Rectangle** — reduces to LC 84 per row.
- **LC 901 Online Stock Span** — streaming monotonic stack.
- **LC 227 Basic Calculator II** — infix evaluation with precedence.
- **LC 224 Basic Calculator** — infix with parentheses and unary minus.
- **LC 735 Asteroid Collision** — revisit once you're fluent with the other patterns.

## What you should be able to do now

- Explain LIFO and contrast stacks with queues in one sentence.
- Implement a stack two different ways (array and linked list) in under 5 minutes.
- Write the queue-from-two-stacks solution and explain the amortized analysis.
- Recognize the monotonic-stack pattern from problem statements and instantiate the template correctly (direction, strictness, index vs. value).
- Solve Largest Rectangle in Histogram in one pass with the sentinel trick.
- Articulate the two-stack pattern for nested-context problems and apply it to Decode String.

If any of these feel shaky, revisit the specific lesson and repeat the exercise. Stacks look simple, but the fluency to recognize the pattern under pressure only comes from reps.

:::quiz
question: Your friend describes a problem as "for each element, how far until the next one with property X." Your first thought should be:
options:
  - A monotonic stack.
  - A hash map.
answer: 0
explanation: "Next X-ier neighbor" is the defining shape of monotonic-stack problems.
:::

:::quiz
question: Which of these problems does NOT naturally use a stack?
options:
  - Evaluate Reverse Polish Notation.
  - Finding the k-th smallest element in an array.
answer: 1
explanation: K-th smallest is a selection problem — heap or quickselect. No LIFO context is involved.
:::

:::quiz
question: For Largest Rectangle in Histogram, what does the sentinel value of 0 at index `n` accomplish?
options:
  - It forces every remaining index on the stack to be popped and evaluated, handling the tail of the array correctly.
  - It marks the end of input for parsing purposes.
answer: 0
explanation: Without the sentinel, bars that are taller than all successors would never trigger a pop.
:::

:::exercise
title: Self-assessment — reimplement three key functions
description: Without consulting the earlier lessons, rewrite `isValid`, `dailyTemperatures`, and `largestRectangleArea` from scratch. Aim for each in under 10 minutes and double-check edge cases (empty input, single element, all-equal input).
starterCode: |
  function isValid(s) { /* ... */ }

  function dailyTemperatures(T) { /* ... */ }

  function largestRectangleArea(heights) { /* ... */ }

  // sanity checks
  console.log(isValid("()[]{}"));  // true
  console.log(isValid("([)]"));    // false
  console.log(dailyTemperatures([73,74,75,71,69,72,76,73])); // [1,1,4,2,1,1,0,0]
  console.log(largestRectangleArea([2,1,5,6,2,3]));          // 10
:::

## Where to go next

The natural next step is **Module 07: Queue**, where you'll formalize FIFO, implement it with arrays / linked lists / circular buffers, learn the deque, and drill queue-specific patterns (BFS, monotonic deque for sliding window, task schedulers). Many of the stack-based patterns you just learned reappear in mirrored form on queues.
