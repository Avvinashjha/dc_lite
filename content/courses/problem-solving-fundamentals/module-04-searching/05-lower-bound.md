# Lower Bound (First Index with nums[i] >= target)

**Lower bound** returns the **first** index `i` such that `nums[i] >= target`, or `nums.length` if no such index exists. This single primitive powers search-insert, first-occurrence, floor/ceiling, and counting problems.

## The algorithm

Use the **half-open** template. The window starts as `[0, n)`. At each step:

- If `nums[mid] < target`, `mid` is too small → the answer must be **strictly right** of `mid` → `lo = mid + 1`.
- Else (`nums[mid] >= target`), `mid` is a valid candidate → the answer is at `mid` or to the **left** → `hi = mid`.

When `lo === hi`, that shared index is the answer.

## The code

```javascript
function lowerBound(nums, target) {
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

## Walkthrough

```text
nums = [1, 2, 2, 2, 4]   target = 2
                         want first index i with nums[i] >= 2 -> index 1

lo=0 hi=5 mid=2 nums[2]=2 >= 2 -> hi=2
lo=0 hi=2 mid=1 nums[1]=2 >= 2 -> hi=1
lo=0 hi=1 mid=0 nums[0]=1 <  2 -> lo=1
lo=1 hi=1 -> return 1
```

## Edge cases — and what the return value means

| Situation | Return |
| --- | --- |
| `target` ≤ all elements | `0` (insert at the front) |
| `target` > all elements | `nums.length` (insert past the end) |
| `target` present | index of the **first** occurrence |
| `target` absent, in-range | index where `target` would be inserted |

The return value is always in `[0, nums.length]` — which is why we use half-open: `nums.length` is a valid “past the end” answer.

## Complexity

- **Time:** O(log n)
- **Space:** O(1)

## Why the invariant is correct

Invariant: everything at index `< lo` is `< target`, and everything at index `>= hi` is `>= target`. When `lo === hi`, the split point is exactly the boundary we want.

:::quiz
question: If target is larger than every element, lowerBound returns:
options:
  - -1
  - 0
  - nums.length (the insert position is past the end)
answer: 2
explanation: No index satisfies nums[i] >= target; the half-open template returns the past-the-end index.
:::

:::quiz
question: When nums[mid] equals target, the correct update is:
options:
  - lo = mid + 1 (move right)
  - hi = mid (keep mid as a candidate, search left for an earlier occurrence)
answer: 1
explanation: Lower bound wants the first such index, so we keep mid as a candidate and look for something earlier.
:::

:::quiz
question: The loop invariant for lowerBound says that at every step:
options:
  - Everything at index < lo is strictly less than target; everything at index >= hi is >= target.
  - nums is strictly increasing.
answer: 0
explanation: Maintaining this split is what makes the final lo == hi the boundary answer.
:::

:::exercise
title: Implement lowerBound
description: Implement `lowerBound(nums, target)` exactly as above. Make sure it returns `nums.length` when `target` is larger than every element.
starterCode: |
  function lowerBound(nums, target) {
    let lo = 0;
    let hi = nums.length;
    // while (lo < hi) ...
    return lo;
  }

  console.log(lowerBound([1, 2, 2, 2, 4], 2)); // 1
  console.log(lowerBound([1, 2, 2, 2, 4], 5)); // 5
  console.log(lowerBound([1, 2, 2, 2, 4], 0)); // 0
:::

## Practice

- [Search Insert Position](/problems/search-insert-position) — it is literally `lowerBound`.
