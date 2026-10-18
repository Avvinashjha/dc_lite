## Padded 2D Prefix Sums

Let `prefix[r][c]` store the sum of matrix rows before `r` and columns before `c`. An extra all-zero row and column make boundary queries work without special cases.

Build each entry from the current cell plus the prefix above and the prefix to the left, subtracting their overlapping top-left area once.

For a query, start with the prefix through `(r2, c2)`. Subtract the area above `r1` and the area left of `c1`. Their overlap was subtracted twice, so add it back. The `r2 + 1` and `c2 + 1` indices convert inclusive query endpoints into the prefix table's exclusive boundaries.

The constructor stores the prefix table once. Each query reads four entries without changing the matrix or table.

```javascript
class NumMatrix {
  constructor(matrix) {
    const m = matrix.length,
      n = matrix[0].length;
    this.prefix = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        this.prefix[i][j] =
          matrix[i - 1][j - 1] +
          this.prefix[i - 1][j] +
          this.prefix[i][j - 1] -
          this.prefix[i - 1][j - 1];
  }
  sumRegion(r1, c1, r2, c2) {
    return (
      this.prefix[r2 + 1][c2 + 1] -
      this.prefix[r1][c2 + 1] -
      this.prefix[r2 + 1][c1] +
      this.prefix[r1][c1]
    );
  }
}
```

**Time:** O(1) per query, O(mn) init | **Space:** O(mn)
