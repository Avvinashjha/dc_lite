## Approach: DP (Unbounded Knapsack Variant)

`dp[i]` stores the maximum number of segments for rod length `i`. For each length, try cutting with x, y, or z. If the remaining length has a valid solution, update dp[i].

```javascript
function maximizeTheCutSegments(n, x, y, z) {
  const dp = new Array(n + 1).fill(-1);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    for (const cut of [x, y, z]) {
      if (i >= cut && dp[i - cut] !== -1)
        dp[i] = Math.max(dp[i], dp[i - cut] + 1);
    }
  }
  return Math.max(dp[n], 0);
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(n)
