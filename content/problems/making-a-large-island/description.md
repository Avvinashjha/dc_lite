You're given an `n x n` binary grid, and you're allowed to flip at most one `0` into a `1`. After doing so (or choosing not to), return the size of the biggest island you can produce. An island here means a group of `1`s connected up, down, left, or right — diagonal neighbors don't count.

Area means the number of cells in one connected island, not the total number of `1`s in the grid. A flip may join several islands, but each original island is counted only once. An all-water grid returns `1`; an all-land grid returns `n × n`.
