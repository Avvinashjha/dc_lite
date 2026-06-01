## Two Pointer Elimination

```javascript
function findCelebrity(n, knows) {
  let candidate = 0;
  for (let i = 1; i < n; i++) if (knows(candidate, i)) candidate = i;
  for (let i = 0; i < n; i++) {
    if (i === candidate) continue;
    if (knows(candidate, i) || !knows(i, candidate)) return -1;
  }
  return candidate;
}
```

**Time:** O(n) | **Space:** O(1)
