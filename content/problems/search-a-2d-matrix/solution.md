## Binary search on row-major index

Logical index `k` maps to `row = Math.floor(k / n)`, `col = k % n`.

```javascript
function searchMatrix(matrix, target) {
  const m = matrix.length, n = matrix[0].length;
  let lo = 0, hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const v = matrix[Math.floor(mid / n)][mid % n];
    if (v === target) return true;
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}
```

**Time:** O(log(mn)) &nbsp; **Space:** O(1)

## Note

LeetCode **240** (search 2D matrix II) has different rules — only rows and columns sorted — use the **O(m + n)** staircase from the course lesson, not this flattening trick.
