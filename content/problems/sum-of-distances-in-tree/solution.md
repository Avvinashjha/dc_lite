## Two DFS (Re-rooting)

```javascript
function sumOfDistancesInTree(n, edges) {
  const graph = Array.from({length:n}, ()=>[]);
  for (const [u,v] of edges) { graph[u].push(v); graph[v].push(u); }
  const count = Array(n).fill(1), ans = Array(n).fill(0);
  function dfs1(u, parent) {
    for (const v of graph[u]) if (v!==parent) { dfs1(v, u); count[u]+=count[v]; ans[u]+=ans[v]+count[v]; }
  }
  function dfs2(u, parent) {
    for (const v of graph[u]) if (v!==parent) { ans[v]=ans[u]-count[v]+(n-count[v]); dfs2(v, u); }
  }
  dfs1(0,-1); dfs2(0,-1);
  return ans;
}
```

**Time:** O(n) | **Space:** O(n)
