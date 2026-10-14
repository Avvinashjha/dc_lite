## BFS with Queue

Process nodes level by level using a queue.

```javascript
function levelOrder(root) {
  if (!root) return [];
  const result = [], q = [root];
  let head = 0;
  while (head < q.length) {
    const level = [], size = q.length - head;
    for (let i = 0; i < size; i++) {
      const node = q[head++];
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

**Time:** O(n) | **Space:** O(n)
