# Sliding Window

A **sliding window** is a contiguous subarray (or substring) whose bounds move as you scan. You maintain **invariants** about what is inside the window — often counts of characters or a running sum — and update them in O(1) as the window slides.

## Fixed-size window

Find the maximum sum of any subarray of length `k`:

```javascript
function maxSumSubarray(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
  }
  return best;
}
```

```text
k = 3
[1, 4, 2, 5, 1]
 ---           sum window [0..2]
    ---        slide: drop nums[i-k], add nums[i]
```

**Time:** O(n), **Space:** O(1).

## Variable-size window: longest substring without repeating

Expand `right` to include characters; when a duplicate appears inside the window, move `left` forward until the duplicate is excluded. Track a frequency map or last-seen index.

```javascript
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let best = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

```text
s = "abcabcbb"
     ^^
     L R   window "ab" OK

when R hits second 'a', move L past previous 'a'
```

## Expand vs shrink

- **Expand** `right` while the window is valid (or to grow the answer).
- **Shrink** `left` while the window is invalid (or to optimize).

Interview tip: state the invariant in one sentence: "The window always contains at most one copy of each character" or "the window sum is at most `target`."

:::quiz
question: A fixed-size window of length k slides one step by which update?
options:
  - Add nums[right] and subtract nums[right - k]
  - Sort the window
  - Double k each step
answer: 0
explanation: One element leaves the left side of the window and one enters the right; that is a constant-time update.
:::

:::quiz
question: Variable-size window for "longest valid substring" typically uses which pointers?
options:
  - Only right
  - left and right, moving left when the window becomes invalid
  - Random index each step
answer: 1
explanation: You grow with right and contract with left when constraints break — classic two-pointer on the same array.
:::

:::quiz
question: Sliding window techniques usually aim for what time complexity over brute force checking every substring?
options:
  - O(n²) — same as brute force
  - O(n) or O(n) per character with amortized pointer moves
  - O(2^n)
answer: 1
explanation: Each pointer moves at most n steps total across the algorithm, giving linear or near-linear behavior.
:::

:::exercise
title: Minimum size subarray sum
description: Given positive integers `nums` and `target`, return the minimal length of a contiguous subarray with sum >= target, or 0 if none. Use sliding window: expand right to grow sum, shrink left while sum >= target.
starterCode: |
  function minSubArrayLen(target, nums) {
    // positive nums only — window sum monotonic as you expand/shrink
  }

  console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])); // 2  ([4,3])
:::

## Practice

- [Longest Substring Without Repeating Characters](/problems/longest-substring-without-repeating-characters) — variable window with last-seen map.
- [Minimum Window Substring](/problems/minimum-window-substring) — advanced; try after mastering the basics.
