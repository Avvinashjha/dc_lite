# Quicksort: Full Recursive Algorithm

With Lomuto partition in hand, quicksort is three lines:

1. Partition the range around a pivot.
2. Recursively sort the left side.
3. Recursively sort the right side.

## The code

```javascript
function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  const p = partition(arr, lo, hi);
  quickSort(arr, lo, p - 1);
  quickSort(arr, p + 1, hi);
  return arr;
}

function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}
```

The pivot at index `p` is **already in its final sorted position** after `partition`, so we recurse on `[lo, p - 1]` and `[p + 1, hi]` — never touching `p` again.

## Walkthrough

```text
arr = [5, 1, 4, 2, 8]

quickSort(0, 4)
  partition -> pivot 8 at index 4
  quickSort(0, 3)
    partition on [5,1,4,2], pivot 2 -> arr becomes [1,2,4,5,8], pivot at index 1
    quickSort(0, 0)  -> base case
    quickSort(2, 3)
      partition on [4,5], pivot 5 -> [1,2,4,5,8], pivot at index 3
      quickSort(2, 2) -> base case
      quickSort(4, 3) -> base case  (lo > hi)
  quickSort(5, 4) -> base case
```

## Complexity

- **Best case:** O(n log n) when partitions are balanced.
- **Average case:** O(n log n) for random pivots on random data.
- **Worst case:** O(n^2) when every partition is maximally unbalanced — e.g., sorted input with "pick last as pivot" picks the largest every time.
- **Space:** O(log n) stack on balanced splits, O(n) stack on skewed splits.

The next lesson addresses the worst case with **randomized pivots**.

## Quicksort vs merge sort

| Property | Quicksort | Merge sort |
| --- | --- | --- |
| Average time | O(n log n) | O(n log n) |
| Worst time | O(n^2) | O(n log n) |
| Extra space | O(log n) stack | O(n) aux + O(log n) stack |
| Stable | No | Yes |
| In-place | Yes | No (typical array impl) |
| Cache behavior | Very good | Decent |

On random numeric arrays, quicksort is typically **faster** than merge sort in practice because of cache behavior and O(1) extra working memory. Engineers who care about worst-case guarantees still reach for merge sort (or **introsort**, which switches to heapsort if quicksort recursion goes too deep).

## Why we pass `lo` and `hi` explicitly

Pure recursion over `(arr, lo, hi)` avoids slicing — `arr.slice(...)` would be O(n) per call and ruin the time complexity. Always partition **in place** with index bounds.

## Tail-call hint

The second recursive call is in tail position. In some implementations, converting it to a loop (`while (lo < hi) { partition + recurse on smaller side; loop on larger }`) caps the stack at **O(log n)** even on adversarial inputs. For interview purposes the plain recursive version above is fine.

:::quiz
question: After `partition(arr, lo, hi)` returns index `p`, what do the two recursive calls operate on?
options:
  - `[lo, p - 1]` and `[p + 1, hi]` — the pivot at `p` is already in its final sorted position.
  - `[lo, p]` and `[p, hi]` — we include the pivot on both sides.
answer: 0
explanation: Including the pivot twice would cause infinite recursion on single-element pivot ranges; the pivot is finalized by partition and must be skipped.
:::

:::quiz
question: On a fully sorted input with the last-element pivot, quicksort's time is:
options:
  - O(n log n)
  - O(n^2)
answer: 1
explanation: Each partition picks the maximum as pivot, leaving a size n-1 left side — a recursion of depth n.
:::

:::quiz
question: Why is quicksort often faster than merge sort in practice despite having the same average complexity?
options:
  - Better cache locality (data moves within a small window) and O(1) working memory, vs. merge sort's auxiliary array copying.
  - It has a smaller constant in the recursion.
answer: 0
explanation: Memory traffic dominates on real CPUs; in-place partitioning is cache-friendly.
:::

:::exercise
title: Implement quickSort
description: Implement `quickSort(arr, lo, hi)` using the Lomuto partition from the previous lesson. Default `lo = 0` and `hi = arr.length - 1`.
starterCode: |
  function partition(arr, lo, hi) {
    const pivot = arr[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    return i + 1;
  }

  function quickSort(arr, lo = 0, hi = arr.length - 1) {
    // base case + partition + two recursive calls
    return arr;
  }

  console.log(quickSort([5, 1, 4, 2, 8]));           // [1, 2, 4, 5, 8]
  console.log(quickSort([3, 3, 3]));                 // [3, 3, 3]
  console.log(quickSort([]));                        // []
:::

## Practice

- [Sort an Array](/problems/sort-an-array) — this algorithm will pass on random inputs, but may hit the worst case on adversarial test data. The next lesson shows how to fix that.
