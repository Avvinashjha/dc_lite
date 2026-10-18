A terminal vertex has no outgoing edges. A vertex is **eventually safe** if every path starting there eventually reaches a terminal vertex. Equivalently, no directed cycle is reachable from it. Terminal vertices are themselves safe.

It is not enough to have one path to a terminal: if another choice leads to a cycle, the starting vertex is unsafe. Return the safe vertex indices in ascending order.
