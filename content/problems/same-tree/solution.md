## Compare Corresponding Subtrees

If both roots are `null`, the two subtrees match. If just one is `null`, their shapes differ. If both exist but their values differ, reject immediately.

Otherwise compare left with left and right with right. Both comparisons must succeed. This recursively checks every corresponding value and missing-child position, rather than comparing only a traversal's values.

```javascript
function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

**Time:** O(n) worst case, where n is the total number of nodes across the inputs | **Space:** O(h) for recursion, where h is the larger tree height.
