## Iterative Postorder

Each subtree reports its size, minimum, maximum, and validity. A parent is a BST only if both children are BSTs and their value ranges lie strictly on the correct sides.

```javascript
function largestBstInABinaryTree(root) {
  if (!root) return 0;
  const order = [],
    stack = [root];
  while (stack.length) {
    const node = stack.pop();
    order.push(node);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  const info = new Map(),
    empty = { size: 0, min: Infinity, max: -Infinity, valid: true };
  let best = 0;
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i],
      l = info.get(node.left) || empty,
      r = info.get(node.right) || empty;
    if (l.valid && r.valid && node.val > l.max && node.val < r.min) {
      const size = l.size + r.size + 1;
      best = Math.max(best, size);
      info.set(node, {
        size,
        min: Math.min(node.val, l.min),
        max: Math.max(node.val, r.max),
        valid: true,
      });
    } else info.set(node, { valid: false });
  }
  return best;
}
```

**Time:** O(n) | **Space:** O(n) auxiliary space, excluding output
