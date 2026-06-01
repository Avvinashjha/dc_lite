Iterate through prices and add every positive difference between consecutive days to the total profit. This captures every upward movement.

```javascript
function maxProfit(prices) {
  let profit = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }

  return profit;
}
```

**Time:** O(n)
**Space:** O(1)
