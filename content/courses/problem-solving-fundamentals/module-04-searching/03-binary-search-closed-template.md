# Binary Search: Closed-Interval Template

This is the most common interview template. The window is a **closed interval** `[lo, hi]` — both ends are valid indices. The loop continues while the window is **non-empty**.

## The code

```javascript
function binarySearch(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

## What each line is doing

- `lo = 0`, `hi = nums.length - 1` — the window covers the whole array; both ends are valid indices.
- `while (lo <= hi)` — stop when the window is empty. `lo > hi` means “no candidates left.”
- `mid = (lo + hi) >>> 1` — integer midpoint. `>>> 1` is safe for non-negative indices and avoids the overflow trap in languages with fixed-width ints. In JavaScript it also avoids a subtle floating-point issue for very large values.
- `nums[mid] < target` → answer is strictly to the right of `mid` → `lo = mid + 1` (we **exclude** mid).
- `nums[mid] > target` → answer is strictly to the left of `mid` → `hi = mid - 1` (we **exclude** mid).

**Never** write `lo = mid` or `hi = mid` in this template — that would keep `mid` inside the window and cause an **infinite loop** when `lo === hi`.

## Trace

```text
nums = [-1, 0, 3, 5, 9, 12]   target = 9

lo=0 hi=5 mid=2 nums[2]=3  <9 -> lo=3
lo=3 hi=5 mid=4 nums[4]=9 ==9 -> return 4
```

## Complexity

- **Time:** O(log n)
- **Space:** O(1)

## Why `(lo + hi) >>> 1`?

In languages like C or Java, `(lo + hi) / 2` can overflow a 32-bit integer when both are near `INT_MAX`. The trick `(lo + hi) >>> 1` — unsigned right shift — handles that correctly. In JavaScript numbers are 64-bit floats, but `>>> 1` is still idiomatic, and it also rounds **down** for non-negative values, which is what we want.

An equivalent, safer-looking form is `lo + Math.floor((hi - lo) / 2)`.

## Common bugs

- Using `lo < hi` instead of `lo <= hi` — misses the last candidate when `lo === hi`.
- Writing `lo = mid` or `hi = mid` — infinite loop when the window has 1 element.
- Forgetting to return `-1` outside the loop when the target is not found.

:::quiz
question: In the closed-interval template, what does the loop condition `lo <= hi` guarantee?
options:
  - That the window is non-empty, so at least one candidate index remains to check.
  - That nums is sorted in ascending order.
answer: 0
explanation: When lo > hi the window is empty and the target cannot be inside.
:::

:::quiz
question: If `nums[mid] < target`, which update keeps the closed-interval invariant correct?
options:
  - lo = mid
  - lo = mid + 1
  - hi = mid - 1
answer: 1
explanation: We know mid itself is too small, so the answer (if any) lies strictly to the right; exclude mid by setting lo = mid + 1.
:::

:::quiz
question: Why is writing `hi = mid` (instead of `hi = mid - 1`) unsafe in this template when the window has size 1?
options:
  - It would cause an infinite loop: mid would equal lo/hi and neither bound moves.
  - It would accidentally skip element 0.
answer: 0
explanation: With lo == hi, mid == lo; hi = mid leaves both bounds unchanged and the loop never ends.
:::

:::exercise
title: Implement binarySearch
description: Implement `binarySearch(nums, target)` using the closed-interval template exactly as shown above. Return the index if found, otherwise -1.
starterCode: |
  function binarySearch(nums, target) {
    let lo = 0;
    let hi = nums.length - 1;
    // while (lo <= hi) ...
    return -1;
  }

  console.log(binarySearch([-1, 0, 3, 5, 9, 12], 9));  // 4
  console.log(binarySearch([-1, 0, 3, 5, 9, 12], 2));  // -1
:::

## Practice

- [Binary Search](/problems/binary-search)
