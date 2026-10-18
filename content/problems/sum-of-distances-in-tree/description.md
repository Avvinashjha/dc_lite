Given a connected, undirected tree with `n` vertices labeled `0` through `n - 1`, return the sum of distances from each vertex to all other vertices.

Each pair `[u,v]` in `edges` is an undirected, unweighted edge. A distance is the **number of edges** on the unique path between two vertices. This is a general tree, not necessarily a binary tree.

Return an array in vertex-label order: `answer[i]` is the total for vertex `i`. The distance from a vertex to itself is zero. A one-vertex tree therefore returns `[0]`.
