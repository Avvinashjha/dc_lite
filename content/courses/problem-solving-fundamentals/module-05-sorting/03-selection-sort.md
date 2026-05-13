# Selection Sort

**Selection sort** repeatedly picks the **minimum** of the unsorted suffix and places it at the end of the sorted prefix. It makes the fewest **swaps** of any quadratic sort — exactly `n - 1` — but always does about `n^2 / 2` comparisons, even on sorted input.

## The idea

Maintain a **sorted prefix** `nums[0..i)` and an **unsorted suffix** `nums[i..n)`. At each step:

1. Scan the suffix to find the index of the minimum.
2. Swap that minimum into position `i`.
3. Grow the sorted prefix by 1.

```text
[29, 10, 14, 37, 13]

i=0: min in [29,10,14,37,13] is 10 at index 1 -> swap  [10, 29, 14, 37, 13]
i=1: min in [29,14,37,13]    is 13 at index 4 -> swap  [10, 13, 14, 37, 29]
i=2: min in [14, 37, 29]     is 14 at index 2 -> noop  [10, 13, 14, 37, 29]
i=3: min in [37, 29]         is 29 at index 4 -> swap  [10, 13, 14, 29, 37]
```

## The code

```javascript
function selectionSort(nums) {
  const n = nums.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (nums[j] < nums[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [nums[i], nums[minIdx]] = [nums[minIdx], nums[i]];
    }
  }
  return nums;
}
```

## Complexity

- **Time:** Θ(n^2) **always** — the inner scan runs regardless of input order.
- **Space:** O(1).
- **Stable:** **No** in the standard implementation. The long-distance swap can jump an equal element over its original neighbor. For example, sorting `[(2a), (2b), (1)]` swaps `1` into position 0 and `2a` to position 2 — the relative order of the two `2`s is inverted.

## Comparison with bubble sort

| Property | Selection | Bubble |
| --- | --- | --- |
| Comparisons | always Θ(n^2) | adaptive (O(n) best case) |
| Swaps | at most n - 1 | up to Θ(n^2) |
| Stable | No (standard) | Yes |
| Code simplicity | Very | Very |

Selection sort wins when **write/swap cost** dominates compare cost — e.g., writing to expensive storage. On in-memory arrays, insertion sort is usually better.

## Honest interview note

If you are asked to implement a sort, reach for **insertion sort** or **merge sort**. Selection sort is mostly useful as a contrast when explaining stability — "bubble sort is stable, selection sort isn't, here's why."

:::quiz
question: How many swaps does selection sort perform on an array of length n?
options:
  - Up to n - 1
  - Up to n^2 / 2
answer: 0
explanation: One swap per outer iteration; the inner loop only updates indices.
:::

:::quiz
question: Why is the standard implementation of selection sort not stable?
options:
  - A swap can move an element past other equal elements, inverting their relative order.
  - Because it uses the minimum.
answer: 0
explanation: A long-distance swap breaks the "equal elements keep original order" rule.
:::

:::quiz
question: On an already-sorted input, selection sort's time is:
options:
  - O(n)
  - Θ(n^2) — the inner scan runs regardless of order.
answer: 1
explanation: Unlike bubble sort, selection sort has no early-exit optimization in its standard form.
:::

:::exercise
title: Implement selectionSort
description: Implement `selectionSort(nums)` sorting in place. Use an inner scan to find the index of the minimum, then swap into position `i`.
starterCode: |
  function selectionSort(nums) {
    const n = nums.length;
    // for i from 0 to n-2
    //   find minIdx in nums[i..n)
    //   swap nums[i] and nums[minIdx]
    return nums;
  }

  console.log(selectionSort([29, 10, 14, 37, 13])); // [10, 13, 14, 29, 37]
  console.log(selectionSort([1]));                  // [1]
  console.log(selectionSort([2, 2, 1]));            // [1, 2, 2] (note stability caveat)
:::

## Practice

- [Sort an Array](/problems/sort-an-array) — your submission should use a better algorithm, but implement selection once as a reference.
