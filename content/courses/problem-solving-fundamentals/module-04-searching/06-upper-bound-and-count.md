# Upper Bound and Counting Occurrences

**Upper bound** is the sibling of lower bound. It returns the **first** index `i` with `nums[i] > target`. Combined with lower bound it gives you a one-line occurrence counter.

## Upper bound

Only the comparison changes from lower bound: use `<=` instead of `<`.

```javascript
function upperBound(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

- If `nums[mid] <= target`, `mid` is either equal to `target` or smaller — either way the first **strictly greater** index is to the right.
- Else `nums[mid] > target`, and `mid` is a valid candidate — the answer is at `mid` or to the left.

## Count of target in O(log n)

For a sorted array with duplicates:

```text
count of target = upperBound(nums, target) - lowerBound(nums, target)
```

```javascript
function countOccurrences(nums, target) {
  return upperBound(nums, target) - lowerBound(nums, target);
}
```

## Walkthrough

```text
nums = [1, 2, 2, 2, 4]   target = 2

lowerBound -> 1 (first index with nums[i] >= 2)
upperBound -> 4 (first index with nums[i] > 2)
count       = 4 - 1 = 3
```

## Edge cases

| Situation | `lowerBound` | `upperBound` |
| --- | --- | --- |
| `target` absent, smaller than all | `0` | `0` |
| `target` absent, larger than all | `n` | `n` |
| `target` absent, in-range | `k` | `k` |
| `target` present | first occurrence | past last occurrence |

When `target` is absent the two bounds are equal — `count = 0`, exactly as expected.

## Complexity

- **Time:** O(log n) for either bound; O(log n) total for the count.
- **Space:** O(1).

## Why not scan linearly?

A linear scan to count occurrences is **O(n)**. For sorted arrays with many queries, combining two binary searches at **O(log n)** each is dramatically faster.

:::quiz
question: The only change from lowerBound to upperBound is:
options:
  - Initializing hi to nums.length - 1 instead of nums.length.
  - Changing the comparison from `nums[mid] < target` to `nums[mid] <= target`.
answer: 1
explanation: Shifting the boundary decision from "<" to "<=" is what turns "first >=" into "first >".
:::

:::quiz
question: For a sorted array without duplicates, what is upperBound(nums, t) - lowerBound(nums, t)?
options:
  - 1 if t is present, 0 if absent.
  - Always 0.
  - Always 1.
answer: 0
explanation: With no duplicates, a present target contributes exactly one index; absence contributes zero.
:::

:::quiz
question: For `nums = [2, 2, 2]` and target `2`, what do lowerBound and upperBound return?
options:
  - lowerBound = 0, upperBound = 3 (count = 3)
  - lowerBound = 0, upperBound = 2 (count = 2)
answer: 0
explanation: Lower bound is the first index with nums[i] >= 2 (index 0); upper bound is the first index with nums[i] > 2, which is past the end (index 3).
:::

:::exercise
title: Count occurrences in O(log n)
description: Implement `countOccurrences(nums, target)` using `lowerBound` and `upperBound`. Do not scan the array linearly.
starterCode: |
  function lowerBound(nums, target) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  function upperBound(nums, target) {
    // fill in
  }

  function countOccurrences(nums, target) {
    return upperBound(nums, target) - lowerBound(nums, target);
  }

  console.log(countOccurrences([1, 2, 2, 2, 4], 2)); // 3
  console.log(countOccurrences([1, 2, 2, 2, 4], 3)); // 0
:::

## Practice

- [Search Insert Position](/problems/search-insert-position) — reuses lowerBound.
