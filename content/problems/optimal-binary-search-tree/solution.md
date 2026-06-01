## DP (Knuth's Optimization)

```javascript
function optimalBST(keys, freq) {
  const n = keys.length;
  const dp = Array.from({length:n}, ()=>Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = freq[i];
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      let sum = 0; for (let k = i; k <= j; k++) sum += freq[k];
      for (let r = i; r <= j; r++) {
        const cost = sum + (r>i?dp[i][r-1]:0) + (r<j?dp[r+1][j]:0);
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }
  return dp[0][n-1];
}
```

**Time:** O(n³) | **Space:** O(n²)
