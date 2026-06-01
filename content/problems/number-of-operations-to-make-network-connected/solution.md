## Union-Find (Count Components)

Need at least n-1 edges. Extra edges = total - (n - components). Answer = components - 1.

```javascript
function makeConnected(n, connections) {
  if (connections.length < n - 1) return -1;
  const parent = Array.from({length: n}, (_, i) => i);
  function find(x) { return parent[x] === x ? x : (parent[x] = find(parent[x])); }
  let components = n;
  for (const [a, b] of connections) {
    const pa = find(a), pb = find(b);
    if (pa !== pb) { parent[pa] = pb; components--; }
  }
  return components - 1;
}
```

**Time:** O(E α(n)) | **Space:** O(n)
