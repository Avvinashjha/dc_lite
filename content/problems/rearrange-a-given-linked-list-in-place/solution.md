## Split, Reverse, and Interleave

Find the end of the first half using slow and fast pointers. Detach the second half by setting `slow.next` to `null`; this prevents the later weaving step from retaining an old link that creates a cycle.

Reverse the second half iteratively. Its nodes are now in the order needed from the far end of the original list. Alternate a node from the first half with a node from the reversed half, saving both next pointers before changing links.

For odd lengths, the first half has one extra node, which naturally remains at the end. No node values change and no replacement nodes are allocated.

```javascript
function rearrange(head) {
  let slow = head,
    fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let second = slow.next;
  slow.next = null;
  let prev = null;
  while (second) {
    const next = second.next;
    second.next = prev;
    prev = second;
    second = next;
  }
  let first = head;
  second = prev;
  while (second) {
    const n1 = first.next,
      n2 = second.next;
    first.next = second;
    second.next = n1;
    first = n1;
    second = n2;
  }
}
```

**Time:** O(n) | **Space:** O(1)
