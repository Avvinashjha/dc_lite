## Monotonic Stack (Greedy)

Keep a decreasing stack of unresolved leaf maxima, preceded by an Infinity sentinel. When a new value is at least the stack top, that smaller value can be paired with the smaller of its two available larger neighbors. Pay their product and remove the smaller value: it will no longer be the maximum of any later merged group. Deferring that pairing cannot offer a smaller partner while preserving leaf order.

After the scan, pair the remaining decreasing maxima from right to left. Each value is pushed once and removed once, giving linear time. The sentinel is never included in a cost.

```javascript
function mctFromLeafValues(arr) {
  let cost = 0;
  const stack = [Infinity];
  for (const val of arr) {
    while (stack[stack.length-1] <= val) {
      const mid = stack.pop();
      cost += mid * Math.min(stack[stack.length-1], val);
    }
    stack.push(val);
  }
  while (stack.length > 2) cost += stack.pop() * stack[stack.length-1];
  return cost;
}
```

**Time:** O(n) | **Space:** O(n)
