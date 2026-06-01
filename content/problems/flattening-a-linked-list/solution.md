## Approach: Merge from Right to Left

Start from the rightmost two lists and merge them into a sorted list using the bottom pointer. Continue merging the result with the next list to the left until all lists are merged into one sorted bottom list.

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
  let result = root;
  while (result.next) {
    result = merge(result, result.next);
  }
  return result;
}
```

**Time Complexity:** O(n*m) where n is number of main nodes and m is average bottom list length

**Space Complexity:** O(1)
