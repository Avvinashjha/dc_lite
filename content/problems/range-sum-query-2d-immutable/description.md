Implement `NumMatrix` to answer repeated sum queries on a fixed rectangular matrix.

- `new NumMatrix(matrix)` prepares the matrix for queries. Its values do not change afterward.
- `sumRegion(r1, c1, r2, c2)` returns the sum of cells from top-left corner `(r1, c1)` through bottom-right corner `(r2, c2)`, **including both corners and every cell between them**.

Rows and columns are zero-indexed. All query coordinates are valid and ordered. Queries may cover one cell, one row, one column, or the whole matrix; negative and zero values are included normally. Aim for constant time per query after preprocessing.

For `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]`, `sumRegion(1, 1, 2, 2)` returns `5 + 6 + 8 + 9 = 28`.

Examples provide `constructorArgs = [matrix]` and a list of method calls. Each example creates a fresh instance; its output lists the query results in call order.
