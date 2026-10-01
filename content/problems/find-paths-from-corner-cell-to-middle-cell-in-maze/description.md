You're given an `n x n` maze, where `n` is odd, filled with movement values. Starting from any of the four corner cells, find every path that leads to the maze's center cell at `(n/2, n/2)` (integer division). From a cell `(i, j)`, you must move exactly `maze[i][j]` steps in a single direction — up, down, left, or right — landing on the next cell in that path; a cell already visited on the current path cannot be revisited, and moves that go outside the grid are not allowed.

**Example:**
```
Input: maze = [[3, 5, 4, 4, 7, 3, 4, 6, 3], [6, 7, 5, 6, 6, 2, 0, 3, 1], [3, 3, 4, 6, 1, 2, 4, 6, 5], [2, 4, 5, 6, 8, 5, 6, 5, 1], [2, 3, 2, 4, 0, 4, 2, 6, 2], [6, 5, 3, 2, 4, 3, 2, 6, 1], [1, 3, 5, 7, 8, 3, 2, 4, 3], [6, 1, 1, 0, 1, 2, 1, 0, 7], [1, 3, 2, 2, 1, 0, 8, 5, 1]]
Output: [(0,0) -> (0,3) -> (0,7) -> (6,7) -> (6,3) -> (3,3) -> (3,5) -> (6,5) -> (6,2) -> (2,2) -> (2,6) -> (4,6) -> (4,4)]
```

**Edge cases:** A given corner may have no valid path to the center at all. When `n = 1`, the single corner cell is itself the center.
