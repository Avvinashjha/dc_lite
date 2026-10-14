## Union-Find (Count Components)

Need at least n-1 edges. Extra edges = total - (n - components). Answer = components - 1.

```javascript
function makeConnected(n, connections) {
  if (connections.length < n - 1) return -1;
  const parent = Array.from({length: n}, (_, i) => i);
  const size = Array(parent.length).fill(1);
  function find(x) { while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x; }
  function union(a,b) { a=find(a);b=find(b);if(a===b)return;if(size[a]<size[b])[a,b]=[b,a];parent[b]=a;size[a]+=size[b]; }
  let components = n;
  for (const [a, b] of connections) {
    const pa = find(a), pb = find(b);
    if (pa !== pb) { union(pa,pb); components--; }
  }
  return components - 1;
}
```

**Time:** O(E α(n)) | **Space:** O(n)
