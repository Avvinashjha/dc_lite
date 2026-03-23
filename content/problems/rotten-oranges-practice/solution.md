## Multi-source BFS

```javascript
function orangesRotting(grid) {
  const m = grid.length, n = grid[0].length, q = [];
  let fresh = 0;
  for (let i=0;i<m;i++) for (let j=0;j<n;j++) {
    if (grid[i][j]===2) q.push([i,j]);
    if (grid[i][j]===1) fresh++;
  }
  if (!fresh) return 0;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  let time = 0;
  while (q.length && fresh) {
    time++;
    const size = q.length;
    for (let k=0;k<size;k++) {
      const [r,c] = q.shift();
      for (const [dr,dc] of dirs) {
        const nr=r+dr, nc=c+dc;
        if (nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]===1) {
          grid[nr][nc]=2; fresh--; q.push([nr,nc]);
        }
      }
    }
  }
  return fresh ? -1 : time;
}
```

**Time:** O(mn) | **Space:** O(mn)
