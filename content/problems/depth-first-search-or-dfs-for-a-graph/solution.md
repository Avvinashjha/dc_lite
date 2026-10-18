## Iterative DFS

Push neighbors in reverse order so they are visited in the original adjacency-list order. Mark a vertex when it is popped for its first visit; later duplicate stack entries are skipped.

```javascript
function dfsOfGraph(adj) {
  const visited = new Set(),
    stack = [0],
    result = [];
  while (stack.length) {
    const u = stack.pop();
    if (visited.has(u)) continue;
    visited.add(u);
    result.push(u);
    for (let i = adj[u].length - 1; i >= 0; i--)
      if (!visited.has(adj[u][i])) stack.push(adj[u][i]);
  }
  return result;
}
```

**Time:** O(V + E) | **Space:** O(V + E)
