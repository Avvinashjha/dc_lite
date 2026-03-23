Each element can belong to either subset. Use backtracking to explore all partitions of size `n/2` and track the minimum absolute difference between the two subset sums.

```javascript
function tugOfWar(arr) {
  const n = arr.length;
  const half = Math.floor(n / 2);
  const totalSum = arr.reduce((a, b) => a + b, 0);
  let minDiff = Infinity;
  let bestSubset = [];

  function backtrack(idx, count, currentSum, chosen) {
    if (count === half) {
      const diff = Math.abs(totalSum - 2 * currentSum);
      if (diff < minDiff) {
        minDiff = diff;
        bestSubset = [...chosen];
      }
      return;
    }
    if (idx >= n || n - idx < half - count) return;

    chosen.push(arr[idx]);
    backtrack(idx + 1, count + 1, currentSum + arr[idx], chosen);
    chosen.pop();
    backtrack(idx + 1, count, currentSum, chosen);
  }

  backtrack(0, 0, 0, []);
  return { minDiff, bestSubset };
}
```

**Time:** O(2^n)
**Space:** O(n)
