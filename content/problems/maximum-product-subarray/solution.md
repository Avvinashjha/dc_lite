## Track Min and Max

Maintain current min and max products (a negative min can become max when multiplied by negative).

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
