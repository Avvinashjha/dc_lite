## Recursive Inorder Traversal

Inorder traversal should be strictly increasing. Track the previously visited node and detect a descending adjacent pair whenever `previous.val > current.val`.

At the first violation, save the previous node as `first`. At every violation, update `second` to the current node. If the swapped nodes were adjacent in inorder, there is one violation and these are exactly the two nodes. If they were separated, there are two violations: the earlier larger value and the later smaller value are the misplaced nodes.

Swap their values after traversal. Do not change child links. The guarantee that exactly two distinct values were swapped ensures both candidates exist.

```javascript
function recoverTree(root) {
  let first = null,
    second = null,
    prev = { val: -Infinity };
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (node.val < prev.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
    inorder(node.right);
  }
  inorder(root);
  [first.val, second.val] = [second.val, first.val];
}
```

**Time:** O(n) | **Space:** O(h)
