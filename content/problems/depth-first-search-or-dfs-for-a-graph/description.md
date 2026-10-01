You're given a graph as an **adjacency list** `adj`, where vertices are numbered `0` through `V - 1` (with `V = adj.length`), and `adj[i]` lists the neighbors reachable directly from vertex `i`. Starting at vertex `0`, perform a **depth-first search (DFS)** and return the sequence in which vertices are **first reached** (a preorder-style traversal).

Follow the standard DFS approach: fully explore one neighbor's branch before backtracking to try the next, visiting neighbors in the order they appear in each adjacency list unless stated otherwise.

**Example 1**

- Input: `adj = [[1, 2], [3], [4], [], []]`
- Output: `[0, 1, 3, 2, 4]`

**Example 2**

- Input: `adj = [[2, 1], [0], [0]]` (three vertices; from `0` neighbors are listed `2` then `1`)
- Output: `[0, 2, 1]`

**Constraints**

- `1 <= V, E <= 10^4`
