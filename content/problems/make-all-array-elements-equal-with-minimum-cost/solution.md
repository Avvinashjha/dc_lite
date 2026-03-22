## Median Minimizes Absolute Deviations

```javascript
function minCost(arr) {
  arr.sort((a, b) => a - b);
  const median = arr[Math.floor(arr.length / 2)];
  return arr.reduce((sum, x) => sum + Math.abs(x - median), 0);
}
```

**Time:** O(n log n) | **Space:** O(1)
