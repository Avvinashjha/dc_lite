## DFS with Path Tracking

```javascript
function kSumPaths(root, k) {
  const result = [];
  function dfs(node, path) {
    if (!node) return;
    path.push(node.val);
    let sum = 0;
    for (let i = path.length-1; i >= 0; i--) {
      sum += path[i];
      if (sum === k) result.push(path.slice(i));
    }
    dfs(node.left, path); dfs(node.right, path);
    path.pop();
  }
  dfs(root, []);
  return result;
}
```

**Time:** O(n²) | **Space:** O(n)
