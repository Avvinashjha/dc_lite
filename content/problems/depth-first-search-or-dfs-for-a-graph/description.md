You get a graph as an **adjacency list** `adj`. Vertex labels are `0` to `V - 1`, where `V = adj.length`. The list `adj[i]` holds the neighbors of `i`. Perform **depth-first search (DFS)** starting from vertex `0`. Return the order in which vertices are **first visited** (preorder-style DFS).

Use the usual DFS rule: from a vertex, explore one neighbor fully before backing up, following the order neighbors appear in each adjacency list unless the problem specifies otherwise.

**Example 1**

- Input: `adj = [[1, 2], [3], [4], [], []]`
- Output: `[0, 1, 3, 2, 4]`

**Example 2**

- Input: `adj = [[2, 1], [0], [0]]` (three vertices; from `0` neighbors are listed `2` then `1`)
- Output: `[0, 2, 1]`

**Constraints**

- `1 <= V, E <= 10^4`
