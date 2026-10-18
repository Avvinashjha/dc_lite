## Bitmask Dynamic Programming

Fix city 0 as the start. A mask records visited cities 1 through n - 1, and dp[mask, u] records the cheapest path ending at city u + 1. Extend each reachable state to every unvisited city. Once all cities have been visited, add the cost of returning to city 0.

Use one flat typed array instead of an array for every subset. Excluding city 0 from the mask halves the subset count; the table occupies about 40 MB at n = 20. Unreachable states use a sentinel larger than any possible tour cost.

```javascript
function tsp(dist) {
  const n = dist.length;
  if (n === 1) return 0;
  const m = n - 1, states = 1 << m, all = states - 1;
  const infinity = 0xffffffff;
  const dp = new Uint32Array(states * m);
  dp.fill(infinity);
  for (let u = 0; u < m; u++) dp[(1 << u) * m + u] = dist[0][u + 1];
  for (let mask = 1; mask < states; mask++) {
    for (let ends = mask; ends; ends &= ends - 1) {
      const u = 31 - Math.clz32(ends & -ends);
      const cost = dp[mask * m + u];
      if (cost === infinity) continue;
      for (let remaining = all ^ mask; remaining; remaining &= remaining - 1) {
        const bit = remaining & -remaining;
        const v = 31 - Math.clz32(bit);
        const index = (mask | bit) * m + v;
        const next = cost + dist[u + 1][v + 1];
        if (next < dp[index]) dp[index] = next;
      }
    }
  }
  let answer = infinity;
  for (let u = 0; u < m; u++) {
    answer = Math.min(answer, dp[all * m + u] + dist[u + 1][0]);
  }
  return answer;
}
```

**Time:** O(2^n × n²). **Space:** O(2^n × n).
