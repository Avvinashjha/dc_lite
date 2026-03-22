Maximize `(yi - xi) + (yj + xj)`. Since the points are sorted by `x`, use a sliding window with a deque to maintain the maximum `yi - xi` for points within the `x-range` of `k`.
