## Matrix-Tree Theorem with Exact Elimination

Build the Laplacian: each diagonal entry is the vertex degree, and an off-diagonal entry is -1 when the two vertices are adjacent. Delete one row and the matching column. The determinant of the remaining matrix equals the spanning-tree count.

Use fraction-free elimination with BigInt so intermediate arithmetic is exact. Each division is exact by the elimination invariant. A missing pivot means the determinant is zero. The empty determinant for one vertex is 1.

```javascript
function countSpanningTrees(adj, V) {
  if (V === 1) return 1;
  const n = V - 1;
  const matrix = Array.from({length: n}, (_, i) =>
    Array.from({length: n}, (_, j) =>
      i === j ? BigInt(adj[i].length) : adj[i].includes(j) ? -1n : 0n
    )
  );
  let previous = 1n, sign = 1n;
  for (let k = 0; k < n - 1; k++) {
    let pivotRow = k;
    while (pivotRow < n && matrix[pivotRow][k] === 0n) pivotRow++;
    if (pivotRow === n) return 0;
    if (pivotRow !== k) {
      [matrix[k], matrix[pivotRow]] = [matrix[pivotRow], matrix[k]];
      sign = -sign;
    }
    const pivot = matrix[k][k];
    for (let i = k + 1; i < n; i++) {
      for (let j = k + 1; j < n; j++) {
        matrix[i][j] = (matrix[i][j] * pivot - matrix[i][k] * matrix[k][j]) / previous;
      }
      matrix[i][k] = 0n;
    }
    previous = pivot;
  }
  return Number(sign * matrix[n - 1][n - 1]);
}
```

For V ≤ 10, the complete graph has the largest possible count, V^(V - 2), at most 100,000,000. The final conversion to Number is therefore exact.

**Time:** O(V³) arithmetic operations. **Space:** O(V²).
