## 2D Knapsack DP

Let `dp[i][j]` be the largest number of processed strings that fit within `i` zeros and `j` ones. Initially every value is zero, representing the empty selection.

For a string containing `zeros` zeros and `ones` ones, either skip it or add it to a selection using the remaining budgets: `dp[i - zeros][j - ones] + 1`.

Visit both budgets in descending order. This keeps the source state from including the current entry, so one string cannot be selected repeatedly. Descending order also handles strings containing only zeros or only ones. Duplicate entries are processed separately and may each be chosen.

```javascript
function findMaxForm(strs, m, n) {
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (const s of strs) {
    let zeros = 0;
    for (const char of s) if (char === "0") zeros++;
    const ones = s.length - zeros;
    for (let i = m; i >= zeros; i--)
      for (let j = n; j >= ones; j--)
        dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
  }
  return dp[m][n];
}
```

**Time:** O(C + S × m × n), where C is total input characters and S is the number of strings | **Space:** O(m × n)
