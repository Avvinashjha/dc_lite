## Breadth-First Search from Every Rotten Orange

Collect all initially rotten cells into one queue and count fresh oranges. Starting all sources together models simultaneous spreading and gives the earliest infection time for every reachable cell.

At each minute, process only the queue entries present at the start of that layer. Mark a fresh neighbor rotten as soon as it is enqueued, preventing multiple neighboring sources from counting it twice. Newly enqueued cells wait for the next layer before spreading further.

Stop when no fresh oranges remain or the queue is exhausted. Remaining fresh oranges are unreachable and require `-1`. If none were fresh initially, return zero without advancing time.

A head index advances through the queue without repeatedly shifting array contents. Each cell is enqueued at most once.

```javascript
function orangesRotting(grid) {
  const m = grid.length,
    n = grid[0].length,
    q = [];
  let fresh = 0;
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 2) q.push([i, j]);
      if (grid[i][j] === 1) fresh++;
    }
  if (!fresh) return 0;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let time = 0;
  let head = 0;
  while (head < q.length && fresh) {
    time++;
    const size = q.length - head;
    for (let k = 0; k < size; k++) {
      const [r, c] = q[head++];
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          q.push([nr, nc]);
        }
      }
    }
  }
  return fresh ? -1 : time;
}
```

**Time:** O(mn) | **Space:** O(mn)
