## Prefix Sum DFS

```javascript
function pathSum(root, targetSum) {
  let count = 0;
  const prefixSums = new Map([[0, 1]]);
  function dfs(node, sum) {
    if (!node) return;
    sum += node.val;
    count += prefixSums.get(sum - targetSum) || 0;
    prefixSums.set(sum, (prefixSums.get(sum) || 0) + 1);
    dfs(node.left, sum); dfs(node.right, sum);
    prefixSums.set(sum, prefixSums.get(sum) - 1);
  }
  dfs(root, 0);
  return count;
}
```

**Time:** O(n) | **Space:** O(n)
