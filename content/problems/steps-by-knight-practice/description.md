On an empty `n × n` chessboard, find the fewest knight moves from `src` to `dest`.

Both positions use **zero-based `[row, column]` coordinates**, ranging from `0` to `n - 1`. In one move, change one coordinate by 2 and the other by 1, independently choosing either sign. The landing square must remain on the board.

For example, from `[0,0]` on a board of size at least 3, the legal destinations are `[1,2]` and `[2,1]`.

Return `0` when the source already equals the destination. Return `-1` if no legal sequence reaches the destination; this can happen on small boards.
