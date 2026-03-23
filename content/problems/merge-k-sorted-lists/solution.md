## Divide and Conquer

```javascript
function mergeKLists(lists) {
  if (!lists.length) return null;
  function merge(a, b) {
    const dummy = {next: null}; let curr = dummy;
    while (a && b) {
      if (a.val <= b.val) { curr.next = a; a = a.next; }
      else { curr.next = b; b = b.next; }
      curr = curr.next;
    }
    curr.next = a || b;
    return dummy.next;
  }
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2)
      merged.push(i+1 < lists.length ? merge(lists[i], lists[i+1]) : lists[i]);
    lists = merged;
  }
  return lists[0];
}
```

**Time:** O(N log k) | **Space:** O(1)
