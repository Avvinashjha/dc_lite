Place `n` queens on an `n x n` chessboard so that no two queens threaten each other. No two queens can share the same row, column, or diagonal. Return all distinct valid board configurations.

Each solution is represented as an array of strings where `'Q'` marks a queen and `'.'` marks an empty square.

### Examples

```
Input: n = 4
Output: [
  [".Q..", "...Q", "Q...", "..Q."],
  ["..Q.", "Q...", "...Q", ".Q.."]
]
```

```
Input: n = 1
Output: [["Q"]]
```

### Constraints

- `1 <= n <= 9`
