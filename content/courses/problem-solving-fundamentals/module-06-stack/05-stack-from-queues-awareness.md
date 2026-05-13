# Stack from Queues (Awareness)

**LeetCode 225** is the mirror of the previous lesson: implement a LIFO stack using only FIFO queue operations (`enqueue`, `dequeue`, `front`, `isEmpty`). Unlike "queue from stacks," this one is **much less useful in practice** — it exists mostly as an exam question. We cover it briefly for awareness and to highlight why the two directions are asymmetric.

## Two standard approaches

### Approach A: push is O(n), pop is O(1)

On each `push`, rotate the queue so the new element ends up at the **front** — the end that `dequeue` serves.

```javascript
class MyStack {
  constructor() {
    this.q = [];
  }

  push(x) {
    this.q.push(x);
    for (let i = 0; i < this.q.length - 1; i++) {
      this.q.push(this.q.shift());
    }
  }

  pop()   { return this.q.shift(); }
  top()   { return this.q[0]; }
  empty() { return this.q.length === 0; }
}
```

Each push costs **O(n)** because we do `n - 1` rotate cycles. `pop` and `top` are O(1) on a well-implemented queue — though `Array.prototype.shift` is O(n) in JS, so this particular implementation is O(n) everywhere.

### Approach B: two queues, push is O(1), pop is O(n)

Mirror of the "queue from two stacks" structure, but the asymmetry bites — whichever side you charge, one operation ends up O(n).

## Why this problem is less elegant than "queue from stacks"

The queue-from-two-stacks trick worked because **two LIFOs composed sequentially yield FIFO** — each element is reversed exactly twice, canceling out. Going the other direction, composing two FIFOs never yields LIFO for free; you always have to pay O(n) somewhere to expose the most recently enqueued element.

## Complexity summary

| Approach | push | pop | top |
| --- | --- | --- | --- |
| A (rotate on push) | O(n) | O(1) | O(1) |
| B (two queues, expensive pop) | O(1) | O(n) | O(n) |

There is no known way to get O(1) for every operation using only queue primitives.

## When would this ever come up?

- Interview questions that want to check whether you understand FIFO vs LIFO.
- Systems where you have a queue primitive (e.g., a message broker) and need to fake LIFO semantics.
- Educational contrast with the "queue from two stacks" problem.

In real interview prep, **spend your drill time on queue-from-stacks** — it's the more commonly asked question and the more instructive amortized-analysis example.

:::quiz
question: Why is the queue-from-two-stacks construction asymmetric with stack-from-two-queues?
options:
  - Two LIFO reversals cancel to form FIFO, but FIFO operations do not naturally compose into LIFO without paying O(n).
  - They are symmetric; both cost O(n) worst case.
answer: 0
explanation: The trick for queue-from-stacks relies on double reversal; no analogous trick exists for stack-from-queues.
:::

:::quiz
question: In approach A (rotate on push), what is the time cost of push on a stack with `n` elements?
options:
  - O(1)
  - O(n)
answer: 1
explanation: Rotating the queue n-1 times positions the new element at the front, but each rotation is one cycle.
:::

:::quiz
question: Why is the stack-from-queues problem considered less practical than queue-from-stacks?
options:
  - Because no stack-from-queues implementation achieves O(1) amortized per operation.
  - Because it's impossible to implement.
answer: 0
explanation: One direction enjoys O(1) amortized; the other cannot.
:::

## Practice

- [Implement Stack using Queues](/problems/implement-stack-using-queues) — Optional. Do this only after you are comfortable with queue-from-stacks; don't spend deep drill time here.
