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

**Time:** O(n × h) as a loose upper bound for path strings, where h is tree height | **Space:** O(h²) auxiliary string storage in the worst case, excluding output
