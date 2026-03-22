## BFS from Target with Parent Pointers

Build a parent map, then BFS from the target node K levels.

```javascript
function distanceK(root, target, k) {
  const parents = new Map();
  function dfs(node, parent) {
    if (!node) return;
    parents.set(node, parent);
    dfs(node.left, node); dfs(node.right, node);
  }
  dfs(root, null);
  const visited = new Set(), q = [target];
  visited.add(target);
  let dist = 0;
  while (q.length && dist < k) {
    const size = q.length; dist++;
    for (let i = 0; i < size; i++) {
      const n = q.shift();
      for (const next of [n.left, n.right, parents.get(n)]) {
        if (next && !visited.has(next)) { visited.add(next); q.push(next); }
      }
    }
  }
  return q.map(n => n.val);
}
```

**Time:** O(n) | **Space:** O(n)
