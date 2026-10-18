## Dynamic programming with binary search

Sort by end time. Let `dp[i]` be the maximum profit obtainable from jobs `0` through `i` in that sorted order.

For each job, either skip it and keep `dp[i - 1]`, or take its profit plus the best profit before it starts. Binary search finds the last earlier job whose end is **less than or equal to** the current start. If no earlier job is compatible, taking this job contributes only its own profit.

```javascript
function maxProfit(jobs) {
  jobs.sort((a, b) => a[1] - b[1]);
  const n = jobs.length;
  const dp = Array(n).fill(0);
  dp[0] = jobs[0][2];

  function findLast(i) {
    let low = 0, high = i - 1, result = -1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (jobs[mid][1] <= jobs[i][0]) {
        result = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return result;
  }

  for (let i = 1; i < n; i++) {
    const previous = findLast(i);
    const take = jobs[i][2] + (previous === -1 ? 0 : dp[previous]);
    dp[i] = Math.max(dp[i - 1], take);
  }
  return dp[n - 1];
}
```

**Time:** O(n log n), including sorting and binary searches.

**Space:** O(n) for the DP array and typical sorting workspace. The reference sorts the input array in place. The maximum total profit is `10^9`, safely within JavaScript's exact integer range.
