## Multi-source BFS

Start BFS from all cells containing 1 simultaneously.

```javascript
function nearestCell(grid) {
  const m = grid.length, n = grid[0].length;
  const dist = Array.from({length: m}, () => Array(n).fill(Infinity));
  const q = [];
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      if (grid[i][j] === 1) { dist[i][j] = 0; q.push([i, j]); }
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while (q.length) {
    const [r, c] = q.shift();
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] > dist[r][c]+1) {
        dist[nr][nc] = dist[r][c]+1; q.push([nr, nc]);
      }
    }
  }
  return dist;
}
```

**Time:** O(mn) | **Space:** O(mn)
