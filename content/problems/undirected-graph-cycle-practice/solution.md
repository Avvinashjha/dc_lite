## Union-Find

```javascript
function hasCycle(V, edges) {
  const parent = Array.from({length:V},(_,i)=>i);
  function find(x) { return parent[x]===x ? x : (parent[x]=find(parent[x])); }
  for (const [u,v] of edges) {
    if (find(u)===find(v)) return true;
    parent[find(u)] = find(v);
  }
  return false;
}
```

**Time:** O(E α(V)) | **Space:** O(V)
