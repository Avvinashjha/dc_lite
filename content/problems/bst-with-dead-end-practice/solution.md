## DFS with Range Tracking

Track valid range [low, high] for each node. A leaf is a dead end if low == high.

```javascript
function isDeadEnd(root) {
  function dfs(node, lo, hi) {
    if (!node) return false;
    if (lo === hi) return true;
    return dfs(node.left, lo, node.val - 1) || dfs(node.right, node.val + 1, hi);
  }
  return dfs(root, 1, Infinity);
}
```

**Time:** O(n) | **Space:** O(h)
