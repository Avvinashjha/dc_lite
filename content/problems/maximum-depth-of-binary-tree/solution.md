## Iterative DFS

Track each node with its depth. An explicit stack also works for a long chain without overflowing the JavaScript call stack.

```javascript
function maximumDepthOfBinaryTree(root) {
  if (!root) return 0;
  const stack = [[root, 1]];
  let depth = 0;
  while (stack.length) {
    const [node, d] = stack.pop();
    depth = Math.max(depth, d);
    if (node.left) stack.push([node.left, d + 1]);
    if (node.right) stack.push([node.right, d + 1]);
  }
  return depth;
}
```

**Time:** O(n) | **Space:** O(h) auxiliary space, excluding output
