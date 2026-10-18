## Parent Map and Ancestor Distances

Record parent pointers, then map the distance from a to each ancestor. Walk upward from b until reaching one of those ancestors; add the two distances. The first shared ancestor is the lowest common ancestor, so these two path segments form the unique path. Distances start at zero, making equal targets return zero. The explicit traversal stack avoids recursion overflow on a long chain.

```javascript
function findDist(root, a, b) {
  const parent = new Map([[root, null]]),
    stack = [root];
  let an, bn;
  while (stack.length) {
    const node = stack.pop();
    if (node.val === a) an = node;
    if (node.val === b) bn = node;
    for (const child of [node.left, node.right])
      if (child) {
        parent.set(child, node);
        stack.push(child);
      }
  }
  const distance = new Map();
  let d = 0;
  while (an) {
    distance.set(an, d++);
    an = parent.get(an);
  }
  d = 0;
  while (!distance.has(bn)) {
    bn = parent.get(bn);
    d++;
  }
  return d + distance.get(bn);
}
```

**Time:** O(n) | **Space:** O(n) auxiliary space, excluding output
