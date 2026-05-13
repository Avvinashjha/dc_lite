# Search a 2D Matrix (Row-Major Binary Search)

**LeetCode 74.** The matrix has two properties:

1. Each row is sorted left-to-right.
2. The first integer of each row is **greater than** the last integer of the previous row.

Together these mean the matrix, read row-by-row, is a **single sorted sequence**. We can binary-search it in **O(log(m · n))** by treating a 1D index `k` in `[0, m*n)` as a 2D coordinate.

## Index mapping

For an `m x n` matrix and flat index `k`:

```text
row = floor(k / n)
col = k % n
```

So `matrix[row][col]` gives the `k`-th element in row-major order.

## The code

```javascript
function searchMatrix(matrix, target) {
  const m = matrix.length;
  const n = matrix[0].length;
  let lo = 0;
  let hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const value = matrix[Math.floor(mid / n)][mid % n];
    if (value === target) return true;
    if (value < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}
```

We reuse the closed-interval template from lesson 03 — the only change is the translation from `mid` to `(row, col)`.

## Walkthrough

```text
matrix = [[1,  3,  5,  7],
          [10, 11, 16, 20],
          [23, 30, 34, 60]]   target = 3

m = 3, n = 4, total = 12, indices 0..11

lo=0 hi=11 mid=5  -> row=1 col=1 value=11 > 3 -> hi=4
lo=0 hi=4  mid=2  -> row=0 col=2 value=5  > 3 -> hi=1
lo=0 hi=1  mid=0  -> row=0 col=0 value=1  < 3 -> lo=1
lo=1 hi=1  mid=1  -> row=0 col=1 value=3 == 3 -> return true
```

## Complexity

- **Time:** O(log(m · n)) = O(log m + log n).
- **Space:** O(1).

## Why this is the cleanest way

An alternative is two nested binary searches (one over rows, one over columns). It is correct but has more boundary logic. The row-major mapping reuses a single binary search and is easier to implement without bugs.

## Pitfall: which statement are you solving?

LeetCode **74** (this lesson) assumes the strong "first of each row > last of previous row" property. LeetCode **240** ("Search a 2D Matrix II", next lesson) only assumes rows and columns are individually sorted — a weaker property that forbids this flattening trick. Always read the row/column constraint carefully.

:::quiz
question: The row-major flattening trick works in LeetCode 74 because:
options:
  - Reading all rows in order yields a single globally sorted sequence.
  - Rows and columns are sorted independently.
answer: 0
explanation: Without the "first of each row > last of previous" guarantee, the 1D sequence would not be monotonic, and binary search on it would be unsafe.
:::

:::quiz
question: For flat index `mid` in an m x n matrix, the 2D coordinate is:
options:
  - row = Math.floor(mid / n), col = mid % n
  - row = mid % m, col = Math.floor(mid / m)
answer: 0
explanation: We use the number of columns `n` for the row-major division and modulo.
:::

:::quiz
question: The time complexity of this algorithm is:
options:
  - O(m + n)
  - O(log(m · n))
  - O(m · n)
answer: 1
explanation: Single binary search over all m·n cells gives logarithmic time.
:::

:::exercise
title: Implement searchMatrix (LC 74)
description: Implement `searchMatrix(matrix, target)` using the row-major mapping and a single binary search.
starterCode: |
  function searchMatrix(matrix, target) {
    const m = matrix.length;
    const n = matrix[0].length;
    let lo = 0, hi = m * n - 1;
    // while (lo <= hi) ...
    return false;
  }

  console.log(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3));  // true
  console.log(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13)); // false
  console.log(searchMatrix([[1]], 1));                                    // true
:::

## Practice

- [Search a 2D Matrix](/problems/search-a-2d-matrix)
