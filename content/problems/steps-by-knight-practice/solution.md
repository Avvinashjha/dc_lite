## BFS

```javascript
function minSteps(n, src, dest) {
  const moves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  const visited = Array.from({length:n}, ()=>Array(n).fill(false));
  const q = [[src[0],src[1],0]]; visited[src[0]][src[1]] = true;
  while (q.length) {
    const [r,c,d] = q.shift();
    if (r===dest[0] && c===dest[1]) return d;
    for (const [dr,dc] of moves) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<n&&nc>=0&&nc<n&&!visited[nr][nc]) { visited[nr][nc]=true; q.push([nr,nc,d+1]); }
    }
  }
  return -1;
}
```

**Time:** O(n²) | **Space:** O(n²)
