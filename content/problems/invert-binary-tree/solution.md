## Approach: Recursive DFS

For each node, swap its left and right children, then recursively invert both subtrees. Base case: null node returns null.

```javascript
function invertBinaryTree(root) {
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  invertBinaryTree(root.left);
  invertBinaryTree(root.right);
  return root;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(h) where h is tree height
