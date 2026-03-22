## Approach: Sort + Median

Sort the array and pick the median element as the target. The median minimizes the sum of absolute deviations. Compute the total cost as the sum of absolute differences from the median.

```javascript
function makeAllArrayElementsEqualWithMinimumCost(arr) {
  arr.sort((a, b) => a - b);
  const median = arr[Math.floor(arr.length / 2)];
  return arr.reduce((sum, x) => sum + Math.abs(x - median), 0);
}
```

**Time Complexity:** O(n log n)

**Space Complexity:** O(1)
