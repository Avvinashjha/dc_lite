# Complexity, Pitfalls, and Practice Ladder

You've covered the interview-relevant queue toolkit: three implementations, the deque, BFS on trees and grids (single and multi-source), the monotonic deque, streaming patterns, and a priority-queue preview. This lesson ties it all together with a cheat sheet, recurring pitfalls, and a ladder of practice problems from warm-up to hard.

## Complexity cheat sheet

### Core queue operations

| Implementation | enqueue | dequeue | peek | Space for live n |
| --- | --- | --- | --- | --- |
| `push` + `shift` (naive) | O(1) amortized | **O(n)** | O(1) | O(n) |
| `push` + head index | O(1) amortized | O(1) amortized | O(1) | O(total enqueued so far) |
| Circular buffer (ring) | O(1) worst | O(1) worst | O(1) | O(capacity) |
| Singly linked list (head + tail) | O(1) worst | O(1) worst | O(1) | O(n) + per-node overhead |

### Deque operations

| Implementation | addFront | addBack | removeFront | removeBack |
| --- | --- | --- | --- | --- |
| Doubly linked list | O(1) | O(1) | O(1) | O(1) |
| Circular buffer variant | O(1) | O(1) | O(1) | O(1) |
| Naive JS array (`push`, `pop`, `shift`, `unshift`) | O(n) | O(1) | O(n) | O(1) |

### Patterns

| Pattern | Time | Space |
| --- | --- | --- |
| BFS on tree / level order | O(n) | O(w) where w = tree width |
| Grid BFS (R × C) | O(R · C) | O(R · C) |
| Multi-source BFS | O(R · C) | O(R · C) |
| Monotonic deque sliding-window max/min | O(n) amortized | O(k) |
| Moving average via circular buffer | O(1) per update | O(size) |
| Time-window queue (recent calls) | O(1) amortized per update | O(window size) |

## Recurring pitfalls

1. **`Array.prototype.shift` in a hot loop.** The single biggest source of "TLE on the last test case" in grid/tree BFS problems. Fix: head-index trick, linked-list queue, or ring buffer.
2. **Forgetting to mark visited on enqueue.** Marking on dequeue is correct but wasteful — the same node can be queued many times. Always mark when pushing.
3. **Confusing queue and stack.** A stack produces DFS order; a queue produces BFS order. Especially in tree problems, pay attention to which one the problem requires.
4. **Ring buffer empty-vs-full ambiguity.** `head === tail` is both states. Pick a convention (explicit count or waste a slot) and commit.
5. **Dequeueing without resetting `tail` on empty.** In the linked-list queue, `tail` becomes a dangling pointer if not cleared. Future enqueues corrupt the structure.
6. **Monotonic deque: evicting before checking window age.** Always run the front-eviction and back-eviction passes in the right order, and output only once the window is fully formed (`i >= k - 1`).
7. **Grid BFS off-by-one.** Bounds must be `0 <= nr < rows` and `0 <= nc < cols`; flipping or using `<=` is the classic crash.
8. **Running single-source BFS for each of many sources.** Use multi-source BFS instead — seed the queue with all sources at layer 0.
9. **Mixing distance representations.** Pick one: `(node, dist)` tuples in the queue, or a separate `dist[]` array, or level-by-level batching. Do not mix two approaches in the same function.
10. **Naive priority-queue problems.** Any problem that says "always pick the smallest/largest" or "top K" or "merge K sorted" is **not** a FIFO queue problem — it needs a heap (Module 10).

## Recognition checklist — when to reach for what

- "Process in arrival order" / "level-by-level" / "first-come-first-served" → **FIFO queue**.
- "Shortest path in unweighted graph/tree/grid" → **BFS** (single or multi-source depending on starting set).
- "Sliding window max/min on an array" → **monotonic deque**.
- "Last N items" / "most recent items in T seconds" → **fixed-size queue or circular buffer**.
- "Always pick the most important / smallest / largest" → **priority queue / heap** (Module 10).
- "Flood fill / region growing / contagion" → **BFS** (or DFS for plain "connected component" without distance).

## Practice ladder

### Warm-up (implementations)

- [Implement Queue using Stacks](/problems/implement-queue-using-stacks)
- [Implement Stack using Queues](/problems/implement-stack-using-queues)

### BFS essentials

- [Binary Tree Level Order Traversal](/problems/binary-tree-level-order-traversal)
- [Flood Fill](/problems/flood-fill)

### Monotonic deque heavyweight

- [Sliding Window Maximum](/problems/sliding-window-maximum)

### Stretch problems (no dedicated practice folder in this repo)

These are on LeetCode — worth solving on the platform after the module-04 through module-07 material is fluent:

