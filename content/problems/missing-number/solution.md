## Expected Sum Minus Actual Sum

The complete range 0 through n sums to n(n + 1) / 2. Since the input contains each other value exactly once, subtracting its sum leaves the missing value. Neither sorting nor mutation is needed. Under n <= 10000, the expected sum is at most 50005000, exactly representable by JavaScript Number.

```javascript
function missingNumber(nums) {
  const n = nums.length;
  return n * (n + 1) / 2 - nums.reduce((a, b) => a + b, 0);
}
```

**Time:** O(n) | **Space:** O(1)
