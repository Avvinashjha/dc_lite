# Heap Sort

**Heap sort** is the sort to reach for when you need:

- Guaranteed **O(n log n)** worst-case time.
- **O(1)** extra space (in-place).

It is **not stable**, so don't use it when tie-breaking order matters.

## The two-phase algorithm

1. **Build** a max-heap from the input array — O(n).
2. Repeatedly **extract** the max: swap `arr[0]` with `arr[end - 1]`, shrink the heap by 1, sift down the new root. After `n - 1` extractions the array is sorted ascending. — O(n log n).

```text
initial:               [3, 1, 4, 1, 5, 9, 2, 6]
after buildMaxHeap:    [9, 6, 4, 3, 5, 1, 2, 1]
                        ^
                        root = max

extract step 1: swap(0, 7) -> [1, 6, 4, 3, 5, 1, 2, 9]  heap end = 7
                siftDown(0, 7) -> [6, 5, 4, 3, 1, 1, 2, 9]

extract step 2: swap(0, 6) -> [2, 5, 4, 3, 1, 1, 6, 9]  heap end = 6
                siftDown(0, 6) -> [5, 3, 4, 2, 1, 1, 6, 9]

... continue for 6 more extractions ...

final:                  [1, 1, 2, 3, 4, 5, 6, 9]
```

## The code

```javascript
function heapSort(arr) {
  const n = arr.length;
  for (let i = (n >>> 1) - 1; i >= 0; i--) siftDown(arr, i, n);
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    siftDown(arr, 0, end);
  }
  return arr;
}

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

Two observations that are easy to miss:

- The first loop runs from `(n / 2) - 1` down to `0` — only non-leaf nodes need sifting. Leaves already satisfy the heap property trivially.
- The second loop uses `end` as an **exclusive** upper bound for `siftDown`. After each swap the largest element is now at position `end - 1` and should not be touched again.

## Complexity

- **Build heap:** O(n).
- **n - 1 extractions:** each costs O(log n) for `siftDown`; total O(n log n).
- **Overall:** O(n log n) worst case, average, and best — no data-dependent speedup.
- **Space:** O(1) — everything happens in place.
- **Stable:** No. Long-distance swaps across the heap break stability.

## Heap sort vs quick sort vs merge sort

| Property | Heap sort | Quick sort | Merge sort |
| --- | --- | --- | --- |
| Worst-case time | O(n log n) | O(n^2) | O(n log n) |
| Average-case time | O(n log n) | O(n log n) | O(n log n) |
| Extra space | O(1) | O(log n) stack | O(n) aux |
| Stable | No | No | Yes |
| Cache-friendliness | Poor | Excellent | Decent |
| Typical real-world speed | Slowest of the three | Usually fastest | Close to quicksort |

Heap sort is chosen when **worst-case guarantees** and **tight memory** both matter. **Introsort** — used by many C++ std::sort implementations — starts as quicksort and switches to heapsort when recursion gets deep, getting quicksort's speed with heapsort's worst-case guarantee.

## Sanity check for the exercise

A quick way to verify your heap sort is correct: sort an adversarial input for quicksort, like an already sorted or reverse sorted array of 10000 elements. Heap sort should handle them in the same time as random input.

:::quiz
question: Why does heap sort have a guaranteed O(n log n) worst case while quicksort does not?
options:
  - Each extraction is O(log n) regardless of data — there is no "unbalanced" mode the way quicksort has.
  - Because heap sort is stable.
answer: 0
explanation: The heap shape is maintained by structural arithmetic, independent of value distribution.
:::

:::quiz
question: Why is heap sort typically slower than quicksort in practice despite the same big-O complexity?
options:
  - It is not slower.
  - Heap operations jump around the array, defeating cache prefetching; quicksort's partition writes are sequential.
answer: 1
explanation: Modern CPUs reward locality of reference; the heap's parent/child jumps create cache misses.
:::

:::quiz
question: Is heap sort stable?
options:
  - Yes, just like merge sort.
  - No — equal elements can be reordered by long-distance swaps during extraction.
answer: 1
explanation: Swaps between distant positions during sift-down and extraction break tie order.
:::

:::exercise
title: Implement heapSort
description: Implement `heapSort(arr)` using the two-phase algorithm. Reuse the `siftDown` you wrote in the previous lesson.
starterCode: |
  function siftDown(arr, i, end) {
    // restore max-heap property within [0, end)
  }

  function heapSort(arr) {
    const n = arr.length;
    // phase 1: build max-heap
    // phase 2: extract max n-1 times, sifting down at root
    return arr;
  }

  console.log(heapSort([3, 1, 4, 1, 5, 9, 2, 6])); // [1,1,2,3,4,5,6,9]
  console.log(heapSort([]));                       // []
  console.log(heapSort([5, 4, 3, 2, 1]));          // [1,2,3,4,5]
:::

## Practice

- [Sort an Array](/problems/sort-an-array) — heap sort is an excellent choice when you want O(n log n) worst-case and O(1) extra space.
