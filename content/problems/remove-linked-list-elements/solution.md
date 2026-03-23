## Dummy Head

```javascript
function removeElements(head, val) {
  const dummy = {next: head};
  let curr = dummy;
  while (curr.next) {
    if (curr.next.val === val) curr.next = curr.next.next;
    else curr = curr.next;
  }
  return dummy.next;
}
```

**Time:** O(n) | **Space:** O(1)
