# Min Stack (O(1) getMin)

**LeetCode 155.** Design a stack that supports `push`, `pop`, `top`, **and** `getMin` — all in **O(1)** time.

This problem looks hard because the minimum changes as elements are pushed and popped. The trick is to use a **second stack** that tracks the minimum at every level.

## The idea

Maintain two parallel stacks:

- `stack` — the actual values (a normal stack).
- `minStack` — at index `i`, the minimum of `stack[0..i]`.

When you push `x`:

- Push `x` onto `stack`.
- Push `min(x, minStack.top)` onto `minStack`. (If `minStack` is empty, just push `x`.)

When you pop, pop from both. `getMin` returns `minStack.top`.

```text
push 3:  stack=[3]       minStack=[3]
push 5:  stack=[3,5]     minStack=[3,3]   (min of [3,5] is 3)
push 2:  stack=[3,5,2]   minStack=[3,3,2]
push 1:  stack=[3,5,2,1] minStack=[3,3,2,1]
push 4:  stack=[3,5,2,1,4] minStack=[3,3,2,1,1]

getMin -> 1

pop -> 4,  stack=[3,5,2,1]   minStack=[3,3,2,1]
getMin -> 1

pop -> 1,  stack=[3,5,2]     minStack=[3,3,2]
getMin -> 2
```

Every push and pop is one array op per stack → O(1).

## The code

```javascript
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(x) {
    this.stack.push(x);
    const currentMin = this.minStack.length === 0
      ? x
      : Math.min(x, this.minStack[this.minStack.length - 1]);
    this.minStack.push(currentMin);
  }

  pop() {
    this.stack.pop();
    this.minStack.pop();
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}
```

## Why this works

At every moment, the invariant is: `minStack[i]` equals `min(stack[0..i])`. When we push, the new minimum is either the element we just pushed (if it's the smallest so far) or the previous minimum. When we pop, the previous "minimum context" is still on top of `minStack`.

The key insight is that we don't need to **recompute** the minimum on pop — we precomputed it on each push.

## Space optimization

The basic version above uses O(n) extra space. A common follow-up asks to do it using **one stack** by storing encoded values. The idea:

- Keep a variable `min` (the current min).
- When pushing a value `x < min`, push `2*x - min` onto the stack and update `min = x`.
- When popping, if the value is `< min`, decode the old min as `2*min - popped` and update `min`.

This is clever but error-prone and uses integer encoding that can overflow in some languages. The two-stack solution is the expected answer in most interviews — mention the one-stack optimization as a follow-up if asked.

## Complexity

| Operation | Time | Extra space |
| --- | --- | --- |
| push | O(1) | O(1) per element |
| pop | O(1) | O(1) |
| top | O(1) | - |
| getMin | O(1) | - |

Total space: O(n) for two stacks of `n` elements.

## A tempting wrong answer

"Just scan the stack for the min on each `getMin` call." That would be **O(n)** per call — violating the O(1) requirement. The problem explicitly asks for O(1), so a linear scan is not allowed.

Another tempting but wrong idea: "store just the current minimum and update it on pop." Counterexample: stack = `[3, 1]`, min = 1. Pop → min becomes ??? We'd need to recompute by scanning → O(n). The auxiliary stack stores the history so the previous min is just one pop away.

## Common bugs

1. **Not handling the empty-stack edge case on first push.** Compare with `minStack[minStack.length - 1]` when it is `undefined` causes `Math.min(x, undefined) === NaN`. Guard with an `isEmpty` check.
2. **Pushing onto only one stack.** Both stacks must stay in sync — every push on `stack` needs a corresponding push on `minStack`, and every pop likewise.

:::quiz
question: Why push onto `minStack` on every push, even if the new element isn't the new minimum?
options:
  - To keep the two stacks the same height, so pop and top operations always stay in sync.
  - Because JavaScript requires it.
answer: 0
explanation: If they desync, popping the data stack without popping the min stack leaves a stale minimum in place.
:::

:::quiz
question: What does `minStack[i]` represent?
options:
  - The minimum of `stack[0..i]` — the smallest value seen among the first i+1 pushes that are still present.
  - Always the global minimum.
answer: 0
explanation: It's a per-level minimum, not a running global; popping restores the prior level's min automatically.
:::

:::quiz
question: Why is a linear scan of the data stack on each `getMin` unacceptable?
options:
  - It is O(n) per call; the problem requires O(1).
  - The data stack does not support scanning.
answer: 0
explanation: O(n) per call would make `getMin` the bottleneck; the two-stack trick keeps it O(1).
:::

:::exercise
title: Implement MinStack
description: Implement the MinStack class with O(1) push, pop, top, and getMin using two internal arrays.
starterCode: |
  class MinStack {
    constructor() {
      this.stack = [];
      this.minStack = [];
    }

    push(x) { /* push onto both stacks */ }
    pop()   { /* pop from both stacks */ }
    top()   { /* return top of data stack */ }
    getMin(){ /* return top of min stack */ }
  }

  const ms = new MinStack();
  ms.push(3); ms.push(5); ms.push(2); ms.push(1);
  console.log(ms.getMin()); // 1
  ms.pop();
  console.log(ms.getMin()); // 2
  ms.pop();
  console.log(ms.getMin()); // 3
:::

## Practice

No dedicated practice folder exists for Min Stack in this repo. Revisit the lesson after completing Valid Parentheses.
