Given a simple undirected graph with `n` vertices and a positive integer `m`, decide whether every vertex can be assigned one of **at most `m` colors** so that adjacent vertices have different colors.

The input is an adjacency list: `graph[v]` contains the neighbors of vertex `v`. The graph has no self-loops or duplicate edges and may be disconnected. Colors can be reused across disconnected components; you do not need to use all `m` colors.

A triangle requires three colors because each vertex is adjacent to both others. A four-vertex cycle needs only two alternating colors. A graph with no edges needs just one color.
