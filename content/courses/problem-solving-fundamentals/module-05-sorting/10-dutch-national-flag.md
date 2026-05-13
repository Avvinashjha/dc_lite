# 3-Way Partition: The Dutch National Flag

Edsger Dijkstra's **Dutch National Flag** problem: given an array containing only three distinct values (say `0`, `1`, `2`), sort it **in place** in **O(n)** time and **O(1)** extra space.

The technique generalizes into a powerful pattern: partition an array into three contiguous regions in **one pass** using three pointers.

## The invariant

We keep four regions as we scan:

```text
[ 0 0 0 | 1 1 1 | unknown ... | 2 2 2 ]
 [lo..lo) [lo..mid) [mid..hi]    (hi..n)
```

- `nums[0..lo)` = the `0`s.
- `nums[lo..mid)` = the `1`s.
- `nums[mid..hi]` = unknown (not yet processed).
- `nums[hi+1..n)` = the `2`s.

Each step processes `nums[mid]` and shrinks the unknown region.

## The algorithm

Three pointers: `lo`, `mid`, `hi`. Start with `lo = 0`, `mid = 0`, `hi = n - 1`.

- `nums[mid] === 0`: swap with `lo`, advance both `lo` and `mid`.
- `nums[mid] === 1`: advance `mid` only (already in the middle region).
- `nums[mid] === 2`: swap with `hi`, decrement `hi`. **Do not** advance `mid` — the element swapped in from the unknown end has not been classified yet.

## The code

```javascript
function sortColors(nums) {
  let lo = 0;
  let mid = 0;
  let hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) {
      [nums[lo], nums[mid]] = [nums[mid], nums[lo]];
      lo++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[hi]] = [nums[hi], nums[mid]];
      hi--;
    }
  }
  return nums;
}
```

## Walkthrough

```text
nums = [2, 0, 2, 1, 1, 0]   lo=0 mid=0 hi=5

mid=0 nums[0]=2 -> swap(0,5) [0,0,2,1,1,2] hi=4
mid=0 nums[0]=0 -> swap(0,0) [0,0,2,1,1,2] lo=1 mid=1
mid=1 nums[1]=0 -> swap(1,1) [0,0,2,1,1,2] lo=2 mid=2
mid=2 nums[2]=2 -> swap(2,4) [0,0,1,1,2,2] hi=3
mid=2 nums[2]=1 -> mid=3
mid=3 nums[3]=1 -> mid=4
mid > hi -> done
```

Final: `[0, 0, 1, 1, 2, 2]`.

## Why not advance `mid` after swapping with `hi`?

Because the element that just arrived at index `mid` came from the **unknown** region `nums[mid..hi]` — we have not classified it yet. Advancing `mid` would skip a value that might be `0`, `1`, or `2`.

By contrast, after a `0`-swap we **do** advance `mid`, because the value that came in from `lo`'s region is guaranteed to be `1` (everything in `[lo..mid)` was already classified as `1`).

## Complexity

- **Time:** O(n) — each index moves at most a constant number of times.
- **Space:** O(1).

## Generalizations

- Same idea with a **pivot value**: partition into `< pivot`, `== pivot`, `> pivot`. This is **3-way quicksort** (Bentley-McIlroy), which handles heavy duplicates gracefully.
- Useful whenever you need to physically separate three classes in one pass — not just for sorting `0/1/2`.

## Alternative: two-pass counting

A two-pass solution would count the zeros, ones, and twos, then overwrite the array. Also O(n) time and O(1) space, but two passes instead of one, and it **modifies values** (not stable if the original values carried hidden identity). The Dutch flag does it in **one pass** with swaps.

:::quiz
question: Why must `mid` NOT advance when we swap with `hi`?
options:
  - The swapped-in element came from the unknown region and has not yet been classified.
  - Advancing would cause an infinite loop.
answer: 0
explanation: Only after classifying the new value can we safely advance; doing so prematurely would skip processing it.
:::

:::quiz
question: The loop condition `mid <= hi` ensures:
options:
  - That we process every index in the unknown region before exiting.
  - That the array is sorted.
answer: 0
explanation: The unknown region is [mid..hi]; the loop exits only when mid passes hi, meaning every index has been classified.
:::

:::quiz
question: Time complexity of the Dutch flag partition is:
options:
  - O(n log n)
  - O(n)
answer: 1
explanation: Each of lo, mid, hi moves at most n times across all iterations.
:::

:::exercise
title: Implement sortColors
description: Implement `sortColors(nums)` sorting an array of `0`, `1`, `2` values in place using the Dutch flag scheme. Return the array.
starterCode: |
  function sortColors(nums) {
    let lo = 0, mid = 0, hi = nums.length - 1;
    // while (mid <= hi) classify nums[mid] into 0 / 1 / 2 region
    return nums;
  }

  console.log(sortColors([2, 0, 2, 1, 1, 0])); // [0, 0, 1, 1, 2, 2]
  console.log(sortColors([2, 0, 1]));          // [0, 1, 2]
  console.log(sortColors([0]));                // [0]
:::

## Practice

- [Sort Colors](/problems/sort-colors) — exactly this algorithm.
