Since all values are in the range [1, n], use them as indices. For each number, negate the value at that index. If the value is already negative, the number is a duplicate.

```javascript
function findDuplicates(nums) {
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    const idx = Math.abs(nums[i]) - 1;
    if (nums[idx] < 0) {
      result.push(idx + 1);
    } else {
      nums[idx] = -nums[idx];
    }
  }

  return result;
}
```

**Time:** O(n)
**Space:** O(1) (output array not counted)
