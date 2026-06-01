## Binary Search on Answer

Binary search on the maximum pages. For each candidate, greedily check if M students can read all books.

```javascript
function allocateMinimumPages(arr, m) {
  if (m > arr.length) return -1;
  let lo = Math.max(...arr), hi = arr.reduce((a, b) => a + b, 0);
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
