## Morris-Style Rewiring

```javascript
function flatten(root) {
  let curr = root;
  while (curr) {
    if (curr.left) {
      let pred = curr.left;
      while (pred.right) pred = pred.right;
      pred.right = curr.right;
      curr.right = curr.left;
      curr.left = null;
    }
    curr = curr.right;
  }
}
```

**Time:** O(n) | **Space:** O(1)
