## DP with State Machine

`dp[t][0]` stores the best cash balance after exactly t completed sales with no stock held. `dp[t][1]` stores the best balance while holding the stock for transaction t (after t - 1 completed sales).

For each price, either keep each state or sell/buy. Update transaction counts in descending order so a purchase uses the preceding day’s lower-transaction state. The answer is the best cash balance over 0 through k completed sales. When k is large enough, collect every positive consecutive price difference.

```javascript
function maxProfit(k, prices) {
  const n = prices.length;
  if (k >= n / 2) {
    let profit = 0;
    for (let i = 1; i < n; i++) profit += Math.max(0, prices[i] - prices[i - 1]);
    return profit;
  }
  const dp = Array.from({ length: k + 1 }, () => [-Infinity, -Infinity]);
  dp[0][0] = 0;
  for (const p of prices) {
    for (let t = k; t >= 1; t--) {
      dp[t][0] = Math.max(dp[t][0], dp[t][1] + p);
      dp[t][1] = Math.max(dp[t][1], dp[t - 1][0] - p);
    }
  }
  return Math.max(...dp.map((d) => d[0]));
}
```

**Time:** O(nk) | **Space:** O(k)
