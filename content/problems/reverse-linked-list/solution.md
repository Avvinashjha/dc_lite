## Reverse One Link at a Time

Keep `prev` as the head of the already-reversed prefix and `curr` as the first unprocessed node. Initially the prefix is empty, so `prev` is `null`.

Save `curr.next` before changing it, point `curr.next` back to `prev`, then advance both pointers using the saved link. Saving first prevents losing access to the unprocessed suffix.

When `curr` reaches `null`, every link has been reversed and `prev` is the new head. The first rewiring sets the old head's next pointer to `null`, making it the final tail. The loop preserves every node and its value.

```javascript
function reverseList(head) {
  let prev = null,
    curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

**Time:** O(n) | **Space:** O(1)
