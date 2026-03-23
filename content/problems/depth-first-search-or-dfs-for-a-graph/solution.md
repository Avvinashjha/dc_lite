## Recursive DFS

```javascript
function dfsOfGraph(adj) {
  const visited = new Set(), result = [];
  function dfs(node) {
    visited.add(node); result.push(node);
    for (const next of adj[node]) if (!visited.has(next)) dfs(next);
  }
  dfs(0);
  return result;
}
```

**Time:** O(V + E) | **Space:** O(V)
