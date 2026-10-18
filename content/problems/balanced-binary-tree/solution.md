## Iterative Postorder

Compute child heights before parent heights. Reject any node whose child heights differ by more than one.

```javascript
function isBalanced(root) {
  if (!root) return true;
  const stack = [[root, false]],
    heights = new Map();
  while (stack.length) {
    const [node, done] = stack.pop();
    if (!done) {
      stack.push([node, true]);
      if (node.right) stack.push([node.right, false]);
      if (node.left) stack.push([node.left, false]);
    } else {
      const l = heights.get(node.left) || 0,
        r = heights.get(node.right) || 0;
      if (Math.abs(l - r) > 1) return false;
      heights.set(node, 1 + Math.max(l, r));
    }
  }
  return true;
}
```

**Time:** O(n) | **Space:** O(n) auxiliary space, excluding output
