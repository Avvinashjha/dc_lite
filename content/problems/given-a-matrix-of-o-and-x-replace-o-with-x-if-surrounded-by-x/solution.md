## Approach: Border DFS

First DFS from all border 'O's and mark them as safe ('S'). Then iterate through the entire board: convert remaining 'O's to 'X' (they are surrounded), and convert 'S' back to 'O'.

```javascript
function givenAMatrixOfOAndXReplaceOWithXIfSurroundedByX(board) {
  if (!board.length) return board;
  const m = board.length, n = board[0].length;
  function dfs(r, c) {
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== "O") return;
    board[r][c] = "S";
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  }
  for (let i = 0; i < m; i++) { dfs(i, 0); dfs(i, n-1); }
  for (let j = 0; j < n; j++) { dfs(0, j); dfs(m-1, j); }
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      board[i][j] = board[i][j] === "S" ? "O" : "X";
  return board;
}
```

**Time Complexity:** O(m × n)

**Space Complexity:** O(m × n) for recursion stack
