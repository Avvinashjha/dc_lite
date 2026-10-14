## Iterative Inorder

Collect the sorted node values with an explicit stack. Return the middle value for an odd count or the average of the two middle values for an even count.

```javascript
function findMedian(root) {
  const stack=[],values=[];let current=root;
  while(current||stack.length) {
    while(current){stack.push(current);current=current.left;}
    current=stack.pop();values.push(current.val);current=current.right;
  }
  const mid=Math.floor(values.length/2);
  return values.length%2 ? values[mid] : (values[mid-1]+values[mid])/2;
}
```

**Time:** O(n) | **Space:** O(n) auxiliary space, excluding output
