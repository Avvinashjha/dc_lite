Given an undirected graph represented as an adjacency list and an integer `m`, determine whether the graph can be colored using at most `m` colors such that no two adjacent vertices share the same color.

**Example 1:**
```
Input: graph = {0:[1,2], 1:[0,2], 2:[0,1]}, m = 3
Output: true
Explanation: Triangle graph needs 3 colors — assign 0→Red, 1→Green, 2→Blue.
```

**Example 2:**
```
Input: graph = {0:[1,2], 1:[0,2], 2:[0,1]}, m = 2
Output: false
Explanation: A triangle cannot be 2-colored.
```

**Example 3:**
```
Input: graph = {0:[1,3], 1:[0,2], 2:[1,3], 3:[2,0]}, m = 2
Output: true
Explanation: A 4-cycle is bipartite and 2-colorable.
```

**Edge cases:** Graph with no edges (always colorable with m ≥ 1). `m = 1` only works if there are no edges. Disconnected components.
