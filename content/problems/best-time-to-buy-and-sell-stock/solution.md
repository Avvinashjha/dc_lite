Track the minimum price seen so far as you iterate. At each step, compute the profit if you sold today and update the maximum profit accordingly.

```javascript
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }

  return maxProfit;
}
```

**Time:** O(n)
**Space:** O(1)
