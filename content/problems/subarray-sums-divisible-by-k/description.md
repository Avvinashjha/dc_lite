You're given an integer array `nums` and an integer `k`. Count how many contiguous, non-empty subarrays have a sum that's evenly divisible by `k`.

**Example 1:**
```
Input: nums = [4,5,0,-2,-3,1], k = 5
Output: 7
Explanation: These 7 subarrays qualify: [4,5,0,-2,-3,1], [5], [5,0], [5,0,-2,-3], [0], [0,-2,-3], [-2,-3]
```

**Example 2:**
```
Input: nums = [5], k = 9
Output: 0
```

**Edge cases:** A subarray summing to zero counts, since zero is divisible by any `k`. Watch out for negative numbers — how the remainder is computed can differ across languages.
