## Pruned Inorder DFS

```javascript
function countInRange(root, l, h) {
  if (!root) return 0;
  if (root.val < l) return countInRange(root.right, l, h);
  if (root.val > h) return countInRange(root.left, l, h);
  return 1 + countInRange(root.left, l, h) + countInRange(root.right, l, h);
}
```

**Time:** O(h + k) where k = nodes in range | **Space:** O(h)
