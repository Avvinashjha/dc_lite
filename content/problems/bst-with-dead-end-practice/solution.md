## Iterative Range Tracking

Each node has an inclusive range of allowed positive integers. When the lower and upper bounds are equal, no further value can be inserted below that node.

```javascript
function isDeadEnd(root) {
  const stack=root?[[root,1,Infinity]]:[];
  while(stack.length){const [node,lo,hi]=stack.pop();if(lo===hi)return true;if(node.left)stack.push([node.left,lo,node.val-1]);if(node.right)stack.push([node.right,node.val+1,hi]);}
  return false;
}
```

**Time:** O(n) | **Space:** O(h) auxiliary space, excluding output
