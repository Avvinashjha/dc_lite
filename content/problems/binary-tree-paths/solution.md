## DFS with Path Tracking

```javascript
function binaryTreePaths(root) {
  const result = [];
  function dfs(node, path) {
    if (!node) return;
    path += node.val;
    if (!node.left && !node.right) { result.push(path); return; }
    dfs(node.left, path + '->');
    dfs(node.right, path + '->');
  }
  dfs(root, '');
  return result;
}
```

**Time:** O(n) | **Space:** O(n)
