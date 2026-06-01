## DFS with Global Max

For each node, compute the max single-path sum through it and update global max.

```javascript
function maxPathSum(root) {
  let max = -Infinity;
  function dfs(node) {
    if (!node) return 0;
    const l = Math.max(0, dfs(node.left));
    const r = Math.max(0, dfs(node.right));
    max = Math.max(max, l + r + node.val);
    return Math.max(l, r) + node.val;
  }
  dfs(root);
  return max;
}
```

**Time:** O(n) | **Space:** O(h)
