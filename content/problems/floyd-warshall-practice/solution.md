## Approach: Floyd-Warshall

Use three nested loops. For each intermediate vertex `k`, update the shortest path between every pair `(i, j)` by checking if going through `k` gives a shorter distance: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.

```javascript
function floydWarshall(graph) {
  const n = graph.length;
  const dist = graph.map(row => [...row]);
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
  return dist;
}
```

**Time Complexity:** O(V³)

**Space Complexity:** O(V²)
