# Heaps: Array Layout, Parent-Child Math, and Sift-Down

A **binary heap** is a complete binary tree stored in an array, satisfying the **heap property**:

- **Max-heap:** every parent is `>=` its children. Root holds the maximum.
- **Min-heap:** every parent is `<=` its children. Root holds the minimum.

Heaps power heap sort (next lesson) and **priority queues** — the data structure behind Top-K problems, Dijkstra's algorithm, Huffman coding, and many streaming algorithms.

## The array layout

A complete binary tree with `n` nodes packs perfectly into an array of length `n`. For a node at index `i` (0-based):

```text
parent(i) = (i - 1) >>> 1
left(i)   = 2 * i + 1
right(i)  = 2 * i + 2
```

Visualization:

```text
index:      0   1   2   3   4   5   6
value:    [100, 90, 80, 40, 30, 20, 10]

tree:             100 (0)
                 /       \
              90 (1)     80 (2)
              /   \       /   \
           40(3) 30(4) 20(5) 10(6)
```

Every parent in the array (indices 0, 1, 2) is at least as big as its children — a valid max-heap.

## Sift-down (a.k.a. heapify down)

Given a node that may violate the max-heap property with its children, restore it by swapping it **down** with its larger child until it is in place (or becomes a leaf).

```javascript
function siftDown(arr, i, end) {
  while (true) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let largest = i;
    if (l < end && arr[l] > arr[largest]) largest = l;
    if (r < end && arr[r] > arr[largest]) largest = r;
    if (largest === i) return;
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    i = largest;
  }
}
```

`end` is the **exclusive upper bound** of the heap region in `arr`. Using `end` rather than `arr.length` makes this function reusable during heap sort when the heap shrinks.

## Building a heap (bottom-up heapify)

Start from the last non-leaf — index `(n / 2) - 1` — and sift down each node toward the root. Building a heap this way is **O(n)** — tighter than the naive "insert n items" bound of O(n log n).

```javascript
function buildMaxHeap(arr) {
  const n = arr.length;
  for (let i = (n >>> 1) - 1; i >= 0; i--) {
    siftDown(arr, i, n);
  }
}
```

## Why buildMaxHeap is O(n), not O(n log n)

Most nodes are near the leaves, and leaves cost **O(1)** to sift down (they never move). Summed over the tree, the total work is bounded by a geometric series that converges to O(n). This is a classic result — often the only part of heaps that surprises interviewers.

## Complexity summary

| Operation | Time |
| --- | --- |
| `siftDown(i, end)` | O(log end) |
| `buildMaxHeap(arr)` | O(n) |
| Peek max (index 0) | O(1) |
| Extract max (root + sift-down) | O(log n) |
| Insert (push + sift-up) | O(log n) |

## Relation to min-heap

Swap every `>` to `<` in `siftDown`. Everything else is identical.

## Why array instead of node objects?

A complete binary tree has **no wasted space** in an array; parent/child arithmetic is branchless and cache-friendly. Node-based binary heaps exist but are rarely faster in practice.

:::quiz
question: For a 0-based heap, the children of index `i` are at:
options:
  - `2 * i + 1` (left) and `2 * i + 2` (right)
  - `i + 1` and `i + 2`
answer: 0
explanation: This is the standard parent-child arithmetic for array-backed heaps.
:::

:::quiz
question: What is the time complexity of building a heap from an unordered array using bottom-up heapify?
options:
  - O(n log n)
  - O(n)
answer: 1
explanation: Despite each node costing O(log n) in the worst case, the tighter per-level analysis gives O(n) total.
:::

:::quiz
question: Why does `siftDown(arr, i, end)` take an `end` parameter rather than using `arr.length`?
options:
  - Heap sort shrinks the logical heap region inside the same array; `end` lets us ignore already-sorted tail elements.
  - It avoids a bug with empty arrays.
answer: 0
explanation: During heap sort, extracted maxima are parked at the end; subsequent sift-downs must stop before them.
:::

:::exercise
title: Implement siftDown and buildMaxHeap
description: Implement `siftDown(arr, i, end)` that restores the max-heap property at index `i` within the range `[0, end)`. Then use it in `buildMaxHeap(arr)`.
starterCode: |
  function siftDown(arr, i, end) {
    // repeatedly swap with the larger child until fixed
  }

  function buildMaxHeap(arr) {
    const n = arr.length;
    // for i from (n >>> 1) - 1 down to 0: siftDown(arr, i, n)
  }

  const a = [3, 1, 4, 1, 5, 9, 2, 6];
  buildMaxHeap(a);
  console.log(a[0]); // 9 — the max is at the root
:::

## Practice

No required practice for this lesson alone — the next lesson's heap sort exercise validates your `siftDown` and `buildMaxHeap`.
