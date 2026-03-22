## DFS with Coloring

Use 3 states: WHITE (unvisited), GRAY (in current path), BLACK (done). A GRAY→GRAY edge means cycle.

```javascript
function hasCycle(V, adj) {
  const color = Array(V).fill(0);
  function dfs(u) {
    color[u] = 1;
    for (const v of adj[u]) {
      if (color[v] === 1) return true;
      if (color[v] === 0 && dfs(v)) return true;
    }
    color[u] = 2;
    return false;
  }
  for (let i = 0; i < V; i++) if (color[i] === 0 && dfs(i)) return true;
  return false;
}
```

**Time:** O(V + E) | **Space:** O(V)
