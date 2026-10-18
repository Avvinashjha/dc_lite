There are `n` computers numbered `0` through `n - 1`. Each pair `[a, b]` in `connections` represents an undirected cable between computers `a` and `b`. Computers can communicate through a path of one or more cables.

In one operation, remove an existing cable and reconnect it between two different computers of your choice. You cannot add new cables. Return the **minimum number of operations** needed to connect every computer into one network, or `-1` if this is impossible. An already connected network, including a single computer, needs `0` operations.

For example, with `n = 4` and `connections = [[0,1],[0,2],[1,2]]`, computers `0`, `1`, and `2` form a cycle while computer `3` is isolated. Move cable `[1,2]` to `[1,3]`: all four computers remain connected, using one operation.
