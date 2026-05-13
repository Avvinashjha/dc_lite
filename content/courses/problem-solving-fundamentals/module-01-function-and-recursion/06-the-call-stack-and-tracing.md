# The Call Stack and Tracing Recursion

To reason confidently about recursion, you need a clear picture of the **call stack** — the data structure JavaScript uses to remember which function is running, what it was doing, and where to return to when it is done.

## What is the call stack?

Every time you call a function, the JavaScript engine pushes a **stack frame** onto the call stack. A frame holds:

- The local variables of that function invocation.
- The parameter values it received.
- The point in the code it should return to when it finishes.

When the function returns, its frame is popped. The stack is strictly **last-in, first-out (LIFO)** — the most recent call is always on top.

```text
CALL STACK  (top is the currently executing function)

 ┌───────────────────┐
 │ inner()           │ ◀── top: currently executing
 ├───────────────────┤
 │ middle()          │
 ├───────────────────┤
 │ outer()           │
 ├───────────────────┤
 │ <main script>     │
 └───────────────────┘
```

If `inner` returns, its frame is popped and `middle` is back on top. When `middle` returns, `outer` resumes from exactly where it left off.

## Tracing `factorial(4)` frame by frame

```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

Call `factorial(4)`. Here is every frame pushed and popped, in order.

**Step 1 — growing the stack (pushes):**

```text
after factorial(4) pushes factorial(3):
 ┌─────────────────────┐
 │ factorial(3)        │ ◀── executing
 │ waits for fact(2)   │
 ├─────────────────────┤
 │ factorial(4)        │
 │ waits for fact(3)   │
 └─────────────────────┘

after factorial(3) pushes factorial(2):
 ┌─────────────────────┐
 │ factorial(2)        │ ◀── executing
 ├─────────────────────┤
 │ factorial(3)        │
 ├─────────────────────┤
 │ factorial(4)        │
 └─────────────────────┘

after factorial(2) pushes factorial(1):
 ┌─────────────────────┐
 │ factorial(1)  n=1   │ ◀── executing, hits base case
 ├─────────────────────┤
 │ factorial(2)        │
 ├─────────────────────┤
 │ factorial(3)        │
 ├─────────────────────┤
 │ factorial(4)        │
 └─────────────────────┘
```

The stack depth at its peak is **4** — one frame per call on the path to the base case.

**Step 2 — shrinking the stack (returns):**

```text
factorial(1) returns 1 → frame popped
factorial(2) resumes: 2 * 1 = 2, returns 2 → frame popped
factorial(3) resumes: 3 * 2 = 6, returns 6 → frame popped
factorial(4) resumes: 4 * 6 = 24, returns 24 → frame popped

Stack is empty. Final answer: 24.
```

This is why recursion works: each paused frame remembers exactly what it was waiting for. When the innermost call returns, the frame above it has all the context it needs to finish its own work.

## Why debugging recursion feels weird

In a loop, variables update in place and you can watch them change. In recursion, **each call has its own copy of the variables** on its own stack frame. Printing `n` in every call reveals this clearly:

```javascript
function factorial(n) {
  console.log(`→ entering factorial(${n})`);
  if (n <= 1) {
    console.log(`← returning 1 from factorial(1)`);
    return 1;
  }
  const result = n * factorial(n - 1);
  console.log(`← returning ${result} from factorial(${n})`);
  return result;
}

