## Breadth-First Search

Treat each square as a state. Each edge represents one legal die roll followed by its mandatory jump, if any. BFS visits states in increasing roll count, so the first arrival at the final square is optimal. Mark the post-jump destination visited to handle cycles without reprocessing states.

Convert a label to its row counted from the bottom, reverse the column on odd-numbered rows, then convert to the top-first array row.

```javascript
function snakesAndLadders(board) {
  const n = board.length;
  function getRC(s) {
    const r = Math.floor((s-1)/n), c = (s-1)%n;
    return [n-1-r, r%2===0 ? c : n-1-c];
  }
  const visited = new Set([1]), q = [[1, 0]];
  let head = 0;
  while (head < q.length) {
    const [pos, moves] = q[head++];
    for (let i = 1; i <= 6; i++) {
      let next = pos + i; if (next > n*n) continue;
      const [r, c] = getRC(next);
      if (board[r][c] !== -1) next = board[r][c];
      if (next === n*n) return moves + 1;
      if (!visited.has(next)) { visited.add(next); q.push([next, moves+1]); }
    }
  }
  return -1;
}
```

**Time:** O(n²) | **Space:** O(n²)
