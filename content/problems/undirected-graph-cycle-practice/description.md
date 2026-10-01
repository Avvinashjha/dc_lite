You're handed an undirected graph and need to figure out whether it has a cycle anywhere in it — a route that leaves a vertex, travels along distinct edges without reusing any of them, and eventually comes back to that same starting vertex.

The graph isn't guaranteed to be connected, so check every component. Read the edges using whichever input form (edge list or adjacency form) the problem gives you.

**Example 1**

- Input: `V = 5`, edges `[[0, 1], [1, 2], [2, 0], [3, 4]]` (undirected edges)
- Output: `true` — vertices `0`, `1`, and `2` form a triangle, which is a cycle.

**Example 2**

- Input: `V = 3`, edges `[[0, 1], [1, 2]]`
- Output: `false` — this is just a simple path, so there's no cycle.

**Constraints** (typical)

- `1 <= V <= 10^5`
- `1 <= E <= 10^5`
