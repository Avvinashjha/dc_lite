## DP

```javascript
function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue;
      const top = i > 0 ? grid[i-1][j] : Infinity;
      const left = j > 0 ? grid[i][j-1] : Infinity;
      grid[i][j] += Math.min(top, left);
    }
  return grid[m-1][n-1];
}
```

**Time:** O(mn) | **Space:** O(1)
