## Interleave + Separate

Insert cloned nodes after originals, set random pointers, then separate.

```javascript
function copyRandomList(head) {
  if (!head) return null;
  let curr = head;
  while (curr) {
    const clone = {val: curr.val, next: curr.next, random: null};
    curr.next = clone; curr = clone.next;
  }
  curr = head;
  while (curr) { if (curr.random) curr.next.random = curr.random.next; curr = curr.next.next; }
  const dummy = {next: null}; let tail = dummy; curr = head;
  while (curr) {
    tail.next = curr.next; tail = tail.next;
    curr.next = curr.next.next; curr = curr.next;
  }
  return dummy.next;
}
```

**Time:** O(n) | **Space:** O(1) extra
