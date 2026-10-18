## Union-Find (Count Components)

A connected network of `n` computers needs at least `n - 1` cables. If fewer cables exist, return `-1` immediately.

Use union-find to count the connected components. A successful union reduces the component count by one; an edge within the same component is redundant. With `c` components, a spanning forest uses `n - c` cables, leaving `E - (n - c)` reusable cables. Since `E >= n - 1`, there are at least `c - 1` reusable cables.

Each move can join at most two components, so at least `c - 1` moves are necessary. Reusing one redundant cable for each join achieves that bound.

```javascript
function makeConnected(n, connections) {
  if (connections.length < n - 1) return -1;
  const parent = Array.from({ length: n }, (_, i) => i);
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
  let components = n;
  for (const [a, b] of connections) {
    const pa = find(a),
      pb = find(b);
    if (pa !== pb) {
      union(pa, pb);
      components--;
    }
  }
  return components - 1;
}
```

**Time:** O(n + E α(n)), where E is the number of cables and α is the inverse Ackermann function | **Space:** O(n)
