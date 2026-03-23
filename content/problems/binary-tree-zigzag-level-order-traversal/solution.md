## BFS with Direction Flag

```javascript
function zigzagLevelOrder(root) {
  if (!root) return [];
  const result = [], q = [root];
  let leftToRight = true;
  while (q.length) {
    const level = [], size = q.length;
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    result.push(leftToRight ? level : level.reverse());
    leftToRight = !leftToRight;
  }
  return result;
}
```

**Time:** O(n) | **Space:** O(n)
