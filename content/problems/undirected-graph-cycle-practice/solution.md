## Union-Find

Before adding an edge, check whether its endpoints are already connected by previously processed edges. If they are, the new edge closes a cycle. Otherwise merge their components. This naturally handles disconnected graphs, self-loops, and distinct parallel edges.

Path compression and union by size keep component lookups nearly constant amortized time.

```javascript
function hasCycle(V, edges) {
  const parent = Array.from({length:V},(_,i)=>i);
  const size = Array(parent.length).fill(1);
  function find(x) { while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x; }
  function union(a,b) { a=find(a);b=find(b);if(a===b)return;if(size[a]<size[b])[a,b]=[b,a];parent[b]=a;size[a]+=size[b]; }
  for (const [u,v] of edges) {
    if (find(u)===find(v)) return true;
    union(u,v);
  }
  return false;
}
```

**Time:** O(V + E α(V)), including initialization | **Space:** O(V)
