## DFS with coordinate sorting

Record each node as `[column, row, value]`. Sort these triples lexicographically by numeric column, row, then value. This preserves top-to-bottom priority while resolving only same-position ties by value.

Walk the sorted triples and start a new output group whenever the column changes. No deduplication is needed: equal-valued nodes are still separate entries.

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
