You're given an `m x n` grid of integers called `image`, where each value is a pixel's color. Starting from a given pixel at `(sr, sc)`, repaint it along with every pixel reachable from it through 4-directional moves (up/down/left/right) that share the pixel's original color, changing them all to the new `color`. Return the resulting grid.

**Example:**
```
Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
Output: [[2,2,2],[2,2,0],[2,0,1]]
```
