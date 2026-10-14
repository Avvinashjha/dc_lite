## Pruned Iterative DFS

Add values inside the inclusive range. The BST ordering lets us omit branches that cannot contain a qualifying value.

```javascript
function rangeSumBST(root, low, high) {
  const stack=root?[root]:[];let sum=0;
  while(stack.length){const node=stack.pop();if(node.val>=low&&node.val<=high)sum+=node.val;if(node.left&&node.val>=low)stack.push(node.left);if(node.right&&node.val<=high)stack.push(node.right);}
  return sum;
}
```

**Time:** O(n) | **Space:** O(h) auxiliary space, excluding output
