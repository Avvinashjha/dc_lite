# Bubble Sort

**Bubble sort** is the canonical "teach me an inefficient sort" — but it has one honest use: if the input is already **almost** sorted, the optimized version terminates in a single pass. In interviews you'll mostly be asked to **explain** it, not to use it as your go-to sort.

## The idea

Repeatedly walk the array. On each pass, compare every adjacent pair `(nums[i], nums[i+1])` and **swap** if they are out of order. After pass **k**, the `k` largest elements have "bubbled up" to the end.

```text
[5, 1, 4, 2, 8]

pass 1:
  (5,1) swap -> [1, 5, 4, 2, 8]
  (5,4) swap -> [1, 4, 5, 2, 8]
  (5,2) swap -> [1, 4, 2, 5, 8]
  (5,8) keep -> [1, 4, 2, 5, 8]          largest parked at end

pass 2:
  (1,4) keep -> [1, 4, 2, 5, 8]
  (4,2) swap -> [1, 2, 4, 5, 8]
  (4,5) keep -> [1, 2, 4, 5, 8]          no more swaps after this -> done
```

## The code (optimized with early exit)

```javascript
function bubbleSort(nums) {
  const n = nums.length;
  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    for (let i = 0; i < n - 1 - pass; i++) {
      if (nums[i] > nums[i + 1]) {
        [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return nums;
}
```

Two optimizations on the naive version:

- The inner loop stops at `n - 1 - pass` because the last `pass` elements are already in place.
- If a full pass makes no swaps, the array is sorted and we break early.

## Complexity

- **Best case (already sorted):** O(n) with the `swapped` flag — a single pass finishes.
- **Worst case (reverse sorted):** O(n^2).
- **Average case:** O(n^2).
- **Space:** O(1) in-place.
- **Stable:** Yes — adjacent swaps never jump equal elements past each other, as long as you only swap on strict `>`.

## When would I ever use this?

You wouldn't, for a general sort — insertion sort strictly dominates it in practice. The reason interviewers still teach bubble sort is that it's the simplest worked example of a **stable**, **in-place**, **comparison-based** sort — good for explaining what those words mean.

## Common mistake

Using `>=` instead of `>` in the swap comparison. That swap still produces a sorted array, but it **breaks stability** — equal elements can now swap positions.

:::quiz
question: After the k-th pass of bubble sort on an array of length n, which elements are guaranteed to be in their final position?
options:
  - The k largest elements, parked at the end of the array.
  - The k smallest elements, parked at the front.
answer: 0
explanation: Adjacent swaps bubble the largest remaining element to the right each pass.
:::

:::quiz
question: With the `swapped` flag optimization, what is the best-case time on an already sorted array?
options:
  - O(n^2)
  - O(n)
answer: 1
explanation: One full pass with no swaps trips the early exit and the algorithm returns.
:::

:::quiz
question: Why is `if (nums[i] > nums[i + 1]) swap` (strict `>`) important for stability?
options:
  - Using `>=` would swap equal elements and reorder them relative to each other.
  - Using `>=` would produce an unsorted result.
answer: 0
explanation: Never swapping equal elements preserves their input order, which is the definition of stability.
:::

:::exercise
title: Implement bubbleSort
description: Implement `bubbleSort(nums)` sorting in place. Include the early-exit `swapped` flag. Return the array.
starterCode: |
  function bubbleSort(nums) {
    const n = nums.length;
    // outer pass loop
    // inner compare-and-swap loop
    return nums;
  }

  console.log(bubbleSort([5, 1, 4, 2, 8]));     // [1, 2, 4, 5, 8]
  console.log(bubbleSort([1, 2, 3]));           // [1, 2, 3]   (early exit on pass 1)
  console.log(bubbleSort([3, 3, 3]));           // [3, 3, 3]   (no swaps -> stable)
:::

## Practice

- [Sort an Array](/problems/sort-an-array) — pass with insertion sort or merge sort; use bubble sort as a mental warm-up only.
