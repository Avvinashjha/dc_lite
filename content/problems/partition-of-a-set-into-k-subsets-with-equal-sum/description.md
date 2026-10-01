You're given an integer array `nums` and an integer `k`. Work out whether the array can be split into `k` groups, each non-empty, such that every group's elements add up to the same total.

**Example 1:**
```
Input: nums = [4, 3, 2, 3, 5, 2, 1], k = 4
Output: true
Explanation: The elements add up to 20 overall, so each group needs to sum to 5: [5], [4,1], [3,2], [3,2].
```

**Example 2:**
```
Input: nums = [1, 2, 3, 4], k = 3
Output: false
```

**Edge cases:** When the overall sum doesn't divide evenly by `k`, no valid split exists, so return `false` right away. With `k = 1` the whole array is trivially one group, so the answer is always `true`. If any single element is larger than `totalSum / k`, it can never fit in a group, so a split is impossible.
