## DP

The value at (i, j) becomes the side length of the largest all-one square whose bottom-right corner is (i, j). If that length is k, exactly k squares of sizes 1 through k end there. Sum those lengths. This implementation overwrites the input matrix to store DP values.

```javascript
function countSquares(matrix) {
  const m = matrix.length, n = matrix[0].length;
  let count = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] && i > 0 && j > 0) {
        matrix[i][j] = Math.min(matrix[i-1][j], matrix[i][j-1], matrix[i-1][j-1]) + 1;
      }
      count += matrix[i][j];
    }
  }
  return count;
}
```

**Time:** O(mn) | **Space:** O(1) auxiliary space, reusing the input matrix.
