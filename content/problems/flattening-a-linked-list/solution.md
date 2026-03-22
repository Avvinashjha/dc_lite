## Merge Sort Style

Merge lists from right to left.

```javascript
function flattenList(root) {
  if (!root || !root.right) return root;
  root.right = flattenList(root.right);
  root = merge(root, root.right);
  return root;
}
function merge(a, b) {
  if (!a) return b;
  if (!b) return a;
  if (a.val < b.val) { a.down = merge(a.down, b); return a; }
  else { b.down = merge(a, b.down); return b; }
}
```

**Time:** O(n) | **Space:** O(1)
