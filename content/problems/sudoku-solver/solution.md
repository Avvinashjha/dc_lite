Use backtracking to fill empty cells one by one. For each cell, try digits 1–9 and validate against Sudoku row, column, and 3×3 box constraints. If no digit works, backtrack.

```javascript
function solveSudoku(board) {
  function isValid(row, col, ch) {
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === ch) return false;
      if (board[i][col] === ch) return false;
      if (board[boxRow + Math.floor(i / 3)][boxCol + (i % 3)] === ch) return false;
    }
    return true;
  }

  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== '.') continue;
        for (let d = 1; d <= 9; d++) {
          const ch = String(d);
          if (isValid(r, c, ch)) {
            board[r][c] = ch;
            if (solve()) return true;
            board[r][c] = '.';
          }
        }
        return false;
      }
    }
    return true;
  }

  solve();
}
```

**Time:** O(9^(empty cells)) — bounded by the fixed board size
**Space:** O(81) recursion depth
