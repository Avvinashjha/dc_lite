## Slow and Fast Pointers

Move slow one node and fast two nodes at each step. When fast reaches the end, slow has advanced floor(n / 2) positions, which selects the second middle for even lengths. Only references move; the list itself is unchanged.

```javascript
function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return slow;
}
```

**Time:** O(n) | **Space:** O(1)
