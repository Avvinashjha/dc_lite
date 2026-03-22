## DP

dp[i][j] = side length of largest square ending at (i,j).

```javascript
function maximalSquare(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const dp = Array.from({length: m}, () => Array(n).fill(0));
  let max = 0;
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === '1') {
        dp[i][j] = i > 0 && j > 0 ? Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 : 1;
        max = Math.max(max, dp[i][j]);
      }
    }
  return max * max;
}
```

**Time:** O(mn) | **Space:** O(mn)
