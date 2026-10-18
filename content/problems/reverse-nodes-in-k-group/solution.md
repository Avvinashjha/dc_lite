## Verify Each Group, Then Reverse It

Keep `prev` immediately before the next group, initially a dummy head. Look ahead `k` nodes before changing any links. If fewer remain, return immediately so the incomplete suffix stays untouched.

For a complete group, keep its first node as `curr` and move each of the next `k - 1` nodes to the group's front, directly after `prev`. The old first node becomes the reversed group's tail; move `prev` there to process the next group.

Each node participates in at most one look-ahead scan and one group reversal. The algorithm uses only pointers, preserves every original node and value, and handles k = 1 without special allocation.

```javascript
function reverseKGroup(head, k) {
  const dummy = { next: head };
  let prev = dummy;
  while (true) {
    let kth = prev;
    for (let i = 0; i < k; i++) {
      kth = kth.next;
      if (!kth) return dummy.next;
    }
    let curr = prev.next,
      next = curr.next;
    for (let i = 0; i < k - 1; i++) {
      curr.next = next.next;
      next.next = prev.next;
      prev.next = next;
      next = curr.next;
    }
    prev = curr;
  }
}
```

**Time:** O(n) | **Space:** O(1)
