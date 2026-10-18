## Dummy Head and Equal-Value Runs

Place a dummy node before the head so a repeated group at the beginning can be removed just like any other group. Keep `prev` at the last retained node, initially the dummy.

Starting from `prev.next`, advance `curr` to the end of the equal-value run. If `curr` is still the run's first node, the value occurred once, so retain it and advance `prev`. Otherwise bypass the entire run by assigning `prev.next = curr.next`, leaving `prev` in place.

Sorted order guarantees all occurrences of a value form one run. Every node is examined a constant number of times, and surviving node identities and values are unchanged. The dummy is only a helper and is not returned as part of the list.

```javascript
function deleteDuplicates(head) {
  const dummy = { next: head };
  let prev = dummy;
  while (prev.next) {
    let curr = prev.next;
    while (curr.next && curr.val === curr.next.val) curr = curr.next;
    if (prev.next === curr) prev = prev.next;
    else prev.next = curr.next;
  }
  return dummy.next;
}
```

**Time:** O(n) | **Space:** O(1)
