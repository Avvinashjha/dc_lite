## Bitmask DP (Held-Karp)

```javascript
function tsp(dist) {
  const n = dist.length, ALL = (1<<n)-1;
  const dp = Array.from({length:1<<n}, ()=>Array(n).fill(Infinity));
  dp[1][0] = 0;
  for (let mask=1;mask<=ALL;mask++) {
    for (let u=0;u<n;u++) {
      if (!(mask&(1<<u)) || dp[mask][u]===Infinity) continue;
      for (let v=0;v<n;v++) {
        if (mask&(1<<v)) continue;
        const next = mask|(1<<v);
        dp[next][v] = Math.min(dp[next][v], dp[mask][u]+dist[u][v]);
      }
    }
  }
  let min = Infinity;
  for (let u=0;u<n;u++) min = Math.min(min, dp[ALL][u]+dist[u][0]);
  return min;
}
```

**Time:** O(2^n × n²) | **Space:** O(2^n × n)
