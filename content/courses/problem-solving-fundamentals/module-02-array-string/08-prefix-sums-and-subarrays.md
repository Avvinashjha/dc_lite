# Prefix Sums and Subarrays

A **prefix sum** array stores cumulative totals: `prefix[i]` is the sum of `nums[0]` through `nums[i-1]` (or through `nums[i]` depending on convention). Once built, **any subarray sum** becomes a difference of two prefix values in O(1).

## Building prefix sums

**0-based prefix** (length n+1), common in competitive programming:

```javascript
function buildPrefix(nums) {
  const p = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) {
    p[i + 1] = p[i] + nums[i];
  }
  return p;
}
```

Sum of `nums[l]` through `nums[r]` **inclusive**:

```javascript
function rangeSum(p, l, r) {
  return p[r + 1] - p[l];
}
```

```text
nums:  [3, -2, 5, 1]
p:     [0, 3,  1, 6, 7]
        ^  ^   ^  ^  ^
index: 0  1   2  3  4

sum nums[1..2] = p[3] - p[1] = 6 - 3 = 3  (-2 + 5)
```

## Subarray sum equals k (intuition)

To count subarrays with sum exactly `k`, you can combine prefix sums with a hash map of **how often each prefix sum has occurred** — when `prefix[r+1] - k` exists as a prior prefix, you found a valid subarray ending at `r`.

This is **O(n)** time and **O(n)** space; the full derivation belongs in a dedicated problem session.

## When prefix sums help

- Many range-sum queries on a static array.
- Transforming "subarray sum" into "difference of prefixes."
- Pairing with hash maps for **count** of subarrays with a property.

## Difference from sliding window

- Prefix + map handles **positive and negative** numbers (with care).
- Sliding window on subarray sum often assumes **all positive** so the sum is monotonic when you expand/shrink.

:::quiz
question: If prefix[0]=0 and prefix[i+1]=prefix[i]+nums[i], what is sum(nums[l..r]) inclusive?
options:
  - prefix[r] - prefix[l]
  - prefix[r + 1] - prefix[l]
  - prefix[r] - prefix[l - 1]
  - nums[l] + nums[r]
answer: 1
explanation: The sum through index r is prefix[r+1]; subtract prefix[l] to remove everything before l.
:::

:::quiz
question: Building a prefix array of length n+1 takes what time?
options:
  - O(n)
  - O(n²)
  - O(1)
answer: 0
explanation: One pass through the input array.
:::

:::quiz
question: Why does naive sliding window fail for subarray sum when nums contains negatives?
options:
  - Because negative numbers are not allowed in JavaScript arrays.
  - Because shrinking the left pointer does not guarantee the sum decreases monotonically, so the two-pointer proof breaks.
  - Because prefix sums always require sorting first.
answer: 1
explanation: With negatives, increasing the left pointer can increase or decrease the sum unpredictably; the simple shrink-when-too-big strategy no longer works.
:::

:::exercise
title: Range sum queries
description: Given `nums`, build `prefix` as above. Implement `rangeSum(l, r)` for inclusive indices. Test with nums = [1,2,3,4], l=1, r=2 -> 5.
starterCode: |
  function buildPrefix(nums) {
    // return array of length nums.length + 1
  }

  function rangeSum(prefix, l, r) {
    // inclusive l, r
  }

  const nums = [1, 2, 3, 4];
  const p = buildPrefix(nums);
  console.log(rangeSum(p, 1, 2)); // 2 + 3 = 5
:::

## Practice

- [Subarray Sum Equals K](/problems/subarray-sum-equals-k) — prefix sum + frequency map.
- [Best Time to Buy and Sell Stock](/problems/best-time-to-buy-and-sell-stock) — running minimum + one pass (related "carry" idea).
