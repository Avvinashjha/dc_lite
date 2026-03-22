## Bottom-Up DFS

Return {size, min, max, isBST} for each subtree.

```javascript
function largestBST(root) {
  let maxSize = 0;
  function dfs(node) {
    if (!node) return {size: 0, min: Infinity, max: -Infinity, isBST: true};
    const l = dfs(node.left), r = dfs(node.right);
    if (l.isBST && r.isBST && node.val > l.max && node.val < r.min) {
      const size = l.size + r.size + 1;
      maxSize = Math.max(maxSize, size);
      return {size, min: Math.min(l.min, node.val), max: Math.max(r.max, node.val), isBST: true};
    }
    return {size: 0, min: -Infinity, max: Infinity, isBST: false};
  }
  dfs(root);
  return maxSize;
}
```

**Time:** O(n) | **Space:** O(h)
