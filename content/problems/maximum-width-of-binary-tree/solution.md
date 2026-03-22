## BFS with Position Tracking

```javascript
function widthOfBinaryTree(root) {
  if (!root) return 0;
  let maxWidth = 0;
  const q = [[root, 0n]];
  while (q.length) {
    const size = q.length, first = q[0][1];
    let last = first;
    for (let i = 0; i < size; i++) {
      const [node, pos] = q.shift();
      last = pos;
      if (node.left) q.push([node.left, 2n*pos]);
      if (node.right) q.push([node.right, 2n*pos+1n]);
    }
    const width = Number(last - first + 1n);
    maxWidth = Math.max(maxWidth, width);
  }
  return maxWidth;
}
```

**Time:** O(n) | **Space:** O(n)
