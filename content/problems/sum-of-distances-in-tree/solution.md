## Iterative Rerooting

First build a parent-before-child order. Process it backward to compute subtree sizes and distances from each subtree root. Process it forward to reroot: moving to a child makes its subtree nodes one step closer and all remaining nodes one step farther.

For child u, exactly count[u] vertices become one edge closer when moving the root from its parent to u, while n - count[u] become one edge farther. Therefore answer[u] = answer[parent[u]] + n - 2 × count[u]. The first backward pass establishes the total for vertex 0; the forward pass derives all remaining totals.

```javascript
function sumOfDistancesInTree(n, edges) {
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }
  const parent = Array(n).fill(-1),
    order = [0],
    count = Array(n).fill(1),
    answer = Array(n).fill(0);
  for (let i = 0; i < order.length; i++) {
    const u = order[i];
    for (const v of graph[u])
      if (v !== parent[u]) {
        parent[v] = u;
        order.push(v);
      }
  }
  for (let i = n - 1; i > 0; i--) {
    const u = order[i],
      p = parent[u];
    count[p] += count[u];
    answer[p] += answer[u] + count[u];
  }
  for (let i = 1; i < n; i++) {
    const u = order[i];
    answer[u] = answer[parent[u]] + n - 2 * count[u];
  }
  return answer;
}
```

**Time:** O(n) | **Space:** O(n)
