First reject words longer than the board or needing more copies of a letter than the board contains. These checks avoid expensive searches for impossible inputs.

Iterate through each cell in the grid. If it matches the first character of the word, run DFS to match remaining characters. Mark cells as visited during recursion and restore them on backtrack.

```javascript
function exist(board, word) {
  const rows = board.length, cols = board[0].length;

  if (word.length > rows * cols) return false;
  const counts = new Map();
  for (const row of board) for (const ch of row) {
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }
  for (const ch of word) {
    if (!counts.get(ch)) return false;
    counts.set(ch, counts.get(ch) - 1);
  }

  function dfs(r, c, idx) {
    if (idx === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[idx]) return false;

    const temp = board[r][c];
    board[r][c] = '#';

    const found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) ||
                  dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);

    board[r][c] = temp;
    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}
```

**Time:** O(m·n·3^L) where L is the word length
**Space:** O(L) recursion depth plus a constant-size English-letter frequency map.
