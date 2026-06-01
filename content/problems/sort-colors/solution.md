Use the Dutch National Flag algorithm with three pointers — `low`, `mid`, and `high` — to sort the array in a single pass. Swap 0s to the front, 2s to the back, and leave 1s in the middle.

```javascript
function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}
```

**Time:** O(n)
**Space:** O(1)
