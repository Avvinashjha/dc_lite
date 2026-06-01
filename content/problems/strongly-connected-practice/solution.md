## Kosaraju's Algorithm

```javascript
function findSCCs(V, adj) {
  const visited = Array(V).fill(false), stack = [];
  function dfs1(u) { visited[u]=true; for (const v of adj[u]) if (!visited[v]) dfs1(v); stack.push(u); }
  for (let i=0;i<V;i++) if (!visited[i]) dfs1(i);
  const radj = Array.from({length:V}, ()=>[]);
  for (let u=0;u<V;u++) for (const v of adj[u]) radj[v].push(u);
  visited.fill(false); const result = [];
  function dfs2(u, comp) { visited[u]=true; comp.push(u); for (const v of radj[u]) if (!visited[v]) dfs2(v, comp); }
  while (stack.length) {
    const u = stack.pop();
    if (!visited[u]) { const comp = []; dfs2(u, comp); result.push(comp); }
  }
  return result;
}
```

**Time:** O(V + E) | **Space:** O(V)
