## Two Lists

```javascript
function partition(head, x) {
  const before = {next:null}, after = {next:null};
  let b = before, a = after;
  while (head) {
    if (head.val < x) { b.next = head; b = b.next; }
    else { a.next = head; a = a.next; }
    head = head.next;
  }
  a.next = null; b.next = after.next;
  return before.next;
}
```

**Time:** O(n) | **Space:** O(1)
