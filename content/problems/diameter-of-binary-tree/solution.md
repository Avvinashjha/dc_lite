## DFS with Global Max

```javascript
function diameterOfBinaryTree(root) {
  let diameter = 0;
  function depth(node) {
    if (!node) return 0;
    const l = depth(node.left), r = depth(node.right);
    diameter = Math.max(diameter, l + r);
    return Math.max(l, r) + 1;
  }
  depth(root);
  return diameter;
}
```

**Time:** O(n) | **Space:** O(h)
