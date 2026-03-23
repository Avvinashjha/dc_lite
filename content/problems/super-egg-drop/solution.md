## DP: Moves-based approach

dp[m][k] = max floors checkable with m moves and k eggs.

```javascript
function superEggDrop(k, n) {
  const dp = Array.from({length:n+1}, ()=>Array(k+1).fill(0));
  let m = 0;
  while (dp[m][k] < n) {
    m++;
    for (let j = 1; j <= k; j++) dp[m][j] = dp[m-1][j-1] + dp[m-1][j] + 1;
  }
  return m;
}
```

**Time:** O(kn) | **Space:** O(kn)
