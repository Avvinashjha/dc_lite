You're handed an undirected graph and need to figure out whether it has a cycle anywhere in it — a route that leaves a vertex, travels along distinct edges without reusing any of them, and eventually comes back to that same starting vertex.

The graph isn't guaranteed to be connected, so check every component. The input is `V` and an edge list `edges`; each undirected edge is listed exactly once.

Vertices are labeled `0` through `V - 1`. Each list entry represents one edge; do not add a second entry merely to indicate its reverse direction. Repeated endpoint pairs represent distinct parallel edges. A self-loop is a cycle, and two parallel edges form a cycle of length two. Traversing one ordinary edge out and back does not count, because that reuses the same edge.
