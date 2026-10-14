## Island Labels and Sizes

Label each island with a distinct ID using an explicit stack. For each zero, add the sizes of its distinct neighboring islands plus one. Counting each ID once avoids double counting an island touching the zero on multiple sides.

```javascript
function largestIsland(grid) {
  const n=grid.length,dirs=[[1,0],[-1,0],[0,1],[0,-1]],sizes=new Map();let id=2,best=0;
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(grid[r][c]===1){
    const stack=[[r,c]];grid[r][c]=id;let size=0;
    while(stack.length){const [x,y]=stack.pop();size++;for(const [dx,dy] of dirs){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<n&&ny>=0&&ny<n&&grid[nx][ny]===1){grid[nx][ny]=id;stack.push([nx,ny]);}}}
    sizes.set(id++,size);best=Math.max(best,size);
  }
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(grid[r][c]===0){
    const seen=new Set();let total=1;
    for(const [dr,dc] of dirs){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]>1&&!seen.has(grid[nr][nc])){seen.add(grid[nr][nc]);total+=sizes.get(grid[nr][nc]);}}
    best=Math.max(best,total);
  }
  return best;
}
```

**Time:** O(n²) | **Space:** O(n²)
