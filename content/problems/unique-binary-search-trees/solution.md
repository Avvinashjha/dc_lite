## Count by Root Choice

Let dp[i] count BST shapes on i ordered keys. Choosing a root leaves j smaller keys on the left and i - 1 - j larger keys on the right. Every left shape can pair with every right shape, contributing dp[j] × dp[i - 1 - j]. Sum over all possible j.

Set dp[0] = 1: an empty child is one valid choice, not zero choices. This is an internal base case even though the problem input starts at n = 1. The largest supported answer, for n = 19, is 1,767,263,190 and is exactly representable by JavaScript Number.

```javascript
function numTrees(n) {
  const dp = Array(n+1).fill(0);
  dp[0] = dp[1] = 1;
  for (let i = 2; i <= n; i++)
    for (let j = 0; j < i; j++)
      dp[i] += dp[j] * dp[i-1-j];
  return dp[n];
}
```

**Time:** O(n²) | **Space:** O(n)
