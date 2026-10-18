Each cell in an `n × n` grid has an elevation. At time `t`, the water level is `t`, and you may occupy only cells whose elevation is at most `t`.

Find the earliest time when you can travel from the top-left cell `[0,0]` to the bottom-right cell `[n-1,n-1]`.

Move only **up, down, left, or right**; diagonal moves are not allowed. Both endpoints must also be submerged. Movement itself takes no additional time: at a fixed water level, you may traverse any connected group of eligible cells.

Equivalently, minimize the highest elevation encountered along a path. Return that elevation, not the number of moves or the sum of elevations.
