## Monotonic Stack

Maintain a decreasing stack of indices.

```javascript
function dailyTemperatures(temperatures) {
  const n = temperatures.length, ans = Array(n).fill(0), stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length-1]]) {
      const j = stack.pop(); ans[j] = i - j;
    }
    stack.push(i);
  }
  return ans;
}
```

**Time:** O(n) | **Space:** O(n)