factorial(4);
```

Output:

```text
→ entering factorial(4)
→ entering factorial(3)
→ entering factorial(2)
→ entering factorial(1)
← returning 1 from factorial(1)
← returning 2 from factorial(2)
← returning 6 from factorial(3)
← returning 24 from factorial(4)
```

The symmetric in/out arrows literally mirror the push/pop of stack frames.

## Stack overflow

The call stack has a finite size. Every recursive call that has not yet returned takes memory on the stack. When the stack fills up, JavaScript throws:

```text
RangeError: Maximum call stack size exceeded
```

The two most common causes:

1. **Missing or unreachable base case** — the most common beginner bug.

```javascript
function oops(n) {
  return n + oops(n - 1); // no base case — infinite recursion
}
```

2. **Legitimate recursion that is too deep** for the stack limit. In modern engines the limit is typically ~10,000–20,000 frames. Most problems you will see in this course are nowhere near that, but deeply nested trees or extremely large `n` can hit it. Solutions: convert to iteration, or use accumulator/tail-style patterns (next lesson), or use an explicit stack data structure.

## Stack space is real space

Even when recursion is correct, every live frame costs memory. Recursion that goes `n` levels deep uses `O(n)` stack space. Iteration uses `O(1)` stack space. This is why we say:

- A recursive `sumTo(n)`: O(n) time, **O(n) stack space**.
- An iterative `sumTo(n)` with a loop: O(n) time, **O(1) space**.

Knowing this helps you pick the right tool.

## A useful mental template for tracing

Any time recursion confuses you, write this table for a small input:

```text
call            | action            | returns
----------------+-------------------+--------
factorial(4)    | 4 * factorial(3)  | 24
factorial(3)    | 3 * factorial(2)  | 6
factorial(2)    | 2 * factorial(1)  | 2
factorial(1)    | base case         | 1
```

Fill the `returns` column from the bottom up — that is the order the frames actually resolve. Once you can do this on paper, the recursion is no longer magic; it is bookkeeping you now control.

:::quiz
question: The call stack is a ___ data structure.
options:
  - FIFO (first-in, first-out) — oldest frame executes first.
  - LIFO (last-in, first-out) — the most recent call is always on top.
  - Sorted by function name.
  - A priority queue.
answer: 1
explanation: A stack is LIFO. The most recently called function is at the top and is the first to finish (pop) before older frames resume.
:::

:::quiz
question: What is the maximum call stack depth reached by a correct recursive `factorial(10)`?
options:
  - 1 — only one function is in the file.
  - Approximately 2 — only two frames fit on the stack.
  - 10 — one frame per recursive call until the base case returns.
  - Unlimited — recursion does not use the stack.
answer: 2
explanation: Each call adds a frame that waits for the smaller call to return. `factorial(10)` → `factorial(1)` creates 10 pending frames at peak, before they unwind one by one.
:::

:::quiz
question: What error does running a recursive function with no base case eventually produce in JavaScript?
options:
  - TypeError: function is not a function
  - SyntaxError: Unexpected token
  - RangeError: Maximum call stack size exceeded
  - ReferenceError: function is not defined
answer: 2
explanation: Infinite recursion fills the call stack. JavaScript throws a RangeError with the message "Maximum call stack size exceeded."
:::

:::exercise
title: Trace `sumTo(4)` on paper (then verify)
description: On paper, write the stack of calls for `sumTo(4)` at its deepest point, and fill in the return value of each frame from bottom to top. Then copy the function into a playground and add `console.log` lines in the style shown in this lesson to verify your trace.
starterCode: |
  function sumTo(n) {
    if (n <= 0) return 0;
    return n + sumTo(n - 1);
  }

  // 1. Paper trace (peak stack for sumTo(4) should be 5 frames):
  //    sumTo(4) waits for sumTo(3)
  //    sumTo(3) waits for sumTo(2)
  //    sumTo(2) waits for sumTo(1)
  //    sumTo(1) waits for sumTo(0)
  //    sumTo(0) returns 0   <-- base case
  //
  // 2. Add console.log("enter", n) and console.log("leave", n, "returns", r)
  //    and verify the order matches your paper trace.
:::

## Key takeaways

- The call stack is a LIFO structure of frames; each recursive call pushes a frame, each return pops one.
- Peak stack depth equals the longest chain of pending recursive calls — that is your recursion's stack-space cost.
- Stack overflow happens either because the base case is missing or because legitimate recursion is simply too deep.
- When confused, log on both entry and exit of each call, or trace the stack on paper from the bottom up.

## Practice

- [Power of Two](/problems/power-of-two) — how deep does your stack go for `n = 2^20`? (Hint: 20.)
- [Sum of Digits](/problems/sum-of-digits-recursive) — trace `sumOfDigits(1234)` on paper before reading the solution.
- [Fibonacci Number](/problems/fibonacci-number) — the stack also branches here; we will tame that in the next lesson.
