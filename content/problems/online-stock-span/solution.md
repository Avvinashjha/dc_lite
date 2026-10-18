## Monotonic Stack

Store pairs `[price, span]` in a stack with strictly decreasing prices. Each pair represents a consecutive block of days already known to have prices no greater than that pair's price.

Start today's span at one. While the top price is no greater than today's price, remove that pair and add its entire span. These blocks are consecutive, so they can be absorbed without scanning their individual days. The first remaining pair, if any, has a higher price and stops the span. Push today's combined block and return its size.


```javascript
class StockSpanner {
  constructor() {
    this.stack = [];
  }
  next(price) {
    let span = 1;
    while (this.stack.length && this.stack[this.stack.length - 1][0] <= price)
      span += this.stack.pop()[1];
    this.stack.push([price, span]);
    return span;
  }
}
```

**Time:** O(1) amortized per call, O(n) for n calls; one call may take O(n). Each pair is pushed once and popped at most once.

**Space:** O(n) in the worst case of strictly decreasing prices.
