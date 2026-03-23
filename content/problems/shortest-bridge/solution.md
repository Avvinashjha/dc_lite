## DFS to find island + BFS to expand

```javascript
function shortestBridge(grid) {
  const n = grid.length, q = [], dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  function dfs(r, c) {
    if (r<0||r>=n||c<0||c>=n||grid[r][c]!==1) return;
    grid[r][c] = 2; q.push([r, c]);
    for (const [dr,dc] of dirs) dfs(r+dr, c+dc);
  }
  outer: for (let i=0;i<n;i++) for (let j=0;j<n;j++) if (grid[i][j]===1) { dfs(i,j); break outer; }
  let steps = 0;
  while (q.length) {
    const size = q.length;
    for (let k=0;k<size;k++) {
      const [r,c] = q.shift();
      for (const [dr,dc] of dirs) {
        const nr=r+dr, nc=c+dc;
        if (nr>=0&&nr<n&&nc>=0&&nc<n) {
          if (grid[nr][nc]===1) return steps;
          if (grid[nr][nc]===0) { grid[nr][nc]=2; q.push([nr,nc]); }
        }
      }
    }
    steps++;
  }
  return steps;
}
```

**Time:** O(n²) | **Space:** O(n²)
