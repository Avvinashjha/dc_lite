To update in-place, encode transitions with extra states: `2` means alive → dead, `3` means dead → alive. Count live neighbors using original states (values 1 or 2), then do a final pass to map states back to 0/1.

```javascript
function gameOfLife(board) {
  const m = board.length, n = board[0].length;
  const dirs = [-1, 0, 1];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let live = 0;
      for (const di of dirs) {
        for (const dj of dirs) {
          if (di === 0 && dj === 0) continue;
          const ni = i + di, nj = j + dj;
          if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
            if (board[ni][nj] === 1 || board[ni][nj] === 2) live++;
          }
        }
      }
      if (board[i][j] === 1 && (live < 2 || live > 3)) board[i][j] = 2;
      if (board[i][j] === 0 && live === 3) board[i][j] = 3;
    }
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 2) board[i][j] = 0;
      if (board[i][j] === 3) board[i][j] = 1;
    }
  }
}
```

**Time:** O(m × n)
**Space:** O(1)
