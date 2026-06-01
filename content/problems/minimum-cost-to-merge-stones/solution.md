## Interval DP

```javascript
function mergeStones(stones, k) {
  const n = stones.length;
  if ((n-1) % (k-1) !== 0) return -1;
  const prefix = [0]; for (const s of stones) prefix.push(prefix[prefix.length-1]+s);
  const dp = Array.from({length:n}, ()=>Array(n).fill(0));
  for (let len = k; len <= n; len++)
    for (let i = 0; i+len-1 < n; i++) {
      const j = i+len-1; dp[i][j] = Infinity;
      for (let mid = i; mid < j; mid += k-1)
        dp[i][j] = Math.min(dp[i][j], dp[i][mid]+dp[mid+1][j]);
      if ((len-1)%(k-1)===0) dp[i][j] += prefix[j+1]-prefix[i];
    }
  return dp[0][n-1];
}
```

**Time:** O(n³/k) | **Space:** O(n²)
