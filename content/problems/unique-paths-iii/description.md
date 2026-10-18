Given a rectangular grid, count paths from the starting cell to the ending cell that visit **every non-obstacle cell exactly once**.

- `1`: the single starting cell.
- `2`: the single ending cell.
- `0`: an empty cell that must be visited.
- `-1`: an obstacle that cannot be visited.

Each move goes one cell up, down, left, or right. Diagonal moves are not allowed. The start and end also count as visited cells. A path must stop at the end; reaching it before visiting all other open cells does not count.

Return the number of valid paths, or `0` if none exists. Paths are distinct when their ordered sequences of visited cells differ.
