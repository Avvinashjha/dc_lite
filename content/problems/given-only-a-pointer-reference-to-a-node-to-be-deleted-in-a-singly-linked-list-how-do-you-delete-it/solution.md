## Copy Next Node

Copy the next node's value and skip it.

```javascript
function deleteNode(node) {
  node.val = node.next.val;
  node.next = node.next.next;
}
```

**Time:** O(1) | **Space:** O(1)
