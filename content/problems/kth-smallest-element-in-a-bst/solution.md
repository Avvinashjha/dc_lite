## Inorder Traversal

```javascript
function kthSmallest(root, k) {
  const stack = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left; }
    curr = stack.pop();
    if (--k === 0) return curr.val;
    curr = curr.right;
  }
}
```

**Time:** O(H + k) | **Space:** O(H)
