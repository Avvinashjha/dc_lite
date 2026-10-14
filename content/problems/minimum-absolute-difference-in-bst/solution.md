## Iterative Inorder

The closest pair in a sorted sequence must be adjacent. Track the preceding inorder value and the smallest gap.

```javascript
function getMinimumDifference(root) {
  const stack=[];let current=root,previous=-Infinity,best=Infinity;
  while(current||stack.length) {
    while(current){stack.push(current);current=current.left;}
    current=stack.pop();best=Math.min(best,current.val-previous);previous=current.val;current=current.right;
  }
  return best;
}
```

**Time:** O(n) | **Space:** O(h) auxiliary space, excluding output
