## Interval DP

dp[i][j] = count of unique palindromic subsequences in s[i..j].

```javascript
function countPalindromicSubsequences(s) {
  const MOD = 1e9 + 7, n = s.length;
  const dp = Array.from({length: n}, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        let lo = i + 1, hi = j - 1;
        while (lo <= hi && s[lo] !== s[i]) lo++;
        while (lo <= hi && s[hi] !== s[i]) hi--;
        if (lo > hi) dp[i][j] = dp[i+1][j-1] * 2 + 2;
        else if (lo === hi) dp[i][j] = dp[i+1][j-1] * 2 + 1;
        else dp[i][j] = dp[i+1][j-1] * 2 - dp[lo+1][hi-1];
      } else {
        dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1];
      }
      dp[i][j] = ((dp[i][j] % MOD) + MOD) % MOD;
    }
  }
  return dp[0][n-1];
}
```

**Time:** O(n²) | **Space:** O(n²)
