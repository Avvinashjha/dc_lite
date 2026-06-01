## Binary Search

```javascript
function ceiling(arr, x) {
  let lo = 0, hi = arr.length - 1, result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] >= x) { result = arr[mid]; hi = mid - 1; }
    else lo = mid + 1;
  }
  return result;
}
```

**Time:** O(log n) | **Space:** O(1)
