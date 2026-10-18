## Split, Reverse, and Merge Alternately

Use slow and fast pointers to find the end of the first half. Detach the second half so the first list ends with `null`. For an odd-length input, the first half contains the middle node and is one node longer.

Reverse the second half iteratively, making its nodes available from the original tail inward. Then weave one second-half node after each first-half node. Save both next pointers before rewiring, so neither remaining chain is lost.

Stop when the second half is exhausted. The extra middle node, if any, already ends the first half. All original nodes and values are preserved, and detaching before merging prevents leftover links from creating a cycle.

```javascript
function reorderList(head) {
  let slow = head,
    fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null,
    curr = slow.next;
  slow.next = null;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  let l1 = head,
    l2 = prev;
  while (l2) {
    const n1 = l1.next,
      n2 = l2.next;
    l1.next = l2;
    l2.next = n1;
    l1 = n1;
    l2 = n2;
  }
}
```

**Time:** O(n) | **Space:** O(1)
