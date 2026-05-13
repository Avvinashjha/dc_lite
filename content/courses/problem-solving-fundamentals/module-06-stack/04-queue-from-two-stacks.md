# Queue from Two Stacks (Amortized Analysis)

**LeetCode 232.** Implement a FIFO queue using only stack operations (`push`, `pop`, `peek`, `isEmpty`). This is a **classic** interview question and the canonical example of **amortized analysis** — where individual operations can be slow but the average per operation stays O(1).

## The idea

Use **two stacks**:

- `inStack` — accepts new pushes; holds items in reverse FIFO order.
- `outStack` — serves pops and peeks; holds items in correct FIFO order.

When `outStack` is empty and we need to pop or peek, we **drain** `inStack` into `outStack`. The drain reverses the order once, which is exactly what converts LIFO into FIFO.

```text
enqueue 1,2,3:
  inStack = [1, 2, 3]   (top is 3)
  outStack = []

dequeue requested; outStack empty so drain:
  pop 3 from inStack, push to outStack: outStack = [3]
  pop 2 from inStack, push to outStack: outStack = [3, 2]
  pop 1 from inStack, push to outStack: outStack = [3, 2, 1]
  inStack = []
  Now top of outStack is 1 — the first element enqueued.

dequeue: pop from outStack -> 1
outStack = [3, 2]

enqueue 4:
  inStack = [4]
  outStack = [3, 2]

dequeue: outStack not empty -> pop 2
  outStack = [3]
```

## The code

```javascript
class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }

  push(x) {
    this.inStack.push(x);
  }

  pop() {
    this._shiftIfNeeded();
    return this.outStack.pop();
  }

  peek() {
    this._shiftIfNeeded();
    return this.outStack[this.outStack.length - 1];
  }

  empty() {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }

  _shiftIfNeeded() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
  }
}
```

## Complexity — the amortized argument

Counting each stack-level push/pop as one "unit" of work:

- `push` on the queue does **1** unit.
- `pop` / `peek` does **1** unit if `outStack` has something; otherwise it drains `n` items from `inStack` into `outStack`, costing roughly `2n + 1` units.

Naively you might say: pop is O(n) worst case, which it is. But **any element is drained at most once** — it goes `inStack -> outStack -> consumed`, and then it is gone. Across any sequence of `k` operations, the total work is at most `3k` units. Divide by `k`: the **average cost per operation is O(1)**.

This is the definition of **amortized O(1)** — individual ops may be slow, but the total cost is linear in the number of ops.

## Why not push + shift?

You could implement `pop` by walking the `inStack` to find the first-pushed element, or by using an array's `shift` — but `shift` is O(n) per call, and it is O(n) **every** call, not amortized. The two-stack trick charges each element once and keeps the overall average flat.

## Common bugs

1. **Draining on every pop** — If you drain before every pop, you might push items back to `inStack` unnecessarily. Correct behavior: only drain when `outStack` is empty.
2. **Forgetting to peek before popping in tests** — When debugging, peeking also triggers `_shiftIfNeeded`; the two methods must share this helper.
3. **Wrong emptiness check** — `empty()` must return true only when **both** stacks are empty.

## Mental model

Think of `outStack` as a **pre-sorted buffer** and `inStack` as an **overflow staging area**. We only pay the cost of converting staging into buffer when the buffer runs out — batching the work keeps per-op cost low.

:::quiz
question: Why is `pop` amortized O(1) even though one pop can move every element from inStack to outStack?
options:
  - Each element is shifted from inStack to outStack at most once in its lifetime; the total work across k operations is O(k).
  - Because inStack never has more than one element.
answer: 0
explanation: Amortized analysis is a total-work-over-operations argument; per-element transfer cost is charged once.
:::

:::quiz
question: When should we drain inStack into outStack?
options:
  - On every pop/peek call.
  - Only when outStack is empty and we need a pop or peek.
answer: 1
explanation: Draining unnecessarily re-moves elements and breaks the amortized O(1) guarantee.
:::

:::quiz
question: To test if the queue is empty, we check:
options:
  - outStack is empty.
  - Both inStack and outStack are empty.
answer: 1
explanation: Newly-pushed items live in inStack; forgetting it reports a non-empty queue as empty.
:::

:::exercise
title: Implement MyQueue
description: Implement the queue-from-two-stacks class with push, pop, peek, and empty. Use only array push/pop internally.
starterCode: |
  class MyQueue {
    constructor() {
      this.inStack = [];
      this.outStack = [];
    }

    push(x) { /* ... */ }
    pop()   { /* drain if needed, then pop */ }
    peek()  { /* drain if needed, then peek */ }
    empty() { /* both empty */ }
  }

  const q = new MyQueue();
  q.push(1); q.push(2); q.push(3);
  console.log(q.peek()); // 1
  console.log(q.pop());  // 1
  console.log(q.pop());  // 2
  q.push(4);
  console.log(q.pop());  // 3
  console.log(q.pop());  // 4
  console.log(q.empty()); // true
:::

## Practice

- [Implement Queue using Stacks](/problems/implement-queue-using-stacks)
