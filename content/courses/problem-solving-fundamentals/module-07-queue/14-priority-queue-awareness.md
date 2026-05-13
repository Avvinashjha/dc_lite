# Priority Queue (Awareness — Heaps Come Later)

A **priority queue** is a queue-shaped abstraction where **removal order is determined by priority**, not arrival order. The element with the highest priority is dequeued first, regardless of when it was inserted.

We are not going to implement one here — the efficient implementation is a **heap**, which has its own module (Module 10: Heap / Priority Queue). This is an **awareness** lesson so you can recognize the pattern, know when to reach for it, and not confuse it with the FIFO queues we've been building.

## The key distinction

| | FIFO Queue | Priority Queue |
| --- | --- | --- |
| Order | First in, first out | Highest (or lowest) priority first |
| Enqueue | O(1) | O(log n) (heap) |
| Dequeue | O(1) | O(log n) (heap) |
| Peek | O(1) | O(1) |
| Canonical use | BFS, level-order traversal | Dijkstra, top-K, merge K sorted, task schedulers |

Despite the name, a priority queue is almost always backed by a **binary heap** — an array laid out to represent a complete binary tree with the heap property. You'll build one from scratch in Module 10.

## When would you use a priority queue?

- **Dijkstra's shortest path** — always expand the unvisited node with the smallest tentative distance.
- **A\* search** — expand the node with the smallest `f(n) = g(n) + h(n)`.
- **Top-K problems** — "find the K largest / smallest elements." Maintain a min-heap of size K.
- **Merge K sorted lists** — keep one pointer per list in a min-heap keyed on current value.
- **Task scheduling** — execute the highest-priority task first.
- **Huffman coding** — pop the two smallest-frequency nodes repeatedly.

## Examples you may have already seen

- **LC 215 Kth Largest Element in an Array** — heap-of-size-K.
- **LC 23 Merge K Sorted Lists** — min-heap across list heads.
- **LC 347 Top K Frequent Elements** — min-heap keyed by frequency.
- **LC 621 Task Scheduler** — max-heap of remaining task counts.
- **LC 1046 Last Stone Weight** — max-heap simulation.

Every one of them hinges on "give me the extreme item quickly" — not on FIFO order.

## What if I don't have a priority queue in my language?

JavaScript does **not** have a built-in priority queue (as of ES2025). In interviews you have three options:

1. **Implement a binary min-heap or max-heap from scratch** (~30 lines). Preferred; you'll learn how in Module 10.
2. **Use an ordered container** — e.g., an `Array` kept sorted. Insertion is O(n), which is usually too slow.
3. **Use a third-party library.** Not allowed in most interview settings, but fine in production.

For competitive programming and interviews, fluency with heap code is a required skill. We'll cover it thoroughly in Module 10.

## Why not just use a sorted array?

Both a sorted array and a heap support "find min" and "find max" in O(1). Heaps add **O(log n) insert and delete**, while a sorted array pays **O(n) insert** (shifting to maintain order). For problems with frequent inserts and extractions, the heap wins.

If inserts are rare and extractions are frequent, a sorted array can be competitive — but heaps are the standard tool.

## The name is confusing — and that's OK

A "priority queue" is not really a queue. It doesn't preserve arrival order. Different languages use different names:

- Python: `heapq` (a min-heap module operating on lists).
- Java: `PriorityQueue<T>`.
- C++: `std::priority_queue<T>` (a max-heap by default).
- JavaScript: **no built-in** — roll your own or npm install one.

When a problem statement says "priority queue" or describes behavior like "always process the highest/lowest value next," think **heap** and move on.

## Quick sketch of the heap API (preview)

You'll build this in Module 10:

```javascript
class MinHeap {
  constructor() { this.data = []; }
  push(x) { /* sift up */ }
  pop()   { /* swap root with last, sift down */ }
  peek()  { return this.data[0]; }
  size()  { return this.data.length; }
}
```

- `push`, `pop`: O(log n).
- `peek`, `size`: O(1).

## Quick mental model

- **FIFO queue:** fairness — first come, first served.
- **Stack:** recency — most recent first.
- **Priority queue:** importance — most important first, regardless of arrival time.

## What's next

Don't drill priority-queue problems yet — you'll get much more mileage out of them once you understand heaps. For now:

- **Recognize** when a problem needs a priority queue (signal phrases: "top K," "always process the smallest / largest," "merge K sorted," "shortest path with weights").
- **Do not confuse** it with FIFO queues when reading problem statements.
- **Return here** after completing Module 10.

:::quiz
question: A priority queue dequeues elements in what order?
options:
  - Arrival order (FIFO).
  - Priority order — highest (or lowest) priority first, regardless of arrival.
answer: 1
explanation: Priority queues break FIFO; the priority comparator decides who leaves next.
:::

:::quiz
question: What data structure typically backs an efficient priority queue?
options:
  - A sorted array.
  - A binary heap.
answer: 1
explanation: Heaps give O(log n) insert/extract — better than a sorted array's O(n) insert.
:::

:::quiz
question: Which problem is best solved with a priority queue (heap) rather than a FIFO queue?
options:
  - Breadth-first traversal of a tree.
  - Finding the K largest elements in a stream of integers.
answer: 1
explanation: Top-K with a min-heap of size K is the textbook use case; tree traversal is standard FIFO BFS.
:::

## Practice

Come back to priority queues after Module 10. For now, the only goal is **recognition** — when you read a problem and see "always pick the largest/smallest" or "top K" or "merge K sorted," your inner voice should say "heap."
