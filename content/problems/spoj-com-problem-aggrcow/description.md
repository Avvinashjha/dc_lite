Given stall coordinates `stalls` on a line and a number of cows `c`, choose exactly `c` stalls, placing at most one cow in each.

Maximize the **minimum distance between any two occupied stalls** and return that distance. Once occupied coordinates are sorted, it is enough to consider gaps between adjacent cows.

Input coordinates may be unsorted. Each array entry represents a separate stall; if two chosen stalls have the same coordinate, their distance is zero. You may reorder the input array. Return only the optimal distance, not the chosen positions.
