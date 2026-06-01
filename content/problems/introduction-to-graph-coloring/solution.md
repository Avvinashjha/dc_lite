## Approach: Backtracking

Try assigning colors 1 to m to each vertex in sequence. Before assigning, check if any adjacent vertex already has the same color. If no valid color exists for a vertex, backtrack.

```javascript
function introductionToGraphColoring(graph, m) {
  const n = graph.length;
  const colors = new Array(n).fill(0);
  function isSafe(v, c) {
    for (let i = 0; i < n; i++)
      if (graph[v][i] && colors[i] === c) return false;
    return true;
  }
  function solve(v) {
    if (v === n) return true;
    for (let c = 1; c <= m; c++) {
      if (isSafe(v, c)) {
        colors[v] = c;
        if (solve(v + 1)) return true;
        colors[v] = 0;
      }
    }
    return false;
  }
  return solve(0);
}
```

**Time Complexity:** O(m^V)

**Space Complexity:** O(V)
