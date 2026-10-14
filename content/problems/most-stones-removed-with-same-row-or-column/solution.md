## Union-Find (Count Components)

Max removable = total stones - number of connected components.

```javascript
function removeStones(stones) {
  const parent = new Map(), size = new Map();
  function find(x) { if(!parent.has(x)){parent.set(x,x);size.set(x,1);}let root=x;while(parent.get(root)!==root)root=parent.get(root);while(parent.get(x)!==x){const next=parent.get(x);parent.set(x,root);x=next;}return root; }
  function union(a, b) { a=find(a);b=find(b);if(a===b)return;if(size.get(a)<size.get(b))[a,b]=[b,a];parent.set(b,a);size.set(a,size.get(a)+size.get(b)); }
  for (const [r, c] of stones) union(r, ~c);
  const roots = new Set();
  for (const [r] of stones) roots.add(find(r));
  return stones.length - roots.size;
}
```

**Time:** O(n α(n)) | **Space:** O(n)
