## Union-Find

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

**Time:** O(E α(V)) | **Space:** O(V)
