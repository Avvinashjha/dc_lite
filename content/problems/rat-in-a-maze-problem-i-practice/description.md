Given a square binary matrix `maze`, return every path from the top-left cell `(0, 0)` to the bottom-right cell `(n - 1, n - 1)`. A numeric `1` is open and a `0` is blocked.

Move one cell at a time in four directions: `D` (down), `L` (left), `R` (right), or `U` (up). Stay within the matrix and never visit the same cell twice within one path. Different paths may share cells.

Return each route once as its sequence of move letters, in any order. Find **all** valid paths, not just shortest ones. Stop a route when it first reaches the destination. Return `[]` if either endpoint is blocked or no route exists. For a one-cell open maze, return `[""]`: the start is already the destination and no moves are needed.

For `[[1, 1], [1, 1]]`, the routes are `"DR"` and `"RD"`. Diagonal moves are not allowed.
