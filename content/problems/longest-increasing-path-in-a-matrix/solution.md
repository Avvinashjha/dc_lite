## Topological Layers

Orient edges from smaller cells to larger neighbors. Cells with no smaller neighbor start the first layer. Remove them, decrement successor indegrees, and repeat. The number of layers equals the longest increasing path; strict increases make the graph acyclic.

```javascript
function longestIncreasingPathInAMatrix(matrix) {
  const rows = matrix.length,
    cols = matrix[0].length,
    dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
  const indegree = Array.from({ length: rows }, () => Array(cols).fill(0)),
    queue = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          matrix[nr][nc] < matrix[r][c]
        )
          indegree[r][c]++;
      }
      if (indegree[r][c] === 0) queue.push([r, c]);
    }
  let head = 0,
    length = 0;
  while (head < queue.length) {
    const end = queue.length;
    length++;
    while (head < end) {
      const [r, c] = queue[head++];
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          matrix[nr][nc] > matrix[r][c] &&
          --indegree[nr][nc] === 0
        )
          queue.push([nr, nc]);
      }
    }
  }
  return length;
}
```

**Time:** O(rows × cols) | **Space:** O(rows × cols)
