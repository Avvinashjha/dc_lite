## Iterative Preorder with Null Markers

Serialize nodes in preorder, recording a null marker for every missing child so shape is preserved. To deserialize, track each unfinished node and whether its next child is left or right. Both operations use explicit stacks, so a long chain does not overflow the JavaScript call stack.

```javascript
function serialize(root) {
  const stack = [root], values = [];
  while (stack.length) {
    const node = stack.pop();
    if (!node) values.push('null');
    else { values.push(String(node.val)); stack.push(node.right, node.left); }
  }
  return values.join(',');
}
function deserialize(data) {
  const values = data.split(',');
  if (values[0] === 'null') return null;
  const root = {val:Number(values[0]),left:null,right:null}, stack = [[root,0]];
  for (let i = 1; i < values.length; i++) {
    const frame = stack[stack.length-1], side = frame[1]++ === 0 ? 'left' : 'right';
    if (frame[1] === 2) stack.pop();
    const node = values[i] === 'null' ? null : {val:Number(values[i]),left:null,right:null};
    frame[0][side] = node;
    if (node) stack.push([node,0]);
  }
  return root;
}
```

**Time:** O(n) | **Space:** O(n), including the encoded string and reconstructed tree.

The runner calls `serialize` and `deserialize` in separate fresh scopes. Any string format that reconstructs the same tree is accepted. Explicit null markers distinguish left-only and right-only children, even when values repeat.
