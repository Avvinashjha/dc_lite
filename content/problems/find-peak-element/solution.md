## Approach: Binary Search

Compare the middle element with its right neighbor. If `nums[mid] > nums[mid + 1]`, keep the left half including `mid`; otherwise keep the right half. The retained interval has a rising boundary on its left and a falling boundary on its right (using negative infinity outside the original array), so it contains a peak. The whole interval need not be sorted.

```javascript
function findPeakElement(nums) {
  let left = 0,
    right = nums.length - 1;
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
