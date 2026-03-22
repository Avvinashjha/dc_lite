## Find Mid + Reverse + Interleave

```javascript
function rearrange(head) {
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
  let second = slow.next; slow.next = null;
  let prev = null;
  while (second) { const next = second.next; second.next = prev; prev = second; second = next; }
  let first = head; second = prev;
  while (second) { const n1 = first.next, n2 = second.next; first.next = second; second.next = n1; first = n1; second = n2; }
}
```

**Time:** O(n) | **Space:** O(1)
