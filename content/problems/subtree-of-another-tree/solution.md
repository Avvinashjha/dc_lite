## Search and Compare Trees

Visit every possible subtree root. At each candidate, compare pairs of nodes: values must match, and both corresponding children must either exist or be absent. Stop that comparison on the first mismatch.

Explicit stacks avoid relying on JavaScript's recursion limit for skewed trees. Null child pairs are included so different shapes cannot compare equal.

```javascript
function isSubtree(root, subRoot) {
  function sameTree(a, b) {
    const pairs = [[a, b]];
    while (pairs.length) {
      const [left, right] = pairs.pop();
      if (!left && !right) continue;
      if (!left || !right || left.val !== right.val) return false;
      pairs.push([left.left, right.left], [left.right, right.right]);
    }
    return true;
  }

  const candidates = [root];
  while (candidates.length) {
    const node = candidates.pop();
    if (sameTree(node, subRoot)) return true;
    if (node.left) candidates.push(node.left);
    if (node.right) candidates.push(node.right);
  }
  return false;
}
```

**Time:** O(m × n) in the worst case, where m and n are the two node counts.

**Auxiliary space:** O(h₁ + h₂) for the traversal and comparison stacks, bounded by the heights of the two trees.
