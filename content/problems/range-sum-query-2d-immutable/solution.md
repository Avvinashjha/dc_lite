## Prefix Sum 2D

```javascript
class NumMatrix {
  constructor(matrix) {
    const m = matrix.length, n = matrix[0].length;
    this.prefix = Array.from({length: m+1}, () => Array(n+1).fill(0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        this.prefix[i][j] = matrix[i-1][j-1] + this.prefix[i-1][j] + this.prefix[i][j-1] - this.prefix[i-1][j-1];
  }
  sumRegion(r1, c1, r2, c2) {
    return this.prefix[r2+1][c2+1] - this.prefix[r1][c2+1] - this.prefix[r2+1][c1] + this.prefix[r1][c1];
  }
}
```

**Time:** O(1) per query, O(mn) init | **Space:** O(mn)
