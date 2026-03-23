## Backtracking

```javascript
function findPath(maze) {
  const n = maze.length, result = [];
  const visited = Array.from({length:n}, ()=>Array(n).fill(false));
  function bt(r, c, path) {
    if (r===n-1 && c===n-1) { result.push(path); return; }
    const dirs = [['D',1,0],['L',0,-1],['R',0,1],['U',-1,0]];
    for (const [d,dr,dc] of dirs) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<n&&nc>=0&&nc<n&&maze[nr][nc]&&!visited[nr][nc]) {
        visited[nr][nc]=true; bt(nr,nc,path+d); visited[nr][nc]=false;
      }
    }
  }
  if (maze[0][0]) { visited[0][0]=true; bt(0,0,''); }
  return result;
}
```

**Time:** O(4^(n²)) | **Space:** O(n²)
