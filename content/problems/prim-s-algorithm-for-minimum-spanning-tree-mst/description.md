Given a connected, weighted, undirected graph with `V` vertices numbered `0` through `V - 1`, use Prim's algorithm to return the total weight of a minimum spanning tree.

A spanning tree connects **every vertex** using exactly `V - 1` edges and contains no cycle. Among all such trees, choose one with the smallest sum of edge weights. Return only that sum; several different trees may have the same minimum weight.

The adjacency list `adj[u]` contains pairs `[neighbor, weight]`. Each undirected edge appears in both endpoint lists, but its weight is counted only once when selected. A single vertex requires no edges, so its answer is `0`.

In the first example, select edges `0–1` with weight `1` and `1–2` with weight `2`. Their total is `3`; selecting the remaining edge as well would create a cycle.
