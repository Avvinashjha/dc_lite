## Iterative bound checking

Carry strict lower and upper bounds through an explicit stack. A child must satisfy every inherited ancestor bound, not just its parent comparison. Reject values equal to a bound as well as values outside it.

The initial bounds are infinities so the smallest and largest allowed integers remain valid. An explicit stack avoids JavaScript call-stack limits on a deeply skewed tree.

```javascript
function isValidBST(root) {
  const stack = root ? [[root, -Infinity, Infinity]] : [];
  while (stack.length) {
    const [node, lower, upper] = stack.pop();
    if (node.val <= lower || node.val >= upper) return false;
    if (node.left) stack.push([node.left, lower, node.val]);
    if (node.right) stack.push([node.right, node.val, upper]);
  }
  return true;
}
```

**Time:** O(n), visiting each node at most once.

**Space:** O(h), where h is tree height; O(n) is a safe worst-case bound.
