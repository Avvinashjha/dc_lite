An undirected tree on vertices `1` through `n` gained one additional edge between two different vertices. You receive the resulting `n` edges in `edges`.

Return an edge whose removal leaves a connected tree. If more than one edge qualifies, return the one appearing **latest in the input list**, preserving its endpoint order. The input order does not identify which edge was originally added.

Only edges on the graph's single cycle can be removed without disconnecting it. The last edge in the entire list need not be on that cycle.

For `[[1,2], [2,3], [3,4], [1,4], [1,5]]`, return `[1,4]`. It is the latest cycle edge; removing the later edge `[1,5]` would isolate vertex `5`.
