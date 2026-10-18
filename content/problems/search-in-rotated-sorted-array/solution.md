## Binary Search on the Sorted Half

Check the midpoint first. If it does not match, at least one side of the current interval is sorted because there is at most one rotation break.

When `nums[lo] <= nums[mid]`, the left half is sorted. Keep it only if `nums[lo] <= target < nums[mid]`; otherwise search the right half. If the left half is not sorted, the right half must be, so keep it only if `nums[mid] < target <= nums[hi]`.

The midpoint is excluded after checking it, ensuring progress even for one- and two-element intervals. Each iteration discards at least half the candidates. Distinct values make the sorted-half test unambiguous; duplicate-valued inputs would require different handling.

```javascript
function search(nums, target) {
  let lo = 0,
    hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
```

**Time:** O(log n) | **Space:** O(1)
