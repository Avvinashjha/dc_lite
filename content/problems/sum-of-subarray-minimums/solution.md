## Monotonic Stack (Contribution)

```javascript
function sumSubarrayMins(arr) {
  const MOD = 1e9+7, n = arr.length, stack = [];
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    while (stack.length && (i===n || arr[stack[stack.length-1]] >= arr[i])) {
      const j = stack.pop();
      const left = stack.length ? j - stack[stack.length-1] : j + 1;
      const right = i - j;
      sum = (sum + arr[j] * left * right) % MOD;
    }
    stack.push(i);
  }
  return sum;
}
```

**Time:** O(n) | **Space:** O(n)
