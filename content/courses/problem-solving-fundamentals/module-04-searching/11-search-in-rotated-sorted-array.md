# Search in Rotated Sorted Array

**LeetCode 33.** Given a rotated ascending array of **distinct** integers, find the index of `target`, or return `-1`. Must be O(log n).

## The key observation

At every step, at least one of the two halves `[lo, mid]` or `[mid, hi]` is a **normal sorted run**. We can identify which half is sorted by comparing `nums[lo]` with `nums[mid]`, then check whether `target` falls inside that sorted half’s range. If yes, search there; otherwise, search the other half.

## Decision table

- If `nums[lo] <= nums[mid]`, the **left** half `[lo..mid]` is sorted.
  - If `nums[lo] <= target < nums[mid]`, target lies in the sorted left → `hi = mid - 1`.
  - Else → `lo = mid + 1`.
- Else the **right** half `[mid..hi]` is sorted.
  - If `nums[mid] < target <= nums[hi]`, target lies in the sorted right → `lo = mid + 1`.
  - Else → `hi = mid - 1`.

## The code

```javascript
function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] === target) return mid;

    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
```

## Walkthrough

```text
nums = [4, 5, 6, 7, 0, 1, 2]   target = 0

lo=0 hi=6 mid=3 nums[3]=7
  nums[0]=4 <= nums[3]=7  -> LEFT [4..7] sorted
  is 0 in [4, 7)? no      -> lo = 4

lo=4 hi=6 mid=5 nums[5]=1
  nums[4]=0 <= nums[5]=1  -> LEFT [0..1] sorted
  is 0 in [0, 1)? yes     -> hi = 4

lo=4 hi=4 mid=4 nums[4]=0 === 0 -> return 4
```

### Target not present

```text
nums = [4, 5, 6, 7, 0, 1, 2]   target = 3   -> return -1
```

At every step one side is sorted; the target never falls inside, so the window shrinks to empty.

## Why this works

Because the array rotates at a single pivot, mid always sits inside one of the two runs. The comparison `nums[lo] <= nums[mid]` tells you on which side of the pivot `mid` currently lies. Knowing one side is sorted lets you test membership in O(1) by comparing with both endpoints of that run.

## Complexity

- **Time:** O(log n) (one half discarded per step).
- **Space:** O(1).

## Caveat: duplicates break this

If `nums` can contain duplicates (LeetCode 81), the check `nums[lo] <= nums[mid]` can hide the sorted side. The next lesson handles that case.

:::quiz
question: In the distinct-elements rotated array, if nums[lo] <= nums[mid] is true then:
options:
  - The left half [lo..mid] is a sorted (unrotated) run.
  - The right half [mid..hi] is the sorted run.
answer: 0
explanation: A rotation at or before lo would have left nums[lo] > nums[mid]; so the comparison holding true means the pivot is past mid.
:::

:::quiz
question: Once the sorted half is identified, how do we decide which side to search?
options:
  - By checking whether target lies between the two endpoints of the sorted half.
  - By flipping a coin.
answer: 0
explanation: Range membership in a sorted run is O(1); that tells us whether to keep or discard that half.
:::

:::quiz
question: Why is the loop condition `lo <= hi` (closed) instead of `lo < hi` (half-open) here?
options:
  - Because we want the final single-element window to still be checked for equality with target.
  - Because half-open does not work with rotations.
answer: 0
explanation: We need to compare the last remaining element to target before concluding "not found," so we keep the closed interval and return -1 after the loop.
:::

:::exercise
title: Implement rotated search
description: Implement `search(nums, target)` for a rotated sorted array of distinct integers. Return the index, or -1 if absent.
starterCode: |
  function search(nums, target) {
    let lo = 0, hi = nums.length - 1;
    // while (lo <= hi) ...
    return -1;
  }

  console.log(search([4, 5, 6, 7, 0, 1, 2], 0));  // 4
  console.log(search([4, 5, 6, 7, 0, 1, 2], 3));  // -1
  console.log(search([1], 0));                    // -1
  console.log(search([1], 1));                    // 0
:::

## Practice

- [Search in Rotated Sorted Array](/problems/search-in-rotated-sorted-array)
