There are `n` cities numbered from 0 to n-1. Given `edges` where `edges[i] = [from, to, weight]` represents a bidirectional weighted edge, and an integer `distanceThreshold`, return the city with the smallest number of cities reachable within `distanceThreshold`. If multiple cities qualify, return the one with the greatest index. A city is reachable if the shortest path distance is at most `distanceThreshold`.

**Example:**
```
Input: n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4
Output: 3
```
