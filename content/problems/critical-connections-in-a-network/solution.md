## Iterative Tarjan Bridge Search

Record discovery times and the earliest ancestor reachable from each subtree. When returning from a child, its edge is a bridge if its low-link value is greater than the parent’s discovery time. Explicit frames support long chains.

```javascript
function criticalConnections(n, connections) {
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    graph[u].push(v);
    graph[v].push(u);
  }
  const disc = Array(n).fill(-1),
    low = Array(n).fill(0),
    parent = Array(n).fill(-1),
    result = [];
  let time = 0;
  for (let start = 0; start < n; start++)
    if (disc[start] === -1) {
      disc[start] = low[start] = time++;
      const stack = [[start, 0]];
      while (stack.length) {
        const frame = stack[stack.length - 1],
          u = frame[0];
        if (frame[1] < graph[u].length) {
          const v = graph[u][frame[1]++];
          if (v === parent[u]) continue;
          if (disc[v] === -1) {
            parent[v] = u;
            disc[v] = low[v] = time++;
            stack.push([v, 0]);
          } else low[u] = Math.min(low[u], disc[v]);
        } else {
          stack.pop();
          const p = parent[u];
          if (p !== -1) {
            low[p] = Math.min(low[p], low[u]);
            if (low[u] > disc[p]) result.push([p, u]);
          }
        }
      }
    }
  return result;
}
```

**Time:** O(V + E) | **Space:** O(V + E)
