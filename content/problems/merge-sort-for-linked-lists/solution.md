## Approach: Split and Merge Linked Lists

Use slow and fast pointers to find the middle, then cut the link before sorting the two halves recursively. Merge the sorted halves by relinking their nodes. The merge is iterative, so a long list does not create a linear-depth call stack. Only the balanced splitting is recursive.

```javascript
function mergeSortForLinkedLists(head) {
  if (!head || !head.next) return head;
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const second = slow.next;
  slow.next = null;
  let left = mergeSortForLinkedLists(head);
  let right = mergeSortForLinkedLists(second);
  const dummy = { next: null };
  let tail = dummy;
  while (left && right) {
    if (left.val <= right.val) {
      tail.next = left;
      left = left.next;
    } else {
      tail.next = right;
      right = right.next;
    }
    tail = tail.next;
  }
  tail.next = left || right;
  return dummy.next;
}
```

**Time Complexity:** O(n log n).

**Space Complexity:** O(log n) auxiliary space for recursive splitting. Existing nodes are reused.
