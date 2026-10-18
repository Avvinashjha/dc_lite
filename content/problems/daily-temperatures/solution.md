## Monotonic Stack

Maintain unresolved day indices with non-increasing temperatures; equal readings stay on the stack. A strictly warmer reading resolves each cooler top index. Every index is pushed once and popped at most once, giving linear total work.

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
