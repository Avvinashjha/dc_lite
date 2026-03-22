## Graph DFS

Build a weighted graph, DFS from dividend to divisor multiplying weights.

```javascript
function calcEquation(equations, values, queries) {
  const graph = new Map();
  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i], v = values[i];
    if (!graph.has(a)) graph.set(a, []);
    if (!graph.has(b)) graph.set(b, []);
    graph.get(a).push([b, v]); graph.get(b).push([a, 1/v]);
  }
  function dfs(src, dst, visited) {
    if (!graph.has(src) || !graph.has(dst)) return -1;
    if (src === dst) return 1;
    visited.add(src);
    for (const [next, w] of graph.get(src)) {
      if (visited.has(next)) continue;
      const res = dfs(next, dst, visited);
      if (res !== -1) return w * res;
    }
    return -1;
  }
  return queries.map(([a, b]) => dfs(a, b, new Set()));
}
```

**Time:** O(Q × (V + E)) | **Space:** O(V + E)
