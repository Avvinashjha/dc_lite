## LCS with Reverse

Answer = n - LPS length (longest palindromic subsequence = LCS(s, reverse(s))).

```javascript
function minInsertions(s) {
  const n = s.length, t = s.split('').reverse().join('');
  const dp = Array(n+1).fill(0);
  for (let i = 1; i <= n; i++) {
    const prev = [...dp];
    for (let j = 1; j <= n; j++)
      dp[j] = s[i-1]===t[j-1] ? prev[j-1]+1 : Math.max(dp[j-1], prev[j]);
  }
  return n - dp[n];
}
```

**Time:** O(n²) | **Space:** O(n)
