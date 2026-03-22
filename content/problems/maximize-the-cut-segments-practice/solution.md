## DP

```javascript
function maximizeCuts(n, x, y, z) {
  const dp = Array(n+1).fill(-1);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    for (const len of [x, y, z]) {
      if (i >= len && dp[i-len] !== -1) dp[i] = Math.max(dp[i], dp[i-len]+1);
    }
  }
  return Math.max(dp[n], 0);
}
```

**Time:** O(n) | **Space:** O(n)
