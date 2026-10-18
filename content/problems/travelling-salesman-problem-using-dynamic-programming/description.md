Given a square cost matrix `dist`, find the minimum-cost tour that visits every city exactly once and returns to its starting city.

`dist[i][j]` is the cost of traveling directly from city i to city j. Costs may be asymmetric, and every directed trip between different cities is available. Include the final return trip in the total.

You may fix city 0 as the starting point: any tour can be rotated to start there without changing its cost. Return only the minimum total cost, not the route. A single city requires no travel and returns 0.
