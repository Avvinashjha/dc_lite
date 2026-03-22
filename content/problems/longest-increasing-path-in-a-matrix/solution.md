## DFS with Memoization

```javascript
function longestIncreasingPath(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const memo = Array.from({length: m}, () => Array(n).fill(0));
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  function dfs(r, c) {
    if (memo[r][c]) return memo[r][c];
    let max = 1;
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && matrix[nr][nc] > matrix[r][c])
        max = Math.max(max, 1 + dfs(nr, nc));
    }
    return memo[r][c] = max;
  }
  let result = 0;
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      result = Math.max(result, dfs(i, j));
  return result;
}
```

**Time:** O(mn) | **Space:** O(mn)
