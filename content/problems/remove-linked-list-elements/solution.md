## Dummy Head and a Predecessor Pointer

Create a temporary dummy node pointing to the head. Keep `curr` immediately before the next node to inspect, which lets the same code remove both leading and interior nodes.

If `curr.next` matches the target, bypass it. Do not advance `curr` after a removal: the following node may also match. If it does not match, retain it by advancing `curr`.

The loop preserves the relative order and values of every retained node. Return `dummy.next`, which may now be a different original node or `null`. The dummy itself is never included in the result.

```javascript
function removeElements(head, val) {
  const dummy = { next: head };
  let curr = dummy;
  while (curr.next) {
    if (curr.next.val === val) curr.next = curr.next.next;
    else curr = curr.next;
  }
  return dummy.next;
}
```

**Time:** O(n) | **Space:** O(1)
