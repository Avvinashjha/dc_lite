## Bottom-Up Merge Sort

Merge adjacent sorted runs of length 1, then 2, then 4, doubling until the run length covers the list. Cut each pair of runs, merge by relinking their original nodes, and attach the merged run to the output of this pass.

The iterative approach avoids the O(log n) call stack required by recursive merge sort. A single dummy node anchors the output and never becomes part of the returned list.

```javascript
function sortList(head) {
  let length = 0;
  for (let node = head; node; node = node.next) length++;
  const dummy = {next: head};

  function cut(start, size) {
    if (!start) return null;
    for (let i = 1; i < size && start.next; i++) start = start.next;
    const rest = start.next;
    start.next = null;
    return rest;
  }

  for (let size = 1; size < length; size *= 2) {
    let current = dummy.next;
    let tail = dummy;
    while (current) {
      let left = current;
      let right = cut(left, size);
      current = cut(right, size);
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
      while (tail.next) tail = tail.next;
    }
  }
  return dummy.next;
}
```

**Time:** O(n log n). Each pass traverses O(n) nodes, and there are O(log n) passes.

**Auxiliary space:** O(1). Only a fixed number of pointers and one dummy node are used; all output nodes come from the input.
