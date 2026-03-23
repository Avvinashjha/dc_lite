## DP with Trie

```javascript
function wordBreak(s, wordDict) {
  const set = new Set(wordDict), n = s.length;
  const dp = Array(n+1).fill(false);
  dp[0] = true;
  for (let i=1;i<=n;i++)
    for (let j=0;j<i;j++)
      if (dp[j] && set.has(s.slice(j,i))) { dp[i]=true; break; }
  return dp[n];
}
```

**Time:** O(n² × k) | **Space:** O(n)
