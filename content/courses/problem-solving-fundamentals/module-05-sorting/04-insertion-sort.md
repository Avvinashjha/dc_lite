# Insertion Sort

**Insertion sort** is the quadratic sort you should actually remember. It is **stable**, **in-place**, **adaptive** (O(n) on nearly-sorted input), and used as the base case in real-world hybrid sorts like V8's Timsort-style implementation (for tiny subarrays).

## The idea

Think of sorting a hand of cards. Pick up one card at a time from the right, **slide it left** past any larger cards until it lands in the right position.

More formally: keep a **sorted prefix** `nums[0..i)`. For each new index `i`, extract `key = nums[i]` and **shift** every element `> key` one position to the right, then drop `key` into the hole.

```text
[5, 2, 4, 6, 1, 3]

i=1, key=2: shift 5 right, insert 2          [2, 5, 4, 6, 1, 3]
i=2, key=4: shift 5 right, insert 4          [2, 4, 5, 6, 1, 3]
i=3, key=6: no shift                          [2, 4, 5, 6, 1, 3]
i=4, key=1: shift 6,5,4,2 right, insert 1    [1, 2, 4, 5, 6, 3]
i=5, key=3: shift 6,5,4 right, insert 3      [1, 2, 3, 4, 5, 6]
```

## The code (shift-based)

```javascript
function insertionSort(nums) {
  for (let i = 1; i < nums.length; i++) {
    const key = nums[i];
    let j = i - 1;
    while (j >= 0 && nums[j] > key) {
      nums[j + 1] = nums[j];
      j--;
    }
    nums[j + 1] = key;
  }
  return nums;
}
```

Notes:

- The inner loop does **shifts**, not swaps — each element moves at most one slot per iteration. A swap-based version works too but costs 3x the assignments.
- The comparison `nums[j] > key` uses strict `>` to preserve stability.

## Complexity

- **Best case (sorted):** O(n) — the inner `while` immediately fails on each step.
- **Worst case (reverse sorted):** O(n^2).
- **Average case:** O(n^2), but with very small constants on real data.
- **Space:** O(1).
- **Stable:** Yes (strict `>` in the inner comparison).

## Why insertion sort appears in production sorts

Real engines sort huge arrays using **merge sort** or **introsort**, but switch to insertion sort once a sub-array is small (often ≤ 16 elements). Reasons:

1. **Small constants.** Single comparison + shift in a tight inner loop.
2. **Excellent on nearly-sorted data.** After partial sorting from the outer algorithm, insertion sort finishes the job in near-O(n).
3. **Stable.** Preserves stability of the outer merge-based algorithm.

## Walkthrough of the invariant

After iteration `i`, `nums[0..i]` is sorted. That invariant holds before the loop (prefix of length 1 is trivially sorted) and is preserved each iteration. When `i` reaches `n - 1`, the whole array is sorted.

:::quiz
question: What is the best-case time complexity of insertion sort?
options:
  - O(n^2)
  - O(n log n)
  - O(n)
answer: 2
explanation: On already-sorted input, the inner loop immediately stops each iteration — the whole algorithm is a single outer pass.
:::

:::quiz
question: Why is insertion sort stable when the comparison is `nums[j] > key`?
options:
  - Strict `>` means equal elements are never shifted past each other, preserving their input order.
  - Because the inner loop moves elements one at a time.
answer: 0
explanation: Stability requires that equal elements never swap; the strict-greater comparison enforces that.
:::

:::quiz
question: Why do hybrid sorts like Timsort fall back to insertion sort for small subarrays?
options:
  - It has very small constant factors and runs near-linearly on nearly-sorted data.
  - It is theoretically O(log n).
answer: 0
explanation: At small sizes the asymptotic advantage of n log n sorts is swamped by constants; insertion sort's tight inner loop wins.
:::

:::exercise
title: Implement insertionSort
description: Implement `insertionSort(nums)` using the shift-based inner loop shown above. Sort in place and return the array.
starterCode: |
  function insertionSort(nums) {
    for (let i = 1; i < nums.length; i++) {
      const key = nums[i];
      let j = i - 1;
      // while j >= 0 and nums[j] > key, shift right
      // insert key at j + 1
    }
    return nums;
  }

  console.log(insertionSort([5, 2, 4, 6, 1, 3])); // [1, 2, 3, 4, 5, 6]
  console.log(insertionSort([1, 2, 3]));          // [1, 2, 3]  (best case)
  console.log(insertionSort([3, 2, 1]));          // [1, 2, 3]  (worst case)
:::

## Practice

- [Sort an Array](/problems/sort-an-array) — try insertion sort on small inputs; it passes within the limits on small test cases but will TLE at n = 50000.
