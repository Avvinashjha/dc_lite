## Approach: DFS + Memoization

For each cell, perform DFS to all 4 neighbors with strictly greater values. Cache the longest path from each cell to avoid recomputation. The answer is the maximum cached value.

```javascript
function longestIncreasingPathInAMatrix(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const memo = Array.from({length: m}, () => Array(n).fill(0));
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  function dfs(r, c) {
    if (memo[r][c]) return memo[r][c];
    let best = 1;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c])
        best = Math.max(best, 1 + dfs(nr, nc));
    }
    return memo[r][c] = best;
  }
  let result = 0;
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      result = Math.max(result, dfs(i, j));
  return result;
}
```

**Time Complexity:** O(m × n)

**Space Complexity:** O(m × n)
