## Binary Search + BFS / Dijkstra

```javascript
function swimInWater(grid) {
  const n = grid.length, dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  let lo = grid[0][0], hi = n*n-1;
  while (lo < hi) {
    const mid = (lo+hi)>>1;
    const visited = Array.from({length:n}, ()=>Array(n).fill(false));
    const q = [[0,0]]; visited[0][0] = true;
    if (grid[0][0] > mid) { lo = mid+1; continue; }
    while (q.length) {
      const [r,c] = q.shift();
      for (const [dr,dc] of dirs) {
        const nr=r+dr,nc=c+dc;
        if (nr>=0&&nr<n&&nc>=0&&nc<n&&!visited[nr][nc]&&grid[nr][nc]<=mid) { visited[nr][nc]=true; q.push([nr,nc]); }
      }
    }
    if (visited[n-1][n-1]) hi = mid; else lo = mid+1;
  }
  return lo;
}
```

**Time:** O(n² log n) | **Space:** O(n²)
