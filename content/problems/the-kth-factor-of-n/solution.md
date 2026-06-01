## Simple Iteration

```javascript
function kthFactor(n, k) {
  for (let i = 1; i <= n; i++) {
    if (n % i === 0 && --k === 0) return i;
  }
  return -1;
}
```

**Time:** O(n) | **Space:** O(1)
