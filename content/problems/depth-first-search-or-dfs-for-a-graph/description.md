You're given a graph as an **adjacency list** `adj`, where vertices are numbered `0` through `V - 1` (with `V = adj.length`), and `adj[i]` lists the neighbors reachable directly from vertex `i`. Starting at vertex `0`, perform a **depth-first search (DFS)** and return the sequence in which vertices are **first reached** (a preorder-style traversal).

Follow the standard DFS approach: fully explore one neighbor's branch before backtracking to try the next, visiting neighbors in the order they appear in each adjacency list as listed.
