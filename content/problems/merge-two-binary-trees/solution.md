## Recursive DFS

Recurse on matching node positions. If either node is missing, return the other subtree unchanged. Otherwise create a node containing the sum and merge the corresponding left and right children. This implementation shares one-sided subtrees with the inputs, which the contract permits.

```javascript
function mergeTrees(t1, t2) {
  if (!t1) return t2;
  if (!t2) return t1;
  return {
    val: t1.val + t2.val,
    left: mergeTrees(t1.left, t2.left),
    right: mergeTrees(t1.right, t2.right)
  };
}
```

**Time:** O(min(n1, n2) + 1), since recursion continues only through positions present in both trees; one-sided subtrees are reused without traversal.

**Space:** O(h) recursion stack, plus O(min(n1, n2)) new output nodes in the worst case, where h is the depth of the overlapping portion.
