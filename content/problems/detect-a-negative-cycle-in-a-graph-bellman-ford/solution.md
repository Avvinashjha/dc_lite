## Bellman-Ford

Initialize every distance to zero, equivalent to adding a virtual source with zero-weight edges to all vertices. This includes disconnected components. Run V - 1 relaxation passes, then check whether any edge can still reduce a distance.

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

**Time:** O(V + V × E), including initialization | **Space:** O(V)
