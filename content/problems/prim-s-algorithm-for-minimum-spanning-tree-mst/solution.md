## Prim's with Priority Queue

```javascript
function primMST(V, adj) {
  const visited = Array(V).fill(false), key = Array(V).fill(Infinity);
  key[0] = 0;
  let totalWeight = 0;
  for (let count = 0; count < V; count++) {
    let u = -1;
    for (let i = 0; i < V; i++) if (!visited[i] && (u===-1 || key[i]<key[u])) u = i;
    visited[u] = true; totalWeight += key[u];
    for (const [v, w] of adj[u]) if (!visited[v] && w < key[v]) key[v] = w;
  }
  return totalWeight;
}
```

**Time:** O(V²) or O(E log V) with heap | **Space:** O(V)
