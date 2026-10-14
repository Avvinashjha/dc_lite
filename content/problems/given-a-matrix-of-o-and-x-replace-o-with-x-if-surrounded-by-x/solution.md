## Border Flood Fill

Only regions connected to a border survive. Mark all such cells safe with an iterative flood fill, then capture unmarked O cells.

```javascript
function givenAMatrixOfOAndXReplaceOWithXIfSurroundedByX(board) {
  if(!board.length)return board;
  const rows=board.length,cols=board[0].length,stack=[];
  function visit(r,c){if(r>=0&&r<rows&&c>=0&&c<cols&&board[r][c]==='O'){board[r][c]='S';stack.push([r,c]);}}
  for(let r=0;r<rows;r++){visit(r,0);visit(r,cols-1);}for(let c=0;c<cols;c++){visit(0,c);visit(rows-1,c);}
  while(stack.length){const [r,c]=stack.pop();visit(r+1,c);visit(r-1,c);visit(r,c+1);visit(r,c-1);}
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)board[r][c]=board[r][c]==='S'?'O':'X';
  return board;
}
```

**Time:** O(rows × cols) | **Space:** O(rows × cols)
