Given a directed graph with `V` vertices and adjacency list `adj`, determine whether it contains a directed cycle in any component. A directed cycle follows one or more edges and returns to its starting vertex.

An edge to a vertex visited along a different, completed path does not by itself imply a cycle. During DFS, an edge back to a vertex on the current active path does.
