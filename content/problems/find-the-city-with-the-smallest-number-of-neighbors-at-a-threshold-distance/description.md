There are `n` cities labeled `0` through `n-1`, connected by bidirectional weighted roads given as `edges`, where each entry `[from, to, weight]` describes one road. For a given `distanceThreshold`, a city counts as a neighbor of another if the shortest path between them is no greater than that threshold. Find the city with the fewest such neighbors; if more than one city ties for fewest, return the one with the largest index.

**Example:**
```
Input: n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4
Output: 3
```
