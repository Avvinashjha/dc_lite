## Pruned Iterative DFS

Count nodes in the range and skip subtrees whose values cannot fall inside it.

```javascript
function countInRange(root, l, h) {
  const stack = root ? [root] : [];
  let count = 0;
  while (stack.length) {
    const node = stack.pop();
    if (node.val >= l && node.val <= h) count++;
    if (node.left && node.val >= l) stack.push(node.left);
    if (node.right && node.val <= h) stack.push(node.right);
  }
  return count;
}
```

**Time:** O(n) in the worst case; pruning can skip irrelevant subtrees.
**Space:** O(H) auxiliary stack space, where H is the tree height (not the upper range bound h).
