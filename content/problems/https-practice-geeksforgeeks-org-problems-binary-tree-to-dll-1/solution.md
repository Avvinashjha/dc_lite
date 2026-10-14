## Iterative Inorder with Previous Pointer

Visit nodes in inorder, saving each original right child before linking the current node to the preceding node. Reuse left and right as previous and next links.

```javascript
function binaryTreeToDll(root) {
  const stack=[];let current=root,previous=null,head=null;
  while(current||stack.length) {
    while(current){stack.push(current);current=current.left;}
    const node=stack.pop(),right=node.right;
    node.left=previous;
    if(previous)previous.right=node;else head=node;
    previous=node;current=right;
  }
  if(previous)previous.right=null;
  return head;
}
```

**Time:** O(n) | **Space:** O(h) auxiliary space, excluding output
