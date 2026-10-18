## Binary Search on Answer

Binary search on the maximum pages. For each candidate limit, greedily count the contiguous groups needed. A limit is feasible if at most m groups are needed: since m does not exceed the number of books, groups can be split further until every student has a non-empty group.

```javascript
function allocateMinimumPages(arr, m) {
  if (m > arr.length) return -1;
  let lo = 0, hi = 0;
  for (const pages of arr) {
    lo = Math.max(lo, pages);
    hi += pages;
  }
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    let students = 1, pages = 0;
    for (const p of arr) {
      if (pages + p > mid) { students++; pages = p; }
      else pages += p;
    }
    if (students <= m) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
```

**Time:** O(N log S) where S = sum of pages | **Space:** O(1)
