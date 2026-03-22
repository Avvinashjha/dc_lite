## BFS with Column Tracking

```javascript
function verticalTraversal(root) {
  const nodes = [];
  function dfs(node, row, col) {
    if (!node) return;
    nodes.push([col, row, node.val]);
    dfs(node.left, row+1, col-1);
    dfs(node.right, row+1, col+1);
  }
  dfs(root, 0, 0);
  nodes.sort((a,b) => a[0]-b[0] || a[1]-b[1] || a[2]-b[2]);
  const result = []; let prevCol = -Infinity;
  for (const [col,,val] of nodes) {
    if (col !== prevCol) { result.push([]); prevCol = col; }
    result[result.length-1].push(val);
  }
  return result;
}
```

**Time:** O(n log n) | **Space:** O(n)
