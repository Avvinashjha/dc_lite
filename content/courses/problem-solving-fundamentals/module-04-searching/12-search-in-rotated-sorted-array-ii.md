# Search in Rotated Sorted Array II (With Duplicates)

**LeetCode 81.** Same as the previous lesson, but duplicates are allowed. We return a **boolean** (present or not). The best **worst-case** time here is **O(n)** — duplicates can hide the sorted half.

## Where the previous template fails

Consider `[1, 1, 1, 0, 1]` with target `0`:

```text
lo=0 hi=4 mid=2 nums[mid]=1
nums[lo]=1, nums[mid]=1 -> nums[lo] <= nums[mid] is TRUE
```

The previous algorithm would declare the **left** half sorted — but it is not (`[1,1,1]` is flat, and the pivot actually lies in that region). The signal we relied on is **ambiguous** whenever `nums[lo] === nums[mid]`.

## The fix: shrink when ambiguous

When `nums[lo] === nums[mid] === nums[hi]`, we cannot decide; shrink the window one step at a time (`lo++` and `hi--`) and retry. Everywhere else, fall back to the distinct-elements logic.

## The code

```javascript
function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] === target) return true;

    if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) {
      lo++;
      hi--;
      continue;
    }

    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return false;
}
```

## Walkthrough

```text
nums = [1, 1, 1, 0, 1]   target = 0

lo=0 hi=4 mid=2 nums[mid]=1
 nums[lo]=1, nums[mid]=1, nums[hi]=1 -> AMBIGUOUS -> lo=1, hi=3

lo=1 hi=3 mid=2 nums[mid]=1
 nums[lo]=1 <= nums[mid]=1  -> LEFT sorted as [1..1]
 is 0 in [1, 1)? no -> lo = 3

lo=3 hi=3 mid=3 nums[mid]=0 === target -> return true
```

## Complexity

- **Time:** O(log n) on average; **O(n)** worst case when long stretches of duplicates force the ambiguity shrink step.
- **Space:** O(1).

## Interview note

You should mention the worst-case degradation explicitly — interviewers watch for this. It is not a bug in your algorithm; it is a known consequence of duplicates breaking the monotonicity signal.

:::quiz
question: Why does the distinct-case algorithm fail when duplicates are allowed?
options:
  - The condition `nums[lo] <= nums[mid]` can be true even when the left half is not a sorted rotation-free run.
  - Duplicates make mid overflow.
answer: 0
explanation: Equal values at both ends hide the pivot location; we cannot tell which half is sorted.
:::

:::quiz
question: What is the fix for ambiguous windows?
options:
  - Shrink by one on both ends (`lo++`, `hi--`) and retry; this avoids wrong decisions at the cost of worst-case O(n).
  - Randomly pick a side.
answer: 0
explanation: When the signal is ambiguous, a conservative one-step shrink keeps correctness; duplicates can force this up to n times.
:::

:::quiz
question: The worst-case time complexity of this algorithm is:
options:
  - O(log n)
  - O(n)
answer: 1
explanation: Arrays like [1,1,...,1,0,1,1] can force the ambiguity branch every step.
:::

:::exercise
title: Implement searchWithDuplicates
description: Implement `search(nums, target)` returning a boolean. Handle the `nums[lo] === nums[mid] === nums[hi]` case with a one-step shrink.
starterCode: |
  function search(nums, target) {
    let lo = 0, hi = nums.length - 1;
    // while (lo <= hi) ...
    return false;
  }

  console.log(search([2, 5, 6, 0, 0, 1, 2], 0)); // true
  console.log(search([2, 5, 6, 0, 0, 1, 2], 3)); // false
  console.log(search([1, 1, 1, 0, 1], 0));       // true
:::

## Practice

- [Search in Rotated Sorted Array](/problems/search-in-rotated-sorted-array) — revisit with duplicates in mind; submit both variants.
