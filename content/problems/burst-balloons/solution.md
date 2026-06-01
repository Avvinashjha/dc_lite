## Interval DP

dp[i][j] = max coins from bursting all balloons between i and j.

```javascript
function maxCoins(nums) {
  const a = [1, ...nums, 1], n = a.length;
  const dp = Array.from({length: n}, () => Array(n).fill(0));
  for (let len = 2; len < n; len++) {
    for (let i = 0; i + len < n; i++) {
      const j = i + len;
      for (let k = i + 1; k < j; k++) {
        dp[i][j] = Math.max(dp[i][j], dp[i][k] + dp[k][j] + a[i]*a[k]*a[j]);
      }
    }
  }
  return dp[0][n-1];
}
```

**Time:** O(n³) | **Space:** O(n²)
