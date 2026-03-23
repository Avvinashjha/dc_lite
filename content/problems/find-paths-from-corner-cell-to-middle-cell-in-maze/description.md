Given an `n x n` maze (where `n` is odd), find all paths from any corner cell to the center cell `(n/2, n/2)`. From cell `(i, j)`, you must move exactly `maze[i][j]` steps in one of the four cardinal directions (up, down, left, right). You cannot revisit a cell in the same path.

**Example 1:**
```
Input: maze = [
  [3, 5, 4, 4, 7],
  [3, 1, 3, 3, 1],
  [3, 2, 3, 1, 2],
  [6, 3, 1, 5, 3],
  [1, 2, 3, 4, 1]
]
Output: One valid path from (0,0): (0,0) → (0,3) → (0,7 invalid)... 
The paths vary; the goal is to reach (2,2) from corners.
```

**Example 2:**
```
Input: maze = [
  [2, 1, 3],
  [1, 1, 1],
  [3, 1, 2]
]
Output: Paths from (0,0) to (1,1): (0,0)→(0,2)→(0,2 can't, bounds)
```

**Edge cases:** No valid path exists from a given corner. Maze with size 1 — the corner is the center.
