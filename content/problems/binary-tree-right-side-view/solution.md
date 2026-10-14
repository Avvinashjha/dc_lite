## BFS Level Order (Last of Each Level)

```javascript
function rightSideView(root) {
  if (!root) return [];
  const result = [], q = [root];
  let head = 0;
  while (head < q.length) {
    const size = q.length - head;
    for (let i = 0; i < size; i++) {
      const node = q[head++];
      if (i === size - 1) result.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  return result;
}
```

**Time:** O(n) | **Space:** O(n)
