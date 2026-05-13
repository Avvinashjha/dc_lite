## Binary search first true

```javascript
function firstBadVersion(n, firstBad) {
  const isBadVersion = v => v >= firstBad;
  let lo = 1, hi = n;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (isBadVersion(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
```

**Time:** O(log n) &nbsp; **Space:** O(1)

We seek the smallest `v` with `isBadVersion(v)` — monotonic predicate.

**Note:** Use `lo + (hi - lo) / 2` to avoid overflow in languages with 32-bit ints; JavaScript numbers are doubles but this form is still good practice.
