## Approach: Inorder Traversal with Prev Pointer

Perform an inorder traversal. Maintain a `prev` pointer. For each visited node, set its left to prev and prev's right to the current node. The first node visited becomes the head.

```javascript
function binaryTreeToDll(root) {
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

**Time Complexity:** O(n)

**Space Complexity:** O(h) where h is tree height
