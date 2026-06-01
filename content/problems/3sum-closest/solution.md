Sort the array and use a two-pointer approach similar to 3Sum. For each element, set two pointers at the remaining range and move them inward. Track the sum with the smallest absolute difference from the target.

```javascript
function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let closest = nums[0] + nums[1] + nums[2];

  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (Math.abs(sum - target) < Math.abs(closest - target)) {
        closest = sum;
      }
      if (sum < target) left++;
      else if (sum > target) right--;
      else return sum;
    }
  }

  return closest;
}
```

**Time:** O(n²)
**Space:** O(1) (ignoring sort space)
