An image is represented by an `m x n` integer grid where `image[i][j]` represents the pixel value. Given a starting pixel `(sr, sc)` and a new color `color`, perform a flood fill starting from that pixel. To perform a flood fill, color the starting pixel plus all pixels connected 4-directionally that share the same original color with the new color. Return the modified image.

**Example:**
```
Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
Output: [[2,2,2],[2,2,0],[2,0,1]]
```
