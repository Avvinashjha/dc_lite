Count the distinct spanning trees of the given simple, undirected graph.

A spanning tree selects exactly `V - 1` existing edges, includes every vertex, and is connected with no cycles. Two spanning trees are different when their selected edge sets differ; choosing a different root does not create a new spanning tree.

`adj[u]` lists the neighbors of vertex u. Every undirected edge appears in both endpoint lists, and the graph has no self-loops or repeated edges.

Return `0` if the graph is disconnected. A single vertex has one spanning tree, using no edges. Return the exact count; no modulo is required.
