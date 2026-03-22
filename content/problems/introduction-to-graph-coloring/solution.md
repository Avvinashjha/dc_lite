## Backtracking

```javascript
function graphColoring(V, adj, M) {
  const colors = Array(V).fill(0);
  function isSafe(v, c) {
    for (const u of adj[v]) if (colors[u] === c) return false;
    return true;
  }
  function solve(v) {
    if (v === V) return true;
    for (let c = 1; c <= M; c++) {
      if (isSafe(v, c)) { colors[v] = c; if (solve(v+1)) return true; colors[v] = 0; }
    }
    return false;
  }
  return solve(0);
}
```

**Time:** O(M^V) | **Space:** O(V)
