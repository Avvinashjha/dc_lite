## BFS

```javascript
function snakesAndLadders(board) {
  const n = board.length;
  function getRC(s) {
    const r = Math.floor((s-1)/n), c = (s-1)%n;
    return [n-1-r, r%2===0 ? c : n-1-c];
  }
  const visited = new Set([1]), q = [[1, 0]];
  while (q.length) {
    const [pos, moves] = q.shift();
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
