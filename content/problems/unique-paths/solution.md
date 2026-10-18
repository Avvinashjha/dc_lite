## One-row dynamic programming

The first row and first column each have one path to every cell. For an interior cell, every path arrives from above or from the left, so add those two counts.

Before updating `dp[j]`, it stores the count from the previous row (above). The already-updated `dp[j - 1]` stores the count from the current row (left). After the last row, `dp[n - 1]` is the answer. All intermediate counts fit the stated answer bound.

```javascript
function uniquePaths(m, n) {
  const dp = Array(n).fill(1);
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      dp[j] += dp[j-1];
  return dp[n-1];
}
```

**Time:** O(mn) | **Space:** O(n)
