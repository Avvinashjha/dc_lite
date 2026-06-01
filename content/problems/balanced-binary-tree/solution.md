## Bottom-Up DFS

Return height of each subtree, returning -1 if unbalanced.

```javascript
function isBalanced(root) {
  function height(node) {
    if (!node) return 0;
    const l = height(node.left), r = height(node.right);
    if (l === -1 || r === -1 || Math.abs(l - r) > 1) return -1;
    return Math.max(l, r) + 1;
  }
  return height(root) !== -1;
}
```

**Time:** O(n) | **Space:** O(h)
