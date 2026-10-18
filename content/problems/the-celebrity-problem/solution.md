## Candidate Elimination

For each new person i, one comparison rules someone out: if the current candidate knows i, the candidate cannot be a celebrity; otherwise i cannot be one. The surviving candidate still needs verification, checking both that they know nobody else and that everyone else knows them.

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

**Time:** O(n) calls to knows, at most 3(n - 1).

**Auxiliary space:** O(1), excluding the provided fixture.
