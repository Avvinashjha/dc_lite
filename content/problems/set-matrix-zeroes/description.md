You're given an `m x n` integer matrix. Whenever a cell holds the value `0`, every other cell in that cell's row and every cell in its column must also become `0`. Apply these changes directly to the given matrix.

Using O(m + n) extra space to remember which rows and columns to zero out is the straightforward route — the harder version of this problem is pulling it off with only O(1) extra space.
