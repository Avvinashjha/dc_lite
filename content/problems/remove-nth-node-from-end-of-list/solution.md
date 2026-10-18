## Two Pointers with a Fixed Gap

Place a dummy node before the head and start both pointers there. Move `fast` forward `n + 1` links, then advance both pointers together until `fast` reaches `null`.

The maintained gap puts `slow` immediately before the node to delete. Bypass that node with `slow.next = slow.next.next`. The dummy handles deleting the head without a separate branch, including the single-node case.

The loop deliberately advances `n + 1` times, not n: the slow pointer must stop at the predecessor. The valid-n guarantee makes all initial advances safe.

```javascript
function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let fast = dummy,
    slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}
```

**Time:** O(L) | **Space:** O(1)
