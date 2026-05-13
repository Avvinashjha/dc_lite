## Iterative

```javascript
function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

**Time:** O(log n) &nbsp; **Space:** O(1)

## Recursive

```javascript
function search(nums, target) {
  function dfs(lo, hi) {
    if (lo > hi) return -1;
    const mid = (lo + hi) >>> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) return dfs(mid + 1, hi);
    return dfs(lo, mid - 1);
  }
  return dfs(0, nums.length - 1);
```

**Space:** O(log n) stack.
