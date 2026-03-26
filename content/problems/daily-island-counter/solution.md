# Solution

Traverse every cell:

- If cell is water, skip.
- If cell is land and not visited, increment count and run DFS/BFS to mark all connected land.

Use 4-direction neighbors (`up, down, left, right`).

Complexity:

- Time: `O(rows * cols)`
- Space: `O(rows * cols)` worst case for recursion/queue + visited tracking
