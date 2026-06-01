## Approach: Sort + Two Pointers

Sort the array first. Then iterate through each element as the first number of the triplet. For each fixed first number, use two pointers (left and right) to find pairs that sum to the negative of the first number.

Skip duplicate values at each step to avoid duplicate triplets.

```javascript
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}
```

**Time Complexity:** O(n^2) — sorting is O(n log n), the nested loop is O(n^2).

**Space Complexity:** O(1) extra space (ignoring the output array).
