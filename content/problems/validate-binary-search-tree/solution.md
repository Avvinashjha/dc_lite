## Iterative Bound Checking

Carry strict lower and upper bounds through an explicit stack. A child must satisfy every inherited ancestor bound, not just its parent comparison.

```javascript
function isValidBST(root) {
  const stack=root?[[root,-Infinity,Infinity]]:[];
  while(stack.length){const [node,lo,hi]=stack.pop();if(node.val<=lo||node.val>=hi)return false;if(node.left)stack.push([node.left,lo,node.val]);if(node.right)stack.push([node.right,node.val,hi]);}
  return true;
}
```

**Time:** O(n) | **Space:** O(h) auxiliary space, excluding output
