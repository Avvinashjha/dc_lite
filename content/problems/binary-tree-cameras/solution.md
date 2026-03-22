## Greedy DFS (Bottom-Up)

Each node has 3 states: 0 = needs camera, 1 = has camera, 2 = covered. Greedily place cameras at parents of uncovered leaves.

```javascript
function minCameraCover(root) {
  let cameras = 0;
  function dfs(node) {
    if (!node) return 2;
    const l = dfs(node.left), r = dfs(node.right);
    if (l === 0 || r === 0) { cameras++; return 1; }
    if (l === 1 || r === 1) return 2;
    return 0;
  }
  if (dfs(root) === 0) cameras++;
  return cameras;
}
```

**Time:** O(n) | **Space:** O(h)
