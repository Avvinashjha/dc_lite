## Math Insight

Incrementing n-1 elements by 1 is equivalent to decrementing 1 element by 1. Answer = sum - n * min.

```javascript
function minMoves(nums) {
  const min = Math.min(...nums);
  return nums.reduce((sum, n) => sum + n - min, 0);
}
```

**Time:** O(n) | **Space:** O(1)
