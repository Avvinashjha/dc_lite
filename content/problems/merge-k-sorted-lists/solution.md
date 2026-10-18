## Divide and Conquer

Merge adjacent pairs of lists in rounds. Compare the two current head values, append the smaller node, and advance that list. Once either list ends, attach the remaining suffix. If a round contains an unpaired list, carry it forward unchanged. Repeatedly halve the number of lists until one remains.

Each round visits at most N nodes, and there are at most ceil(log₂ k) rounds. The list-head arrays themselves also require O(k) total processing, which matters when many input lists are empty.

```javascript
function mergeKLists(lists) {
  if (!lists.length) return null;
  function merge(a, b) {
    const dummy = { next: null };
    let curr = dummy;
    while (a && b) {
      if (a.val <= b.val) {
        curr.next = a;
        a = a.next;
      } else {
        curr.next = b;
        b = b.next;
      }
      curr = curr.next;
    }
    curr.next = a || b;
    return dummy.next;
  }
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2)
      merged.push(
        i + 1 < lists.length ? merge(lists[i], lists[i + 1]) : lists[i],
      );
    lists = merged;
  }
  return lists[0];
}
```

**Time:** O(k + N log(k + 1)), where N is the total node count. Empty input takes O(1).

**Space:** O(k) auxiliary space for arrays of list heads. Existing nodes are reused.
