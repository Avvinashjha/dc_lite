## Skip Adjacent Duplicates

Sorted order makes equal values adjacent. Keep `curr` at the last retained node. When its next node has the same value, bypass that next node by assigning `curr.next = curr.next.next`.

Do not advance `curr` after a removal: another duplicate may now be immediately next. Advance only when the next value differs. This retains the first node of each run, preserves its value, and removes every other occurrence in one pass.

An empty or single-node list needs no changes. Return the original head, which is retained by this implementation.

```javascript
function deleteDuplicates(head) {
  let curr = head;
  while (curr && curr.next) {
    if (curr.val === curr.next.val) curr.next = curr.next.next;
    else curr = curr.next;
  }
  return head;
}
```

**Time:** O(n) | **Space:** O(1)
