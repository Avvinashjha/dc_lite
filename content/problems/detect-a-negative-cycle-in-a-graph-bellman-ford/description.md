You're given a weighted, directed graph with V vertices and a list of edges. Determine whether it contains a **negative-weight cycle** — a cycle whose edge weights sum to less than zero — using the Bellman-Ford shortest-path algorithm.

**Example:** V=4, edges=[[0,1,-1],[1,2,-2],[2,3,-3],[3,0,4]] → false (no negative cycle)
