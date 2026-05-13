# The Deque (Double-Ended Queue)

A **deque** (pronounced "deck", short for **Double-Ended QUEue**) allows adding and removing from **both ends** in O(1). It is a generalization that subsumes both stack and queue behavior — and it's the data structure behind the monotonic-deque pattern (lesson 10) and the classic **Sliding Window Maximum** problem.

## The four-way API

| Operation | What it does | Time |
| --- | --- | --- |
| `addFront(x)` / `pushFront(x)` | Insert at the front | O(1) |
| `addBack(x)`  / `pushBack(x)`  | Insert at the back  | O(1) |
| `removeFront()` | Remove and return the front | O(1) |
| `removeBack()`  | Remove and return the back  | O(1) |
| `peekFront()` / `front()` | Inspect the front | O(1) |
| `peekBack()`  / `back()`  | Inspect the back  | O(1) |
| `isEmpty()` / `size()` | Standard | O(1) |

A deque is a superset of both queue and stack:

- Use `addBack` + `removeFront` → FIFO queue.
- Use `addBack` + `removeBack` → LIFO stack.
- Use `addFront` + `removeBack` → reverse FIFO.

## Two standard implementations

### 1. Doubly linked list

Each node holds `value`, `prev`, and `next`. Maintain `head` and `tail` pointers. Inserting or removing at either end is a handful of pointer updates — O(1) worst case.

```javascript
class Deque {
  constructor() {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  addFront(x) {
    const node = { value: x, prev: null, next: this.head };
    if (this.head) this.head.prev = node;
    else this.tail = node;
    this.head = node;
    this.count++;
  }

  addBack(x) {
    const node = { value: x, prev: this.tail, next: null };
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.count++;
  }

  removeFront() {
    if (!this.head) return undefined;
    const v = this.head.value;
    this.head = this.head.next;
    if (this.head) this.head.prev = null;
    else this.tail = null;
    this.count--;
    return v;
  }

  removeBack() {
    if (!this.tail) return undefined;
    const v = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) this.tail.next = null;
    else this.head = null;
    this.count--;
    return v;
  }

  peekFront() { return this.head ? this.head.value : undefined; }
  peekBack()  { return this.tail ? this.tail.value : undefined; }
  isEmpty()   { return this.head === null; }
  size()      { return this.count; }
}
```

### 2. Circular buffer variant

A ring buffer can also support both-end operations: extend the circular queue from lesson 03 to let `head` and `tail` move in **either direction**, with fixed capacity. Same O(1) guarantees, same fixed-capacity trade-off.

This version is what high-performance deque libraries use under the hood. For interviews, the doubly linked list is usually cleaner to write.

## Deque in JavaScript — the pragmatic shortcut

For small/medium inputs in interviews, a plain `Array` used with:

- `push` + `shift` — O(1) / O(n) — **don't**.
- `push` + `pop` + `unshift` + `shift` — mostly O(n) on front-end ops — **don't**.

If you need a **real** O(1) deque, write the doubly linked list or use the ring-buffer variant. The alternative interview trick: most problems that need a deque only ever **add to the back** and **remove from both ends** — which is what the **sliding window maximum** pattern needs. For those, a plain array with `push` / `pop` / `shift` works as long as `shift` is rare enough (still technically O(n) worst case on bad inputs).

For **LC 239 Sliding Window Maximum** with n up to 10⁵, a plain array works in practice because each element is shifted at most once. But if you want a **true** O(1) bound, use your own deque.

## When to reach for a deque

- **Sliding window maximum / minimum** (LC 239, LC 862, LC 1438) — the signature use case.
- **Palindrome check** — compare both ends, move inward.
- **0/1 BFS** on a graph (weight-0 edges addFront; weight-1 edges addBack) — an advanced technique.
- Simulation problems where items move toward both ends.

## Deque vs queue vs stack — summary

| | Stack | Queue | Deque |
| --- | --- | --- | --- |
| Add at | Top | Back | Front or back |
| Remove at | Top | Front | Front or back |
| Standard use | DFS | BFS | Sliding window, 0/1 BFS |
| Memory layout | Array or LL | Array / ring / LL | Doubly LL or ring |

## Common bugs (doubly linked version)

1. **Forgetting to update the opposite end on empty-to-full or full-to-empty transitions.** When the deque becomes empty, both `head` and `tail` must be `null`. When it becomes non-empty from empty, both must be set to the new lone node.
2. **Not nulling `prev` / `next` on the new boundary node.** Leftover pointers break the invariant.
3. **Confusing `addFront` with `addBack`.** Pay attention to the direction — the two are almost mirror images but easy to swap under interview pressure.

:::quiz
question: Which is NOT a strict requirement for a deque?
options:
  - O(1) add/remove at both ends.
  - O(1) random access by index.
answer: 1
explanation: A deque does not need to support index access; that's a separate ADT (list/vector).
:::

:::quiz
question: If you want to build a queue using a deque, which pair of operations do you use?
options:
  - addBack + removeFront.
  - addFront + removeFront.
answer: 0
explanation: FIFO = enqueue on one side, dequeue on the other; the deque becomes a queue when you pick opposite ends.
:::

:::quiz
question: Why is a doubly linked list more common than a singly linked list for deques?
options:
  - removeBack on a singly linked list is O(n) — you'd have to walk the list to find the new tail; a doubly linked list makes it O(1).
  - Doubly linked lists use less memory.
answer: 0
explanation: The prev pointer enables O(1) removal from the back without scanning from the head.
:::

:::exercise
title: Implement a doubly-linked-list Deque
description: Implement Deque with addFront, addBack, removeFront, removeBack, peekFront, peekBack, isEmpty, and size. Handle empty/singleton boundary cases carefully.
starterCode: |
  class Deque {
    constructor() {
      this.head = null;
      this.tail = null;
      this.count = 0;
    }

    addFront(x) { /* insert before head */ }
    addBack(x)  { /* insert after tail */ }
    removeFront() { /* advance head; reset tail if empty */ }
    removeBack()  { /* retreat tail; reset head if empty */ }
    peekFront() { /* ... */ }
    peekBack()  { /* ... */ }
    isEmpty()   { return this.head === null; }
    size()      { return this.count; }
  }

  const d = new Deque();
  d.addBack(2); d.addBack(3); d.addFront(1);
  console.log(d.peekFront()); // 1
  console.log(d.peekBack());  // 3
  console.log(d.removeBack());  // 3
  console.log(d.removeFront()); // 1
  console.log(d.size());        // 1
:::

## Practice

No direct practice for the deque implementation itself. Lessons 10–11 apply the deque to the signature interview problem: Sliding Window Maximum.
