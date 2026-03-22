## Approach: BST Property

If both p and q are smaller than root, LCA is in the left subtree. If both are larger, LCA is in the right subtree. Otherwise, the current root is the LCA (the split point).

```javascript
function lowestCommonAncestorOfABinarySearchTree(root, p, q) {
  while (root) {
    if (p < root.val && q < root.val) root = root.left;
    else if (p > root.val && q > root.val) root = root.right;
    else return root.val;
  }
  return -1;
}
```

**Time Complexity:** O(H) where H is tree height

**Space Complexity:** O(1)
