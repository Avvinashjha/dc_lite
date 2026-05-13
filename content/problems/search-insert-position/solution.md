## Lower bound (half-open interval)

```javascript
function searchInsert(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

**Time:** O(log n) &nbsp; **Space:** O(1)

When `target` exists, `lo` lands on its first index. When it does not, `lo` is the insert position.
