# Search Insert Position

**LeetCode 35.** Given a sorted array and a target, return the index where the target should be inserted to keep the array sorted. If the target is already present, return its index.

This is **literally** `lowerBound` from the previous lesson. Recognizing that turns a 10-minute problem into a 30-second problem.

## Problem restatement

- If `target` is in `nums`, return its first index.
- If `target` is not in `nums`, return the index where it would be inserted.

Both cases are **the first index `i` with `nums[i] >= target`** — lower bound.

## The code

```javascript
function searchInsert(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

## Walkthroughs

### Target present

```text
nums = [1, 3, 5, 6]   target = 5   -> return 2

lo=0 hi=4 mid=2 nums[2]=5 >= 5 -> hi=2
lo=0 hi=2 mid=1 nums[1]=3  < 5 -> lo=2
lo=2 hi=2 -> return 2
```

### Target absent, in-range

```text
nums = [1, 3, 5, 6]   target = 2   -> return 1

lo=0 hi=4 mid=2 nums[2]=5 >= 2 -> hi=2
lo=0 hi=2 mid=1 nums[1]=3 >= 2 -> hi=1
lo=0 hi=1 mid=0 nums[0]=1 <  2 -> lo=1
lo=1 hi=1 -> return 1
```

### Target bigger than everything

```text
nums = [1, 3, 5, 6]   target = 7   -> return 4 (n)
```

### Target smaller than everything

```text
nums = [1, 3, 5, 6]   target = 0   -> return 0
```

## Complexity

- **Time:** O(log n)
- **Space:** O(1)

## Why `hi = nums.length` is essential

If we set `hi = nums.length - 1` (closed interval), we could not return `nums.length` when `target` is larger than every element. Half-open is designed for exactly this kind of “index possibly past the end” answer.

:::quiz
question: Why is LeetCode 35 the same as lowerBound?
options:
  - Because both return the first index with nums[i] >= target, which is either the first occurrence or the insertion point.
  - Because both always return 0.
answer: 0
explanation: Insertion position and first-not-less are the same index when nums is sorted.
:::

:::quiz
question: For `nums = [1, 3, 5]` and target `4`, searchInsert returns:
options:
  - 2
  - 3
  - -1
answer: 0
explanation: 4 would be inserted between 3 (index 1) and 5 (index 2), so at index 2.
:::

:::quiz
question: Why is closed-interval binary search awkward for search-insert?
options:
  - Because the answer can be `nums.length`, which is not a valid index in the closed interval; half-open naturally handles it.
  - Because closed-interval binary search cannot find equal elements.
answer: 0
explanation: Half-open's exclusive upper bound makes "past the end" a first-class answer.
:::

:::exercise
title: Implement searchInsert
description: Implement `searchInsert(nums, target)` using the half-open lower-bound template.
starterCode: |
  function searchInsert(nums, target) {
    let lo = 0, hi = nums.length;
    // while (lo < hi) ...
    return lo;
  }

  console.log(searchInsert([1, 3, 5, 6], 5)); // 2
  console.log(searchInsert([1, 3, 5, 6], 2)); // 1
  console.log(searchInsert([1, 3, 5, 6], 7)); // 4
  console.log(searchInsert([1, 3, 5, 6], 0)); // 0
:::

## Practice

- [Search Insert Position](/problems/search-insert-position)
