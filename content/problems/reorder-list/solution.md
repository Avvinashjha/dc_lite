## Find Middle + Reverse + Merge

```javascript
function reorderList(head) {
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
  let prev = null, curr = slow.next;
  slow.next = null;
  while (curr) { const next = curr.next; curr.next = prev; prev = curr; curr = next; }
  let l1 = head, l2 = prev;
  while (l2) { const n1 = l1.next, n2 = l2.next; l1.next = l2; l2.next = n1; l1 = n1; l2 = n2; }
}
```

**Time:** O(n) | **Space:** O(1)
