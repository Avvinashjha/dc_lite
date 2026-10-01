You're given an `n × n` matrix of integers representing an image. Rotate it **90 degrees clockwise**, modifying the matrix **in place** — allocating a second `n × n` matrix for the output isn't allowed, though a few extra scalar variables are fine.

As a sanity check: after rotating, the original first row becomes the new last column, and the same pattern continues for every row.

**Example 1**

- Input: `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]`
- Output: `[[7, 4, 1], [8, 5, 2], [9, 6, 3]]`

**Example 2**

- Input: `matrix = [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]`
- Output: `[[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]`

**Constraints**

- `n == matrix.length == matrix[i].length`
- `1 <= n <= 20`
- `-1000 <= matrix[i][j] <= 1000`
