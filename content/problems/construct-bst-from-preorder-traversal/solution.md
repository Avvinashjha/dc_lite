## Recursive with Bound

Use an upper bound to determine when to stop building the left subtree.

```javascript
function bstFromPreorder(preorder) {
  let i = 0;
  function build(bound) {
    if (i >= preorder.length || preorder[i] > bound) return null;
    const node = { val: preorder[i++], left: null, right: null };
    node.left = build(node.val);
    node.right = build(bound);
    return node;
  }
  return build(Infinity);
}
```

**Time:** O(n) | **Space:** O(n)
