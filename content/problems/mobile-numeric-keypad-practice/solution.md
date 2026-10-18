## DP with Adjacency Map

Let dp[d] count sequences of the current length ending at digit d. Initially every digit has one length-1 sequence. To add a press ending at d, sum counts from d itself and its valid neighboring keys. Build a fresh array for each length so transitions all use the previous length. The adjacency map includes staying on the same key.

At n = 25 the total is 1217034591721250, below Number.MAX_SAFE_INTEGER, so all additions remain exact under the published bounds.

```javascript
function getCount(n) {
  const adj = {0:[0,8],1:[1,2,4],2:[2,1,3,5],3:[3,2,6],4:[4,1,5,7],5:[5,2,4,6,8],6:[6,3,5,9],7:[7,4,8],8:[8,5,7,9,0],9:[9,6,8]};
  let dp = Array(10).fill(1);
  for (let i = 2; i <= n; i++) {
    const next = Array(10).fill(0);
    for (let d = 0; d <= 9; d++) for (const prev of adj[d]) next[d] += dp[prev];
    dp = next;
  }
  return dp.reduce((a,b) => a+b, 0);
}
```

**Time:** O(n) | **Space:** O(1)
