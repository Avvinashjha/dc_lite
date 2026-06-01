## Union-Find

```javascript
function findRedundantConnection(edges) {
  const parent = Array.from({length: edges.length+1}, (_,i) => i);
  function find(x) { return parent[x] === x ? x : (parent[x] = find(parent[x])); }
  for (const [u, v] of edges) {
    if (find(u) === find(v)) return [u, v];
    parent[find(u)] = find(v);
  }
}
```

**Time:** O(n α(n)) | **Space:** O(n)
