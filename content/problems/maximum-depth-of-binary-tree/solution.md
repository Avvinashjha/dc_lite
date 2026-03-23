## Approach: Recursive DFS

The depth of a tree is 1 plus the maximum of the depths of its left and right subtrees. Base case: a null node has depth 0.

```javascript
function maximumDepthOfBinaryTree(root) {
  if (!root) return 0;
  return 1 + Math.max(
    maximumDepthOfBinaryTree(root.left),
    maximumDepthOfBinaryTree(root.right)
  );
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(h) where h is tree height
