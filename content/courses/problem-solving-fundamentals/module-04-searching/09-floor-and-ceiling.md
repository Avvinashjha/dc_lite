# Floor and Ceiling in a Sorted Array

For a sorted array and a query `x`:

- **Floor(x)** = the **largest** element `<= x`.
- **Ceiling(x)** = the **smallest** element `>= x`.

Both are one-line derivations from the bounds primitives.

## Ceiling — direct from lowerBound

Ceiling is the first element `>= x`, which is exactly what lower bound points to:

```javascript
function ceiling(nums, x) {
  const idx = lowerBound(nums, x);
  return idx < nums.length ? nums[idx] : null;
}
```

If `lowerBound` returns `nums.length`, every element was less than `x` — no ceiling exists; we return `null` (or `-1`, depending on the problem spec).

## Floor — one step back from lowerBound

Floor is the last element `<= x`. Look at `lowerBound`’s result:

- If `nums[idx] === x`, the floor is `nums[idx]` (x itself is in the array).
- Otherwise, the floor is at `idx - 1` — if that index is valid.

```javascript
function floor(nums, x) {
  const idx = lowerBound(nums, x);
  if (idx < nums.length && nums[idx] === x) return nums[idx];
  if (idx === 0) return null;
  return nums[idx - 1];
}
```

## Shared primitive

```javascript
function lowerBound(nums, x) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

## Walkthrough

```text
nums = [1, 3, 8, 10, 12]

x = 5:
  lowerBound -> 2  (nums[2] = 8)
  ceiling -> 8 (idx < n, not equal to x)
  floor   -> nums[1] = 3

x = 10:
  lowerBound -> 3  (nums[3] = 10)
  ceiling -> 10
  floor   -> 10 (nums[idx] === x)

x = 0:
  lowerBound -> 0
  ceiling -> 1
  floor   -> null (idx === 0 and nums[0] != x)

x = 15:
  lowerBound -> 5 (n)
  ceiling -> null
  floor   -> nums[4] = 12
```

## Complexity

- **Time:** O(log n)
- **Space:** O(1)

## Common mistake

Writing a dedicated floor binary search from scratch is tempting, but it doubles the chance of off-by-one bugs. Reuse `lowerBound` — the specification is identical, you just interpret the returned index differently.

:::quiz
question: Given nums = [2, 4, 6, 8], the floor of 5 is:
options:
  - 4
  - 6
answer: 0
explanation: The largest element that is <= 5 is 4.
:::

:::quiz
question: Ceiling returns null (or "no such element") when:
options:
  - Every element is less than x, making lowerBound return nums.length.
  - Every element is greater than x.
answer: 0
explanation: If lowerBound returns the past-the-end index, no element is >= x.
:::

:::quiz
question: If x is present in nums, floor(nums, x) equals:
options:
  - x itself.
  - The element before x.
answer: 0
explanation: Floor picks the largest element <= x, and x itself qualifies.
:::

:::exercise
title: Implement floor and ceiling
description: Implement `floor(nums, x)` and `ceiling(nums, x)` using a single `lowerBound` helper. Return `null` when no such element exists.
starterCode: |
  function lowerBound(nums, x) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (nums[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  function ceiling(nums, x) {
    // ...
  }

  function floor(nums, x) {
    // ...
  }

  console.log(ceiling([1, 3, 8, 10, 12], 5)); // 8
  console.log(floor(  [1, 3, 8, 10, 12], 5)); // 3
  console.log(ceiling([1, 3, 8, 10, 12], 15)); // null
  console.log(floor(  [1, 3, 8, 10, 12], 0));  // null
:::

## Practice

- [Ceiling in a sorted array](/problems/ceiling-in-a-sorted-array)
