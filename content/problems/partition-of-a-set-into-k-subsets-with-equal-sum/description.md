Given an integer array `nums` and an integer `k`, return `true` if you can divide the array into `k` non-empty subsets that all have the same sum.

**Example 1:**
```
Input: nums = [4, 3, 2, 3, 5, 2, 1], k = 4
Output: true
Explanation: Total sum is 20. Each subset must sum to 5: [5], [4,1], [3,2], [3,2].
```

**Example 2:**
```
Input: nums = [1, 2, 3, 4], k = 3
Output: false
```

**Edge cases:** If total sum isn't divisible by `k`, immediately return `false`. `k = 1` is always `true`. Any single element exceeding `totalSum / k` makes it impossible.
