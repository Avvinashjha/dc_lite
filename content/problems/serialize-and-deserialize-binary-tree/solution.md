## Preorder with null markers

```javascript
function serialize(root) {
  const result = [];
  function dfs(node) {
    if (!node) { result.push('null'); return; }
    result.push(node.val);
    dfs(node.left); dfs(node.right);
  }
  dfs(root);
  return result.join(',');
}
function deserialize(data) {
  const vals = data.split(',');
  let i = 0;
  function build() {
    if (vals[i] === 'null') { i++; return null; }
    const node = {val: Number(vals[i++]), left: null, right: null};
    node.left = build(); node.right = build();
    return node;
  }
  return build();
}
```

**Time:** O(n) | **Space:** O(n)
