# Merge Sort

**Merge sort** is the first O(n log n) sort every engineer should master. It is **stable**, has **predictable worst-case** time, and is the basis of Java's `Collections.sort`, Python's Timsort, and many external / disk-based sorts.

## The recursive structure

Divide, conquer, combine:

1. If the range has 0 or 1 elements, it is already sorted — return.
2. Split the range into two halves at the midpoint.
3. Recursively sort each half.
4. **Merge** the two sorted halves (from the previous lesson).

```text
        [5, 2, 4, 6, 1, 3]
          /            \
      [5, 2, 4]      [6, 1, 3]
       /    \         /    \
    [5,2]  [4]     [6,1]   [3]
    / \           / \
  [5] [2]       [6] [1]

bottom up, merging in sorted order:
  [5][2]    -> [2, 5]
  [6][1]    -> [1, 6]
  [2,5][4]  -> [2, 4, 5]
  [1,6][3]  -> [1, 3, 6]
  [2,4,5][1,3,6] -> [1, 2, 3, 4, 5, 6]
```

## The code

We reuse the `merge` helper from the previous lesson. Using a **single shared auxiliary buffer** of length `n` avoids allocating a new array at every call.

```javascript
function mergeSort(arr) {
  const aux = new Array(arr.length);
  sort(arr, 0, arr.length - 1, aux);
  return arr;
}

function sort(arr, lo, hi, aux) {
  if (lo >= hi) return;
  const mid = (lo + hi) >>> 1;
  sort(arr, lo, mid, aux);
  sort(arr, mid + 1, hi, aux);
  merge(arr, lo, mid, hi, aux);
}

function merge(arr, lo, mid, hi, aux) {
  let i = lo;
  let j = mid + 1;
  let k = 0;
  while (i <= mid && j <= hi) {
    if (arr[i] <= arr[j]) aux[k++] = arr[i++];
    else aux[k++] = arr[j++];
  }
  while (i <= mid) aux[k++] = arr[i++];
  while (j <= hi) aux[k++] = arr[j++];
  for (let t = 0; t < k; t++) arr[lo + t] = aux[t];
}
```

## Complexity

- **Time:** O(n log n) — best, average, and worst. The recursion tree has `log2(n)` levels; each level does O(n) merging.
- **Space:** O(n) for the auxiliary buffer, plus O(log n) for the recursion stack.
- **Stable:** Yes (`<=` in the merge comparison).

## Recurrence

`T(n) = 2 T(n/2) + Θ(n)` → `Θ(n log n)` by the Master Theorem.

## Why merge sort is so widely used

- **Guaranteed worst case.** Quicksort can degrade to O(n^2); merge sort cannot.
- **Stable.** Important when sorting by multiple keys in sequence.
- **External-friendly.** You can merge sorted runs from disk; the algorithm does not need the whole input in RAM.
- **Parallelizable.** Independent halves can be sorted on different threads / cores.

## The cost: extra memory

The auxiliary buffer is `O(n)`. For sorting primitive arrays in-memory, this is usually acceptable; for extreme memory constraints, **heapsort** (lesson 12) gives O(n log n) worst-case time with **O(1)** extra space.

## Walkthrough of the recursion

```text
sort(arr, 0, 5)
  sort(arr, 0, 2)
    sort(arr, 0, 1)
      sort(arr, 0, 0)  -> base case
      sort(arr, 1, 1)  -> base case
      merge(arr, 0, 0, 1)
    sort(arr, 2, 2)    -> base case
    merge(arr, 0, 1, 2)
  sort(arr, 3, 5)
    sort(arr, 3, 4)
      sort(arr, 3, 3)  -> base case
      sort(arr, 4, 4)  -> base case
      merge(arr, 3, 3, 4)
    sort(arr, 5, 5)    -> base case
    merge(arr, 3, 4, 5)
  merge(arr, 0, 2, 5)
```

:::quiz
question: What is the time complexity of merge sort in the worst case?
options:
  - O(n log n)
  - O(n^2)
  - O(n)
answer: 0
explanation: Each of O(log n) recursion levels does O(n) total merging.
:::

:::quiz
question: Why allocate one shared auxiliary buffer instead of a new buffer inside each recursive call?
options:
  - To avoid repeated allocation and GC cost; a single O(n) buffer is reused for every merge.
  - Because recursive calls do not work with separate buffers.
answer: 0
explanation: Shared aux is purely a performance optimization; correctness is identical.
:::

:::quiz
question: Is merge sort stable?
options:
  - Yes, provided the merge step uses `<=` (prefer left on ties).
  - No, the recursion mixes equal elements.
answer: 0
explanation: Stability is entirely a property of the merge step's tie-break rule.
:::

:::exercise
title: Implement mergeSort
description: Implement `mergeSort(arr)` using a single shared auxiliary buffer and the `merge` helper. Return the sorted array.
starterCode: |
  function mergeSort(arr) {
    const aux = new Array(arr.length);
    // sort(arr, 0, arr.length - 1, aux)
    return arr;
  }

  function sort(arr, lo, hi, aux) {
    // recursive split + merge
  }

  function merge(arr, lo, mid, hi, aux) {
    // two-pointer merge, copy back
  }

  console.log(mergeSort([5, 2, 4, 6, 1, 3])); // [1, 2, 3, 4, 5, 6]
  console.log(mergeSort([1]));                // [1]
  console.log(mergeSort([]));                 // []
:::

## Practice

- [Sort an Array](/problems/sort-an-array) — merge sort passes within the time limits for n = 5·10^4.
