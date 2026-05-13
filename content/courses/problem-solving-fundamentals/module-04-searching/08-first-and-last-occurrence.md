# First and Last Occurrence of a Target

Given a **sorted** array with possibly many duplicates, find the **first** and **last** index of a target. Return `[-1, -1]` if the target is absent. This is LeetCode 34 ("Find First and Last Position of Element in Sorted Array").

## The trick

- **First occurrence** = `lowerBound(nums, target)` — but only if `nums[firstIdx] === target`; otherwise target is absent.
- **Last occurrence** = `upperBound(nums, target) - 1` — the index just before the first strictly-greater element.

No special-case code needed — two bounds and one subtraction.

## The code

```javascript
function searchRange(nums, target) {
  const first = lowerBound(nums, target);
  if (first === nums.length || nums[first] !== target) return [-1, -1];
  const last = upperBound(nums, target) - 1;
  return [first, last];
}

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
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

## Walkthrough

```text
nums = [5, 7, 7, 8, 8, 10]   target = 8

lowerBound -> 3  (first index with nums[i] >= 8)
nums[3] = 8, so target is present
upperBound -> 5  (first index with nums[i] > 8)
last = 5 - 1 = 4

return [3, 4]
```

## Absent target

```text
nums = [5, 7, 7, 8, 8, 10]   target = 6

lowerBound -> 1 (nums[1]=7)
nums[1] = 7 !== 6 -> absent -> return [-1, -1]
```

## Complexity

- **Time:** O(log n) — two binary searches.
- **Space:** O(1).

## Why not scan linearly from the lower bound?

If the target has **k** copies, linear scanning from the first occurrence takes O(k). That is fine when `k` is small, but for a worst-case array of all-the-same-value (k = n), it becomes O(n). Using `upperBound` keeps it O(log n) unconditionally.

:::quiz
question: Once you have lowerBound and upperBound, the last occurrence of a present target is:
options:
  - upperBound(nums, target) - 1
  - lowerBound(nums, target) + 1
answer: 0
explanation: upperBound is one past the last occurrence; subtracting 1 gives the last index itself.
:::

:::quiz
question: How do you detect that the target is absent using only the lower bound?
options:
  - Check whether `first === nums.length` or `nums[first] !== target`.
  - Check whether lowerBound returned -1.
answer: 0
explanation: lowerBound returns the insert position even when the target is not present; you must also verify the element at that position.
:::

:::quiz
question: If nums = [2, 2, 2] and target = 2, what does searchRange return?
options:
  - [0, 2]
  - [-1, -1]
  - [0, 3]
answer: 0
explanation: lowerBound=0, upperBound=3, so last = 3 - 1 = 2.
:::

:::exercise
title: Implement searchRange
description: Implement `searchRange(nums, target)` using two bounds as shown. Return `[-1, -1]` when the target is absent.
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
    let lo = 0, hi = nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (nums[mid] <= target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  function searchRange(nums, target) {
    // return [first, last] or [-1, -1]
  }

  console.log(searchRange([5, 7, 7, 8, 8, 10], 8)); // [3, 4]
  console.log(searchRange([5, 7, 7, 8, 8, 10], 6)); // [-1, -1]
  console.log(searchRange([], 0));                  // [-1, -1]
:::

## Practice

- [Binary Search](/problems/binary-search) — warm up the template before tackling range queries.
