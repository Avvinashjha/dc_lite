## Morris Inorder Traversal (Two Pass)

First count nodes, then find the middle element(s) via inorder.

```javascript
function findMedian(root) {
  let count = 0;
  function countNodes(node) { if (!node) return; countNodes(node.left); count++; countNodes(node.right); }
  countNodes(root);
  let idx = 0, prev = 0, result = 0;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    idx++;
    if (count % 2 === 1 && idx === Math.ceil(count / 2)) result = node.val;
    if (count % 2 === 0) {
      if (idx === count / 2) prev = node.val;
      if (idx === count / 2 + 1) result = (prev + node.val) / 2;
    }
    inorder(node.right);
  }
  inorder(root);
  return result;
}
```

**Time:** O(n) | **Space:** O(h)
