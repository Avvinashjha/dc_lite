## Three-Way Partitioning

The processed prefix contains zeros, the next region contains ones, and the processed suffix contains twos. The middle region remains unclassified. After swapping a two to the end, keep the middle pointer in place: the incoming value still needs inspection. Each iteration shrinks the unclassified region by one.

```javascript
function sortColors(nums) {
  let lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) { [nums[lo], nums[mid]] = [nums[mid], nums[lo]]; lo++; mid++; }
    else if (nums[mid] === 1) mid++;
    else { [nums[mid], nums[hi]] = [nums[hi], nums[mid]]; hi--; }
  }
}
```

**Time:** O(n) | **Space:** O(1)
