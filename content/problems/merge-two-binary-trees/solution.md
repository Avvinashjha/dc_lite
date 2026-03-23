## Recursive DFS

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

**Time:** O(n) | **Space:** O(n)
