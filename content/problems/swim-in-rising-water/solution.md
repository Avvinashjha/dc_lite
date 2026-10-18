## Binary Search with BFS Reachability

A water level is feasible if BFS can reach the destination using only cells no higher than that level. Once a level is feasible, every higher level is feasible too, so binary search finds the first feasible level.

The lower bound is the larger endpoint elevation. The upper bound n² - 1 makes every cell available under the unique-elevation constraints.

```javascript
function swimInWater(grid) {
  const n = grid.length,
    dirs = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
  let lo = Math.max(grid[0][0], grid[n - 1][n - 1]),
    hi = n * n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const visited = Array.from({ length: n }, () => Array(n).fill(false));
    const q = [[0, 0]];
    visited[0][0] = true;
    let head = 0;
    while (head < q.length) {
      const [r, c] = q[head++];
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < n &&
          nc >= 0 &&
          nc < n &&
          !visited[nr][nc] &&
          grid[nr][nc] <= mid
        ) {
          visited[nr][nc] = true;
          q.push([nr, nc]);
        }
      }
    }
    if (visited[n - 1][n - 1]) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
```

**Time:** O(n² log n) | **Space:** O(n²)
