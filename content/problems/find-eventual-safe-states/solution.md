## Reverse Topological Elimination

Start with terminal vertices. Remove their incoming edges in the reversed graph; a predecessor is safe when every outgoing edge has been removed. Vertices trapped in or leading to cycles are never eliminated.

```javascript
function eventualSafeNodes(graph) {
  const n = graph.length,
    reverse = Array.from({ length: n }, () => []),
    degree = graph.map((a) => a.length),
    queue = [];
  graph.forEach((edges, u) => edges.forEach((v) => reverse[v].push(u)));
  for (let u = 0; u < n; u++) if (degree[u] === 0) queue.push(u);
  for (let head = 0; head < queue.length; head++)
    for (const u of reverse[queue[head]]) if (--degree[u] === 0) queue.push(u);
  return degree.flatMap((d, u) => (d === 0 ? [u] : []));
}
```

**Time:** O(V + E) | **Space:** O(V + E)
