# What Is a Queue? The FIFO Model

A **queue** is a linear data structure with a simple rule: the **first element put in is the first one taken out**. This is called **FIFO** — First In, First Out. Queues are the opposite of stacks, and they appear anywhere you want to process things **in the order they arrived**.

## Real-world analogies

- A **line at a coffee shop**: first customer in line is served first.
- A **printer queue**: jobs are printed in the order they were submitted.
- **BFS** (breadth-first search): nodes are visited in the order they are discovered.
- A **request queue** in a web server: requests are handled in arrival order.

The common thread: **fairness and ordering**. No one cuts the line; whatever arrived first gets processed first.

## The abstract operations

A queue is defined by its operations — independent of how it's implemented:

| Operation | What it does | Time (ideal) |
| --- | --- | --- |
| `enqueue(x)` / `offer(x)` | Add `x` to the back (tail) | O(1) |
| `dequeue()` / `poll()` | Remove and return the front (head) | O(1) |
| `peek()` / `front()` | Return the front without removing | O(1) |
| `isEmpty()` | Is the queue empty? | O(1) |
| `size()` | How many elements are in the queue? | O(1) |

The critical design goal for any queue implementation is **O(1) per operation**. The naive approach (JavaScript `Array.prototype.shift`) is O(n), and we'll see why in the next lesson.

## Mental picture

```text
enqueue 1:   front=1                back=1        queue: [1]
enqueue 2:   front=1                back=2        queue: [1, 2]
enqueue 3:   front=1                back=3        queue: [1, 2, 3]
dequeue():   returns 1
             front=2                back=3        queue: [2, 3]
peek():      returns 2              (still there)
enqueue 4:   front=2                back=4        queue: [2, 3, 4]
```

Two ends, two roles:

- **Front (head):** where elements leave.
- **Back (tail):** where elements enter.

## Stack vs queue — at a glance

| | Stack | Queue |
| --- | --- | --- |
| Order | LIFO (Last In, First Out) | FIFO (First In, First Out) |
| Add/remove | Same end (top) | Opposite ends (tail adds, head removes) |
| Real-world | Plates, browser back button | Ticket line, printer queue |
| Classic algorithm | DFS | BFS |
| Interview signature | "Most recent unresolved" | "Process in arrival order" |

A good rule of thumb: **if the problem cares about arrival order or level-by-level processing, use a queue**. If it cares about the most recent unresolved state, use a stack.

## Why queues appear so often in interviews

Three big families:

1. **BFS traversal** — trees and graphs. Every shortest-path-by-edge-count algorithm uses a queue.
2. **Sliding-window / streaming problems** — "the last N things" or "items received in the last T seconds."
3. **Event simulation** — tasks processed in arrival order.

If you can't implement a queue with O(1) operations on demand, every BFS you write will be quietly O(n²) and pass small tests but time out on large ones.

## Three standard implementations

We'll build each in the next three lessons:

1. **Array-backed queue** (naive: `push` + `shift`) — O(n) per dequeue, **do not use in practice**.
2. **Circular buffer (ring buffer)** — fixed capacity, O(1) everything, elegant.
3. **Linked-list-backed queue** — unbounded, O(1) everything, pointer-fluent.

For interviews, the **circular buffer** is the most instructive; the **linked list** is often the expected answer when asked to "implement a queue from scratch with O(1) operations."

## Key vocabulary

- **Front / head:** the end where dequeue happens.
- **Back / tail / rear:** the end where enqueue happens.
- **Enqueue:** add to the back.
- **Dequeue:** remove from the front.
- **Peek / front:** read the front without removing.
- **Overflow:** enqueue on a fixed-capacity full queue.
- **Underflow:** dequeue on an empty queue.

:::quiz
question: A queue follows which access order?
options:
  - Last In, First Out (LIFO)
  - First In, First Out (FIFO)
answer: 1
explanation: The first element enqueued is always the first one dequeued.
:::

:::quiz
question: Which pair of operations happens at opposite ends of the queue?
options:
  - enqueue (back) and dequeue (front)
  - enqueue (front) and dequeue (front)
answer: 0
explanation: A stack uses the same end for both; a queue uses opposite ends.
:::

:::quiz
question: Which algorithm is most naturally implemented with a queue?
options:
  - Depth-first search
  - Breadth-first search
answer: 1
explanation: BFS processes nodes in the order they are discovered — FIFO.
:::

:::exercise
title: Predict the output
description: In comments, state what each operation returns for a queue. No code needed.
starterCode: |
  // Starting with an empty queue q.
  // q.enqueue(10)
  // q.enqueue(20)
  // q.enqueue(30)
  // Print: q.peek()       -> ?
  // Print: q.dequeue()    -> ?
  // Print: q.dequeue()    -> ?
  // Print: q.size()       -> ?
  // q.enqueue(40)
  // Print: q.peek()       -> ?
  // Print: q.isEmpty()    -> ?
:::

## Practice

No required practice here. The next three lessons implement the queue in three different ways; from lesson 06 onward we apply it to BFS and sliding-window problems.
