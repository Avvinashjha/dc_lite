## Interval DP

Every merge reduces the pile count by k - 1, so one pile is reachable only when (n - 1) is divisible by k - 1.

Let dp[i][j] be the minimum cost to reduce that interval to the smallest feasible number of piles: 1 + ((j - i) % (k - 1)). Intervals shorter than k need no merge. Try split points in steps of k - 1 so the left interval can become one pile. If the full interval can become one pile, add its total stone count for the final merge; prefix sums provide that total in O(1).

```javascript
function mergeStones(stones, k) {
  const n = stones.length;
  if ((n-1) % (k-1) !== 0) return -1;
  const prefix = [0]; for (const s of stones) prefix.push(prefix[prefix.length-1]+s);
  const dp = Array.from({length:n}, ()=>Array(n).fill(0));
  for (let len = k; len <= n; len++)
    for (let i = 0; i+len-1 < n; i++) {
      const j = i+len-1; dp[i][j] = Infinity;
      for (let mid = i; mid < j; mid += k-1)
        dp[i][j] = Math.min(dp[i][j], dp[i][mid]+dp[mid+1][j]);
      if ((len-1)%(k-1)===0) dp[i][j] += prefix[j+1]-prefix[i];
    }
  return dp[0][n-1];
}
```

**Time:** O(n² + n³/(k - 1)) | **Space:** O(n²)
