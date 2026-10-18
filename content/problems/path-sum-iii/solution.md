## Prefix Sum DFS

Track the frequencies of prefix sums along the current root-to-node route. Initialize the map with `0 → 1` to represent the empty prefix before the root.

If the sum through the current node is `sum`, a downward path ending here has the target sum whenever an earlier prefix equals `sum - targetSum`. Add that prefix's frequency, not just one: repeated prefix sums represent different starting points.

Count matches before inserting the current prefix, so a zero target does not count an empty path. Then visit both children. On returning, remove this node's prefix contribution; otherwise a later sibling could incorrectly match a prefix from a different branch. Delete entries whose frequency reaches zero so the map contains only active ancestors.

```javascript
function pathSum(root, targetSum) {
  let count = 0;
  const prefixSums = new Map([[0, 1]]);
  function dfs(node, sum) {
    if (!node) return;
    sum += node.val;
    count += prefixSums.get(sum - targetSum) || 0;
    prefixSums.set(sum, (prefixSums.get(sum) || 0) + 1);
    dfs(node.left, sum);
    dfs(node.right, sum);
    const remaining = prefixSums.get(sum) - 1;
    if (remaining === 0) prefixSums.delete(sum);
    else prefixSums.set(sum, remaining);
  }
  dfs(root, 0);
  return count;
}
```

**Time:** O(n) expected | **Space:** O(h), where n is the number of nodes and h is tree height. Prefix sums remain exact JavaScript integers under the stated bounds.
