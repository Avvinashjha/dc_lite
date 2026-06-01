## Approach: Dynamic Programming

`dp[i][j]` represents the side length of the largest square whose bottom-right corner is at `(i,j)`. If `matrix[i][j]` is '1', `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1`. The answer is the maximum dp value squared.

```javascript
function maximalSquare(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));
  let max = 0;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      if (matrix[i-1][j-1] === "1") {
        dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
        max = Math.max(max, dp[i][j]);
      }
  return max * max;
}
```

**Time Complexity:** O(m × n)

**Space Complexity:** O(m × n)
