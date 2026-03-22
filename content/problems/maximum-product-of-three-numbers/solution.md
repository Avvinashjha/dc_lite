## Sort and Check Two Cases

Max is either the product of 3 largest or 2 smallest (negative) × largest.

```javascript
function maximumProduct(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  return Math.max(
    nums[n-1] * nums[n-2] * nums[n-3],
    nums[0] * nums[1] * nums[n-1]
  );
}
```

**Time:** O(n log n) | **Space:** O(1)
