# Quicksort: Lomuto Partition

Before writing quicksort, master its engine: the **partition** step. Given an array range and a chosen **pivot**, partitioning rearranges the range so that:

```text
[  elements <= pivot  |  pivot at its final index  |  elements > pivot  ]
```

The pivot lands in its **final sorted position**, and everything to the left is ≤ it, everything to the right is > it. Quicksort then recurses on the two sides.

This lesson focuses on the **Lomuto** partition scheme — the most common one in interviews.

## The Lomuto scheme

Pick the **last element** as the pivot. Walk the range with two indices:

- `i` tracks the boundary of the "≤ pivot" region (exclusive — `i` is one past the last such element).
- `j` scans every other index.

When `arr[j] <= pivot`, swap `arr[j]` into the "≤ pivot" region by advancing `i` and swapping `arr[i]` with `arr[j]`. After the scan, swap the pivot into position `i + 1`.

## The code

```javascript
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

`partition` returns the **final index** of the pivot.

## Walkthrough

```text
arr = [5, 1, 4, 2, 8]   lo=0 hi=4 pivot = arr[4] = 8

i = -1
j=0: arr[0]=5 <= 8 -> i=0  swap(0,0) -> [5,1,4,2,8]
j=1: arr[1]=1 <= 8 -> i=1  swap(1,1) -> [5,1,4,2,8]
j=2: arr[2]=4 <= 8 -> i=2  swap(2,2) -> [5,1,4,2,8]
j=3: arr[3]=2 <= 8 -> i=3  swap(3,3) -> [5,1,4,2,8]

swap pivot into position i+1=4 -> swap(4,4) -> [5,1,4,2,8]
return 4
```

Now a more interesting example:

```text
arr = [3, 1, 4, 1, 5, 9, 2, 6, 5]   lo=0 hi=8 pivot = 5

i=-1
j=0: 3 <= 5 -> i=0, swap(0,0)  [3,1,4,1,5,9,2,6,5]
j=1: 1 <= 5 -> i=1, swap(1,1)  [3,1,4,1,5,9,2,6,5]
j=2: 4 <= 5 -> i=2, swap(2,2)  [3,1,4,1,5,9,2,6,5]
j=3: 1 <= 5 -> i=3, swap(3,3)  [3,1,4,1,5,9,2,6,5]
j=4: 5 <= 5 -> i=4, swap(4,4)  [3,1,4,1,5,9,2,6,5]
j=5: 9 <= 5 -> no
j=6: 2 <= 5 -> i=5, swap(5,6)  [3,1,4,1,5,2,9,6,5]
j=7: 6 <= 5 -> no

swap pivot (index 8) with index i+1=6 -> swap(6,8)
result: [3,1,4,1,5,2,5,6,9]
return 6

check: left of 6 is {3,1,4,1,5,2,5} all <= 5;
       right of 6 is {6,9} all > 5.    pivot (5) is at its final position.
```

## Complexity

- **Time:** O(n) per partition — a single left-to-right scan.
- **Space:** O(1) extra (in-place).

## Common bugs

1. **`i = lo` instead of `i = lo - 1`.** Breaks the invariant; the pivot ends up in the wrong place.
2. **Comparing `arr[j] < pivot`** (strict) — leaves some equal-to-pivot elements on the wrong side, which is not wrong for correctness but triggers quadratic behavior on all-equal inputs.
3. **Forgetting the final swap.** The pivot must be moved into position `i + 1` at the end.

## Stability

Lomuto partition is **not stable** — long-distance swaps reorder equal elements.

:::quiz
question: After partition, what is true about index `i + 1` (the returned index)?
options:
  - It holds the pivot, and the pivot is in its final sorted position.
  - It holds the smallest element.
answer: 0
explanation: Everything left is <= pivot, everything right is > pivot, so the pivot never moves again.
:::

:::quiz
question: How many elements does `partition` move to the <= pivot region on average?
options:
  - About n/2 for a random pivot, but this varies widely — the partition is balanced only on average.
  - Always exactly half.
answer: 0
explanation: A random pivot gives an expected half-split; specific inputs can give any split.
:::

:::quiz
question: What is the purpose of starting `i` at `lo - 1` instead of `lo`?
options:
  - It keeps the "<= pivot region" empty initially; incrementing `i` before swapping then grows the region correctly on the first match.
  - It handles negative indices.
answer: 0
explanation: The invariant is "arr[lo..i] are all <= pivot"; starting at i = lo - 1 makes that range empty to begin with.
:::

:::exercise
title: Implement Lomuto partition
description: Implement `partition(arr, lo, hi)` that returns the final index of the pivot `arr[hi]`. After the call, every element to the left of the returned index is `<=` pivot and every element to the right is `>` pivot.
starterCode: |
  function partition(arr, lo, hi) {
    const pivot = arr[hi];
    let i = lo - 1;
    // for j from lo to hi - 1
    //   if arr[j] <= pivot, grow the <= region
    // place pivot at i + 1
    return /* pivot final index */;
  }

  const a = [3, 1, 4, 1, 5, 9, 2, 6, 5];
  const idx = partition(a, 0, a.length - 1);
  console.log(idx, a);
  // idx should be 6; a should have 5 at index 6 with <=5 to the left and >5 to the right
:::

## Practice

- [Sort Colors](/problems/sort-colors) — the three-way variant (next lessons) is the preferred solution, but understanding plain partition first helps.
