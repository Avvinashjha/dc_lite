## Morris Inorder / Stack Inorder

Find two nodes where inorder sequence is violated.

```javascript
function recoverTree(root) {
  let first = null, second = null, prev = {val: -Infinity};
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (node.val < prev.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
    inorder(node.right);
  }
  inorder(root);
  [first.val, second.val] = [second.val, first.val];
}
```

**Time:** O(n) | **Space:** O(h)
