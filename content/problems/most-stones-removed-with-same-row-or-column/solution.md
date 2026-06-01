## Union-Find (Count Components)

Max removable = total stones - number of connected components.

```javascript
function removeStones(stones) {
  const parent = new Map();
  function find(x) { if (!parent.has(x)) parent.set(x, x); if (parent.get(x) !== x) parent.set(x, find(parent.get(x))); return parent.get(x); }
  function union(a, b) { parent.set(find(a), find(b)); }
  for (const [r, c] of stones) union(r, ~c);
  const roots = new Set();
  for (const [r] of stones) roots.add(find(r));
  return stones.length - roots.size;
}
```

**Time:** O(n α(n)) | **Space:** O(n)
