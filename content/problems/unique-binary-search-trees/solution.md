## Catalan Number / DP

```javascript
function numTrees(n) {
  const dp = Array(n+1).fill(0);
  dp[0] = dp[1] = 1;
  for (let i = 2; i <= n; i++)
    for (let j = 0; j < i; j++)
      dp[i] += dp[j] * dp[i-1-j];
  return dp[n];
}
```

**Time:** O(n²) | **Space:** O(n)
