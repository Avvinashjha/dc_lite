## DFS

```javascript
function sumOfLeftLeaves(root) {
  if (!root) return 0;
  let sum = 0;
  if (root.left && !root.left.left && !root.left.right) sum += root.left.val;
  else sum += sumOfLeftLeaves(root.left);
  sum += sumOfLeftLeaves(root.right);
  return sum;
}
```

**Time:** O(n) | **Space:** O(h)
