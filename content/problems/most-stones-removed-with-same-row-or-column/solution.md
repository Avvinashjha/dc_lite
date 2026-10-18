## Union-Find (Count Components)

Connect stones that share a row or column. At least one stone must remain in each connected component. Conversely, remove leaves of a spanning tree one at a time while retaining their parents; this removes every stone except one. Therefore the maximum is total stones minus the component count.

The implementation unions row IDs with column IDs instead of comparing every stone pair. Nonnegative row IDs and negative column IDs (~c = -c - 1) occupy disjoint namespaces. This prevents a row numbered 1 from being confused with column 1. Every active component contains a row, so counting row roots counts all components.

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
