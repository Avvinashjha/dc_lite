## Iterative Flood Fill

Each unvisited land cell starts a new island. Mark cells when they enter the stack so every land cell is processed once.

```javascript
function numIslands(grid) {
  const rows=grid.length,cols=grid[0].length;let count=0;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++) {
    if(grid[r][c]!=='1')continue;
    count++;grid[r][c]='0';const stack=[[r,c]];
    while(stack.length){const [x,y]=stack.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx,ny=y+dy;
      if(nx>=0&&nx<rows&&ny>=0&&ny<cols&&grid[nx][ny]==='1'){grid[nx][ny]='0';stack.push([nx,ny]);}
    }}
  }
  return count;
}
```

**Time:** O(rows × cols) | **Space:** O(rows × cols)
