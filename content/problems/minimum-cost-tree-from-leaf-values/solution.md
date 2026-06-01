## Monotonic Stack (Greedy)

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
