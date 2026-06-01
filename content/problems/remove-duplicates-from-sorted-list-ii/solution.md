## Dummy Head + Skip Groups

```javascript
function deleteDuplicates(head) {
  const dummy = {next: head};
  let prev = dummy;
  while (prev.next) {
    let curr = prev.next;
    while (curr.next && curr.val === curr.next.val) curr = curr.next;
    if (prev.next === curr) prev = prev.next;
    else prev.next = curr.next;
  }
  return dummy.next;
}
```

**Time:** O(n) | **Space:** O(1)
