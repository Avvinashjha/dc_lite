You're given a directed, weighted graph as a `V x V` adjacency matrix `graph`, where `graph[i][j]` holds the weight of the edge going from vertex `i` to vertex `j`, and every diagonal entry `graph[i][i]` is `0`. Compute the shortest distance between every pair of vertices using the Floyd-Warshall all-pairs shortest path algorithm. Wherever no path connects two vertices, leave the distance at the large sentinel value `10000`, which stands in for infinity.

**Example:**
```
Input: graph = [[0,3,10000,5],[2,0,10000,4],[10000,1,0,10000],[10000,10000,2,0]]
Output: [[0,3,7,5],[2,0,6,4],[3,1,0,5],[5,3,2,0]]
```
