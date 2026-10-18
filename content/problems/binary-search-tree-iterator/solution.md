## Controlled Inorder with Stack

Maintain a stack of left-spine nodes. On `next()`, pop and push right subtree's left spine.

```javascript
class BSTIterator {
  constructor(root) {
    this.stack = [];
    this._pushLeft(root);
  }
  _pushLeft(node) {
    while (node) {
      this.stack.push(node);
      node = node.left;
    }
  }
  next() {
    const node = this.stack.pop();
    this._pushLeft(node.right);
    return node.val;
  }
  hasNext() {
    return this.stack.length > 0;
  }
}
```

**Time:** O(h) initialization; O(1) amortized per next() across a traversal, with O(h) worst case for one call; O(1) per hasNext().
**Space:** O(h)
