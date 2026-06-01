## LCA + Distance

Find LCA, then sum distances from LCA to each node.

```javascript
function findDist(root, a, b) {
  function lca(node) {
    if (!node || node.val===a || node.val===b) return node;
    const l = lca(node.left), r = lca(node.right);
    return l && r ? node : l || r;
  }
  function dist(node, target, d) {
    if (!node) return -1;
    if (node.val === target) return d;
    const l = dist(node.left, target, d+1);
    return l !== -1 ? l : dist(node.right, target, d+1);
  }
  const ancestor = lca(root);
  return dist(ancestor, a, 0) + dist(ancestor, b, 0);
}
```

**Time:** O(n) | **Space:** O(h)
