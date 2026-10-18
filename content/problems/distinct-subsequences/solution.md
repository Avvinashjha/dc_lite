## DP

After processing a prefix of `s`, `dp[j]` counts ways to form the first `j` characters of `t`. Initialize `dp[0] = 1` for the empty selection. When characters match, add the ways to form the shorter target prefix.

Update `j` from right to left so the current source character cannot be reused during the same iteration. Different index selections are counted separately.

```javascript
function numDistinct(s, t) {
  const m = s.length,
    n = t.length;
  const dp = Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= m; i++) {
    for (let j = n; j >= 1; j--) {
      if (s[i - 1] === t[j - 1]) dp[j] += dp[j - 1];
    }
  }
  return dp[n];
}
```

**Time:** O(mn) | **Space:** O(n)
