## Hash Set

```javascript
function findPair(arr, n) {
  const set = new Set(arr);
  for (const x of arr) if (set.has(x + n) || set.has(x - n)) return true;
  return false;
}
```

**Time:** O(n) | **Space:** O(n)
