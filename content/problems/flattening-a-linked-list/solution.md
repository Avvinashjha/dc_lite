## Approach: Merge the Bottom Lists

Walk the horizontal chain, saving each next pointer before merging its sorted bottom list into the accumulated result. Clear horizontal links so the output is a single bottom chain.

```javascript
function flatteningALinkedList(root) {
  function merge(a, b) {
    const dummy = { bottom: null };
    let curr = dummy;
    while (a && b) {
      if (a.data <= b.data) { curr.bottom = a; a = a.bottom; }
      else { curr.bottom = b; b = b.bottom; }
      curr = curr.bottom;
    }
    curr.bottom = a || b;
    return dummy.bottom;
  }
  if (!root) return null;
  // Save each horizontal successor before merging; merged nodes use bottom only.
  let result = null, current = root;
  while (current) {
    const next = current.next;
    current.next = null;
    result = merge(result, current);
    current = next;
  }
  for (let node = result; node; node = node.bottom) node.next = null;
  return result;
}
```

**Time Complexity:** O(N × k) in the worst case, where N is the total number of nodes and k is the number of bottom lists

**Space Complexity:** O(1)
