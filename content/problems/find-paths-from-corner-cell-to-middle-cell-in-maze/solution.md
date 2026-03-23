## Approach: DFS Backtracking

Start DFS from each corner cell. At each cell, try jumping exactly `maze[i][j]` steps in all four directions. Mark cells as visited to avoid cycles, and backtrack when a direction leads nowhere. Collect the path when you reach the center.

```javascript
function findPaths(maze) {
  const n = maze.length;
  const mid = Math.floor(n / 2);
  const results = [];
  const corners = [[0, 0], [0, n - 1], [n - 1, 0], [n - 1, n - 1]];
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  function dfs(r, c, path, visited) {
    if (r === mid && c === mid) {
      results.push([...path]);
      return;
    }

    const steps = maze[r][c];
    for (const [dr, dc] of dirs) {
      const nr = r + dr * steps;
      const nc = c + dc * steps;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
      const key = nr * n + nc;
      if (visited.has(key)) continue;

      visited.add(key);
      path.push([nr, nc]);
      dfs(nr, nc, path, visited);
      path.pop();
      visited.delete(key);
    }
  }

  for (const [sr, sc] of corners) {
    const key = sr * n + sc;
    dfs(sr, sc, [[sr, sc]], new Set([key]));
  }
  return results;
}
```

**Time Complexity:** O(4^(n²)) worst case — each cell has up to 4 choices, but visited pruning keeps it manageable

**Space Complexity:** O(n²) for the visited set and recursion stack
