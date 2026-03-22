Place queens one row at a time using backtracking. Track which columns and diagonals are already attacked using sets. A queen at `(row, col)` occupies the `row - col` diagonal and the `row + col` anti-diagonal.

```javascript
function solveNQueens(n) {
  const result = [];
  const cols = new Set();
  const diag = new Set();
  const antiDiag = new Set();
  const board = Array.from({ length: n }, () => '.'.repeat(n));

  function backtrack(row) {
    if (row === n) {
      result.push([...board]);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag.has(row - col) || antiDiag.has(row + col)) continue;

      cols.add(col);
      diag.add(row - col);
      antiDiag.add(row + col);
      board[row] = board[row].substring(0, col) + 'Q' + board[row].substring(col + 1);

      backtrack(row + 1);

      cols.delete(col);
      diag.delete(row - col);
      antiDiag.delete(row + col);
      board[row] = '.'.repeat(n);
    }
  }

  backtrack(0);
  return result;
}
```

**Time:** O(n!) — pruning eliminates most branches, but worst case is factorial.
**Space:** O(n) for the sets and recursion stack.
