## DFS/Stack

Process child lists before continuing with next pointer.

```javascript
function flatten(head) {
  let curr = head;
  while (curr) {
    if (curr.child) {
      let childTail = curr.child;
      while (childTail.next) childTail = childTail.next;
      childTail.next = curr.next;
      if (curr.next) curr.next.prev = childTail;
      curr.next = curr.child;
      curr.child.prev = curr;
      curr.child = null;
    }
    curr = curr.next;
  }
  return head;
}
```

**Time:** O(n) | **Space:** O(1)
