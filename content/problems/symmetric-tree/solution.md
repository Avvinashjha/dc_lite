## Recursive Mirror Check

```javascript
function isSymmetric(root) {
  function isMirror(a, b) {
    if (!a && !b) return true;
    if (!a || !b || a.val !== b.val) return false;
    return isMirror(a.left, b.right) && isMirror(a.right, b.left);
  }
  return isMirror(root, root);
}
```

**Time:** O(n) | **Space:** O(h)
