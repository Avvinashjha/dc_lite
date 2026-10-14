## Iterative Inorder

Inorder traversal visits a BST in sorted order. Stop after visiting k nodes.

```javascript
function kthSmallestElementInABst(root, k) {
  const stack=[];let current=root;
  while(current||stack.length) {
    while(current){stack.push(current);current=current.left;}
    current=stack.pop();if(--k===0)return current.val;current=current.right;
  }
}
```

**Time:** O(h + k) | **Space:** O(h) auxiliary space
