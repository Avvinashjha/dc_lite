## Parent Map

Record each node’s parent. Mark all ancestors of p, then walk from q toward the root until the first marked ancestor is reached.

```javascript
function lowestCommonAncestorOfABinaryTree(root, p, q) {
  const parent = new Map([[root, null]]),
    stack = [root];
  let pn, qn;
  while (stack.length) {
    const node = stack.pop();
    if (node.val === p) pn = node;
    if (node.val === q) qn = node;
    for (const child of [node.left, node.right])
      if (child) {
        parent.set(child, node);
        stack.push(child);
      }
  }
  const ancestors = new Set();
  while (pn) {
    ancestors.add(pn);
    pn = parent.get(pn);
  }
  while (!ancestors.has(qn)) qn = parent.get(qn);
  return qn.val;
}
```

**Time:** O(n) | **Space:** O(n) auxiliary space, excluding output
