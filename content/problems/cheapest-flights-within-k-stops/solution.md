## Bellman-Ford (K+1 iterations)

Relax edges k + 1 times. Read only from the previous pass and write into a copied array so each pass adds at most one flight; in-place updates could accidentally use too many stops.

```javascript
function findCheapestPrice(n, flights, src, dst, k) {
  let prices = Array(n).fill(Infinity);
  prices[src] = 0;
  for (let i = 0; i <= k; i++) {
    const temp = [...prices];
    for (const [u, v, w] of flights) {
      if (prices[u] !== Infinity) temp[v] = Math.min(temp[v], prices[u] + w);
    }
    prices = temp;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}
```

**Time:** O((k + 1) × (n + E)), including the price-array copy each pass.
**Space:** O(n)
