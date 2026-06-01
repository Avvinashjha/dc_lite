## In-Place Reversal

```javascript
function reverseBetween(head, left, right) {
  const dummy = {next: head};
  let prev = dummy;
  for (let i = 0; i < left - 1; i++) prev = prev.next;
  let curr = prev.next;
  for (let i = 0; i < right - left; i++) {
    const next = curr.next;
    curr.next = next.next;
    next.next = prev.next;
    prev.next = next;
  }
  return dummy.next;
}
```

**Time:** O(n) | **Space:** O(1)
