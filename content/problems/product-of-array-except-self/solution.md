## Left and Right Products

Every answer is the product of the entries strictly before its index and the entries strictly after it.

In a left-to-right pass, store the product of all earlier entries in `result[i]`, then include `nums[i]` in the running prefix. In a right-to-left pass, multiply `result[i]` by the product of all later entries, then include `nums[i]` in the running suffix. Updating after using each product excludes the current index.

Initialize both running products to `1`, the product of an empty side. Zeros and negative values work through ordinary multiplication without division or special-case branches. The input is not modified.

```javascript
function productExceptSelf(nums) {
  const n = nums.length,
    result = Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}
```

**Time:** O(n) | **Space:** O(1) auxiliary space, plus O(n) for the returned array.
