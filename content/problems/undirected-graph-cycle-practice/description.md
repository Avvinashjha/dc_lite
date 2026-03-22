You get an undirected graph. Decide whether it contains a cycle. A cycle is a path that starts and ends at the same vertex and uses at least one edge without repeating edges (the usual simple-cycle idea for this kind of problem).

The graph may be disconnected. Use the edge list (or adjacency form) your input format specifies.

**Example 1**

- Input: `V = 5`, edges `[[0, 1], [1, 2], [2, 0], [3, 4]]` (undirected edges)
- Output: `true` (triangle `0–1–2–0` is a cycle)

**Example 2**

- Input: `V = 3`, edges `[[0, 1], [1, 2]]`
- Output: `false` (a path, no cycle)

**Constraints** (typical)

- `1 <= V <= 10^5`
- `1 <= E <= 10^5`
