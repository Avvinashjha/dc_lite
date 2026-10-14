## Hash Set

```javascript
function findPair(arr, n) {
  const set = new Set();
  n = Math.abs(n);
  for (const x of arr) {
    if (set.has(x + n) || set.has(x - n)) return true;
    set.add(x);
  }
  return false;
}
```

**Time:** O(n) | **Space:** O(n)
