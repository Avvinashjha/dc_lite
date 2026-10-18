## Two Lists

Use two dummy heads and two tail pointers. Walk the original list once, appending each node to the appropriate tail. Appending in traversal order preserves relative order in both groups.

After the scan, set the second tail's `next` to `null`. This is essential: its old link might point back into the first group, which would create a cycle when the groups are joined. Connect the first tail to the second group's head and return the first dummy's next node. Empty groups need no special handling.

The dummy heads are temporary helpers; every node in the returned list is an original node with its original value.

```javascript
function partition(head, x) {
  const before = { next: null },
    after = { next: null };
  let b = before,
    a = after;
  while (head) {
    if (head.val < x) {
      b.next = head;
      b = b.next;
    } else {
      a.next = head;
      a = a.next;
    }
    head = head.next;
  }
  a.next = null;
  b.next = after.next;
  return before.next;
}
```

**Time:** O(n) | **Space:** O(1)
