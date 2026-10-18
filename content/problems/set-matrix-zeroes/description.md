Given an `m × n` integer matrix, set every cell in a row or column containing an **original zero** to `0`. Modify the given matrix in place.

Zeros introduced by your changes must not trigger further changes. For example, `[[0,1],[2,3]]` becomes `[[0,0],[0,3]]`; the bottom-right cell stays `3`.

**Follow-up:** Can you use O(1) extra space? Storing the affected rows and columns in sets uses O(m + n) extra space.