- **LC 542 01 Matrix.** Multi-source BFS to compute distance-to-nearest-0 for every cell.
- **LC 994 Rotting Oranges.** The lesson-09 pattern end-to-end.
- **LC 1091 Shortest Path in Binary Matrix.** 8-directional grid BFS.
- **LC 200 Number of Islands.** Connected components by BFS (or DFS).
- **LC 733 Flood Fill.** Paint bucket — a gentle warm-up.
- **LC 199 Binary Tree Right Side View.** Level-order with "last element per level."
- **LC 102 / 107 / 103 Level-Order variants.** Same skeleton, different reductions.
- **LC 346 Moving Average from Data Stream.** Circular buffer + running sum.
- **LC 933 Number of Recent Calls.** Time-window queue with head pointer.
- **LC 622 Design Circular Queue.** Ring buffer from scratch.
- **LC 239 Sliding Window Maximum.** Monotonic deque — the boss.
- **LC 862 Shortest Subarray with Sum at Least K.** Advanced monotonic-deque over prefix sums.

### Suggested 7-day drill plan

- **Day 1:** Re-implement the four core structures — naive queue, circular queue, linked-list queue, deque. Solve Implement Queue using Stacks. Internalize "shift is O(n)."
- **Day 2:** Tree Level-Order Traversal + the variants (right view, zigzag, averages). Pattern fluency.
- **Day 3:** Flood Fill + Shortest Path in Binary Matrix. Grid BFS with both mutation-marking and `dist[][]` strategies.
- **Day 4:** 01 Matrix + Rotting Oranges. Multi-source BFS mastery.
- **Day 5:** Moving Average + Recent Calls. Streaming patterns. Internalize running-aggregate vs full-recompute.
- **Day 6:** Sliding Window Maximum. Do both the clean version and the head-index `Int32Array` version. Re-implement for minimum as a mirror exercise.
- **Day 7:** Mixed review — random selection from the above list under timed conditions. Focus on pattern recognition in < 30 seconds.

## What you should be able to do now

- Explain FIFO vs LIFO vs priority-queue semantics in one sentence each.
- Implement a queue three different ways (naive + head index, circular buffer, linked list) in under 10 minutes each.
- Implement a deque with all four ends in O(1).
- Write a tree level-order traversal with either `level` / `nextLevel` arrays or single-queue + `levelSize` snapshot.
- Write a grid BFS that computes distances from a single source or multiple sources.
- Recognize the monotonic-deque pattern and implement Sliding Window Maximum end-to-end.
- Design an O(1)-per-call circular buffer for a fixed-size streaming aggregate.
- Identify priority-queue problems and route them to Module 10 (heaps) instead.

If any of these feel shaky, revisit the specific lesson and repeat the exercise. Queues look simple, but the fluency to recognize the right variant under pressure only comes from reps.

:::quiz
question: You need the maximum element of every size-5 window over an array of length 10⁶. Your first thought:
options:
  - A monotonic deque — O(n) amortized.
  - A heap of size 5 — O(n log 5).
answer: 0
explanation: The deque solves it in optimal linear time; the heap approach is the second-best fallback.
:::

:::quiz
question: You're implementing a custom message queue that might run for days. Which implementation do you choose?
options:
  - `push` + `shift` on a JS array.
  - Circular buffer with fixed capacity, or a linked-list queue (unbounded but GC-friendly).
answer: 1
explanation: Long-running systems need bounded memory or at least well-collected nodes; naive `shift` is O(n) per op.
:::

:::quiz
question: Which of these does NOT naturally use a (FIFO) queue?
options:
  - Level-order traversal of a binary tree.
  - Finding the kth smallest element in a stream.
answer: 1
explanation: K-th smallest is a selection / heap problem; the queue's arrival order isn't useful here.
:::

:::exercise
title: Self-assessment — reimplement three key functions
description: Without consulting the earlier lessons, rewrite `levelOrder(root)`, a grid BFS `shortestPathBinaryMatrix(grid)`, and `maxSlidingWindow(nums, k)` from scratch. Aim for each in under 10 minutes and double-check edge cases (empty root, blocked corners, k = 1, k = nums.length).
starterCode: |
  function levelOrder(root) { /* ... */ }

  function shortestPathBinaryMatrix(grid) { /* ... */ }

  function maxSlidingWindow(nums, k) { /* ... */ }

  // sanity checks
  // levelOrder of the tree from lesson 07 -> [[3],[9,20],[15,7]]
  console.log(shortestPathBinaryMatrix([[0,1],[1,0]]));           // 2
  console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3));          // [3,3,5,5,6,7]
:::

## Where to go next

The natural next step is **Module 08: Linked List**, where you'll formalize nodes and pointers, build the singly and doubly linked lists, and drill the two-pointer family (slow/fast, cycle detection, reverse, merge, palindrome). Several patterns you've already met — linked-list-backed stack and queue, the deque's doubly linked structure — will feel like old friends.
