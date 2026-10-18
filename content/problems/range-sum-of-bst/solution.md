## Pruned Iterative DFS

Use an explicit stack to visit candidate nodes. Add a node's value when it lies between both bounds, inclusive.

If a node's value is no greater than `low`, its entire left subtree is strictly below the range and can be skipped. Similarly, when the node's value is at least `high`, its right subtree is strictly above the range. These pruning rules rely on distinct values and strict BST ordering.

The stack avoids recursive call-stack limits for long, one-sided trees. Reading child pointers without modifying them preserves the input.

```javascript
function rangeSumBST(root, low, high) {
  const stack = root ? [root] : [];
  let sum = 0;
  while (stack.length) {
    const node = stack.pop();
    if (node.val >= low && node.val <= high) sum += node.val;
    if (node.left && node.val > low) stack.push(node.left);
    if (node.right && node.val < high) stack.push(node.right);
  }
  return sum;
}
```

**Time:** O(n) in the worst case, with out-of-range branches pruned | **Space:** O(h), where h is tree height.
