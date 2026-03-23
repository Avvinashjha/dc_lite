## Bottom-Up DP

dp[i] = minimum coins for amount i.

```javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}
```

**Time:** O(amount × coins) | **Space:** O(amount)
