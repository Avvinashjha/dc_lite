## Backtracking with a Visited Grid

Mark the starting cell visited. From each open cell, try every valid neighboring cell that is not already on the current route. Mark it before descending and unmark it afterward. Unmarking allows other routes to reuse that cell while still preventing cycles within a route.

Keep moves in one shared array. When the destination is reached, join the moves into a result string and stop that branch. The empty move array correctly represents the open one-cell maze. Reject a blocked endpoint immediately.

```javascript
function findPath(maze) {
  const n = maze.length;
  if (!maze[0][0] || !maze[n - 1][n - 1]) return [];
  const result = [];
  const visited = Array.from({ length: n }, () => Array(n).fill(false));
  const moves = [];
  const directions = [
    ["D", 1, 0],
    ["L", 0, -1],
    ["R", 0, 1],
    ["U", -1, 0],
  ];
  function visit(r, c) {
    if (r === n - 1 && c === n - 1) {
      result.push(moves.join(""));
      return;
    }
    for (const [letter, dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (
        nr < 0 ||
        nr >= n ||
        nc < 0 ||
        nc >= n ||
        !maze[nr][nc] ||
        visited[nr][nc]
      )
        continue;
      visited[nr][nc] = true;
      moves.push(letter);
      visit(nr, nc);
      moves.pop();
      visited[nr][nc] = false;
    }
  }
  visited[0][0] = true;
  visit(0, 0);
  return result;
}
```

**Time:** O(4^(n²) + P) as a loose upper bound, where P is the total number of move characters returned. The search is exponential because it enumerates simple paths.

**Space:** O(n²) auxiliary space for the visited grid, recursion, and current moves, plus O(P + R) for R returned route strings. The input maze is not modified.
