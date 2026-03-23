Use two pointers. A slow pointer tracks the position for the next non-zero element, while a fast pointer scans through the array. Swap non-zero elements forward to maintain relative order.

```javascript
function moveZeroes(nums) {
  let slow = 0;

  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
  }
}
```

**Time:** O(n)
**Space:** O(1)
