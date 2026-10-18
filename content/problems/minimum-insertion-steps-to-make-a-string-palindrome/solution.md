## LCS with Reverse

Keep a longest palindromic subsequence of length L unchanged and supply matching characters for the other n - L characters. The minimum insertion count is n - L. The length L equals the longest common subsequence length of s and its reverse; contiguity is not required.

Compute that length row by row. A match extends the previous row’s diagonal; a mismatch chooses the best result from skipping one character in either string. Copying the prior row before updating keeps those dependencies intact.

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
