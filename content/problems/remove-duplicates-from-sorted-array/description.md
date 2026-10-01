You're given `nums`, an integer array already sorted in non-decreasing order. Modify it **in-place** so every distinct value appears exactly once, then return `k`, the number of distinct values. After your changes, the first `k` positions of `nums` must hold those distinct values in their original relative order — whatever sits past index `k` doesn't matter.

**Example 1:**
```
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
```

**Example 2:**
```
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
```

**Edge cases:** A single-element array. An array where every element is identical.
