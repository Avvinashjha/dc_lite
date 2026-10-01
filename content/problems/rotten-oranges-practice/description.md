You're given a grid where each cell holds `0` (empty), `1` (a fresh orange), or `2` (a rotten orange). Every minute, any rotten orange spreads rot to fresh oranges in the cells directly adjacent to it (up, down, left, right — not diagonally). Determine the minimum number of minutes needed until no fresh orange is left on the grid; if that's impossible, return -1.

**Example:** grid = [[2,1,1],[1,1,0],[0,1,1]] → Output: 4
