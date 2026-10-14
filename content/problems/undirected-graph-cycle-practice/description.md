You're handed an undirected graph and need to figure out whether it has a cycle anywhere in it — a route that leaves a vertex, travels along distinct edges without reusing any of them, and eventually comes back to that same starting vertex.

The graph isn't guaranteed to be connected, so check every component. The input is `V` and an edge list `edges`; each undirected edge is listed exactly once.
