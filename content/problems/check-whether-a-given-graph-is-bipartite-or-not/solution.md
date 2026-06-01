## BFS Coloring

Try 2-coloring the graph with BFS. If any conflict is found, it's not bipartite.

```javascript
function isBipartite(graph) {
  const n = graph.length, color = Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    if (color[i] !== -1) continue;
    color[i] = 0;
    const q = [i];
    while (q.length) {
      const u = q.shift();
      for (const v of graph[u]) {
        if (color[v] === -1) { color[v] = 1 - color[u]; q.push(v); }
        else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}
```

**Time:** O(V + E) | **Space:** O(V)
