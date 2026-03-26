# Solution

Use a queue and process nodes level by level.

1. Push root into queue.
2. While queue is non-empty, read `levelSize = queue.length`.
3. Pop `levelSize` nodes, collect values, and push children.
4. Append each level's values to answer.

Complexity:

- Time: `O(n)` for `n` nodes
- Space: `O(n)` in worst case
