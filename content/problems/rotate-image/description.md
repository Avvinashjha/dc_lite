Given an `n × n` integer matrix, rotate its values **90 degrees clockwise** in place.

Modify the supplied matrix using constant extra space; do not allocate a second matrix. The function's return value is ignored. Every original cell `(r, c)` moves to `(c, n - 1 - r)`.

For `[[1, 2], [3, 4]]`, the result is `[[3, 1], [4, 2]]`. The original top row becomes the rightmost column, read from top to bottom. A one-cell matrix is unchanged. Negative and repeated values follow the same positional rotation.
