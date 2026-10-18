## Union-Find in Input Order

Initially every vertex is its own component. Process edges in their given order. If the endpoints belong to different components, join them using union by size. Path compression keeps future representative lookups fast.

If both endpoints are already connected, an earlier path joins them, so the current edge closes a cycle. Return that edge.

Why does the first cycle-closing edge satisfy the latest-edge rule? There is exactly one cycle in the full graph. No cycle edge closes it until all the other cycle edges have appeared, so the detected edge is precisely the latest member of that cycle. Later non-cycle edges do not qualify for removal.

```javascript
function findRedundantConnection(edges) {
  const parent = Array.from({ length: edges.length + 1 }, (_, i) => i);
  const size = Array(parent.length).fill(1);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    a = find(a);
    b = find(b);
    if (a === b) return;
    if (size[a] < size[b]) [a, b] = [b, a];
    parent[b] = a;
    size[a] += size[b];
  }
  for (const [u, v] of edges) {
    if (find(u) === find(v)) return [u, v];
    union(u, v);
  }
}
```

**Time:** O(n α(n)) | **Space:** O(n)
