You're given an `m x n` integer matrix. Whenever a cell holds the value `0`, every other cell in that cell's row and every cell in its column must also become `0`. Apply these changes directly to the given matrix.

Using O(m + n) extra space to remember which rows and columns to zero out is the straightforward route — the harder version of this problem is pulling it off with only O(1) extra space.

### Examples

```
Input: matrix = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1]
]
Output: [
  [1, 0, 1],
  [0, 0, 0],
  [1, 0, 1]
]
```

```
Input: matrix = [
  [0, 1, 2, 0],
  [3, 4, 5, 2],
  [1, 3, 1, 5]
]
Output: [
  [0, 0, 0, 0],
  [0, 4, 5, 0],
  [0, 3, 1, 0]
]
```

### Constraints

- `m == matrix.length`
- `n == matrix[0].length`
- `1 <= m, n <= 200`
- `-2^31 <= matrix[i][j] <= 2^31 - 1`
