Given an `m x n` matrix of integers, find the longest path you can trace where each step strictly increases in value. From any cell you may only step up, down, left, or right (no diagonal moves, and never off the edge of the grid), and every move must land on a cell whose value is strictly larger than the one you're leaving.

**Example 1:**
```
Input: matrix = [[9,9,4],[6,6,8],[2,1,1]]
Output: 4 (path: 1 -> 2 -> 6 -> 9)
```

**Example 2:**
```
Input: matrix = [[3,4,5],[3,2,6],[2,2,1]]
Output: 4
```
