Given an `n × n` board, return the minimum number of die rolls needed to travel from square `1` to square `n²`.

Squares are numbered from the **bottom-left**, left to right across the bottom row, then right to left across the next row, alternating upward. The input array is still stored in the usual top-row-first order.

For each turn:

1. Choose a destination from `current + 1` through `min(current + 6, n²)`. Moves cannot overshoot the final square.
2. If that square contains `-1`, stay there. Otherwise, you **must** move to the destination label stored in that cell.
3. Follow at most one snake or ladder in this turn. If its destination has another jump, do not follow that second jump.

The jump does not cost an additional roll. Return `-1` if the final square cannot be reached. You are finding the fewest possible rolls, not an expected value over random dice outcomes.
