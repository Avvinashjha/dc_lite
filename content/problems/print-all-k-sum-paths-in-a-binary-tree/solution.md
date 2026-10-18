## Iterative DFS with Prefix Positions

Keep the current root-to-node values in `path`. A map stores the positions of each prefix sum on this route. Position zero represents the empty prefix before the root.

At a node with cumulative sum `sum`, every earlier prefix equal to `sum - k` identifies a matching path ending here. Its stored position is exactly the starting index to copy from `path`. Store all positions, because repeated prefix sums represent different valid starting nodes.

Look up matches before adding the current prefix to avoid empty paths. Use explicit enter and exit stack events: entering a node records its prefix and schedules its children; exiting removes that prefix and the final path value. This prevents one branch's prefixes from affecting another and avoids recursive stack limits.

```javascript
function kSumPaths(root, k) {
  if (!root) return [];
  const result = [];
  const path = [];
  const prefixes = new Map([[0, [0]]]);
  const stack = [{ node: root, sum: 0, exit: false }];
  while (stack.length) {
    const event = stack.pop();
    if (event.exit) {
      const positions = prefixes.get(event.sum);
      positions.pop();
      if (positions.length === 0) prefixes.delete(event.sum);
      path.pop();
      continue;
    }
    const { node } = event;
    const sum = event.sum + node.val;
    path.push(node.val);
    for (const start of prefixes.get(sum - k) || []) {
      result.push(path.slice(start));
    }
    if (!prefixes.has(sum)) prefixes.set(sum, []);
    prefixes.get(sum).push(path.length);
    stack.push({ sum, exit: true });
    if (node.right) stack.push({ node: node.right, sum, exit: false });
    if (node.left) stack.push({ node: node.left, sum, exit: false });
  }
  return result;
}
```

**Time:** O(n + P) expected, where P is the total number of values copied into all returned paths. Output can be large: a chain of n zeros with k = 0 has n(n + 1)/2 paths and Θ(n³) returned values.

**Space:** O(h) auxiliary space for traversal, the current path, and active prefix positions, plus O(P) for output. Here h is tree height.
