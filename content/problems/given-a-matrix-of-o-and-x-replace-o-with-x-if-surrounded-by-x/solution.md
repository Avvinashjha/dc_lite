## Border DFS

Mark border-connected O's as safe, then flip remaining O's.

```javascript
function solve(board) {
  const m = board.length, n = board[0].length;
  function dfs(r, c) {
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== 'O') return;
    board[r][c] = '#';
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  }
  for (let i = 0; i < m; i++) { dfs(i, 0); dfs(i, n-1); }
  for (let j = 0; j < n; j++) { dfs(0, j); dfs(m-1, j); }
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      board[i][j] = board[i][j] === '#' ? 'O' : 'X';
}
```

**Time:** O(mn) | **Space:** O(mn)
