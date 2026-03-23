## Tarjan's Bridge Algorithm

Track discovery time and lowest reachable ancestor for each node.

```javascript
function criticalConnections(n, connections) {
  const graph = Array.from({length: n}, () => []);
  for (const [u, v] of connections) { graph[u].push(v); graph[v].push(u); }
  const disc = Array(n).fill(-1), low = Array(n).fill(0), result = [];
  let timer = 0;
  function dfs(u, parent) {
    disc[u] = low[u] = timer++;
    for (const v of graph[u]) {
      if (v === parent) continue;
      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) result.push([u, v]);
      } else low[u] = Math.min(low[u], disc[v]);
    }
  }
  dfs(0, -1);
  return result;
}
```

**Time:** O(V + E) | **Space:** O(V + E)
