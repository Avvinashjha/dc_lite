## 2D Knapsack DP

```javascript
function findMaxForm(strs, m, n) {
  const dp = Array.from({length: m+1}, () => Array(n+1).fill(0));
  for (const s of strs) {
    const zeros = [...s].filter(c => c==='0').length;
    const ones = s.length - zeros;
    for (let i = m; i >= zeros; i--)
      for (let j = n; j >= ones; j--)
        dp[i][j] = Math.max(dp[i][j], dp[i-zeros][j-ones] + 1);
  }
  return dp[m][n];
}
```

**Time:** O(L × m × n) | **Space:** O(m × n)
