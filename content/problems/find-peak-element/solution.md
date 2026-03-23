## Approach: Binary Search

Compare the middle element with its right neighbor. If `nums[mid] > nums[mid + 1]`, a peak must exist in the left half (including mid) since values are decreasing. Otherwise, a peak exists in the right half. The boundary conditions guarantee at least one peak on each side of any descent.

```javascript
function findPeakElement(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = (left + right) >> 1;
    if (nums[mid] > nums[mid + 1]) right = mid;
    else left = mid + 1;
  }
  return left;
}
```

**Time Complexity:** O(log n)

**Space Complexity:** O(1)
