# Find Minimum in Rotated Sorted Array

**LeetCode 153.** A sorted ascending array of **distinct** integers has been rotated at some unknown pivot — for example `[0,1,2,4,5,6,7]` becomes `[4,5,6,7,0,1,2]`. Find the minimum in O(log n).

## The key observation

After rotation, the array has two sorted halves. The minimum is the **only** element smaller than its left neighbor — equivalently, the **start** of the second sorted half.

Compare `nums[mid]` to `nums[hi]`:

- If `nums[mid] > nums[hi]`, the minimum is **strictly to the right** of `mid` → `lo = mid + 1`.
- Else (`nums[mid] <= nums[hi]`), the right side (from `mid` onward) is sorted, so the minimum is at `mid` or to its left → `hi = mid`.

Using `nums[hi]` (not `nums[lo]`) is what makes this cleanly decidable — comparing with `nums[lo]` has an edge case when the array is not rotated.

## The code

```javascript
function findMin(nums) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}
```

## Walkthrough

```text
nums = [4, 5, 6, 7, 0, 1, 2]

lo=0 hi=6 mid=3 nums[3]=7 > nums[6]=2 -> lo=4
lo=4 hi=6 mid=5 nums[5]=1 < nums[6]=2 -> hi=5
lo=4 hi=5 mid=4 nums[4]=0 < nums[5]=1 -> hi=4
lo=4 hi=4 -> return nums[4] = 0
```

### Not rotated

```text
nums = [1, 2, 3, 4, 5]

lo=0 hi=4 mid=2 nums[2]=3 < nums[4]=5 -> hi=2
lo=0 hi=2 mid=1 nums[1]=2 < nums[2]=3 -> hi=1
lo=0 hi=1 mid=0 nums[0]=1 < nums[1]=2 -> hi=0
return nums[0] = 1
```

Even when there is no rotation, the algorithm lands on index 0 correctly.

## Why compare to `nums[hi]`?

Two facts:

1. The minimum is always `<= nums[hi]` (the last element is in the second sorted run, or the array is fully sorted).
2. If `nums[mid] > nums[hi]`, then the run from `lo` through `mid` is not the one containing the minimum — the minimum must lie after `mid`.

These two together mean each comparison halves the window with no ambiguity.

## Complexity

- **Time:** O(log n)
- **Space:** O(1)

:::quiz
question: Why do we compare nums[mid] with nums[hi] instead of nums[lo]?
options:
  - Comparing with nums[hi] lets us unambiguously decide which half holds the minimum even when the array is not rotated; comparing with nums[lo] has an awkward edge case.
  - Comparing with nums[lo] is not allowed in JavaScript.
answer: 0
explanation: For the unrotated case nums[lo] <= nums[mid] is always true, which makes the nums[lo]-based rule miss information; nums[hi] is always an upper bound on the minimum so the decision is clean.
:::

:::quiz
question: If nums[mid] > nums[hi], the minimum must lie:
options:
  - At mid or to the left of mid.
  - Strictly to the right of mid.
answer: 1
explanation: mid itself is greater than the last element, so something smaller exists beyond mid; mid is not the minimum.
:::

:::quiz
question: On an unrotated sorted array like [1, 2, 3], findMin still returns:
options:
  - The first element, 1 — the algorithm handles this case naturally.
  - -1
answer: 0
explanation: Every comparison moves hi left until hi = lo = 0, giving nums[0] = 1.
:::

:::exercise
title: Implement findMin
description: Implement `findMin(nums)` using the `nums[hi]` comparison. Assume distinct integers.
starterCode: |
  function findMin(nums) {
    let lo = 0, hi = nums.length - 1;
    // while (lo < hi) ...
    return nums[lo];
  }

  console.log(findMin([4, 5, 6, 7, 0, 1, 2])); // 0
  console.log(findMin([3, 4, 5, 1, 2]));       // 1
  console.log(findMin([1, 2, 3, 4, 5]));       // 1
  console.log(findMin([2, 1]));                // 1
:::

## Practice

- [Search in Rotated Sorted Array](/problems/search-in-rotated-sorted-array) — the next two lessons use a similar idea to search for a target.
