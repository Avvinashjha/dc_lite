## Kahn's Algorithm (BFS)

```javascript
function topologicalSort(V, adj) {
  const inDeg = Array(V).fill(0);
  for (let u=0;u<V;u++) for (const v of adj[u]) inDeg[v]++;
  const q = [], result = [];
  for (let i=0;i<V;i++) if (inDeg[i]===0) q.push(i);
  while (q.length) {
    const u = q.shift(); result.push(u);
    for (const v of adj[u]) if (--inDeg[v]===0) q.push(v);
  }
  return result;
}
```

**Time:** O(V + E) | **Space:** O(V)
