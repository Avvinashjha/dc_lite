## Level-by-Level Using Next Pointers

The current level's `next` links let us traverse it without a queue. For each parent, connect its left child to its right child. If the parent has a next neighbor, connect its right child to that neighbor's left child. Otherwise its right child remains the last node on the next level and points to `null`.

After finishing a level, move to its leftmost child. The root's level is already linked because its only node points to `null`; each completed level establishes the links needed for the next traversal. The perfect-tree guarantee ensures that both children exist whenever the level has children.

```javascript
function connect(root) {
  if (!root) return root;
  let leftmost = root;
  while (leftmost.left) {
    let curr = leftmost;
    while (curr) {
      curr.left.next = curr.right;
      curr.right.next = curr.next ? curr.next.left : null;
      curr = curr.next;
    }
    leftmost = leftmost.left;
  }
  return root;
}
```

**Time:** O(n) | **Space:** O(1)
