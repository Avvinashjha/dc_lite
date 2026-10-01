You're given a matrix of 0s and 1s. Among all rectangular sub-matrices you could carve out of it, find the one with the largest area where the count of 1s exactly matches the count of 0s, and return that area. A common way to approach this: treat every 0 as -1, then the problem reduces to finding a sub-matrix whose values sum to zero, which can be tackled with prefix sums combined with a search for the longest zero-sum subarray.

**Example:**
```
Input: matrix = [[0,0,1,1],[0,1,1,0],[1,1,1,0],[1,0,0,1]]
Output: 8
```
