## Prim's Algorithm with Linear Minimum Selection

Maintain `key[v]`, the cheapest edge currently known from the selected tree to unvisited vertex `v`. Set vertex `0`'s key to zero so it becomes the initial vertex without adding an edge cost.

Repeatedly choose the unvisited vertex with the smallest key, add that key to the total, and mark the vertex visited. For each unvisited neighbor, improve its key if the current edge is cheaper. A key is a single connecting edge's weight, not a distance from the starting vertex.

The minimum crossing edge is safe to add: if a minimum spanning tree does not contain it, inserting it creates a cycle, and another edge crossing the same cut can be removed without increasing the total weight. This preserves the possibility of an optimal tree at every step.

The graph is guaranteed connected, so every selected vertex has a finite key. Updating only unvisited vertices prevents cycles and counts each selected undirected edge once.

```javascript
function primMST(V, adj) {
  const visited = Array(V).fill(false),
    key = Array(V).fill(Infinity);
  key[0] = 0;
  let totalWeight = 0;
  for (let count = 0; count < V; count++) {
    let u = -1;
    for (let i = 0; i < V; i++)
      if (!visited[i] && (u === -1 || key[i] < key[u])) u = i;
    visited[u] = true;
    totalWeight += key[u];
    for (const [v, w] of adj[u]) if (!visited[v] && w < key[v]) key[v] = w;
  }
  return totalWeight;
}
```

**Time:** O(V² + E) for this implementation | **Space:** O(V)
