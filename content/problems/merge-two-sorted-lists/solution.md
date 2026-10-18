## Iterative Merge

Use a dummy node to avoid special handling for the first output node. Compare the current heads, append the smaller node, and advance only that input pointer. Once one list is exhausted, attach the remaining sorted suffix from the other list. Return dummy.next so the placeholder itself is excluded. Existing nodes are relinked; no output-sized buffer is allocated.

```javascript
function mergeTwoLists(l1, l2) {
  const dummy = { val: 0, next: null };
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  curr.next = l1 || l2;
  return dummy.next;
}
```

**Time:** O(m + n) | **Space:** O(1)
