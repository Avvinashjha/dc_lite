## Approach: Sort and Compare

Sort the array. The maximum product is either from the three largest numbers, or from the two smallest (most negative) numbers multiplied by the largest. Compare both candidates.

```javascript
function maximumProductOfThreeNumbers(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  return Math.max(
    nums[n-1] * nums[n-2] * nums[n-3],
    nums[0] * nums[1] * nums[n-1]
  );
}
```

**Time Complexity:** O(n log n)

**Space Complexity:** O(1)
