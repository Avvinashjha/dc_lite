## Approach: DP with Adjacency Map

Define the valid knight moves for each digit. For each step, accumulate the count of ways to reach each digit from its valid predecessor digits. Use a DP array that is updated iteratively.

```javascript
function knightDialer(n) {
  const MOD = 1e9 + 7;
  const moves = {0:[4,6],1:[6,8],2:[7,9],3:[4,8],4:[0,3,9],5:[],6:[0,1,7],7:[2,6],8:[1,3],9:[2,4]};
  let dp = new Array(10).fill(1);
  for (let i = 1; i < n; i++) {
    const next = new Array(10).fill(0);
    for (let d = 0; d <= 9; d++)
      for (const m of moves[d]) next[d] = (next[d] + dp[m]) % MOD;
    dp = next;
  }
  return dp.reduce((a, b) => (a + b) % MOD, 0);
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(1)
