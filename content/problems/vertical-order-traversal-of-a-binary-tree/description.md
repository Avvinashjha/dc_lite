Return the vertical traversal of a binary tree. Assign the root position `(row, column) = (0, 0)`. A left child is at `(row + 1, column - 1)` and a right child is at `(row + 1, column + 1)`.

Group values by column and return those groups from left to right. Within each column, order nodes by:

1. Row, from top to bottom.
2. Value, from smallest to largest, **only when the row is also equal**.

Keep duplicate values: each node appears once. Both the order of columns and the order within a column matter. The editor passes a root node with `val`, `left`, and `right` properties; displayed arrays use level order with `null` for missing children.

For `[1,2,3,4,6,5,7]`, the middle column illustrates the tie rule:

| Node value | Row | Column |
| --- | --- | --- |
| 1 | 0 | 0 |
| 6 | 2 | 0 |
| 5 | 2 | 0 |

That column is `[1,5,6]`: the root stays first, and the two row-2 values are sorted numerically, even though a left-first traversal encounters `6` before `5`.
