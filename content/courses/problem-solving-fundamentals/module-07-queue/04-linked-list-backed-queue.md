# Linked-List-Backed Queue

The third and final standard queue implementation: a **singly linked list** with two pointers — `head` (front) and `tail` (back). Every operation is **O(1) worst case**, and the queue grows and shrinks **on demand** without needing a capacity.

This is the usual expected answer when an interviewer says "implement a queue from scratch with O(1) operations."

## The idea

- Each node stores a `value` and a `next` pointer.
- `head` points at the front; `dequeue` unlinks and advances head.
- `tail` points at the back; `enqueue` appends after tail and advances tail.

```text
Empty:          head -> null,  tail -> null

enqueue(1):     head --\
                       v
                      [1|null]  <-- tail

enqueue(2):     head --\
                       v
                      [1|*] -> [2|null]  <-- tail

dequeue -> 1:   head --\
                       v
                      [2|null]  <-- tail

dequeue -> 2:   head -> null,  tail -> null   (empty again)
```

The subtle case: when the queue becomes empty after a dequeue, `tail` must also be reset to `null`. Forgetting this is the most common bug in this implementation.

## The code

```javascript
class QueueLL {
  constructor() {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  enqueue(x) {
    const node = { value: x, next: null };
    if (this.tail === null) {
      this.head = node;
    } else {
      this.tail.next = node;
    }
    this.tail = node;
    this.count++;
  }

  dequeue() {
    if (this.head === null) return undefined;
    const v = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;   // queue emptied
    this.count--;
    return v;
  }

  peek() {
    return this.head === null ? undefined : this.head.value;
  }

  isEmpty() { return this.head === null; }
  size()    { return this.count; }
}
```

Every operation is a handful of pointer updates — **O(1) worst case**, no resize cost, no capacity limit.

## Walkthrough

```text
q.enqueue(10)
  node = {value:10, next:null}
  tail===null, so head = node
  tail = node
  head -> [10|null] <- tail   count=1

q.enqueue(20)
  node = {value:20, next:null}
  tail!==null, tail.next = node
  tail = node
  head -> [10|*] -> [20|null] <- tail   count=2

q.enqueue(30)
  head -> [10|*] -> [20|*] -> [30|null] <- tail   count=3

q.dequeue()
  v = head.value = 10
  head = head.next (-> [20|*])
  head !== null, so don't touch tail
  head -> [20|*] -> [30|null] <- tail   count=2   returns 10

q.dequeue()
  v = 20
  head = head.next (-> [30|null])
  head -> [30|null] <- tail   count=1   returns 20

q.dequeue()
  v = 30
  head = head.next (-> null)
  head === null, so tail = null
  head -> null, tail -> null   count=0   returns 30
```

## Array-backed vs circular vs linked-list

| Aspect | Head-index array | Circular buffer | Linked list |
| --- | --- | --- | --- |
| Enqueue | O(1) amortized | O(1) worst case | O(1) worst case |
| Dequeue | O(1) | O(1) worst case | O(1) worst case |
| Memory for `n` live items | Potentially much more than n (growing tail) | Exactly capacity | n × (value + pointer) |
| Needs capacity upfront? | No | Yes | No |
| Cache locality | Great | Great | Poor (pointer chasing) |
| Best for | One-shot BFS on LC | Bounded streams, audio/network | Interview "from scratch" answers, unbounded queues |

For most interview prompts that say "implement a queue," the linked-list version is the safest answer because it's easy to get correct in an interview and its worst-case bounds are clean.

## Common bugs

1. **Forgetting to null out `tail` when the queue empties.** Without this, future enqueues on an empty queue will incorrectly try to `tail.next = ...` on a dangling node.
2. **Updating `count` only on enqueue or only on dequeue.** Keep them symmetric.
3. **Using `head.next.value` for peek.** That's the second element, not the first. `head.value` is the front.
4. **Using a singly linked list and trying to dequeue from the tail.** Dequeue happens at `head`; trying the tail would require walking the list to find the new tail each time — O(n).

## Why a doubly linked list?

You don't need one here. A doubly linked list adds a `prev` pointer and extra bookkeeping, but a queue only ever adds at the tail and removes at the head — both operations are already O(1) on a singly linked list with a tail pointer. The **deque** (double-ended queue) does need a doubly linked list; that's the next lesson.

## Design considerations in practice

- In languages without garbage collection, you'd use a node pool to avoid per-enqueue allocations.
- In JavaScript, each `{value, next}` object is fine but has a per-node memory overhead (16–32 bytes on modern engines). If you enqueue millions of items, the circular buffer is often preferable.

:::quiz
question: Why must `tail` be set to null when the last element is dequeued?
options:
  - Otherwise `tail` becomes a dangling reference to a detached node; the next enqueue would corrupt the list.
  - JavaScript requires it.
answer: 0
explanation: After dequeue-to-empty, tail still references the (now-unlinked) node; reset to null so subsequent enqueue(s) enter the empty-queue branch.
:::

:::quiz
question: Why is enqueue O(1) on this linked-list queue?
options:
  - Because we maintain a tail pointer so appending is a constant-time link update, not a linear walk.
  - Because linked lists are always O(1).
answer: 0
explanation: Without the tail pointer, appending would require walking to the end — O(n).
:::

:::quiz
question: Which field of `head.value` represents the front (next to be dequeued)?
options:
  - head.value is the front; head.next.value is the second element.
  - head.value is the last element enqueued.
answer: 0
explanation: The front of the queue is always `head`; new elements go on the tail via `tail.next = newNode`.
:::

:::exercise
title: Implement QueueLL
description: Implement the linked-list queue with head and tail pointers, enqueue, dequeue, peek, isEmpty, and size. Don't forget to reset tail on dequeue-to-empty.
starterCode: |
  class QueueLL {
    constructor() {
      this.head = null;
      this.tail = null;
      this.count = 0;
    }

    enqueue(x) { /* append at tail; handle empty case */ }
    dequeue()  { /* advance head; reset tail if now empty */ }
    peek()     { /* return head.value or undefined */ }
    isEmpty()  { return this.head === null; }
    size()     { return this.count; }
  }

  const q = new QueueLL();
  q.enqueue(1); q.enqueue(2); q.enqueue(3);
  console.log(q.peek());    // 1
  console.log(q.dequeue()); // 1
  console.log(q.dequeue()); // 2
  console.log(q.dequeue()); // 3
  console.log(q.isEmpty()); // true
  q.enqueue(4);
  console.log(q.peek());    // 4  (tests tail reset correctness)
:::

## Practice

No required practice for this lesson. The next lesson generalizes to the deque — the double-ended queue that powers sliding-window-maximum.
