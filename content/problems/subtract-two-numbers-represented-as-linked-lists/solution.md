## Digit-by-Digit Subtraction

Copy digits into arrays and skip their leading zeros. Compare significant lengths, then digits lexicographically, to put the larger number first. Work from right to left, carrying a borrow into the next position. Prepend each result digit so the returned list remains most-significant-first.

This avoids whole-number conversion and leaves both input lists unchanged.

```javascript
function subtractLists(l1, l2) {
  function digits(node) {
    const values = [];
    for (; node; node = node.next) values.push(node.val);
    let start = 0;
    while (start < values.length - 1 && values[start] === 0) start++;
    return values.slice(start);
  }
  let a = digits(l1), b = digits(l2);
  let comparison = a.length - b.length;
  if (comparison === 0) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) { comparison = a[i] - b[i]; break; }
    }
  }
  if (comparison < 0) [a, b] = [b, a];
  let i = a.length - 1, j = b.length - 1, borrow = 0, head = null;
  while (i >= 0) {
    let value = a[i--] - (j >= 0 ? b[j--] : 0) - borrow;
    borrow = value < 0 ? 1 : 0;
    if (borrow) value += 10;
    head = {val: value, next: head};
  }
  while (head.next && head.val === 0) head = head.next;
  return head;
}
```

**Time:** O(m + n), where m and n are the input lengths.

**Space:** O(m + n) for digit arrays and the result list.
