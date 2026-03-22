## BST Property

If both values < root, go left. If both > root, go right. Otherwise, root is LCA.

```javascript
function lowestCommonAncestor(root, p, q) {
  while (root) {
    if (p.val < root.val && q.val < root.val) root = root.left;
    else if (p.val > root.val && q.val > root.val) root = root.right;
    else return root;
  }
}
```

**Time:** O(h) | **Space:** O(1)
