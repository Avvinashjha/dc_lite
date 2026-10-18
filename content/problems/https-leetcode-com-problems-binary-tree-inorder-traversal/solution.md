## Approach: Iterative with Stack

Use a stack to simulate the recursive inorder traversal. Push all left children onto the stack, then pop, record the value, and move to the right child. Repeat until both stack and current pointer are exhausted.

```javascript
function binaryTreeInorderTraversal(root) {
  const result = [],
    stack = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    result.push(curr.val);
    curr = curr.right;
  }
  return result;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(h) auxiliary stack space, where h is tree height (O(n) for a skewed tree), plus O(n) for the returned array.
