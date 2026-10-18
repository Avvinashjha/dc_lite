## Iterative Postorder

Collect a parent-before-child order and process it backward. Each node contributes the sum of its two child heights to the diameter.

```javascript
function diameterOfBinaryTree(root) {
  if (!root) return 0;
  const order = [],
    stack = [root];
  while (stack.length) {
    const node = stack.pop();
    order.push(node);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  const heights = new Map();
  let diameter = 0;
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i],
      l = heights.get(node.left) || 0,
      r = heights.get(node.right) || 0;
    diameter = Math.max(diameter, l + r);
    heights.set(node, 1 + Math.max(l, r));
  }
  return diameter;
}
```

**Time:** O(n) | **Space:** O(n) auxiliary space, excluding output
