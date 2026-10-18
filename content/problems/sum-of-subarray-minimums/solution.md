## Monotonic Stack (Contribution)

Count how many subarrays assign their minimum to each index j. Its left boundary is the nearest strictly smaller value; its right boundary is the nearest smaller-or-equal value. There are left × right choices of endpoints, contributing arr[j] × left × right.

The asymmetric comparisons are essential: when minimum values tie, this rule assigns the subarray to its rightmost minimum exactly once. Pop on greater-or-equal values to enforce that convention. A final sentinel iteration flushes the remaining stack without reading beyond the array.

Each index is pushed and popped once. Under the stated limits, contribution products are below JavaScript's maximum safe integer, so Number arithmetic is exact before taking the modulo.

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
