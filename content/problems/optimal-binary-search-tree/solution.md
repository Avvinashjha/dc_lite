## Interval Dynamic Programming

Let `dp[i][j]` be the minimum search cost for keys in the inclusive interval `[i, j]`, measured with that subtree's root at level 1. A single key costs its frequency; an empty interval costs zero.

Try each key `r` in the interval as its root. BST ordering fixes the left keys to `[i, r - 1]` and the right keys to `[r + 1, j]`. Attaching either subtree increases every key's level by one. Adding the sum of all frequencies in the interval accounts for those increases and the root's own level-1 cost:

`cost = sum(freq[i..j]) + dp[i][r - 1] + dp[r + 1][j]`.

Take the smallest cost over all roots. Process shorter intervals first so both subproblems are ready. The key values themselves do not enter the cost calculation; their sorted order determines the allowed subtrees.

```javascript
function optimalBST(keys, freq) {
  const n = keys.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = freq[i];
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      let sum = 0;
      for (let k = i; k <= j; k++) sum += freq[k];
      for (let r = i; r <= j; r++) {
        const cost =
          sum + (r > i ? dp[i][r - 1] : 0) + (r < j ? dp[r + 1][j] : 0);
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }
  return dp[0][n - 1];
}
```

**Time:** O(n³) | **Space:** O(n²)
