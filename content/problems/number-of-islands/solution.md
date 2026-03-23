## DFS Flood Fill

```javascript
function numIslands(grid) {
  const m = grid.length, n = grid[0].length;
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  }
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      if (grid[i][j] === '1') { count++; dfs(i, j); }
  return count;
}
```

**Time:** O(mn) | **Space:** O(mn)
