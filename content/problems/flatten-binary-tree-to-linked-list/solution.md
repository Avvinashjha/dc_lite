## Approach: Morris-like Traversal

For each node with a left child, find the rightmost node of the left subtree. Connect that rightmost node to the current right child. Then move the entire left subtree to the right side and set left to null. Advance to the next right node.

```javascript
function flattenBinaryTreeToLinkedList(root) {
  let curr = root;
  while (curr) {
    if (curr.left) {
      let prev = curr.left;
      while (prev.right) prev = prev.right;
      prev.right = curr.right;
      curr.right = curr.left;
      curr.left = null;
    }
    curr = curr.right;
  }
  return root;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(1)
