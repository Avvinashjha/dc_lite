## Iterative Flood Fill and Multi-Source BFS

Mark one entire island with an explicit stack, then expand from all its cells simultaneously. Each BFS layer crosses one additional water cell. The first contact with the other island gives the minimum number of flips.

```javascript
function shortestBridge(grid) {
  const n = grid.length, q = [], dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  function markIsland(r, c) {
    const stack = [[r,c]]; grid[r][c] = 2;
    while (stack.length) {
      const [x,y] = stack.pop(); q.push([x,y]);
      for (const [dx,dy] of dirs) {
        const nx=x+dx,ny=y+dy;
        if(nx>=0&&nx<n&&ny>=0&&ny<n&&grid[nx][ny]===1) {
          grid[nx][ny]=2;stack.push([nx,ny]);
        }
      }
    }
  }
  outer: for (let i=0;i<n;i++) for (let j=0;j<n;j++) if (grid[i][j]===1) { markIsland(i,j); break outer; }
  let steps = 0;
  let head = 0;
  while (head < q.length) {
    const size = q.length - head;
    for (let k=0;k<size;k++) {
      const [r,c] = q[head++];
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
