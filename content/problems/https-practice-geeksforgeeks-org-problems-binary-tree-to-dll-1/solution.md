## Inorder DFS

```javascript
function bToDLL(root) {
  let prev = null, head = null;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (!prev) head = node;
    else { node.left = prev; prev.right = node; }
    prev = node;
    inorder(node.right);
  }
  inorder(root);
  return head;
}
```

**Time:** O(n) | **Space:** O(h)
