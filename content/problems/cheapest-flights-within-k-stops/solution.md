## Bellman-Ford (K+1 iterations)

Relax edges K+1 times to find shortest path with at most K stops.

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

**Time:** O(k * E) | **Space:** O(n)
