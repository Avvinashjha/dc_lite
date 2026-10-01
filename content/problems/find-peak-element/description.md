You're given an integer array `nums`. An element is a peak if it's strictly larger than the elements immediately beside it, and for this problem the edges of the array are treated as bordered by negative infinity — so the first or last element only needs to beat its single real neighbor to count as a peak. Return the index of any one peak element; at least one is guaranteed to exist, and when there are several, any valid index is accepted. Aim for an O(log n) solution.

**Example 1:**
```
Input: nums = [1,2,3,1]
Output: 2
```

**Example 2:**
```
Input: nums = [1,2,1,3,5,6,4]
Output: 5
```
