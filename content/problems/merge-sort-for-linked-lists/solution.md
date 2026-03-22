## Split + Merge

```javascript
function sortList(head) {
  if (!head || !head.next) return head;
  let slow = head, fast = head.next;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  const mid = slow.next; slow.next = null;
  return merge(sortList(head), sortList(mid));
}
function merge(a, b) {
  const dummy = {next: null}; let t = dummy;
  while (a && b) { if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; } t = t.next; }
  t.next = a || b;
  return dummy.next;
}
```

**Time:** O(n log n) | **Space:** O(log n)
