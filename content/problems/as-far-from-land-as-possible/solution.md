## Multi-source BFS

Start BFS from all land cells simultaneously and expand outward.

```javascript
function maxDistance(grid) {
  const n = grid.length, q = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (grid[i][j] === 1) q.push([i, j]);
  if (q.length === 0 || q.length === n * n) return -1;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  let dist = -1;
  while (q.length) {
    dist++;
    const size = q.length;
    for (let k = 0; k < size; k++) {
      const [r, c] = q.shift();
      for (const [dr, dc] of dirs) {
        const nr = r+dr, nc = c+dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
          grid[nr][nc] = 1; q.push([nr, nc]);
        }
      }
    }
  }
  return dist;
}
```

**Time:** O(n²) | **Space:** O(n²)
