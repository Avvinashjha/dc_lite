## Approach: Sort + Median

Copy and sort the array, then pick the median element as the target. The median minimizes the sum of absolute deviations. For an even number of elements, any value between the two middle values is optimal; choosing the upper median suffices. Moving the target toward the middle decreases the distances on the larger side at least as fast as it increases distances on the smaller side. Compute the total cost as the sum of absolute differences from the median.

```javascript
function makeAllArrayElementsEqualWithMinimumCost(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return arr.reduce((sum, x) => sum + Math.abs(x - median), 0);
}
```

**Time Complexity:** O(n log n)

**Space Complexity:** O(n) for the sorted copy and sorting workspace.
