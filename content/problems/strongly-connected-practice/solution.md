## Iterative Kosaraju

Use explicit DFS frames to record vertices in finishing order. Traverse the reversed graph in reverse finishing order; each traversal yields one strongly connected component.

```javascript
function findSCCs(V, adj) {
  const visited = Array(V).fill(false),
    order = [],
    reverse = Array.from({ length: V }, () => []);
  for (let u = 0; u < V; u++) for (const v of adj[u]) reverse[v].push(u);
  for (let start = 0; start < V; start++)
    if (!visited[start]) {
      const stack = [[start, 0]];
      visited[start] = true;
      while (stack.length) {
        const frame = stack[stack.length - 1],
          u = frame[0];
        if (frame[1] === adj[u].length) {
          order.push(u);
          stack.pop();
          continue;
        }
        const v = adj[u][frame[1]++];
        if (!visited[v]) {
          visited[v] = true;
          stack.push([v, 0]);
        }
      }
    }
  visited.fill(false);
  const result = [];
  while (order.length) {
    const start = order.pop();
    if (visited[start]) continue;
    const stack = [start],
      component = [];
    visited[start] = true;
    while (stack.length) {
      const u = stack.pop();
      component.push(u);
      for (const v of reverse[u])
        if (!visited[v]) {
          visited[v] = true;
          stack.push(v);
        }
    }
    result.push(component);
  }
  return result;
}
```

**Time:** O(V + E) | **Space:** O(V + E)
