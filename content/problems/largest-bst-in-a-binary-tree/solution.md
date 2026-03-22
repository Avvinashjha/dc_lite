## Approach: Postorder Traversal

For each node, return its subtree size, min, max, and whether it is a valid BST. A node forms a valid BST if both children are BSTs and the node value is within the valid range. Track the maximum BST size found.

```javascript
function largestBstInABinaryTree(root) {
  let maxSize = 0;
  function solve(node) {
    if (!node) return { size: 0, min: Infinity, max: -Infinity, isBST: true };
    const left = solve(node.left);
    const right = solve(node.right);
    if (left.isBST && right.isBST && node.val > left.max && node.val < right.min) {
      const size = left.size + right.size + 1;
      maxSize = Math.max(maxSize, size);
      return { size, min: Math.min(node.val, left.min), max: Math.max(node.val, right.max), isBST: true };
    }
    return { size: 0, min: 0, max: 0, isBST: false };
  }
  solve(root);
  return maxSize;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(h)
