## Approach: Inorder Traversal

Perform an inorder traversal of the BST, which visits nodes in sorted order. Count visited nodes and return the value when the count reaches k.

```javascript
function kthSmallestElementInABst(root, k) {
  let count = 0, result = 0;
  function inorder(node) {
    if (!node || count >= k) return;
    inorder(node.left);
    count++;
    if (count === k) { result = node.val; return; }
    inorder(node.right);
  }
  inorder(root);
  return result;
}
```

**Time Complexity:** O(H + k) where H is tree height

**Space Complexity:** O(H)
