## Two Pointer (Gap of n)

```javascript
function removeNthFromEnd(head, n) {
  const dummy = {next: head};
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}
```

**Time:** O(L) | **Space:** O(1)
