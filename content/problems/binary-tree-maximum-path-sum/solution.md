## Iterative Postorder

For each node, retain the best downward path. Its best full path combines the node with positive gains from both children; the downward value passed to its parent uses only one child.

```javascript
function maxPathSum(root) {
  if (!root) return 0;
  const order = [], stack = [root];
  while(stack.length) {
    const node=stack.pop();order.push(node);
    if(node.left)stack.push(node.left);
    if(node.right)stack.push(node.right);
  }
  const gains=new Map();let best=-Infinity;
  for(let i=order.length-1;i>=0;i--) {
    const node=order[i],l=Math.max(0,gains.get(node.left)||0),r=Math.max(0,gains.get(node.right)||0);
    best=Math.max(best,node.val+l+r);gains.set(node,node.val+Math.max(l,r));
  }
  return best;
}
```

**Time:** O(n) | **Space:** O(n) auxiliary space, excluding output
