## Floyd-Warshall

Compute all-pairs shortest paths, then count reachable cities per node.

```javascript
function findTheCity(n, edges, distanceThreshold) {
  const dist = Array.from({length: n}, () => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) { dist[u][v] = w; dist[v][u] = w; }
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
  let minCount = n, result = 0;
  for (let i = 0; i < n; i++) {
    const count = dist[i].filter(d => d <= distanceThreshold).length - 1;
    if (count <= minCount) { minCount = count; result = i; }
  }
  return result;
}
```

**Time:** O(n³) | **Space:** O(n²)
