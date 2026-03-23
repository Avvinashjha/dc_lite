Given a binary matrix, find the largest area rectangular sub-matrix that has an equal number of 1s and 0s. Return the area of this sub-matrix. The approach converts 0s to -1s and uses a combination of prefix sums and longest subarray with zero sum.

**Example:**
```
Input: matrix = [[0,0,1,1],[0,1,1,0],[1,1,1,0],[1,0,0,1]]
Output: 8
```
