## Approach: Dynamic Programming

Create a 2D DP table where `dp[i][j]` stores the length of the longest common suffix ending at `s1[i-1]` and `s2[j-1]`. If characters match, `dp[i][j] = dp[i-1][j-1] + 1`. Track the maximum value seen.

```javascript
function longestCommonSubstring(s1, s2) {
  const m = s1.length, n = s2.length;
  let max = 0;
  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      if (s1[i-1] === s2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
        max = Math.max(max, dp[i][j]);
      }
  return max;
}
```

**Time Complexity:** O(m × n)

**Space Complexity:** O(m × n)
