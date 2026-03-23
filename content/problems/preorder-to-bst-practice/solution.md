## Recursive with Upper Bound

```javascript
function preorderToBST(pre) {
  let i = 0;
  function build(bound) {
    if (i >= pre.length || pre[i] > bound) return null;
    const node = {val: pre[i++], left: null, right: null};
    node.left = build(node.val); node.right = build(bound);
    return node;
  }
  return build(Infinity);
}
```

**Time:** O(n) | **Space:** O(n)
