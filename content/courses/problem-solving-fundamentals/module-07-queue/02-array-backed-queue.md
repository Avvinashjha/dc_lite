# Array-Backed Queue (and Why Naive is O(n))

The first instinct most people have: "I'll use a JS array, `push` to enqueue and `shift` to dequeue." It works — but one of those operations is **linear time**, and that turns an innocent BFS into a quietly quadratic algorithm.

## The naive version

```javascript
class QueueNaive {
  constructor() {
    this.items = [];
  }

  enqueue(x) { this.items.push(x); }        // O(1) amortized
  dequeue()  { return this.items.shift(); } // O(n) — the trap
  peek()     { return this.items[0]; }
  isEmpty()  { return this.items.length === 0; }
  size()     { return this.items.length; }
}
```

`Array.prototype.shift` removes the first element **and then reindexes every other element**. On a queue of `n` items, that's `n - 1` memory moves per dequeue. If you dequeue `n` items across a BFS, total cost is `O(n²)`.

```text
before shift:   [A, B, C, D, E]
after  shift:   [B, C, D, E]        <-- every index shifted left by one
```

This is fine for tiny arrays (`n < 100`) and for quick scripts. It is **not** fine for production code or LeetCode problems with `n` up to `10^5`.

## A small improvement: head pointer

Instead of physically removing from the front, keep a `head` index that advances:

```javascript
class QueueHeadIndex {
  constructor() {
    this.items = [];
    this.head = 0;
  }

  enqueue(x) { this.items.push(x); }

  dequeue() {
    if (this.head >= this.items.length) return undefined;
    const v = this.items[this.head];
    this.items[this.head] = undefined;   // allow GC
    this.head++;
    return v;
  }

  peek() { return this.items[this.head]; }
  isEmpty() { return this.head >= this.items.length; }
  size() { return this.items.length - this.head; }
}
```

All operations are now **O(1)** — but the memory footprint **grows forever** because dequeued slots are never reclaimed. For a workload that enqueues `N` items over the lifetime, you're using O(N) memory even if the queue is usually empty.

That's often acceptable for a single algorithm run (the queue is discarded after the function returns). For long-running services, you need a better structure.

## When is the head-pointer version good enough?

- A one-shot BFS: enqueue at most `n` total nodes, done. Memory is O(n) either way.
- A simulation whose total work fits in memory.

## When is it not good enough?

- A long-lived queue that processes millions of messages.
- Any case where you enqueue and dequeue in a tight loop and run for hours.
- Bounded-buffer contexts (e.g., a fixed-size ring buffer for streaming data).

For those, you need the **circular queue** (next lesson).

## Walkthrough — why naive shift is slow

```text
Enqueue 1..5:  items=[1, 2, 3, 4, 5]

dequeue():
  returns 1
  shift reindexes: items=[2, 3, 4, 5]    4 moves

dequeue():
  returns 2
  shift reindexes: items=[3, 4, 5]       3 moves

dequeue():
  returns 3
  shift reindexes: items=[4, 5]          2 moves

Total moves to drain n=5: 4+3+2+1 = 10 = O(n^2)
```

Contrast with the head-index version: each dequeue is just an increment and a nulled slot — constant time.

## What about `Deque` libraries?

In production JavaScript, some libraries (e.g., `double-ended-queue`, `denque` on npm) give you O(1) `shift`/`unshift`/`push`/`pop` on a **ring buffer** underneath. In interviews you typically won't use a library — you'll either write the circular queue yourself or use the head-index trick above.

## Complexity summary (this lesson)

| Version | enqueue | dequeue | peek | Space |
| --- | --- | --- | --- | --- |
| `push` + `shift` (naive) | O(1) amortized | **O(n)** | O(1) | O(n) |
| `push` + head index | O(1) amortized | O(1) | O(1) | O(total enqueued, not current size) |

## Decision rule

- **Solving a LeetCode BFS once?** Head-index version is fine. Or use a plain array with `push` and remember never to `shift` in the inner loop.
- **Bounded / long-lived queue?** Use the circular buffer from the next lesson.
- **Quick interview answer?** Implement the head-index version in ~10 lines and move on; mention the memory trade-off.

## Common bugs

1. **Using `shift` in a BFS inner loop.** Silently makes the whole algorithm O(n²). One of the most common causes of "TLE on the last test case."
2. **Forgetting to handle an empty queue.** `shift()` returns `undefined`; so does `items[this.head]` past the end. Guard with `isEmpty()` for intent.
3. **Resetting `head` inconsistently.** Some implementations set `head = 0` when the queue becomes empty, so memory is reclaimed opportunistically. That's a valid optimization; just make sure to also truncate `items` in that branch.

:::quiz
question: Why is `Array.prototype.shift` O(n)?
options:
  - Because it has to reindex every remaining element after removing the first.
  - Because it deallocates memory.
answer: 0
explanation: Removing at index 0 requires sliding every other element down by one position.
:::

:::quiz
question: The head-index version makes all operations O(1) but has what downside?
options:
  - Memory grows with total enqueues, not current size, because dequeued slots are not reclaimed.
  - It's slower than the naive version.
answer: 0
explanation: The internal array never shrinks on dequeue; it only grows on enqueue.
:::

:::quiz
question: For a one-shot BFS that processes at most n nodes, which implementation is a good default?
options:
  - Naive push/shift (because the total work is O(n²), which is "usually fine").
  - Head-index version or a plain array with careful pointer management — O(1) per op.
answer: 1
explanation: O(n) vs O(n²) is the difference between passing and failing large test cases.
:::

:::exercise
title: Implement QueueHeadIndex
description: Implement the head-index queue with O(1) enqueue, dequeue, peek, isEmpty, and size. Null dequeued slots to permit garbage collection.
starterCode: |
  class QueueHeadIndex {
    constructor() {
      this.items = [];
      this.head = 0;
    }
    enqueue(x) { /* ... */ }
    dequeue()  { /* advance head, return value */ }
    peek()     { /* ... */ }
    isEmpty()  { /* size-aware check */ }
    size()     { /* ... */ }
  }

  const q = new QueueHeadIndex();
  q.enqueue(1); q.enqueue(2); q.enqueue(3);
  console.log(q.peek());    // 1
  console.log(q.dequeue()); // 1
  console.log(q.dequeue()); // 2
  console.log(q.size());    // 1
  console.log(q.dequeue()); // 3
  console.log(q.isEmpty()); // true
:::

## Practice

No required practice for this lesson. The next lesson builds the circular queue — the production-grade O(1) option.
