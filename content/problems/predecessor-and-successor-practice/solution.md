## BST Traversal

```javascript
function findPreSuc(root, key) {
  let pre = null, suc = null, curr = root;
  while (curr) {
    if (curr.val < key) { pre = curr; curr = curr.right; }
    else curr = curr.left;
  }
  curr = root;
  while (curr) {
    if (curr.val > key) { suc = curr; curr = curr.left; }
    else curr = curr.right;
  }
  return [pre, suc];
}
```

**Time:** O(h) | **Space:** O(1)
