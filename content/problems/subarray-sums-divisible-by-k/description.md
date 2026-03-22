Given an integer array `nums` and an integer `k`, return the number of non-empty subarrays whose sum is divisible by `k`.

**Example 1:**
```
Input: nums = [4,5,0,-2,-3,1], k = 5
Output: 7
Explanation: The 7 subarrays are: [4,5,0,-2,-3,1], [5], [5,0], [5,0,-2,-3], [0], [0,-2,-3], [-2,-3]
```

**Example 2:**
```
Input: nums = [5], k = 9
Output: 0
```

**Edge cases:** Array with zeros (sum 0 is divisible by any `k`). Negative numbers — remainder handling differs by language.
