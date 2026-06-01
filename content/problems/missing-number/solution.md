## XOR or Math

```javascript
function missingNumber(nums) {
  const n = nums.length;
  return n * (n + 1) / 2 - nums.reduce((a, b) => a + b, 0);
}
```

**Time:** O(n) | **Space:** O(1)
