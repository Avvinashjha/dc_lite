## Recursive Construction

The first element of preorder is root, the second is the left subtree root. Find it in postorder to determine left subtree size.

```javascript
function constructFromPrePost(preorder, postorder) {
  let preIdx = 0;
  const postMap = new Map();
  postorder.forEach((v, i) => postMap.set(v, i));
  function build(postLo, postHi) {
    if (postLo > postHi || preIdx >= preorder.length) return null;
    const node = { val: preorder[preIdx++], left: null, right: null };
    if (postLo === postHi) return node;
    const leftRootIdx = postMap.get(preorder[preIdx]);
    node.left = build(postLo, leftRootIdx);
    node.right = build(leftRootIdx + 1, postHi - 1);
    return node;
  }
  return build(0, postorder.length - 1);
}
```

**Time:** O(n) | **Space:** O(n)
