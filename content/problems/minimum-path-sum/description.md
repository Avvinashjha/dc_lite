Given a nonempty rectangular grid of nonnegative integers, find a path from the **top-left cell to the bottom-right cell** with the smallest sum of visited values.

Each move goes exactly one cell right or down. Diagonal, upward, and leftward moves are not allowed. Count both the starting and ending cells. Return the minimum sum, not the path itself. A one-cell grid returns that cell’s value.

In Example 1, moving right, right, down, down visits `1 → 3 → 1 → 1 → 1`, totaling `7`.
