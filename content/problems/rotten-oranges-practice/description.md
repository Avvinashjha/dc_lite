Given a rectangular grid, each cell is `0` (empty), `1` (fresh orange), or `2` (rotten orange). Every minute, all currently rotten oranges simultaneously infect fresh oranges directly above, below, left, or right of them.

Newly rotten oranges spread rot starting in the **next** minute. Rot cannot move diagonally or pass through empty cells.

Return the minimum minutes until no fresh oranges remain. Return `0` if there are none initially, even if the grid has no oranges, and `-1` if any fresh orange can never be reached. You may modify the grid.

For `[[2, 1, 1, 1, 2]]`, rot spreads from both ends at once, so the answer is `2`, not `3`. For `[[2, 0, 1]]`, the empty cell blocks the only route and the answer is `-1`.
