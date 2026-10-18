## Move Each Next Node to the Segment Front

Use a dummy head and move `prev` to the node immediately before position `left`. Keep `curr` at the first node of the segment; it will become the segment's tail.

Repeat `right - left` times: detach the node immediately after `curr`, then insert it immediately after `prev`. Each move extends the reversed prefix by one node while `curr` remains in place as its tail.

The dummy makes a segment starting at the head work identically. The nodes outside the segment keep their order, and returning `dummy.next` supplies the possibly changed head. When both positions are equal, no moves are needed.

```javascript
function reverseBetween(head, left, right) {
  const dummy = { next: head };
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
