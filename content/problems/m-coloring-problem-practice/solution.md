## Approach: Backtracking

Assign colors to vertices one by one. For each vertex, try all `m` colors and check if any neighbor already has that color. If the assignment is safe, recurse to the next vertex. If no color works, backtrack.

```javascript
function canColor(graph, m, n) {
  const colors = new Array(n).fill(0);

  function isSafe(node, color) {
    for (const neighbor of (graph[node] || [])) {
      if (colors[neighbor] === color) return false;
    }
    return true;
  }

  function solve(node) {
    if (node === n) return true;

    for (let c = 1; c <= m; c++) {
      if (isSafe(node, c)) {
        colors[node] = c;
        if (solve(node + 1)) return true;
        colors[node] = 0;
      }
    }
    return false;
  }

  return solve(0);
}
```

**Time Complexity:** O(n × m^n) worst case for m >= 2, including the neighbor scan for each attempted color. For m = 1, O(n + E), where E is the number of edges.

**Space Complexity:** O(n) for the color array and recursion stack
