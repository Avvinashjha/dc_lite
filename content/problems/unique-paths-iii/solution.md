Count total non-obstacle squares. Start DFS from the starting cell, tracking visited squares. When we reach the ending cell having visited all non-obstacle squares, increment the path count.

```javascript
function uniquePathsIII(grid) {
  const rows = grid.length, cols = grid[0].length;
  let startR, startC, empty = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== -1) empty++;
      if (grid[r][c] === 1) { startR = r; startC = c; }
    }
  }

  let count = 0;
  function dfs(r, c, remaining) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === -1) return;
    if (grid[r][c] === 2) {
      if (remaining === 1) count++;
      return;
    }
    grid[r][c] = -1;
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      dfs(r + dr, c + dc, remaining - 1);
    }
    grid[r][c] = 0;
  }

  dfs(startR, startC, empty);
  return count;
}
```

**Time:** O(3^(m·n)) — at most 3 choices per cell due to backtracking
**Space:** O(m·n)
