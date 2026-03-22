## Union-Find / DFS with Island IDs

Label islands with IDs and sizes. For each 0, check adjacent islands.

```javascript
function largestIsland(grid) {
  const n = grid.length, dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  const sizes = new Map(); let id = 2, maxSize = 0;
  function dfs(r, c, id) {
    if (r<0||r>=n||c<0||c>=n||grid[r][c]!==1) return 0;
    grid[r][c] = id;
    return 1 + dfs(r+1,c,id) + dfs(r-1,c,id) + dfs(r,c+1,id) + dfs(r,c-1,id);
  }
  for (let i=0;i<n;i++) for (let j=0;j<n;j++)
    if (grid[i][j]===1) { const s = dfs(i,j,id); sizes.set(id,s); maxSize = Math.max(maxSize,s); id++; }
  for (let i=0;i<n;i++) for (let j=0;j<n;j++) if (grid[i][j]===0) {
    const seen = new Set(); let total = 1;
    for (const [dr,dc] of dirs) {
      const nr=i+dr, nc=j+dc;
      if (nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]>1&&!seen.has(grid[nr][nc])) {
        seen.add(grid[nr][nc]); total += sizes.get(grid[nr][nc]);
      }
    }
    maxSize = Math.max(maxSize, total);
  }
  return maxSize;
}
```

**Time:** O(n²) | **Space:** O(n²)
