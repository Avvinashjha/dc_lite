Given a directed graph with `V` vertices labeled `0` through `V - 1`, return all its **strongly connected components**.

A component is a **maximal** group in which every vertex can reach every other vertex by following directed edges. Maximal means you cannot add another vertex while retaining that property.

The adjacency list `adj[u]` contains the destinations of edges leaving vertex `u`. Edges are directed; an edge from `u` to `v` does not imply an edge back.

Return a partition of all vertices: include each vertex exactly once, including isolated vertices as singleton components. The order of components and the order of vertices within them do not matter.
