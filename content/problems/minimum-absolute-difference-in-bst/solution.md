## Inorder Traversal

```javascript
function getMinimumDifference(root) {
  let prev = -Infinity, min = Infinity;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    min = Math.min(min, node.val - prev);
    prev = node.val;
    inorder(node.right);
  }
  inorder(root);
  return min;
}
```

**Time:** O(n) | **Space:** O(h)
