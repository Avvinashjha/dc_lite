## Iterative Depth-First Search

Keep a stack of `[node, sumSoFar]` pairs. Start with the root and its value. When visiting a leaf, compare the accumulated sum with the target. For each child, add its value and push the resulting state.

Only leaves can complete a path. Do not stop early because a partial sum exceeds the target: negative values later in the path can reduce it. If every path is exhausted without a matching leaf, return `false`.

An explicit stack avoids recursive call-stack limits on a long, one-sided tree.

```javascript
function hasPathSum(root, targetSum) {
  if (!root) return false;
  const stack = [[root, root.val]];
  while (stack.length) {
    const [node, sum] = stack.pop();
    if (!node.left && !node.right && sum === targetSum) return true;
    if (node.right) stack.push([node.right, sum + node.right.val]);
    if (node.left) stack.push([node.left, sum + node.left.val]);
  }
  return false;
}
```

**Time:** O(n) | **Space:** O(h), where n is the number of nodes and h is tree height. The depth-first stack stores pending branches along the current path.
