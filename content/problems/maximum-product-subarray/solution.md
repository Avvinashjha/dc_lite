## Track Min and Max

Maintain the smallest and largest products of subarrays ending at the current position. For each value, either start a new subarray or extend a previous one. A negative value can turn the previous minimum into the new maximum, so keep both. Save the previous maximum before updating either state. A zero naturally resets both ending products to zero; the next position may start fresh.

```javascript
function maxProduct(nums) {
  let max = nums[0], curMax = nums[0], curMin = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const temp = curMax;
    curMax = Math.max(nums[i], nums[i] * curMax, nums[i] * curMin);
    curMin = Math.min(nums[i], nums[i] * temp, nums[i] * curMin);
    max = Math.max(max, curMax);
  }
  return max;
}
```

**Time:** O(n) | **Space:** O(1)
