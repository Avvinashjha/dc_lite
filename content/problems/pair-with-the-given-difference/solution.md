## Hash Set

Keep a set of values at earlier indices. For the current value `x`, a matching earlier value must be either `x - n` or `x + n`; checking both handles either input order.

Check before inserting `x`. This guarantees different indices, including when `n = 0`: a value matches only if another occurrence was already seen. If the scan ends without a match, no pair exists.

```javascript
function findPair(arr, n) {
  const set = new Set();
  for (const x of arr) {
    if (set.has(x + n) || set.has(x - n)) return true;
    set.add(x);
  }
  return false;
}
```

**Time:** O(L) expected | **Space:** O(L), where L is arr.length (the parameter n is the target difference).
