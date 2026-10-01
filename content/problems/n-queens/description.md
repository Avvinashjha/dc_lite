Arrange `n` queens on an `n x n` chessboard so that none of them attack one another — meaning no two queens may share a row, a column, or a diagonal. Return every distinct board arrangement that satisfies this.

Each returned solution is an array of strings, where `'Q'` denotes a square holding a queen and `'.'` denotes an empty one.

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
