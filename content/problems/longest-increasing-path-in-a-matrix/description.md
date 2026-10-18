Given an `m x n` matrix of integers, find the longest path you can trace where each step strictly increases in value. From any cell you may only step up, down, left, or right (no diagonal moves, and never off the edge of the grid), and every move must land on a cell whose value is strictly larger than the one you're leaving.

Return the number of cells in the path, including both endpoints.

You may start and end at any cell. Equal values cannot extend a path, and the grid does not wrap at its edges. A matrix whose values are all equal has answer `1`.
