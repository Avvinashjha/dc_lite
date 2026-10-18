Find every path from any corner of an odd-sized square maze to its center at `(Math.floor(n / 2), Math.floor(n / 2))`.

From `(r, c)`, jump exactly `maze[r][c]` cells up, down, left, or right. The landing cell must be inside the maze and must not already occur in the current path. Only landing cells are visited; cells jumped over are not added to the path. A zero-valued cell cannot move.

Stop a path when it first reaches the center, regardless of the center’s value. For `n = 1`, return the single path `[[0,0]]` once, wrapped in the result array: `[[[0,0]]]`. Return an empty array if no corner can reach the center.
