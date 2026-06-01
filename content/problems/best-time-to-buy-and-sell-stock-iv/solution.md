## DP with State Machine

Use dp[t][0/1] to track max profit after t transactions with/without stock.

```javascript
function maxProfit(k, prices) {
  const n = prices.length;
  if (k >= n / 2) {
    let profit = 0;
    for (let i = 1; i < n; i++) profit += Math.max(0, prices[i] - prices[i-1]);
    return profit;
  }
  const dp = Array.from({length: k+1}, () => [-Infinity, -Infinity]);
  dp[0][0] = 0;
  for (const p of prices) {
    for (let t = k; t >= 1; t--) {
      dp[t][0] = Math.max(dp[t][0], dp[t][1] + p);
      dp[t][1] = Math.max(dp[t][1], dp[t-1][0] - p);
    }
  }
  return Math.max(...dp.map(d => d[0]));
}
```

**Time:** O(nk) | **Space:** O(k)
