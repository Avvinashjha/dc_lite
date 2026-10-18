You're given a weighted, directed graph with V vertices and a list of edges. Determine whether it contains a **negative-weight cycle** — a cycle whose edge weights sum to less than zero — using the Bellman-Ford shortest-path algorithm.

Check the entire graph, including components that cannot be reached from vertex 0. A zero-weight cycle is not negative.
