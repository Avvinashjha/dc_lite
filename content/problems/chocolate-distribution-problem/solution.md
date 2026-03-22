Sort the array. Then slide a window of size m across the sorted array and find the window where the difference between the last and first element is minimized.

```javascript
function findMinDiff(arr, m) {
  if (m === 0 || arr.length === 0) return 0;
  arr.sort((a, b) => a - b);

  let minDiff = Infinity;
  for (let i = 0; i + m - 1 < arr.length; i++) {
    const diff = arr[i + m - 1] - arr[i];
    minDiff = Math.min(minDiff, diff);
  }

  return minDiff;
}
```

**Time:** O(n log n) for sorting
**Space:** O(1) (ignoring sort space)
