## Approach: Floyd-Warshall

Compute all-pairs shortest paths using Floyd-Warshall. For each city, count how many other cities are reachable within the threshold. Return the city with the smallest count, breaking ties by largest index.

```javascript
function findTheCityWithTheSmallestNumberOfNeighborsAtAThresholdDistance(n, edges, distanceThreshold) {
  const dist = Array.from({length: n}, () => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) { dist[u][v] = w; dist[v][u] = w; }
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
  let result = -1, minCount = Infinity;
  for (let i = 0; i < n; i++) {
    let count = 0;
    for (let j = 0; j < n; j++) if (i !== j && dist[i][j] <= distanceThreshold) count++;
    if (count <= minCount) { minCount = count; result = i; }
  }
  return result;
}
```

**Time Complexity:** O(n³)

**Space Complexity:** O(n²)
