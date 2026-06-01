## Iterative Merge

```javascript
function mergeTwoLists(l1, l2) {
  const dummy = {val: 0, next: null};
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 || l2;
  return dummy.next;
}
```

**Time:** O(m + n) | **Space:** O(1)
