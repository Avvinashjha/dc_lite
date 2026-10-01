You're given a matrix with `m` rows and `n` columns. Traverse it in a spiral: start at the top-left cell and move right along the top row, drop down the rightmost column, sweep left along the bottom row, climb the leftmost column, then keep spiraling inward until every cell has been visited. Return the values in the order you visited them.

**Example 1:**
```
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]
```

**Example 2:**
```
Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]
```

**Edge cases:** Matrices with just one row or one column. An empty matrix should return `[]`.
