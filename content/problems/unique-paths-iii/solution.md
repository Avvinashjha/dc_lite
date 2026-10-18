## Backtracking

Count all non-obstacle cells, including the start and end. Search from the start, temporarily marking each visited cell as blocked. Restore its original value after exploring its neighbors so other candidate paths can use it.

`remaining` includes the current cell. At the ending cell, count the path only when `remaining === 1`; otherwise stop that branch because the end cannot be used as an intermediate cell.

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
    const original = grid[r][c];
    grid[r][c] = -1;
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      dfs(r + dr, c + dc, remaining - 1);
    }
    grid[r][c] = original;
  }

  dfs(startR, startC, empty);
  return count;
}
```

**Time:** O(3^(m·n)) — after the first move, returning to the previous cell is forbidden, leaving at most 3 choices
**Space:** O(m·n)
