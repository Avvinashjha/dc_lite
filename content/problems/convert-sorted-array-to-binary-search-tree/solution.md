## Recursive Mid-Point

Pick the middle element as root, recurse on left and right halves.

```javascript
function sortedArrayToBST(nums) {
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    return { val: nums[mid], left: build(lo, mid-1), right: build(mid+1, hi) };
  }
  return build(0, nums.length - 1);
}
```

**Time:** O(n) | **Space:** O(log n)
