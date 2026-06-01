Given an array of non-negative integers and a target value `sum`, determine whether any subset of the array adds up to exactly `sum`. Return `true` if such a subset exists, `false` otherwise.

**Example 1:**
```
Input: arr = [3, 34, 4, 12, 5, 2], sum = 9
Output: true
Explanation: Subset [4, 5] sums to 9.
```

**Example 2:**
```
Input: arr = [3, 34, 4, 12, 5, 2], sum = 30
Output: false
```

**Edge cases:** `sum = 0` is always true (empty subset). Array with a single element equal to `sum`. All elements larger than `sum`.
