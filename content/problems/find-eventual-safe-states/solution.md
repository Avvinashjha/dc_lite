## Reverse Topological Sort

Terminal nodes have no outgoing edges. Process in reverse — safe nodes are those with all successors safe.

```javascript
function eventualSafeNodes(graph) {
  const n = graph.length, color = Array(n).fill(0);
  function dfs(u) {
    if (color[u] > 0) return color[u] === 2;
    color[u] = 1;
    for (const v of graph[u]) if (!dfs(v)) return false;
    color[u] = 2;
    return true;
  }
  const result = [];
  for (let i = 0; i < n; i++) if (dfs(i)) result.push(i);
  return result;
}
```

**Time:** O(V + E) | **Space:** O(V)
