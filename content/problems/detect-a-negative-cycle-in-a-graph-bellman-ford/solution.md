## Bellman-Ford

Run V-1 relaxations, then check if any edge can still be relaxed.

```javascript
function hasNegativeCycle(V, edges) {
  // A virtual source reaches every component with a zero-weight edge.
  const dist = Array(V).fill(0);
  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) return true;
  }
  return false;
}
```

**Time:** O(V × E) | **Space:** O(V)
