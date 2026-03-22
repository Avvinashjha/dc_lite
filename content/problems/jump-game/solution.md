Iterate through the array while maintaining the farthest index you can reach. If you ever land on an index beyond your current reach, return false. Otherwise, update your reach as `max(maxReach, i + nums[i])`.

```javascript
function canJump(nums) {
  let maxReach = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }

  return true;
}
```

**Time:** O(n)
**Space:** O(1)
