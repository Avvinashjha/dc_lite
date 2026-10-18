## Approach: DFS Backtracking

Start DFS from each corner cell. At each cell, try jumping exactly `maze[i][j]` steps in all four directions. Mark cells as visited to avoid cycles, and backtrack when a direction leads nowhere. Collect the path when you reach the center.

```javascript
function findPaths(maze) {
  const n = maze.length;
  const mid = Math.floor(n / 2);
  const results = [];
  const corners =
    n === 1
      ? [[0, 0]]
      : [
          [0, 0],
          [0, n - 1],
          [n - 1, 0],
          [n - 1, n - 1],
        ];
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

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

**Time:** O(4^(n²) + Pn²) as a loose worst-case bound, where `P` is the number of returned paths. Copying the paths can itself be expensive; this is an exhaustive enumeration problem.

**Space:** O(n²) auxiliary space for the current path, visited set, and recursion, plus O(Pn²) for the returned paths in the worst case.
