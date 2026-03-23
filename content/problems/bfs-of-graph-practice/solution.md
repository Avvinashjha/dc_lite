## Standard BFS

Use a queue and visited set to traverse level by level.

```javascript
function bfsOfGraph(adj) {
  const visited = new Set([0]), q = [0], result = [];
  while (q.length) {
    const node = q.shift();
    result.push(node);
    for (const next of adj[node]) {
      if (!visited.has(next)) { visited.add(next); q.push(next); }
    }
  }
  return result;
}
```

**Time:** O(V + E) | **Space:** O(V)
