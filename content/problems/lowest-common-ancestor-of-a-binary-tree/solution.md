## Approach: Recursive DFS

If the current node is null or matches p or q, return it. Recurse into left and right subtrees. If both return non-null, the current node is the LCA (p and q are in different subtrees). Otherwise, return whichever side is non-null.

```javascript
function lowestCommonAncestorOfABinaryTree(root, p, q) {
  function dfs(node) {
    if (!node || node.val === p || node.val === q) return node;
    const left = dfs(node.left);
    const right = dfs(node.right);
    if (left && right) return node;
    return left || right;
  }
  const result = dfs(root);
  return result ? result.val : -1;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(h)
