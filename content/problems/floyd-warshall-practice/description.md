Given a weighted directed graph represented as an adjacency matrix `graph` of size `V x V`, find the shortest distances between every pair of vertices using the Floyd-Warshall algorithm. If no path exists, the distance remains as a large value (use `10000` to represent infinity). `graph[i][j]` is the weight of the edge from vertex `i` to vertex `j`. `graph[i][i]` is always 0.

**Example:**
```
Input: graph = [[0,3,10000,5],[2,0,10000,4],[10000,1,0,10000],[10000,10000,2,0]]
Output: [[0,3,7,5],[2,0,6,4],[3,1,0,5],[5,3,2,0]]
```
